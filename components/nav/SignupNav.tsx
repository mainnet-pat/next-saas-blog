import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import LoginForm from './LoginForm'

const SignupNav = () => {
  return (
    <>
        <div>
            <LoginForm/>
        </div>
        <div>
            <Link href={"/signup"}>
                <Button>
                    SignUp
                </Button>
            </Link>
        </div>
    </>
  )
}

export default SignupNav