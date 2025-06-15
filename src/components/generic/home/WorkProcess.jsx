export function WorkProcess() {
  const steps = [
    {
      number: "01",
      title: "Assessment",
      description: "We begin by evaluating your smoking habits, triggers, and readiness to quit to create a personalized plan.",
    },
    {
      number: "02",
      title: "Goal Setting",
      description: "Together, we define clear, realistic goals and set a quit date that aligns with your lifestyle.",
    },
    {
      number: "03",
      title: "Preparation",
      description: "We guide you through mental, emotional, and environmental preparations to increase your chances of success.",
    },
    {
      number: "04",
      title: "Action",
      description: "On your quit day, you’ll follow your personalized plan with tools, support, and motivation to stay on track.",
    },
    {
      number: "05",
      title: "Support",
      description: "Ongoing support from professionals and peers helps you navigate cravings and avoid relapse.",
    },
    {
      number: "06",
      title: "Maintenance",
      description: "We help you build long-term strategies to stay smoke-free and celebrate your milestones along the way.",
    },
  ];
  

  return (
    <section id="process" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">Process</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Personalized, proven strategies to support your smoke-free journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
