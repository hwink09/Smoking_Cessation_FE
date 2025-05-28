import { Code, Layers, Smartphone, Globe, Rocket, LineChart } from "lucide-react"

export function Services() {
  const services = [
    {
      icon: <Smartphone className="w-10 h-10 text-purple-500" />,
      title: "Quit Smoking App",
      description:
        "Track your progress, set goals, and receive daily motivation with our easy-to-use mobile app.",
    },
    {
      icon: <Globe className="w-10 h-10 text-cyan-500" />,
      title: "Online Counseling",
      description:
        "Connect with certified experts for personalized quit plans and ongoing support — anytime, anywhere.",
    },
    {
      icon: <Layers className="w-10 h-10 text-purple-500" />,
      title: "Behavioral Therapy",
      description:
        "Access scientifically backed strategies to manage cravings and change habits for lasting results.",
    },
    {
      icon: <Rocket className="w-10 h-10 text-cyan-500" />,
      title: "Motivational Programs",
      description:
        "Daily tips, stories, and encouragement to keep you inspired and focused on your smoke-free journey.",
    },
    {
      icon: <LineChart className="w-10 h-10 text-purple-500" />,
      title: "Progress Tracking",
      description:
        "Visualize milestones, health improvements, and money saved — all in one dashboard.",
    },
    {
      icon: <Code className="w-10 h-10 text-cyan-500" />,
      title: "Community Support",
      description:
        "Join a supportive community of people on the same journey and share experiences and advice.",
    },
  ];
  

  return (
    <section id="services" className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">Services</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
          We offer comprehensive smoking cessation support tailored to your unique health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-white/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
