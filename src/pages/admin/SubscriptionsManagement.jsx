import React from 'react'
import Subscriptions from '~/components/admin/subscriptions/Subscriptions'
import AdminLayout from '~/components/layouts/admin/AdminLayout'
import { useAuth } from '~/hooks/useAuth';

function SubscriptionsManagement() {
    const { currentUser } = useAuth();
  return (
   <AdminLayout admin={currentUser}>
         <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Đăng Ký
         </h1>
         <Subscriptions/>
       </AdminLayout>
  )
}

export default SubscriptionsManagement
