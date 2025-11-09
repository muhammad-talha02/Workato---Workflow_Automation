import { requiredAuth } from '@/lib/better-auth/auth-utils'
import React from 'react'

const CredientailsPage = async () => {
        await requiredAuth()
    
  return (
    <div>CredientailsPage</div>
  )
}

export default CredientailsPage