import { Check, Star } from "lucide-react";
import classNames from "classnames";
import { useAuth } from "~/hooks/useAuth";
import usePackages from "~/hooks/usePackages";
import SubscriptionService from "~/services/subscriptionService";
import PaymentService from "~/services/PaymentService";
import { toast } from "react-toastify";

export function Pricing() {
  const { packages, loading, error } = usePackages();
  const { currentUser: user } = useAuth();

  const packageOrder = ["free", "plus", "premium"];
  const sortedPackages = (packages || []).slice().sort((a, b) => {
    const aIndex = packageOrder.indexOf(a.name?.toLowerCase());
    const bIndex = packageOrder.indexOf(b.name?.toLowerCase());
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

  const formatPrice = (price) =>
    price === 0 ? "Miễn phí" : `${new Intl.NumberFormat().format(price)}₫`;

  const isPopular = (plan) => plan.name?.toLowerCase() === "plus";

  const handleGetStarted = async (plan) => {
    if (!user) {
      toast("Vui lòng đăng nhập để đăng ký.");
      return;
    }

    try {
      const activeSubscriptions =
        await SubscriptionService.getMyActiveSubscription();

      if (activeSubscriptions && activeSubscriptions.length > 0) {
        toast.warn("Bạn đã có gói đăng ký đang hoạt động.");
        return;
      }

      const subscriptionPayload = {
        package_id: plan._id,
        user_id: user.userId,
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
        user_id: user.userId,
        amount: plan.price,
        description: `Thanh toán cho gói ${plan.name}`,
      };

      const paymentResult = await PaymentService.createPaymentLink(
        paymentPayload
      );

      if (paymentResult?.checkoutUrl) {
        window.location.href = paymentResult.checkoutUrl;
      } else {
        toast("Không thể tạo liên kết thanh toán.");
      }
    } catch (error) {
      toast("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <section id="pricing" className="py-20 relative bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bảng giá{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              hợp lý & rõ ràng
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn gói hỗ trợ phù hợp để giúp bạn cai thuốc lá – không chi phí ẩn,
            chỉ hiệu quả thật.
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
                    "relative border rounded-2xl p-8 transition-all shadow-md hover:scale-[1.02]",
                    "bg-white text-gray-900",
                    popular
                      ? "border-purple-500 shadow-purple-500/10"
                      : "border-gray-200 hover:border-gray-300"
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
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    )}
                  >
                    {plan.cta || "Đăng ký ngay"}
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
