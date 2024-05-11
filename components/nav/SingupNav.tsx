import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import LoginForm from './LoginForm'

const SingupNav = () => {
  return (
    <>
        <div>
            <LoginForm/>
        </div>
        <div>
            <Link href={"/singup"}>
                <Button>
                    SingUp
                </Button>
            </Link>
        </div>
    </>
  )
}

export default SingupNav