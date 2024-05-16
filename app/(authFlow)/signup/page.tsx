import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoginForm from '@/components/nav/LoginForm';

export default async function Signup({
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
  const signUp = async (formData: FormData) => {
    'use server';
    const origin = headers().get('origin');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const supabase = createClient();
    let userExist = false as boolean
    
    // Check if the user already exists in Supabase
    try {
      const response = await fetch(process.env.SITE_URL + `/api/checkEmail?email=${email}`, {
        method: 'GET',
      });
      const exists = await response.json();
      if (exists.exists) {
        userExist = true
      }
    } catch(error) {
      console.log(error)
    }
    if (userExist) {
      return redirect('/signup?message=Email already exists');
    }

    if (password !== confirmPassword) {
      return redirect('/signup?message=Passwords do not match');
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error)
      return redirect('/signup?message=Could not authenticate user. ' + error.message);
    }

    return redirect(
      `/confirm?message=Check email(${email}) to continue sign in process`
    );
  };

  return (
    <div>
      <div className="w-full px-8 sm:max-w-md mx-auto mt-4">
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground mb-4"
          action={signUp}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <Input    
            type='email'        
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required>
          </Input>
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <Input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          >
          </Input>
          <label className="text-md" htmlFor="password">
            Confirm Password
          </label>
          <Input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            required 
          >
          </Input>
          <Button className="bg-indigo-700 rounded-md px-4 py-2 text-foreground mb-2">
            Sign up
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
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}