import { Check, Star } from "lucide-react";
import classNames from "classnames";
import { usePackageData } from "~/hooks/usePackageData";
import SubscriptionService from "~/services/subscriptionService";
import { useAuth } from "~/hooks/useAuth";
import PaymentService from "~/services/PaymentService";

export function Pricing() {
  const { packages, loading, error } = usePackageData();
  const { currentUser: user } = useAuth();

  // Sắp xếp packages theo thứ tự mong muốn
  const packageOrder = ["free", "plus", "premium"];
  const sortedPackages = (packages || []).slice().sort((a, b) => {
    const aIndex = packageOrder.indexOf(a.name?.toLowerCase());
    const bIndex = packageOrder.indexOf(b.name?.toLowerCase());
    // Nếu không tìm thấy, cho xuống cuối
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

  const formatPrice = (price) =>
    price === 0 ? "Free" : `${new Intl.NumberFormat().format(price)}`;

  const isPopular = (plan) => plan.name?.toLowerCase() === "plus";

  const handleGetStarted = async (plan) => {
    try {
      const subscriptionPayload = {
        package_id: plan._id,
        user_id: user._id,
        start_date: new Date().toISOString(),
        end_date: "",
        status: "pending",
        name: plan.name,
        price: plan.price,
      };
      const createdSub = await SubscriptionService.createSubscription(
        subscriptionPayload
      );

      const paymentPayload = {
        subscription_id: createdSub.subscription._id,
        user_id: user._id,
        amount: plan.price,
        description: `Thanh toán cho gói ${plan.name}`,
      };
      const paymentResult = await PaymentService.createPaymentLink(
        paymentPayload
      );

      if (paymentResult?.checkoutUrl) {
        window.location.href = paymentResult.checkoutUrl;
      } else {
        alert("Không thể tạo liên kết thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đăng ký/thanh toán:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <section
      id="pricing"
      className="py-20 bg-white" // ✅ nền trắng toàn phần
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thành tựu Đơn giản, Minh bạch{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Giá cả
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn gói hỗ trợ hoàn hảo để giúp bạn cai thuốc lá không có chi phí
            ẩn, chỉ có kết quả thực sự.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải gói dịch vụ...</p>
        ) : error ? (
          <p className="text-center text-red-500">Lỗi: {error.message}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {sortedPackages.map((plan, index) => {
              const popular = isPopular(plan);
              return (
                <div
                  key={plan._id || index}
                  className={classNames(
                    "relative border rounded-2xl p-8 transition-all shadow-xl hover:scale-[1.02]",
                    "bg-white text-gray-900", // ✅ thẻ nền trắng, chữ tối
                    popular
                      ? "border-purple-500 shadow-purple-200"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  {popular && (
                    <div className="absolute -top-5 left-0 right-0 flex justify-center">
                      <div className="flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-sm font-medium text-white shadow-md">
                        <Star className="w-4 h-4" />
                        Phổ biến nhất
                      </div>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-2 capitalize">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-800 mb-4">
                    {formatPrice(plan.price)}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features?.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-800"
                      >
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleGetStarted(plan)}
                    className={classNames(
                      "block w-full py-3 rounded-full text-center font-semibold transition-all duration-200",
                      popular
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    )}
                  >
                    {plan.cta || "Get Started"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
