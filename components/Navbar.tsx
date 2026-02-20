import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { WalletConnect } from './WalletConnect'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between border-b border-gray-700 shadow-sm px-10 py-2'>
            <div className='flex items-center'>
                <Image src="/star.png" alt="Logo" width={60} height={60} className='p-2' />
                <h1 className='text-3xl font-bold text-white ml-5 items-center'>Stellar Payment Dashboard</h1>
            </div>

            <div className='flex items-center space-x-5'>
                <Link href="https://github.com/harshitsingh123456789/stellar-white-belt-wallet-app" target="_blank" rel="noopener noreferrer">
                    <Image src="/github.png" alt="Github" width={40} height={40} className='cursor-pointer hover:opacity-80 transition-opacity rounded-full' />
                </Link>
                <Link href="https://twitter.com/harshitsingh123456789" target="_blank" rel="noopener noreferrer">
                    <Image src="/twitter.png" alt="Twitter" width={40} height={40} className='cursor-pointer hover:opacity-80 transition-opacity rounded-full' />
                </Link>
                <ThemeToggle />
            </div>
        </div>
    )
}

export default Navbar