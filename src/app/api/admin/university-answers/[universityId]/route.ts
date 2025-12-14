import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string }> }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { universityId } = await params;

    // Get university data for submission documents and approval status
    const { data: university, error: universityError } = await supabase
      .from('Universities')
      .select('letter_path, asset_evidence_path, publication_evidence_path, is_data_approved')
      .eq('id', universityId)
      .single();

    if (universityError) {
      console.error('University error:', universityError);
    }

    // Get submission for this university
    const { data: submissions, error: submissionError } = await supabase
      .from('Submissions')
      .select(`
        id,
        university_id,
        submitted_at,
        status,
        Universities (
          name
        )
      `)
      .eq('university_id', universityId)
      .in('status', ['approved', 'completed'])
      .order('submitted_at', { ascending: false })
      .limit(1);

    if (submissionError) {
      console.error('Submission error:', submissionError);
      throw submissionError;
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json(
        {
          universityId,
          universityName: 'Unknown',
          submissionId: null,
          submittedAt: null,
          answers: [],
          crawlingData: null,
          submissionDocuments: null,
          isDataApproved: false
        },
        { status: 200 }
      );
    }

    const submission = submissions[0];
    const universityName = submission.Universities?.name || 'Unknown';

    // Get answers for this submission with proper joins
    const { data: answers, error: answersError } = await supabase
      .from('Answers')
      .select(`
        id,
        submission_id,
        question_id,
        selected_option_id,
        evidence_notes,
        score,
        is_approved,
        Questions (
          id,
          text,
          category_id,
          Categories (
            name
          )
        ),
        Options (
          id,
          text
        )
      `)
      .eq('submission_id', submission.id)
      .order('question_id');

    if (answersError) {
      console.error('Answers error:', answersError);
      throw answersError;
    }

    // Get crawling data for this university by name
    const { data: crawlingData, error: crawlingError } = await supabase
      .from('university_crawling')
      .select(`
        id,
        university_name,
        storage_folder_path,
        publications_csv_url,
        huggingface_csv_url,
        policies_csv_url,
        organigram_csv_url,
        total_publications,
        total_huggingface_models,
        total_huggingface_datasets,
        total_policies,
        total_divisions,
        status,
        analysis_timestamp
      `)
      .ilike('university_name', universityName)
      .order('analysis_timestamp', { ascending: false })
      .limit(1);

    if (crawlingError) {
      console.error('Crawling error:', crawlingError);
    }

    // Transform answers to include category name as dimension
    const transformedAnswers = (answers || []).map(answer => {
      const questionRelation = Array.isArray(answer.Questions)
        ? answer.Questions[0]
        : answer.Questions;
      const optionRelation = Array.isArray(answer.Options)
        ? answer.Options[0]
        : answer.Options;

      const dimensionName = (() => {
        const categories = questionRelation?.Categories;
        if (Array.isArray(categories)) {
          return categories[0]?.name || 'Unknown';
        }
        if (categories && typeof categories === 'object' && 'name' in categories) {
          const name = (categories as { name?: string | null }).name;
          return name || 'Unknown';
        }
        return 'Unknown';
      })();

      return {
        id: answer.id,
        submission_id: answer.submission_id,
        question_id: answer.question_id,
        selected_option_id: answer.selected_option_id,
        evidence_notes: answer.evidence_notes,
        score: answer.score,
        is_approved: answer.is_approved,
        Questions: {
          question_text: questionRelation?.text || '',
          dimension: dimensionName
        },
        Options: {
          option_text: optionRelation?.text || ''
        }
      };
    });

    const result = {
      universityId: submission.university_id,
      universityName: universityName,
      submissionId: submission.id,
      submittedAt: submission.submitted_at,
      answers: transformedAnswers,
      crawlingData: crawlingData && crawlingData.length > 0 ? crawlingData[0] : null,
      submissionDocuments: university ? {
        letterPath: university.letter_path,
        assetEvidencePath: university.asset_evidence_path,
        publicationEvidencePath: university.publication_evidence_path
      } : null,
      isDataApproved: university?.is_data_approved || false
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch answers';
    console.error('Error fetching university answers:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string }> }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { universityId } = await params;

    if (!universityId) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { approvals } = body as { approvals?: Record<string, boolean> };

    if (!approvals || typeof approvals !== 'object') {
      return NextResponse.json(
        { error: 'Invalid approvals payload' },
        { status: 400 }
      );
    }

    const updates = Object.entries(approvals).map(([answerId, isApproved]) =>
      supabase
        .from('Answers')
        .update({ is_approved: !!isApproved })
        .eq('id', answerId)
    );

    const results = await Promise.all(updates);
    const failed = results.filter(result => result.error);

    if (failed.length > 0) {
      console.error('Failed to update some approvals:', failed.map(item => item.error));
      return NextResponse.json(
        { error: 'Failed to update approvals' },
        { status: 500 }
      );
    }

    // Cari submission_id dari salah satu jawaban yang baru diperbarui
    const { data: submissionRow, error: submissionLookupError } = await supabase
      .from("Answers")
      .select("submission_id")
      .in("id", Object.keys(approvals))
      .limit(1)
      .maybeSingle();

    if (submissionLookupError) {
      console.error("Failed to fetch submission_id for finalize-submission:", submissionLookupError);
    } else if (submissionRow?.submission_id) {
      const { error: finalizeError } = await supabase.functions.invoke("finalize-submission", {
        body: { submission_id: submissionRow.submission_id },
      });

      if (finalizeError) {
        console.error("Failed to invoke finalize-submission:", finalizeError);
      }
    }

    return NextResponse.json(
      { message: 'Approvals updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update approvals';
    console.error('Error updating approvals:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}