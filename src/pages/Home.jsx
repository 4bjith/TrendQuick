import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import img1 from "../assets/images/adam-kenton-3GQb_qH29X0-unsplash.jpg";
import img2 from "../assets/images/andrey-zvyagintsev-EQj1ZMpq_VM-unsplash.jpg";
import img3 from "../assets/images/giorgio-trovato-8krX0HkXw8c-unsplash.jpg";
import CategoryRibbon from "../components/CategoryRibbon";
import ProductRibbon from "../components/ProductRibbon";
import Footer from "../components/Footer";

const slides = [
  {
    image: img1,
    title: "Summer Collection",
    subtitle: "New Arrivals",
    description: "Discover the hottest trends for the season. Style that speaks to you.",
  },
  {
    image: img2,
    title: "Exclusive Deals",
    subtitle: "Limited Time Offer",
    description: "Get up to 50% off on selected premium brands. Don't miss out!",
  },
  {
    image: img3,
    title: "Modern Essentials",
    subtitle: "Elevate Your Wardrobe",
    description: "Timeless pieces crafted for comfort and style. Perfect for every occasion.",
  },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="w-full h-auto">
        {/* Navbar section */}
        <Navbar />

        {/* Hero Section */}
        <div className="w-full h-[70vh] relative overflow-hidden bg-gray-900">
          {/* Background Images Carousel */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}

          {/* Content - Left Aligned */}
          <div className="absolute inset-0 flex items-center px-10 md:px-20">
            <div className="text-white max-w-xl space-y-6 z-10 animate-fade-in-up">
              <h3 className="text-xl md:text-2xl font-medium text-yellow-400 uppercase tracking-widest">
                {slides[currentSlide].subtitle}
              </h3>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 drop-shadow-md">
                {slides[currentSlide].description}
              </p>
              <button className="mt-8 px-8 py-3 bg-white text-black font-bold text-lg rounded-full hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-lg">
                Shop Now
              </button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-yellow-400 w-8" : "bg-white/50 w-3 hover:bg-white"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <CategoryRibbon />
        <ProductRibbon />
        <Footer />
      </div>
    </>
  );
}

export default Home;