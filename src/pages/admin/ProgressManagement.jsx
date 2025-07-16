
import React from 'react'
import Progress from '~/components/admin/progress/Progress';
import AdminLayout from '~/components/layouts/admin/AdminLayout';
import { useAuth } from '~/hooks/useAuth';

function ProgressManagement() {
 const { currentUser } = useAuth();
  return (
     <AdminLayout admin={currentUser}>
         <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Tiến trình
         </h1>
         <Progress />
       </AdminLayout>
  )
}

export default ProgressManagement

