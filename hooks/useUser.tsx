// // hooks/useUser.ts
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase/client'
// import { User } from '@supabase/supabase-js'

// export function useUser() {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const getSession = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
//       setUser(user)
//       setLoading(false)
//     }

//     getSession()

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setUser(session?.user ?? null)
//       }
//     )

//     return () => subscription.unsubscribe()
//   }, [])

//   return { user, loading }
// }