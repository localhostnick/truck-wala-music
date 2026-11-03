import { useState, useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { MusicPill } from './components/MusicPill';
import { PlaylistGuide } from './components/PlaylistGuide';
import { playIndianTruckHorn } from './utils/horn';

const TRUCK_SHAYARI = [
  'बुरी नज़र वाले तेरा मुंह काला',
  'हंस मत पगली प्यार हो जाएगा',
  'दम है तो क्रॉस कर, वरना बर्दाश्त कर',
  'देखो मगर प्यार से',
  'समय से पहले भाग्य से ज्यादा कभी नहीं मिलता',
  'लटक मत पटक दूंगी',
  'मालिक की गाड़ी ड्राइवर का पसीना, चलती है रोड पर बनकर हसीना',
  'फासला रखो — HORN OK PLEASE',
  'चलती है गाड़ी उड़ती है धूल, जलते हैं दुश्मन खिलते हैं फूल',
  'यार की शादी में अब्दुल्ला दीवाना, ट्रक की खिड़की से सारा ज़माना',
  'धीरे चलोगे तो बार-बार मिलेंगे, तेज़ चलोगे तो हरिद्वार मिलेंगे',
];

export function App() {
  const [shayariIndex, setShayariIndex] = useState(0);
  const [isHonking, setIsHonking] = useState(false);

  // Auto-cycle shayari every 10 seconds automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setShayariIndex(prev => (prev + 1) % TRUCK_SHAYARI.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const cycleShayari = () => {
    setShayariIndex(prev => (prev + 1) % TRUCK_SHAYARI.length);
  };

  const handleHorn = () => {
    setIsHonking(true);
    playIndianTruckHorn();
    setTimeout(() => {
      setIsHonking(false);
    }, 1200);
  };

  return (
    <>
      {/* Background Graphic Layers */}
      <div className="bg" aria-hidden="true">
        <div className="bg__img" />
        <div className="bg__scrim" />
      </div>

      {/* Main Viewport Shell */}
      <main className="shell">
        <Topbar />

        <div aria-hidden="true" style={{ height: '2.5rem' }} />

        {/* Hero Truck Typography */}
        <div className="logo-wrap">
          <h1 className="logo">
            <span className="logo__line" lang="hi">ट्रक ड्राइवर</span>
            <span className="logo__en" lang="en">Truck Wala Music</span>
          </h1>
        </div>

        {/* Music Player Dock */}
        <div className="dock">
          {/* Bigger Shayari (auto-cycles every 10 seconds) */}
          <p
            className="shayari"
            onClick={cycleShayari}
            title="हर 10 सेकंड में बदलती है • क्लिक करके अगली शायरी देखें"
          >
            "{TRUCK_SHAYARI[shayariIndex]}"
          </p>

          {/* Glitch-Free Instant Player */}
          <MusicPill />

          {/* Authentic Indian Truck Horn Button */}
          <div className="horn-btn-wrap">
            <button
              type="button"
              onClick={handleHorn}
              className={`truck-horn-btn ${isHonking ? 'is-honking' : ''}`}
              title="बजाओ असली इंडियन ट्रक हॉर्न! (Horn OK Please)"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zM3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              <span>{isHonking ? '🎺 POOO - POOO!!' : '🎺 बजाओ ट्रक हॉर्न (PO-PO)'}</span>
            </button>
          </div>

          {/* Credit */}
          <p className="credit">
            made with ❤️ by{' '}
            <a
              href="https://github.com/localhostnick"
              target="_blank"
              rel="noopener noreferrer"
            >
              localhostnick
            </a>
          </p>
        </div>
      </main>

      {/* Informational About Section */}
      <PlaylistGuide />
    </>
  );
}

export default App;
