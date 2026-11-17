'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const FALLBACK_SLIDES = [
  {
    id: 'default-1',
    badge: 'SEASON 2026 COLLECTION',
    title: 'Tailored for everyday movement.',
    subtitle:
      'Heavyweight organic cottons, structured outerwear, and clean minimalist silhouettes built to last.',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Shop Collection',
    ctaLink: '/shop',
    secCtaLabel: 'Explore Sale',
    secCtaLink: '/shop?sale=true',
  },
];

export function HeroCarousel({ slides = [], interval = 5000 }) {
  const items = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-slide timer (stops on hover or when only 1 slide exists)
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isPaused, items.length, interval, nextSlide]);

  // Keep index valid if admin deletes a slide
  useEffect(() => {
    if (current >= items.length) setCurrent(0);
  }, [items.length, current]);

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    setTouchStartX(null);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group relative overflow-hidden bg-zinc-950 text-white"
    >
      {/* Sliding Track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((slide) => (
          <div key={slide.id} className="w-full shrink-0">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
              {/* Text Content */}
              <div className="space-y-6">
                {slide.badge && (
                  <span className="inline-block rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-300">
                    {slide.badge}
                  </span>
                )}

                <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                  {slide.title}
                </h1>

                {slide.subtitle && (
                  <p className="max-w-lg text-base text-zinc-400 sm:text-lg">
                    {slide.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href={slide.ctaLink || '/shop'}>
                    <Button
                      size="lg"
                      className="bg-white text-zinc-950 hover:bg-zinc-200"
                    >
                      {slide.ctaLabel || 'Shop Collection'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  {slide.secCtaLabel && slide.secCtaLink && (
                    <Link href={slide.secCtaLink}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-zinc-700 bg-transparent text-white hover:bg-zinc-900"
                      >
                        {slide.secCtaLabel}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Slide Visual */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-900">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-103"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Prev / Next Controls (Visible when > 1 slide) */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-700 bg-zinc-900/80 p-2.5 text-white opacity-0 backdrop-blur-xs transition-all hover:bg-white hover:text-zinc-950 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-700 bg-zinc-900/80 p-2.5 text-white opacity-0 backdrop-blur-xs transition-all hover:bg-white hover:text-zinc-950 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Bottom Custom Slide Dots + Pause Indicator */}
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {items.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === idx
                    ? 'w-8 bg-white'
                    : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}