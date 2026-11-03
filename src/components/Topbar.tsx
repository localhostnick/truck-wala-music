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

      <nav className="links" aria-label="Support and listen elsewhere">
        <a
          className="link"
          href="https://music.youtube.com/playlist?list=PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open playlist on YouTube Music"
          title="YouTube Music"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
          </svg>
        </a>
      </nav>
    </header>
  );
}
