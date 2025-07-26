import { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import SubscriptionService from "~/services/subscriptionService";

export const useUserSubscription = () => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (!currentUser?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const activeSubscriptions =
          await SubscriptionService.getMyActiveSubscription();

        // Lấy subscription đang active
        const currentSubscription =
          activeSubscriptions && activeSubscriptions.length > 0
            ? activeSubscriptions[0]
            : null;

        setSubscription(currentSubscription);
      } catch (err) {
        console.error("Error fetching user subscription:", err);
        // Nếu lỗi 500 hoặc lỗi khác, set subscription null và không hiển thị error để không crash app
        if (err.response?.status === 500) {
          setSubscription(null);
          console.warn(
            "Server error when fetching subscription, assuming free plan"
          );
        } else {
          setError(
            err?.response?.data?.message ||
              "Không thể tải thông tin gói đăng ký"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscription();
  }, [currentUser?.userId]);

  // Kiểm tra xem user có gói plus hoặc premium không
  const hasPlusOrPremium = () => {
    if (!subscription) return false;

    const packageName = subscription.name?.toLowerCase();
    return packageName === "plus" || packageName === "premium";
  };

  // Kiểm tra xem gói có còn hạn không
  const isSubscriptionActive = () => {
    if (!subscription) return false;

    if (subscription.status !== "active") return false;

    // Gói free không có ngày hết hạn
    if (subscription.name?.toLowerCase() === "free") return true;

    // Kiểm tra ngày hết hạn
    if (subscription.end_date) {
      return new Date(subscription.end_date) >= new Date();
    }

    return false;
  };

  // Kiểm tra quyền truy cập coach
  const canAccessCoach = () => {
    // Nếu đang loading, chờ
    if (loading) {
      return false;
    }

    // Nếu không có subscription hoặc subscription là Free, không có quyền
    if (!subscription || subscription.name?.toLowerCase() === "free") {
      return false;
    }

    // Chỉ cho phép Plus/Premium và phải active
    return hasPlusOrPremium() && isSubscriptionActive();
  };

  // Kiểm tra user có phải Free user không (chưa có gói thật sự)
  const isFreeUser = () => {
    // Không có subscription hoặc có subscription tên là "free" = Free user
    return !subscription || subscription.name?.toLowerCase() === "free";
  };

  return {
    subscription,
    loading,
    error,
    hasPlusOrPremium,
    isSubscriptionActive,
    canAccessCoach,
    isFreeUser,
    refetch: () => {
      if (currentUser?.userId) {
        const fetchUserSubscription = async () => {
          try {
            setLoading(true);
            const activeSubscriptions =
              await SubscriptionService.getMyActiveSubscription();
            const currentSubscription =
              activeSubscriptions && activeSubscriptions.length > 0
                ? activeSubscriptions[0]
                : null;
            setSubscription(currentSubscription);
          } catch (err) {
            // Handle lỗi 500 gracefully
            if (err.response?.status === 500) {
              setSubscription(null);
              console.warn(
                "Server error when refetching subscription, assuming free plan"
              );
            } else {
              setError(
                err?.response?.data?.message ||
                  "Không thể tải thông tin gói đăng ký"
              );
            }
          } finally {
            setLoading(false);
          }
        };
        fetchUserSubscription();
      }
    },
  };
};
