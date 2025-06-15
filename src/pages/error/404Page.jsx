import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <main className="w-full">
        <section className="py-10 bg-white font-serif">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-3xl text-center">
                <div
                  className="relative bg-center bg-no-repeat bg-cover h-[400px] flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
                  }}
                >
                  <h1 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-[80px] font-bold text-gray-800 drop-shadow-lg">
                    404
                  </h1>
                </div>

                <div className="mt-[-50px]">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                    Look like you're lost
                  </h3>
                  <p className="mb-6 text-gray-600">
                    The page you are looking for is not available!
                  </p>
                  <Link
                    to="/"
                     className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500"
                  >
                    Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
