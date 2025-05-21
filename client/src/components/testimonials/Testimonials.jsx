import { Image } from "antd"


export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Thanks to this smoking cessation counseling program, I successfully quit after years of struggle. My health has improved significantly and I feel more energetic.",
      author: "John Nguyen",
      position: "Successful Patient",
      avatar: "/placeholder-smoking.svg?height=80&width=80",
    },
    {
      quote:
        "The counselors are very dedicated and truly understand the psychology of smokers. They helped me find the right method to quit smoking sustainably.",
      author: "Anna Tran",
      position: "Client",
      avatar: "/placeholder-smoking.svg?height=80&width=80",
    },
    {
      quote:
        "This smoking cessation support program not only helped me gradually reduce my bad habits but also provided valuable knowledge about the harms of smoking and how to maintain a healthy lifestyle.",
      author: "Michael Lee",
      position: "Successful Quitter",
      avatar: "/placeholder-smoking.svg?height=80&width=80",
    },
  ];
  

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Clients Say
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Our community speaks for itself read how we’ve helped people quit smoking for good.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="mb-6">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.667 13.333H5.33366C5.33366 8 9.33366 5.333 13.3337 5.333L12.0003 8C10.667 9.333 10.667 11.333 10.667 13.333ZM21.3337 13.333H16.0003C16.0003 8 20.0003 5.333 24.0003 5.333L22.667 8C21.3337 9.333 21.3337 11.333 21.3337 13.333ZM24.0003 16V21.333C24.0003 22.4 23.067 23.333 22.0003 23.333H20.0003V26.667H22.0003C24.9337 26.667 27.3337 24.267 27.3337 21.333V16H24.0003ZM13.3337 16V21.333C13.3337 22.4 12.4003 23.333 11.3337 23.333H9.33366V26.667H11.3337C14.267 26.667 16.667 24.267 16.667 21.333V16H13.3337Z"
                    fill="url(#paint0_linear)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="5.33366"
                      y1="16"
                      x2="27.3337"
                      y2="16"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#A855F7" />
                      <stop offset="1" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <Image 
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.author}</h4>
                  <p className="text-white/60 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
