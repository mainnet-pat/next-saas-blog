import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient()

  const { email } = req.body

  const { data, error } = await supabase
    .from('auth.users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
  } else if (data) {
    res.status(200).json({ exists: true })
  } else {
    res.status(200).json({ exists: false })
  }
}