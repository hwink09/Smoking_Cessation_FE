import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';


const PaymentCancelPage = () => {
  const navigate = useNavigate();
  const { currentUser: user } = useAuth(); 

  const handleGoHome = () => {
        console.log('Current user:', user);
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/'); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-red-50">
      <XCircle size={80} className="text-red-600 mb-4" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">Thanh toán thất bại!</h1>
      <p className="text-gray-700 mb-6">Giao dịch đã bị hủy hoặc gặp lỗi. Vui lòng thử lại.</p>
      <Button type="default" onClick={handleGoHome}>
        Về trang chủ
      </Button>
    </div>
  );
};

export default PaymentCancelPage;
