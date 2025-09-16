import { notFound } from 'next/navigation'
import { fetchUserById } from '@/lib/actions/user.actions'
// import UserForm from '@/components/admin/users/UserForm'
import {BackButton} from '@/components/admin-view/BackButton'


export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // 1. Obtener el usuario
 
  
   const user = await fetchUserById(id)
  
   if(!user){
     notFound() 
   }

  // 2. Renderizar el formulario de edición
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <BackButton href="/admin/users" />
          <h1 className="text-2xl font-bold mt-4">Edit User</h1>
          <p className="text-muted-foreground">
            Update user information and save changes
          </p>
        </div>
      </div>

      {/* <Card className="p-6">
        <UserForm 
          initialData={user} 
          isEditing 
        />
      </Card> */}
    </div>
  )
}