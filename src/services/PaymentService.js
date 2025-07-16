import api from "./api";


const PaymentService = {
  // Tạo link thanh toán
  createPaymentLink: async (payload) => {
    const response = await api.post('/payments/create-payment-link', payload);
    return response.data;
  },

  // Webhook - thường được dùng server-side, nhưng vẫn có thể viết ra đây nếu muốn theo dõi
  receiveWebhook: async (payload) => {
    const response = await api.post('/payments/webhook/receive-hook', payload);
    return response.data;
  },

  // Lấy thông tin theo mã đơn hàng
  getPaymentByOrderCode: async (orderCode) => {
    const response = await api.get(`/payments/order/${orderCode}`);
    return response.data;
  },

  // Lấy tất cả thanh toán
  getAllPayments: async () => {
    const response = await api.get('/payments/all');
    return response.data;
  },

  // Cập nhật thanh toán
  updatePayment: async (paymentId, updatedData) => {
    const response = await api.put(`/payments/${paymentId}`, updatedData);
    return response.data;
  },
};

export default PaymentService;
