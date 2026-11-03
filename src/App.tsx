import { useState, useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { MusicPill } from './components/MusicPill';
import { PlaylistGuide } from './components/PlaylistGuide';

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

        {/* Hero Truck Typography - Bigger & Shifted Higher Up */}
        <div className="logo-wrap">
          <h1 className="logo">
            <span className="logo__line" lang="hi">ट्रक ड्राइवर</span>
            <span className="logo__en" lang="en">Truck Wala Music</span>
          </h1>
        </div>

        {/* Music Player Dock */}
        <div className="dock">
          {/* Shayari (auto-cycles every 10 seconds) */}
          <p
            className="shayari"
            onClick={cycleShayari}
            title="हर 10 सेकंड में बदलती है • क्लिक करके अगली शायरी देखें"
          >
            "{TRUCK_SHAYARI[shayariIndex]}"
          </p>

          {/* Minimalist Coverless Glassy Player */}
          <MusicPill />

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
