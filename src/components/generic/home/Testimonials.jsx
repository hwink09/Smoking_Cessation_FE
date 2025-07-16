
import { Image } from "antd";

import { Marquee } from "~/components/ui/Marquee";
import useFeedbacks from "~/hooks/useFeedbacks";
import React from "react";

const Testimonials = () => {
  const {
    feedbacks,
    loading,
    error,
  } = useFeedbacks();

  // Fetch feedbacks on component mount

  // Show all feedbacks from API (not just those with status 'approved')
  const approvedFeedbacks = (Array.isArray(feedbacks) ? feedbacks : [])
    // .filter(feedback => feedback.status === 'approved') // Show all feedbacks
    .slice(0, 6) // Limit to 6 testimonials
    .map(feedback => ({
      quote: feedback.content,
      author: feedback.user_id?.name || feedback.user_id?.email || 'Anonymous',
      position: "Client",
      avatar: feedback.user_id?.avatar_url || "/default-avatar.png",
      rating: feedback.rating
    }));

  // Remove fallback testimonials and all console.log
  const testimonials = approvedFeedbacks;

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
          Our community speaks for itself — read how we've helped people quit smoking for good.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-white/60">Unable to load testimonials at the moment.</p>
        </div>
      ) : testimonials.length === 0 ? null : (
        <Marquee pauseOnHover className="max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="min-w-[300px] max-w-sm mx-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="mb-6">
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                  fallback="/default-avatar.png"
                />
                <div className="ml-2">
                  <h4 className="font-medium text-white">{testimonial.author}</h4>
                  <p className="text-white/60 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      )}
    </section>
  );
}

export default Testimonials;