import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string }> }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { universityId } = await params;

    // Get all approved submissions for this university
    const { data: submissions, error: submissionError } = await supabase
      .from('Submissions')
      .select('id')
      .eq('university_id', universityId)
      .eq('status', 'approved');

    if (submissionError) {
      console.error('Error fetching submissions:', submissionError);
      return NextResponse.json({ error: submissionError.message }, { status: 500 });
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No approved submissions found for this university' 
      }, { status: 404 });
    }

    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('Categories')
      .select('id, name');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return NextResponse.json({ error: categoriesError.message }, { status: 500 });
    }

    // For each submission, update all category scores to 0
    const updates = [];
    for (const submission of submissions) {
      for (const category of categories || []) {
        updates.push({
          submission_id: submission.id,
          category_id: category.id,
          category_name: category.name,
          calculated_score: 0,
          updated_at: new Date().toISOString(),
        });
      }
    }

    // Upsert all category scores
    const { error: upsertError } = await supabase
      .from('CategoryScores')
      .upsert(updates, { 
        onConflict: 'submission_id,category_id',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      console.error('Error updating category scores:', upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully invalidated all category scores for university`,
      updated_count: updates.length
    });
  } catch (error) {
    console.error('Error in invalidate endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
