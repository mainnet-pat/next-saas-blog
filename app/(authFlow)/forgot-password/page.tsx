import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }

  const confirmReset = async (formData: FormData) => {
    'use server';

    const origin = headers().get('origin');
    const email = formData.get('email') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      return redirect('/forgot-password?message=Could not authenticate user. ' + error.message);
    }

    return redirect(
      '/confirm?message=Password Reset link has been sent to your email address'
    );
  };

  return (
    <div>
      <div className="w-full px-8 sm:max-w-md mx-auto mt-4">
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground mb-4"
          action={confirmReset}
        >
          <label className="text-md" htmlFor="email">
            Enter Email Address
          </label>
          <Input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required>
          </Input>

          <Button className="bg-indigo-700 rounded-md px-4 py-2 text-foreground mb-2">
            Confirm
          </Button>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>

        <Link
          href="/login"
          className="rounded-md no-underline text-foreground text-sm"
        >
          Remember your password? Sign in
        </Link>
      </div>
    </div>
  );
}