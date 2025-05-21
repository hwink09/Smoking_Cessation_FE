import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section>
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 to-cyan-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full filter blur-3xl" />
      </div>
       <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Empowering Lives 
            </span>{" "}
            To Quit Smoking 
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
          We provide comprehensive counseling and support solutions to help you quit smoking, improve your health, and take control of your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="#contact"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all text-white font-medium"
            >
              Get Started
            </Link>
            <Link
              to="#services"
              className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all text-white font-medium flex items-center justify-center gap-2"
            >
              Our Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
