
import { Image } from "antd";
import { Marquee } from "~/components/ui/Marquee";


export function Testimonials() {
  const testimonials = [
    {
      quote: "Thanks to this smoking cessation counseling program...",
      author: "John Nguyen",
      position: "Successful Patient",
      avatar: "/placeholder-smoking.svg?height=80&width=80",
    },
    {
      quote: "The counselors are very dedicated and truly understand...",
      author: "Anna Tran",
      position: "Client",
      avatar: "/placeholder-smoking.svg?height=80&width=80",
    },
    {
      quote: "This smoking cessation support program not only helped me...",
      author: "Michael Lee",
      position: "Successful Quitter",
      avatar: "/placeholder-smoking.svg?height=80&width=80",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What Our{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Clients Say
          </span>
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Our community speaks for itself — read how we’ve helped people quit smoking for good.
        </p>
      </div>

      
      <Marquee pauseOnHover className="max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="min-w-[300px] max-w-sm mx-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
          >
            <div className="mb-6">
            
            </div>
            <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
            <div className="flex items-center">
              <Image
                src={testimonial.avatar}
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
      </Marquee>
    </section>
  );
}
