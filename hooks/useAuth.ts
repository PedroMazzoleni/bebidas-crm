'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

export function useAuth(requiredRole?: 'admin' | 'comercial') {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles').select('full_name, role').eq('id', user.id).single()

      if (!profile) { router.push('/login'); return }

      // Redirect if role doesn't match
      if (requiredRole === 'admin' && profile.role !== 'admin') {
        router.push('/user/dashboard')
        return
      }

      setUserName(profile.full_name || '')
      setUserId(user.id)
      setRole(profile.role)
      setReady(true)
    }
    init()
  }, [router, requiredRole])

  return { userName, userId, role, ready }
}