// UsersSay.jsx
import React, { useState, useEffect } from "react";

function UsersSay() {
  const testimonials = [
    {
      name: "Aarav",
      text: "I've met such amazing people on Hiddo! The HD calls are super clear, and it feels like you're really face-to-face. Totally hooked!",
      avatar: "/img/landing/avatars/avatar-1.png",
      rating: 5,
    },
    {
      name: "Sofia R.",
      text: "Hiddo makes connecting so easy and fun. I've made new friends from around the world — and yes, some very cute ones too 😉.",
      avatar: "/img/landing/avatars/avatar-2.png",
      rating: 5,
    },
    {
      name: "Karan",
      text: "This app actually feels alive! Every chat feels real, every moment exciting. Can't wait to see who I meet next on Hiddo!",
      avatar: "/img/landing/avatars/avatar-3.png",
      rating: 4,
    },
    {
      name: "Mia L.",
      text: "The interface is so smooth and the people are genuine. I've had the best late-night conversations on Hiddo. Highly recommend!",
      avatar: "/img/landing/avatars/avatar-4.png",
      rating: 5,
    },
    {
      name: "Rohan",
      text: "Hiddo feels different — real faces, real vibes. It's my go-to app when I want to meet someone new and interesting.",
      avatar: "/img/landing/avatars/avatar-5.png",
      rating: 4,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, testimonials.length]);

  const goPrev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % testimonials.length);

  // Show 3 at a time on desktop
  const visible = [0, 1, 2].map((i) => testimonials[(current + i) % testimonials.length]);

  return (
    <>
      {/* Section Background: WHITE */}
      <section className="py-16 px-4 bg-[#FFFAF5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-800">
            What Our Users Say
          </h2>

          {/* Slider wrapper */}
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Prev Arrow */}
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center shadow-md hover:bg-green-800 transition"
            >
              ‹
            </button>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8 md:px-10">
              {visible.map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative bg-green-800 rounded-md p-6 border border-gray-200 shadow-sm transition-all duration-300 hover:border-green-800 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                >
                  <div className="relative z-10">
                    {/* Avatar + name + stars */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={testimonial.avatar || "https://i.pravatar.cc/150?img=32"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-green-800 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = "https://i.pravatar.cc/150?img=32";
                        }}
                      />
                      <div>
                        <div className="font-semibold text-black group-hover:text-green-800 transition-colors duration-300">
                          {testimonial.name}
                        </div>
                        {/* Stars */}
                        <div className="flex text-green-800">
                          {"★".repeat(testimonial.rating)}
                          {"☆".repeat(5 - testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-white italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={goNext}
              aria-label="Next"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center shadow-md hover:bg-green-800 transition"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-green-800 w-6"
                    : "bg-gray-300 hover:bg-pink-300 w-2.5"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default UsersSay;