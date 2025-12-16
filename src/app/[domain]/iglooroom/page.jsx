import IrLogo from '../../../components/IrLogo'
import Link from 'next/link'
import React from 'react'

export default function Iglooroom({ searchParams }) {
  const { status } = searchParams

  return (
    <div className='h-screen grid place-items-center'>
      <div className='text-center flex flex-col items-center'>
        <h2 className='text-4xl text-gray-400  mb-20'>{
          status === "notfound" ? "Property not found!" : "Property not active!"}
        </h2>
        <Link href={"https://info.igloorooms.com"} >
          <IrLogo className="h-[8vh]" />
        </Link>
      </div>
    </div>
  )
}
