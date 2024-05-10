import Header from '@/components/nav/Navbar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Login({
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

  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/auth/login?message=Could not authenticate user');
    }

    return redirect('/');
  };

  return (
    <div>
      <div className="w-full px-8 sm:max-w-md mx-auto mt-4">
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground mb-4"
          action={signIn}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <Input 
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required>
          </Input>
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <Input className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required>
          </Input>

          <Button className="bg-indigo-700 rounded-md px-4 py-2 text-foreground mb-2">
            Sign In
          </Button>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>

        <Link
          href="/auth/forgot-password"
          className="rounded-md no-underline text-indigo-400 text-sm "
        >
          Forgotten Password.
        </Link>

        <br />
        <br />

        <Link
          href="/auth/signup"
          className="rounded-md no-underline text-foreground text-sm"
        >
          {`Don't have an Account? Sign Up`}
        </Link>
      </div>
    </div>
  );
}