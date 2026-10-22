'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDuration, launchPoster, launchPreview, launchVideo, type Launch } from '@/lib/launches'

/**
 * Shows a product's muted preview loop while it is on screen, and swaps to the
 * full launch film (with controls) when the visitor presses play.
 */
export default function LaunchPlayer({ launch, compact = false }: { launch: Launch; compact?: boolean }) {
  const previewRef = useRef<HTMLVideoElement | null>(null)
  const filmRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)

  // Play the preview only while visible, and never for people who asked for reduced motion.
  useEffect(() => {
    const video = previewRef.current
    if (!video || playing) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [playing])

  useEffect(() => {
    if (playing) filmRef.current?.play().catch(() => {})
  }, [playing])

  return (
    <div className="group relative w-full overflow-hidden rounded-[1.4rem] bg-black" style={{ aspectRatio: '16 / 9' }}>
      {playing ? (
        <video
          ref={filmRef}
          className="absolute inset-0 h-full w-full"
          src={launchVideo(launch.slug)}
          poster={launchPoster(launch.slug)}
          controls
          playsInline
          preload="auto"
          aria-label={`${launch.name} launch film`}
        />
      ) : (
        <>
          <video
            ref={previewRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={launchPreview(launch.slug)}
            poster={launchPoster(launch.slug)}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className={`absolute flex items-center gap-3 rounded-full bg-white/95 font-semibold text-[#0f1222] shadow-lg backdrop-blur transition hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 ${
              compact ? 'bottom-3 left-3 py-1.5 pl-1.5 pr-4 text-sm' : 'bottom-3 left-3 py-1.5 pl-1.5 pr-4 text-sm md:bottom-5 md:left-5 md:py-2 md:pl-2 md:pr-5 md:text-base'
            }`}
            aria-label={`Play the ${launch.name} launch film`}
          >
            <span
              className={`flex items-center justify-center rounded-full text-white ${compact ? 'h-7 w-7' : 'h-7 w-7 md:h-10 md:w-10'}`}
              style={{ background: launch.accent }}
            >
              <svg viewBox="0 0 24 24" className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} fill="currentColor" aria-hidden>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
            Watch launch film
            <span className="font-mono text-xs opacity-60">{formatDuration(launch.duration)}</span>
          </button>
        </>
      )}
    </div>
  )
}
