"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 50% OFF",
    description: "Shop the latest trends and save big on your favorite items",
    cta: "Shop Now",
    link: "/shop",
    priority: true,
    bgColor: "from-orange-500 to-pink-500",
    image: "https://picsum.photos/800/600?random=1"
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh Copriollection 2024",
    description: "Discover the newest products just added to our store",
    cta: "Explore",
    link: "/shop?filter=new",
    bgColor: "from-blue-600 to-purple-600",
    image: "https://picsum.photos/800/600?random=2"
  },
  {
    id: 3,
    title: "Electronics Deal",
    subtitle: "Tech at Best Prices",
    description: "Get the latest gadgets with exclusive discounts",
    cta: "View Deals",
    link: "/shop?category=electronics",
    bgColor: "from-green-500 to-teal-500",
    image: "https://picsum.photos/800/600?random=3"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentSlide
              ? 'opacity-100 translate-x-0'
              : index < currentSlide
              ? 'opacity-0 -translate-x-full'
              : 'opacity-0 translate-x-full'
          }`}
        >
          <div className={`w-full h-full bg-gradient-to-r ${slide.bgColor} relative`}>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 opacity-20">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content - MODIFIED FOR CENTER ALIGNMENT */}
            <div className="relative z-10 h-full flex items-center justify-center text-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in-up">
                    {slide.title}
                  </h2>
                  <p className="text-2xl md:text-3xl text-yellow-300 font-semibold mb-4 animate-slide-in-right">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg md:text-xl text-white opacity-90 mb-8 animate-fade-in-up">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.link}
                    className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover-scale transition-smooth shadow-lg hover:shadow-2xl"
                  >
                    {slide.cta} 
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover-scale z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover-scale z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-900" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              index === currentSlide
                ? 'w-12 bg-white'
                : 'w-3 bg-white/50 hover:bg-white/75'
            } h-3 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
