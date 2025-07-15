import React from 'react'
import Notifications from '~/components/admin/notifacation/Notifications'
import AdminLayout from '~/components/layouts/admin/AdminLayout';
import { useAuth } from '~/hooks/useAuth';

function NotificationManagement() {
  const { currentUser } = useAuth();
  return (
     <AdminLayout admin={currentUser}>
         <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Thông báo
         </h1>
         <Notifications />
       </AdminLayout>
  )
}

export default NotificationManagement

