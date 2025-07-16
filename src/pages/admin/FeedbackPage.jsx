import React from 'react'
import FeedbackManagement from '~/components/admin/feedbackManagement/Feedbacks';
import AdminLayout from '~/components/layouts/admin/AdminLayout';
import { useAuth } from '~/hooks/useAuth';

function FeedbackPage() {
 const { currentUser } = useAuth();
  return (
     <AdminLayout admin={currentUser}>
         <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
           Phản hồi
         </h1>
         <FeedbackManagement />
       </AdminLayout>
  )
}

export default FeedbackPage
