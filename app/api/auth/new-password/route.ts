import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const password = String(formData.get('password'))
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createClient()
        await (await supabase).auth.exchangeCodeForSession(code)

        const {  error } = await (await supabase).auth.updateUser({
            password: password
        })

        if (error) {
            return NextResponse.json({ error: error }, { status: 500 })
        }
    }

    return NextResponse.redirect(new URL('/dashboard/library', request.url), {
        status: 302,
    })
}
