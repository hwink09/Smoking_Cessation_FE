import { Check } from "lucide-react"
import { Link } from "react-router-dom"


export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Great for individuals beginning their quit-smoking journey.",
      features: [
        "Personalized quit plan",
        "Email support",
        "Access to beginner resources",
        "Daily motivation tips",
        "Progress tracking tools",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Complete",
      price: "$149",
      description: "Designed for those who want expert guidance and full support.",
      features: [
        "One-on-one coaching (2 sessions/month)",
        "Full access to premium tools",
        "Habit tracking dashboard",
        "Relapse prevention strategies",
        "Community support group access",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Premium Care",
      price: "Custom",
      description: "Tailored support for long-term smokers or complex cases.",
      features: [
        "Comprehensive health assessment",
        "Unlimited coaching sessions",
        "Nicotine replacement guidance",
        "Therapist referrals (if needed)",
        "Family support planning",
        "12-month follow-up support",
        "Dedicated quit advisor",
      ],
      cta: "Contact Us",
      popular: false,
    },
  ];
  

  return (
    <section id="pricing" className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">Pricing</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Select the perfect support package to help you quit smoking no hidden costs, just real results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                bg-white/5 backdrop-blur-sm border rounded-xl p-6 transition-all
                ${plan.popular ? "border-purple-500 relative" : "border-white/10 hover:border-white/30"}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
              </div>
              <p className="text-white/70 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className={`
                  block w-full py-3 rounded-full text-center font-medium transition-all
                  ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }
                `}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
