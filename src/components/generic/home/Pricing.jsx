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
    price === 0 ? "Free" : `${new Intl.NumberFormat().format(price)}`;

  const isPopular = (plan) => plan.name?.toLowerCase() === "plus";

  const handleGetStarted = async (plan) => {
    if (!user) {
      toast("Vui lòng đăng nhập để đăng ký.");
      return;
    }

    try {
      // Kiểm tra xem user đã có subscription đang hoạt động chưa
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
    <section
      id="pricing"
      className="py-20 relative bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Select the perfect support package to help you quit smoking — no
            hidden costs, just real results.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-white/70">Đang tải gói dịch vụ...</p>
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
                    "relative border rounded-2xl p-8 transition-all shadow-lg hover:scale-[1.02]",
                    "bg-white/5 backdrop-blur-md text-white",
                    popular
                      ? "border-purple-500 shadow-purple-500/20"
                      : "border-white/10 hover:border-white/30"
                  )}
                >
                  {popular && (
                    <div className="absolute -top-5 left-0 right-0 flex justify-center">
                      <div className="flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-sm font-medium text-white shadow-lg">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-2 capitalize">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    {formatPrice(plan.price)}
                  </div>
                  <p className="text-white/70 mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features?.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-white/90"
                      >
                        <Check className="w-5 h-5 text-green-400 shrink-0 mt-1" />
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
                        : "bg-white/10 hover:bg-white/20 text-white"
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
