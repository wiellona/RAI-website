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
        total_github_models,
        total_github_datasets,
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

    // Calculate AI ranking scores if crawling data exists
    let aiRankingScores = null;
    if (crawlingData && crawlingData.length > 0) {
      const currentData = crawlingData[0];
      
      // Get all universities' crawling data for ranking calculation
      const { data: allCrawlingData } = await supabase
        .from('university_crawling')
        .select(`
          total_publications,
          total_huggingface_models,
          total_huggingface_datasets,
          total_github_models,
          total_github_datasets,
          total_policies,
          total_divisions
        `);

      if (allCrawlingData && allCrawlingData.length > 0) {
        // Calculate total assets for all universities
        const dataWithAssets = allCrawlingData.map(item => {
          const total_models = (item.total_huggingface_models || 0) + (item.total_github_models || 0);
          const total_datasets = (item.total_huggingface_datasets || 0) + (item.total_github_datasets || 0);
          return {
            total_publications: item.total_publications || 0,
            total_models,
            total_datasets,
            total_assets: total_models + total_datasets,
            total_policies: item.total_policies || 0,
            total_divisions: item.total_divisions || 0
          };
        });

        // Sort values for percentile calculation
        const publicationsValues = dataWithAssets.map(d => d.total_publications).sort((a, b) => a - b);
        const assetsValues = dataWithAssets.map(d => d.total_assets).sort((a, b) => a - b);
        const policiesValues = dataWithAssets.map(d => d.total_policies).sort((a, b) => a - b);
        const divisionsValues = dataWithAssets.map(d => d.total_divisions).sort((a, b) => a - b);

        // Calculate current university's metrics
        const total_models = (currentData.total_huggingface_models || 0) + (currentData.total_github_models || 0);
        const total_datasets = (currentData.total_huggingface_datasets || 0) + (currentData.total_github_datasets || 0);
        const total_assets = total_models + total_datasets;
        const total_publications = currentData.total_publications || 0;
        const total_policies = currentData.total_policies || 0;
        const total_divisions = currentData.total_divisions || 0;

        // Calculate scores using percentile ranking (same as automated-ranking route)
        const calculateScore = (value: number, sortedValues: number[], maxScore: number): number => {
          const n = sortedValues.length;
          if (n === 0) return 0;
          if (n === 1) return maxScore;
          const position = sortedValues.indexOf(value);
          const percentile = (position / (n - 1)) * 100;
          return (percentile / 100) * maxScore;
        };

        // Calculate 8 detailed category scores
        // Publications split into 2 categories
        const category1_score = calculateScore(total_publications, publicationsValues, 2000); // Ethics in AI
        const category2_score = calculateScore(total_publications, publicationsValues, 1200); // Fairness
        
        // Assets split into 2 categories
        const category3_score = calculateScore(total_assets, assetsValues, 1300); // Transparency
        const category4_score = calculateScore(total_assets, assetsValues, 1800); // Accountability
        
        // Policies split into 2 categories
        const category5_score = calculateScore(total_policies, policiesValues, 600); // Privacy
        const category6_score = calculateScore(total_policies, policiesValues, 1200); // Security
        
        // Divisions split into 2 categories
        const category7_score = calculateScore(total_divisions, divisionsValues, 800); // Continuous Learning
        const category8_score = calculateScore(total_divisions, divisionsValues, 1100); // Collaboration

        // Calculate grouped scores for backward compatibility
        const publications_grade = category1_score + category2_score;
        const assets_grade = category3_score + category4_score;
        const policies_grade = category5_score + category6_score;
        const divisions_grade = category7_score + category8_score;
        
        const total_score = publications_grade + assets_grade + policies_grade + divisions_grade;

        // Calculate rank
        const allScores = dataWithAssets.map(item => {
          const cat1 = calculateScore(item.total_publications, publicationsValues, 2000);
          const cat2 = calculateScore(item.total_publications, publicationsValues, 1200);
          const cat3 = calculateScore(item.total_assets, assetsValues, 1300);
          const cat4 = calculateScore(item.total_assets, assetsValues, 1800);
          const cat5 = calculateScore(item.total_policies, policiesValues, 600);
          const cat6 = calculateScore(item.total_policies, policiesValues, 1200);
          const cat7 = calculateScore(item.total_divisions, divisionsValues, 800);
          const cat8 = calculateScore(item.total_divisions, divisionsValues, 1100);
          return cat1 + cat2 + cat3 + cat4 + cat5 + cat6 + cat7 + cat8;
        }).sort((a, b) => b - a);

        const rank = allScores.findIndex(score => score === total_score) + 1;

        aiRankingScores = {
          category1_score: Math.round(category1_score * 100) / 100,
          category2_score: Math.round(category2_score * 100) / 100,
          category3_score: Math.round(category3_score * 100) / 100,
          category4_score: Math.round(category4_score * 100) / 100,
          category5_score: Math.round(category5_score * 100) / 100,
          category6_score: Math.round(category6_score * 100) / 100,
          category7_score: Math.round(category7_score * 100) / 100,
          category8_score: Math.round(category8_score * 100) / 100,
          publications_grade: Math.round(publications_grade * 100) / 100,
          assets_grade: Math.round(assets_grade * 100) / 100,
          policies_grade: Math.round(policies_grade * 100) / 100,
          divisions_grade: Math.round(divisions_grade * 100) / 100,
          total_score: Math.round(total_score * 100) / 100,
          rank,
          total_publications,
          total_models,
          total_datasets,
          total_policies,
          total_divisions,
          total_assets
        };
      }
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
      isDataApproved: university?.is_data_approved || false,
      aiRankingScores
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