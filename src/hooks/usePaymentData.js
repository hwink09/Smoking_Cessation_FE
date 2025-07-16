import { useState, useCallback, useEffect } from "react";
import PaymentService from "~/services/PaymentService";

export function usePaymentData() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy tất cả thanh toán
  const fetchAllPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PaymentService.getAllPayments();
      setPayments(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy thanh toán theo orderCode
  const getPaymentByOrderCode = useCallback(async (orderCode) => {
    setLoading(true);
    setError(null);
    try {
      const data = await PaymentService.getPaymentByOrderCode(orderCode);
      setSelectedPayment(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo thanh toán
  const createPayment = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await PaymentService.createPaymentLink(payload);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cập nhật thanh toán
  const updatePayment = useCallback(async (paymentId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await PaymentService.updatePayment(paymentId, updatedData);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự fetch khi cần
  useEffect(() => {
    fetchAllPayments();
  }, [fetchAllPayments]);

  return {
    payments,
    selectedPayment,
    loading,
    error,
    fetchAllPayments,
    getPaymentByOrderCode,
    createPayment,
    updatePayment,
  };
}
