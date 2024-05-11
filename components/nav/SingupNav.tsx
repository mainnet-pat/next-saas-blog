import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const SingupNav = () => {
  return (
    <>
        <div>
            <Link href={"/login"}>
                <Button>
                    Login
                </Button>
            </Link>
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