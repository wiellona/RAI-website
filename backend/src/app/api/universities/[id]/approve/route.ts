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

    if (approved) {
      // Approve: Just update is_data_approved to true
      const { error } = await supabase
        .from('Universities')
        .update({ is_data_approved: true })
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({ 
        message: 'University data approved successfully!' 
      });
    } else {
      // Reject: Set is_data_approved to false and nullify all metrics
      const { error } = await supabase
        .from('Universities')
        .update({
          is_data_approved: false,
          collaboration: null,
          privacy: null,
          accountability: null,
          security: null,
          ethics_in_ai: null,
          fairness: null,
          transparency: null,
          continuous_learning: null
        })
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({ 
        message: 'University data rejected. All metrics have been set to NULL.' 
      });
    }
  } catch (error: any) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update approval status' },
      { status: 500 }
    );
  }
}