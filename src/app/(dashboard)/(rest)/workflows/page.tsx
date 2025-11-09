import { requiredAuth } from '@/lib/better-auth/auth-utils'
import React from 'react'

const Page = async () => {
    await requiredAuth()
  return (
    <div>Page</div>
  )
}

export default Page