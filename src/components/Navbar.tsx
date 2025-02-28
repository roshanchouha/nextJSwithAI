"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'


const Navbar = () => {
    const { data: session } = useSession();

    const user: User = session?.user as User

    return (
        <nav className='p-4 md:p-4 shadow-md'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link href="" > Mystry Message</Link>
                {
                    session ? (<>
                        <span className='mr-4 '>Welcome {user?.name || user.email}</span>
                        <Button onClick={() => signOut()}>Sign Out</Button>
                    </>) : (<div>
                        <Link href="/sign-in" className="">
                            <Button>Login</Button>
                        </Link>
                    </div>)
                }
            </div>
        </nav>
    )
}

export default Navbar