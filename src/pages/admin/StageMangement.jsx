import React from 'react'
import Stage from '~/components/admin/stages/Stage';
import AdminLayout from '~/components/layouts/admin/AdminLayout';
import { useAuth } from '~/hooks/useAuth';

function StageMangement() {
  const { currentUser } = useAuth();
  return (
     <AdminLayout admin={currentUser}>
         <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Giai đoạn
         </h1>
         <Stage />
       </AdminLayout>
  )
}

export default StageMangement
