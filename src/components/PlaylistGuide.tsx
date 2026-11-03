export function PlaylistGuide() {
  return (
    <section className="playlist-guide" id="about" aria-labelledby="about-title">
      <div className="playlist-guide__inner">
        <p className="playlist-guide__eyebrow">Truck wala music, one tap away</p>
        <h2 id="about-title">The Indian truck driver playlist for long roads</h2>
        <p className="playlist-guide__lead">
          Truck Wala Music is a free playlist website for the Punjabi, Hindi, Bhojpuri and 90s Bollywood highway songs heard in truck cabins and roadside dhabas across India. Open the page, press play and keep the music running—there is no signup or app to install.
        </p>

        <div className="playlist-guide__highlights" aria-label="Playlist highlights">
          <article>
            <h3>Made for the highway</h3>
            <p>A non-stop truck driver playlist with simple controls that work on mobile and desktop.</p>
          </article>
          <article>
            <h3>Desi songs in one mix</h3>
            <p>Punjabi energy, Hindi favourites, Bhojpuri tracks and nostalgic Bollywood road songs.</p>
          </article>
          <article>
            <h3>No account needed</h3>
            <p>Start listening here, or open the same playlist on YouTube Music whenever you want.</p>
          </article>
        </div>

        <div className="playlist-guide__faq" aria-labelledby="playlist-faq-title">
          <h2 id="playlist-faq-title">About this truck wala playlist</h2>
          <div className="playlist-guide__faq-grid">
            <article>
              <h3>What is Truck Wala Music?</h3>
              <p>It is a browser-based Indian truck music player built for quick, uninterrupted listening without registration.</p>
            </article>
            <article>
              <h3>Does it work on a phone?</h3>
              <p>Yes. The player is designed for mobile screens, with large play, skip and seek controls for easy use.</p>
            </article>
            <article>
              <h3>Where does the music play from?</h3>
              <p>The songs play through YouTube. You can also open the full truck driver playlist directly on YouTube Music.</p>
            </article>
          </div>
        </div>

        {/* Prominent CTA Button instead of plain text link */}
        <div className="playlist-guide__cta-container">
          <a
            className="playlist-guide__btn-cta"
            href="https://music.youtube.com/playlist?list=PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <circle cx="12" cy="12" r="11" fill="#ff0000" />
              <circle cx="12" cy="12" r="7.5" fill="none" stroke="#ffffff" strokeWidth="1.6" />
              <polygon points="10,8.5 16,12 10,15.5" fill="#ffffff" />
            </svg>
            <span>Open Playlist on YouTube Music</span>
          </a>
        </div>
      </div>
    </section>
  );
}
