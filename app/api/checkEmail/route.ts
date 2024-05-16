import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/supabase';

export async function GET(request: Request) {
	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SERVICE_ROLE_SUPABASE_ANON_KEY!
	);

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email as string)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ exists: !!data.email });
  } catch (error) {
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}