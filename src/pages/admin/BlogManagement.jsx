import React from 'react'
import BlogPosts from '~/components/admin/blog/BlogPosts'
import AdminLayout from '~/components/layouts/admin/AdminLayout';
import { useAuth } from '~/hooks/useAuth';

function BlogManagement() {
      const { currentUser } = useAuth();
  return (
       <AdminLayout admin={currentUser}>
         <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Quản lý huy hiệu
         </h1>
         <BlogPosts />
       </AdminLayout>
  )
}

export default BlogManagement
