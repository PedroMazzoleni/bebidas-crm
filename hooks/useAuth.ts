'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth(requiredRole?: 'admin' | 'comercial') {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.push('/login'); return }
      const data = await res.json()

      if (requiredRole === 'admin' && data.role !== 'admin') {
        router.push('/user/dashboard')
        return
      }

      setUserName(data.full_name || '')
      setUserId(data.id)
      setRole(data.role)
      setReady(true)
    }
    init()
  }, [router, requiredRole])

  return { userName, userId, role, ready }
}
