import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { HIGHWAY_PLAYLIST, type TrackItem } from '../data/playlist';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const MusicPill: React.FC = () => {
  const instanceId = useId().replace(/:/g, '');
  const hostId = `yt-host-${instanceId}`;

  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const titleSpanRef = useRef<HTMLSpanElement | null>(null);
  const handleNextRef = useRef<() => void>(() => {});

  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [liveDuration, setLiveDuration] = useState(HIGHWAY_PLAYLIST[0].duration);
  const [isTitleScrolling, setIsTitleScrolling] = useState(false);

  const currentTrack: TrackItem = HIGHWAY_PLAYLIST[trackIndex];

  // Stop polling timer
  const stopTimer = useCallback(() => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  // Start polling timer
  const startTimer = useCallback(() => {
    stopTimer();
    progressTimerRef.current = window.setInterval(() => {
      if (!isSeekingRef.current && playerRef.current) {
        try {
          const cur = playerRef.current.getCurrentTime() || 0;
          setCurrentTime(cur);
          const dur = playerRef.current.getDuration();
          if (Number.isFinite(dur) && dur > 0) {
            setLiveDuration(dur);
          }
        } catch {}
      }
    }, 250);
  }, [stopTimer]);

  // Load YouTube IFrame API
  useEffect(() => {
    let isMounted = true;
    let localPlayer: any = null;

    const initYT = (): Promise<any> => {
      if (window.YT?.Player) return Promise.resolve(window.YT);

      return new Promise((resolve, reject) => {
        const checkReady = () => {
          if (window.YT?.Player) resolve(window.YT);
          else reject(new Error('YT namespace not ready'));
        };

        const prevReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          prevReady?.();
          checkReady();
        };

        if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
          const start = Date.now();
          const timer = window.setInterval(() => {
            if (window.YT?.Player) {
              window.clearInterval(timer);
              checkReady();
            } else if (Date.now() - start > 10000) {
              window.clearInterval(timer);
              reject(new Error('YT API timed out'));
            }
          }, 50);
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        tag.onerror = () => reject(new Error('Failed to load YT script'));
        document.head.appendChild(tag);
      });
    };

    initYT()
      .then(yt => {
        if (!isMounted) return;

        localPlayer = new yt.Player(hostId, {
          height: 200,
          width: 200,
          videoId: currentTrack.id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              playerRef.current = event.target;
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              const state = event.data;
              if (state === 1) {
                // Playing
                setIsPlaying(true);
                startTimer();
              } else if (state === 2) {
                // Paused
                setIsPlaying(false);
                stopTimer();
              } else if (state === 0) {
                // Track ended: auto advance to next song!
                stopTimer();
                handleNextRef.current();
              }
            },
          },
        });
      })
      .catch(err => {
        console.warn('YouTube API init error:', err);
      });

    return () => {
      isMounted = false;
      stopTimer();
      try {
        localPlayer?.destroy();
      } catch {}
      playerRef.current = null;
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Title Overflow / Marquee
  useEffect(() => {
    const wrap = titleWrapRef.current;
    const span = titleSpanRef.current;
    if (!wrap || !span) return;

    const checkOverflow = () => {
      setIsTitleScrolling(span.getBoundingClientRect().width > wrap.getBoundingClientRect().width + 2);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [currentTrack.title]);

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    try {
      if (isPlaying) {
        player.pauseVideo();
        setIsPlaying(false);
      } else {
        player.playVideo();
        setIsPlaying(true);
      }
    } catch {
      try {
        player.loadVideoById({
          videoId: currentTrack.id,
          startSeconds: 0,
        });
        player.playVideo();
        setIsPlaying(true);
      } catch {}
    }
  }, [isPlaying, currentTrack.id]);

  // Next Track - Instant & Glitch-Free
  const handleNext = useCallback(() => {
    const nextIndex = (trackIndex + 1) % HIGHWAY_PLAYLIST.length;
    setTrackIndex(nextIndex);
    const nextSong = HIGHWAY_PLAYLIST[nextIndex];

    setCurrentTime(0);
    setLiveDuration(nextSong.duration);
    setIsPlaying(true);

    const player = playerRef.current;
    if (player) {
      try {
        player.loadVideoById({
          videoId: nextSong.id,
          startSeconds: 0,
        });
        player.playVideo();
      } catch {
        try {
          player.loadVideoById(nextSong.id, 0);
          player.playVideo();
        } catch {}
      }
    }
  }, [trackIndex]);

  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  // Previous Track - Instant & Glitch-Free
  const handlePrevious = useCallback(() => {
    const player = playerRef.current;
    if (currentTime > 3 && player) {
      try {
        player.seekTo(0, true);
        setCurrentTime(0);
      } catch {}
      return;
    }

    const prevIndex = (trackIndex - 1 + HIGHWAY_PLAYLIST.length) % HIGHWAY_PLAYLIST.length;
    setTrackIndex(prevIndex);
    const prevSong = HIGHWAY_PLAYLIST[prevIndex];

    setCurrentTime(0);
    setLiveDuration(prevSong.duration);
    setIsPlaying(true);

    if (player) {
      try {
        player.loadVideoById({
          videoId: prevSong.id,
          startSeconds: 0,
        });
        player.playVideo();
      } catch {
        try {
          player.loadVideoById(prevSong.id, 0);
          player.playVideo();
        } catch {}
      }
    }
  }, [trackIndex, currentTime]);

  // Seek functionality
  const executeSeek = useCallback(
    (ratio: number) => {
      const player = playerRef.current;
      if (!player || liveDuration <= 0) return;
      const target = Math.min(1, Math.max(0, ratio)) * liveDuration;
      try {
        player.seekTo(target, true);
        setCurrentTime(target);
      } catch {}
    },
    [liveDuration]
  );

  const getRailRatio = useCallback((clientX: number) => {
    const rail = railRef.current;
    if (!rail) return 0;
    const rect = rail.getBoundingClientRect();
    return rect.width <= 0 ? 0 : (clientX - rect.left) / rect.width;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (liveDuration <= 0) return;
      e.preventDefault();
      isSeekingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      executeSeek(getRailRatio(e.clientX));
    },
    [liveDuration, executeSeek, getRailRatio]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isSeekingRef.current) {
        executeSeek(getRailRatio(e.clientX));
      }
    },
    [executeSeek, getRailRatio]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isSeekingRef.current) {
        isSeekingRef.current = false;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
        executeSeek(getRailRatio(e.clientX));
      }
    },
    [executeSeek, getRailRatio]
  );

  // Global Keyboard Navigation (Space / K = play/pause, Left/Right = Seek 5s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === ' ' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        executeSeek((currentTime + 5) / liveDuration);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        executeSeek((currentTime - 5) / liveDuration);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, executeSeek, currentTime, liveDuration]);

  const progressPercent = liveDuration > 0 ? Math.min(100, (currentTime / liveDuration) * 100) : 0;

  return (
    <div className="music-pill-root">
      {/* Hidden YouTube IFrame portaled to body to completely avoid layout/scroll expansion */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="music-pill__yt-host" aria-hidden="true">
            <div id={hostId} />
          </div>,
          document.body
        )}

      {/* Sleek Coverless Glassy Player Container */}
      <div className="glassy-card-player" aria-label="Highway Music Player">
        <div className="glassy-card-player__sheen" aria-hidden="true" />

        {/* 1. Track Info (Title & Artist in ALL CAPS) */}
        <div className="glassy-card-player__meta">
          <div className="glassy-card-player__title-wrap" ref={titleWrapRef}>
            <span
              ref={titleSpanRef}
              className={`glassy-card-player__title ${
                isTitleScrolling ? 'music-pill__title--scroll' : ''
              }`}
            >
              {currentTrack.title.toUpperCase()}
            </span>
          </div>
          <p className="glassy-card-player__artist">{currentTrack.artist.toUpperCase()}</p>
        </div>

        {/* 2. Straight Line Progress Bar (Kitna Song Play Hua) */}
        <div className="glassy-card-player__progress-line-wrap">
          <div
            ref={railRef}
            className="glassy-card-player__rail"
            role="slider"
            tabIndex={0}
            aria-label="Seek track"
            aria-valuemin={0}
            aria-valuemax={Math.floor(liveDuration) || 0}
            aria-valuenow={Math.floor(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(liveDuration)}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Background line */}
            <div className="glassy-card-player__rail-bg" />
            {/* Active progress fill */}
            <div
              className="glassy-card-player__rail-fill"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Smooth glowing slider knob */}
            <span
              className="glassy-card-player__rail-knob"
              style={{ left: `${progressPercent}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* 3. Bottom Row: Current Time, Play/Forward/Backward Controls, Total Duration */}
        <div className="glassy-card-player__bottom-row">
          {/* Current Time */}
          <span className="glassy-card-player__time-current font-mono">
            {formatTime(currentTime)}
          </span>

          {/* Controls: Backward, Play/Pause, Forward */}
          <div className="glassy-card-player__controls">
            {/* Previous */}
            <button
              type="button"
              aria-label="Previous song"
              onClick={handlePrevious}
              className="glassy-ctrl-btn"
              title="Previous song"
            >
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.18)" />
                <path
                  d="M17.5 19L12.5 14L17.5 9"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Play / Pause (Center Big Button) */}
            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="glassy-ctrl-btn glassy-ctrl-btn--primary"
              title={isPlaying ? 'Pause (Space / K)' : 'Play (Space / K)'}
            >
              {isPlaying ? (
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" fill="rgba(255,255,255,0.26)" />
                  <rect x="11" y="9.5" width="3.5" height="13" rx="1" fill="currentColor" />
                  <rect x="17.5" y="9.5" width="3.5" height="13" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" fill="rgba(255,255,255,0.26)" />
                  <polygon points="12.5,9.5 12.5,22.5 23,16" fill="currentColor" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              type="button"
              aria-label="Next song"
              onClick={handleNext}
              className="glassy-ctrl-btn"
              title="Next song"
            >
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.18)" />
                <path
                  d="M10.5 9L15.5 14L10.5 19"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Total Duration */}
          <span className="glassy-card-player__time-total font-mono">
            {formatTime(liveDuration)}
          </span>
        </div>
      </div>
    </div>
  );
};
