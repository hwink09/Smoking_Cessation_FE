import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-green-50">
      <CheckCircle2 size={80} className="text-green-600 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Thanh toán thành công!</h1>
      <p className="text-gray-700 mb-6">Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử lý thành công.</p>
      <Button type="primary" onClick={() => navigate('/')}>Về trang chủ</Button>
    </div>
  );
};

export default PaymentSuccessPage;
