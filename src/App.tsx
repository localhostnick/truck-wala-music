import { useState } from 'react';
import { Topbar } from './components/Topbar';
import { MusicPill } from './components/MusicPill';
import { PlaylistGuide } from './components/PlaylistGuide';

const TRUCK_SHAYARI = [
  'बुरी नज़र वाले तेरा मुंह काला',
  'हंस मत पगली प्यार हो जाएगा',
  'दम है तो क्रॉस कर वरना बर्दाश्त कर',
  'देखो मगर प्यार से',
  'समय से पहले भाग्य से ज्यादा कभी नहीं मिलता',
  'लटक मत पटक दूंगी',
  'मालिक की गाड़ी ड्राइवर का पसीना, चलती है रोड पर बनकर हसीना',
  'फासला रखो - Horn OK Please',
  'चलती है गाड़ी उड़ती है धूल, जलते हैं दुश्मन खिलते हैं फूल',
];

export function App() {
  const [shayariIndex, setShayariIndex] = useState(0);

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
          <p
            className="shayari"
            onClick={cycleShayari}
            title="Click for another truck quote"
          >
            {TRUCK_SHAYARI[shayariIndex]}
          </p>

          <MusicPill playlistId="PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy" />

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
