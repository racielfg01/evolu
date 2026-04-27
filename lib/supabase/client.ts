// import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from "@supabase/ssr";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseKey, {
//   auth: {
//     flowType: 'pkce',
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true
//   }
// })


export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    // process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseUrl!, supabaseKey!,
    {
  // auth: {
  //   flowType: 'pkce',
  //   autoRefreshToken: true,
  //   persistSession: true,
  //   detectSessionInUrl: true
  // }
}
  );
}

// export async function signOut() {
//   const supabase = createClient()
//   try {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw new Error(error.message);
//   } catch (error) {
//     console.error("SignOut Failed:", error);
//     throw error;
//   }
// }