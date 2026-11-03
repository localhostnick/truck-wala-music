import { Clock } from './Clock';
import { Listeners } from './Listeners';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <Clock />
        <span className="topbar__sep" aria-hidden="true" />
        <Listeners />
      </div>

      <nav className="links" aria-label="Listen on YouTube Music">
        <a
          className="ytm-corner-badge"
          href="https://music.youtube.com/playlist?list=PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open playlist on YouTube Music"
          title="Open playlist on YouTube Music"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="#ff0000" />
            <circle cx="12" cy="12" r="7.5" fill="none" stroke="#ffffff" strokeWidth="1.6" />
            <polygon points="10,8.5 16,12 10,15.5" fill="#ffffff" />
          </svg>
          <span className="ytm-corner-badge__text">YT MUSIC</span>
        </a>
      </nav>
    </header>
  );
}
