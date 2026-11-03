import React, { useState, useEffect, useRef, useCallback, useId } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface MusicPillProps {
  playlistId?: string;
  autoplay?: boolean;
}

const DEFAULT_PLAYLIST = 'PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const MusicPill: React.FC<MusicPillProps> = ({
  playlistId = DEFAULT_PLAYLIST,
  autoplay = false,
}) => {
  const instanceId = useId().replace(/:/g, '');
  const hostId = `yt-host-${instanceId}`;

  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<number | null>(null);
  const cueCheckTimerRef = useRef<number | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const titleSpanRef = useRef<HTMLSpanElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isTitleScrolling, setIsTitleScrolling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopProgressTimer = useCallback(() => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const startProgressTimer = useCallback((player: any) => {
    stopProgressTimer();
    progressTimerRef.current = window.setInterval(() => {
      if (!isSeekingRef.current) {
        try {
          const cur = player.getCurrentTime() || 0;
          setCurrentTime(cur);
          const dur = player.getDuration();
          if (Number.isFinite(dur) && dur > 0) setDuration(dur);
        } catch {}
      }
    }, 250);
  }, [stopProgressTimer]);

  const extractTrackData = useCallback((player: any) => {
    try {
      const data = player.getVideoData();
      const videoId = data?.video_id;
      const t = data?.title?.trim();

      if (!t || t === 'Private video' || !videoId) return false;

      setTitle(t);
      setArtist(data.author?.trim() || 'Highway Records');
      setCoverUrl(`https://i.ytimg.com/vi/${videoId}/hq720.jpg`);

      const dur = player.getDuration();
      if (Number.isFinite(dur) && dur > 0) setDuration(dur);

      setHasData(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Initialize YouTube IFrame API
  useEffect(() => {
    let isMounted = true;
    let localPlayer: any = null;

    const stopCueCheck = () => {
      if (cueCheckTimerRef.current !== null) {
        window.clearInterval(cueCheckTimerRef.current);
        cueCheckTimerRef.current = null;
      }
    };

    const loadYTAPI = (): Promise<any> => {
      if (window.YT?.Player) return Promise.resolve(window.YT);

      return new Promise((resolve, reject) => {
        const checkReady = () => {
          if (window.YT?.Player) resolve(window.YT);
          else reject(new Error('YT namespace missing'));
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
              reject(new Error('YT timeout'));
            }
          }, 50);
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        tag.onerror = () => reject(new Error('Failed to load YT API'));
        document.head.appendChild(tag);
      });
    };

    loadYTAPI()
      .then(yt => {
        if (!isMounted) return;

        localPlayer = new yt.Player(hostId, {
          height: 1,
          width: 1,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            listType: 'playlist',
            list: playlistId,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              playerRef.current = event.target;
              event.target.cuePlaylist({
                listType: 'playlist',
                list: playlistId,
                index: 0,
              });
              setIsReady(true);

              // Poll until track data is loaded
              let attempts = 0;
              cueCheckTimerRef.current = window.setInterval(() => {
                if (!isMounted) {
                  stopCueCheck();
                  return;
                }
                attempts++;
                if (extractTrackData(event.target) || attempts > 35) {
                  stopCueCheck();
                  if (attempts > 35 && !hasData) {
                    setTitle('Highway Dhaba Mix');
                    setArtist('Indian Truck Wala Playlist');
                    setHasData(true);
                  }
                }
              }, 200);

              if (autoplay) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              const state = event.data;
              if (state === 1) {
                // Playing
                setIsPlaying(true);
                extractTrackData(event.target);
                startProgressTimer(event.target);
              } else if (state === 2) {
                // Paused
                setIsPlaying(false);
                stopProgressTimer();
                setCurrentTime(event.target.getCurrentTime() || 0);
              } else if (state === 0) {
                // Ended
                stopProgressTimer();
                setIsPlaying(false);
                setCurrentTime(0);
              } else if (state === 3 || state === 5) {
                extractTrackData(event.target);
              }
            },
            onError: () => {
              if (!isMounted) return;
              setErrorMessage('Trying next song...');
              setTitle(prev => prev || 'Highway Hits');
              setArtist(prev => prev || 'Tap play to listen');
              setHasData(true);
            },
          },
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setErrorMessage('Could not load player. Check connection.');
        setHasData(true);
      });

    return () => {
      isMounted = false;
      stopProgressTimer();
      stopCueCheck();
      try {
        localPlayer?.destroy();
      } catch {}
      playerRef.current = null;
    };
  }, [playlistId, hostId, autoplay, extractTrackData, startProgressTimer, stopProgressTimer]);

  // Transition from skeleton to loaded state with pleasant delay
  useEffect(() => {
    if (!hasData) return;
    const timer = window.setTimeout(() => setIsLoaded(true), 900);
    return () => window.clearTimeout(timer);
  }, [hasData]);

  // Title marquee scroll if text overflows
  useEffect(() => {
    if (!isLoaded) return;
    const wrap = titleWrapRef.current;
    const span = titleSpanRef.current;
    if (!wrap || !span) return;

    const checkOverflow = () => {
      setIsTitleScrolling(span.getBoundingClientRect().width > wrap.getBoundingClientRect().width + 2);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [title, isLoaded]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (player && isReady) {
      setErrorMessage(null);
      try {
        const state = player.getPlayerState();
        if (state === 1 || state === 3) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      } catch {
        setErrorMessage('Click play again');
      }
    }
  }, [isReady]);

  // Previous Track
  const handlePrevious = useCallback(() => {
    const player = playerRef.current;
    if (player && isReady) {
      setErrorMessage(null);
      try {
        if ((player.getCurrentTime() || 0) > 3) {
          player.seekTo(0, true);
          setCurrentTime(0);
        } else {
          player.previousVideo();
        }
      } catch {}
    }
  }, [isReady]);

  // Next Track
  const handleNext = useCallback(() => {
    const player = playerRef.current;
    if (player && isReady) {
      setErrorMessage(null);
      try {
        player.nextVideo();
      } catch {}
    }
  }, [isReady]);

  // Seek functionality
  const executeSeek = useCallback((ratio: number) => {
    const player = playerRef.current;
    if (!player || !isReady || duration <= 0) return;
    const target = Math.min(1, Math.max(0, ratio)) * duration;
    try {
      player.seekTo(target, true);
      setCurrentTime(target);
    } catch {}
  }, [duration, isReady]);

  const getRailRatio = useCallback((clientX: number) => {
    const rail = railRef.current;
    if (!rail) return 0;
    const rect = rail.getBoundingClientRect();
    return rect.width <= 0 ? 0 : (clientX - rect.left) / rect.width;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isReady || duration <= 0) return;
    e.preventDefault();
    isSeekingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    executeSeek(getRailRatio(e.clientX));
  }, [duration, isReady, executeSeek, getRailRatio]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isSeekingRef.current) {
      executeSeek(getRailRatio(e.clientX));
    }
  }, [executeSeek, getRailRatio]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isSeekingRef.current) {
      isSeekingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      executeSeek(getRailRatio(e.clientX));
    }
  }, [executeSeek, getRailRatio]);

  // Global Keyboard Shortcuts (Space / K to play, Arrow keys to seek)
  useEffect(() => {
    if (!isLoaded || !isReady) return;

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
        executeSeek((currentTime + 5) / duration);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        executeSeek((currentTime - 5) / duration);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoaded, isReady, togglePlay, executeSeek, currentTime, duration]);

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="music-pill-root">
      {/* Hidden YouTube IFrame */}
      <div className="music-pill__yt-host" aria-hidden="true">
        <div id={hostId} />
      </div>

      {isLoaded ? (
        <div className="music-pill" aria-label="YouTube Music player">
          <div className="music-pill__sheen" aria-hidden="true" />

          {/* Spinning Album Disc Cover */}
          <div className={`music-pill__cover ${isPlaying ? 'is-spinning' : ''}`}>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=""
                draggable={false}
                onError={e => {
                  const img = e.currentTarget;
                  if (img.src.includes('hq720')) {
                    img.src = img.src.replace('hq720.jpg', 'hqdefault.jpg');
                  }
                }}
              />
            ) : (
              <span className="music-pill__cover-fallback" aria-hidden="true" />
            )}
            <span className="music-pill__cover-hub" aria-hidden="true" />
          </div>

          {/* Metadata & Controls Body */}
          <div className="music-pill__body">
            <div className="music-pill__row">
              {/* Song Title & Artist */}
              <div className="music-pill__meta">
                <div className="music-pill__title-wrap" ref={titleWrapRef}>
                  <span
                    ref={titleSpanRef}
                    className={`music-pill__title ${
                      isTitleScrolling ? 'music-pill__title--scroll' : ''
                    }`}
                  >
                    {title || 'Highway Dhaba Playlist'}
                  </span>
                </div>
                <p className="music-pill__artist">
                  {errorMessage || artist || 'Truck Wala Music'}
                </p>
              </div>

              {/* Controls */}
              <div className="music-pill__controls">
                {/* Previous */}
                <button
                  type="button"
                  aria-label="Previous track"
                  disabled={!isReady}
                  onClick={handlePrevious}
                  className="music-pill__btn"
                >
                  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.19)" />
                    <path
                      d="M17.5 19L12.5 14L17.5 9"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  disabled={!isReady}
                  onClick={togglePlay}
                  className="music-pill__btn music-pill__btn--primary"
                >
                  {isPlaying ? (
                    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" fill="rgba(255,255,255,0.23)" />
                      <rect x="11" y="10" width="3.5" height="12" rx="1" fill="currentColor" />
                      <rect x="17.5" y="10" width="3.5" height="12" rx="1" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" fill="rgba(255,255,255,0.23)" />
                      <polygon points="12,10 12,22 22,16" fill="currentColor" />
                    </svg>
                  )}
                </button>

                {/* Next */}
                <button
                  type="button"
                  aria-label="Next track"
                  disabled={!isReady}
                  onClick={handleNext}
                  className="music-pill__btn"
                >
                  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.19)" />
                    <path
                      d="M10.5 9L15.5 14L10.5 19"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Seekable Progress Bar */}
            <div className="music-pill__progress">
              <span className="music-pill__time">{formatTime(currentTime)}</span>
              <div
                ref={railRef}
                className="music-pill__rail music-pill__rail--seek"
                role="slider"
                tabIndex={isReady && duration > 0 ? 0 : -1}
                aria-label="Seek track"
                aria-valuemin={0}
                aria-valuemax={Math.floor(duration) || 0}
                aria-valuenow={Math.floor(currentTime)}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                aria-disabled={!isReady || duration <= 0}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <div className="music-pill__fill" style={{ width: `${progressPercent}%` }} />
                <span
                  className="music-pill__knob"
                  style={{ left: `${progressPercent}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="music-pill__time">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Skeleton Loading State */
        <div
          className="music-pill music-pill--loading"
          aria-busy="true"
          aria-label="Loading playlist"
          role="status"
        >
          <div className="music-pill__sheen" aria-hidden="true" />
          <div className="music-pill__cover music-pill__skel-cover" aria-hidden="true">
            <span className="music-pill__skel-pulse" />
          </div>
          <div className="music-pill__body">
            <div className="music-pill__row">
              <div className="music-pill__meta">
                <div className="music-pill__skel-line music-pill__skel-line--title" />
                <div className="music-pill__skel-line music-pill__skel-line--artist" />
              </div>
              <div className="music-pill__controls" aria-hidden="true">
                <span className="music-pill__skel-dot" />
                <span className="music-pill__skel-dot music-pill__skel-dot--lg" />
                <span className="music-pill__skel-dot" />
              </div>
            </div>
            <div className="music-pill__progress">
              <span className="music-pill__skel-time" />
              <div className="music-pill__rail music-pill__skel-rail" />
              <span className="music-pill__skel-time" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
