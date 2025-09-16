// import { ComboboxDemo } from "@/components/TruckSelector";

// export default function Profile() {
//   return (
//     <div className="grid grid-cols-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <h1>Perfil</h1>
//       {/* <ComboboxDemo/> */}
     
//     </div>
//   );
// }


import AccountForm from '@/components/AccountForm'
import { createClient } from '@/lib/supabase/server'

export default async function Account() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return <AccountForm user={user} />
}

