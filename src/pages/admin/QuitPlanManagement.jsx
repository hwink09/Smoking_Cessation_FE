import React from 'react'
import QuitPlans from '~/components/admin/quitPlan/QuitPlans';
import AdminLayout from '~/components/layouts/admin/AdminLayout';
import { useAuth } from '~/hooks/useAuth';

function QuitPlanManagement() {
  const { currentUser } = useAuth();
  return (
     <AdminLayout admin={currentUser}>
         <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Quản lý kế hoạch cai thuốc
         </h1>
         <QuitPlans />
       </AdminLayout>
  )
}

export default QuitPlanManagement
