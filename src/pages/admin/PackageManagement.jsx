import React from 'react'
import PackageItem from '~/components/admin/packages/PackageItem';
import AdminLayout from '~/components/layouts/admin/AdminLayout';
import { useAuth } from '~/hooks/useAuth';

function PackageManagement() {
  const { currentUser } = useAuth();
  return (
     <AdminLayout admin={currentUser}>
         <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Quản lý gói
         </h1>
         <PackageItem />
       </AdminLayout>
  )
}

export default PackageManagement
