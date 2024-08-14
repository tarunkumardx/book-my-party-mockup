import React from 'react'
import { logo } from '@/assets/images'
import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <>
      <Link className="logo d-inline-block" href="/">
        <Image src={logo ? logo : 'Logo'} height="70" width="250" alt={'Logo'} className="img-fluid" />
      </Link>
    </>
  )
}
export default Logo