import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { approved } = await request.json();
    const supabase = getSupabaseServerClient();

    console.log(`[approve] Processing approval for university ${id}: ${approved}`);

    if (approved) {
      // Approve: Update is_data_approved to true
      const { error } = await supabase
        .from('Universities')
        .update({ is_data_approved: true })
        .eq('id', id);

      if (error) {
        console.error('[approve] Error approving university:', error);
        throw error;
      }

      console.log(`[approve] University ${id} approved successfully`);

      return NextResponse.json({ 
        message: 'University data approved successfully! Please refresh the page to see changes.' 
      });
    } else {
      // Reject: Set is_data_approved to false
      const { error: uniError } = await supabase
        .from('Universities')
        .update({ is_data_approved: false })
        .eq('id', id);

      if (uniError) {
        console.error('[approve] Error rejecting university:', uniError);
        throw uniError;
      }

      // Get submission IDs for this university
      const { data: submissions, error: subError } = await supabase
        .from('Submissions')
        .select('id')
        .eq('university_id', id);

      if (subError) {
        console.error('[approve] Error fetching submissions:', subError);
        throw subError;
      }

      console.log(`[approve] Found ${submissions?.length || 0} submissions for university ${id}`);

      if (submissions && submissions.length > 0) {
        const submissionIds = submissions.map(s => s.id);

        // ✅ FIX: Set CategoryScores calculated_score to NULL (DON'T DELETE!)
        const { error: scoreError } = await supabase
          .from('CategoryScores')
          .update({ calculated_score: null })  // ← GUNAKAN UPDATE, BUKAN DELETE!
          .in('submission_id', submissionIds);

        if (scoreError) {
          console.error('[approve] Error nullifying scores:', scoreError);
          throw scoreError;
        }

        console.log(`[approve] Set CategoryScores to NULL for ${submissionIds.length} submissions`);

        // Delete UniversityRankings entry (optional - bisa di-set null juga)
        const { error: rankError } = await supabase
          .from('UniversityRankings')
          .delete()
          .eq('university_id', id);

        if (rankError) {
          console.error('[approve] Error deleting rankings:', rankError);
          // Don't throw - rankings might not exist
        }

        console.log(`[approve] Deleted UniversityRankings for university ${id}`);
      }

      console.log(`[approve] University ${id} rejected successfully`);

      return NextResponse.json({ 
        message: 'University data rejected. All scores have been set to NULL. Please refresh the page to see changes.' 
      });
    }
  } catch (error: any) {
    console.error('[approve] Approval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update approval status' },
      { status: 500 }
    );
  }
}