import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(
  request: NextRequest,
  { params }: { params: { universityId: string } }
) {
  try {
    const supabase = getSupabaseServerClient();
    const universityId = params.universityId;

    // Get crawling data for this university
    const { data: crawlingData, error } = await supabase
      .from('CrawlingData')
      .select('*')
      .eq('university_id', universityId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching crawling data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!crawlingData) {
      return NextResponse.json([{
        university_id: universityId,
        num_publications: 0,
        num_assets: 0,
        crawling_score: 0,
        last_crawled_at: null,
        note: 'No crawling data available for this university'
      }]);
    }

    // Format data for CSV export
    const formattedData = [{
      university_id: crawlingData.university_id,
      num_publications: crawlingData.num_publications || 0,
      num_assets: crawlingData.num_assets || 0,
      crawling_score: crawlingData.crawling_score || 0,
      last_crawled_at: crawlingData.last_crawled_at || 'Never',
    }];

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error in crawling data export:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
