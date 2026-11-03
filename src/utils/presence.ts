type ListenerCallback = (count: number) => void;

class RealtimePresenceManager {
  private tabId: string;
  private channel: BroadcastChannel | null = null;
  private listeners: ListenerCallback[] = [];
  private currentCount: number = 1;

  constructor() {
    this.tabId = `tab_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('truck_listeners_channel');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'ping' || event.data?.type === 'update') {
            this.calculateActiveTabs();
          }
        };
      } catch {}

      // Register this tab
      this.sendHeartbeat();
      window.setInterval(() => this.sendHeartbeat(), 3000);
      window.setInterval(() => this.calculateActiveTabs(), 4000);

      window.addEventListener('beforeunload', () => {
        this.removeTab();
      });

      window.addEventListener('storage', (e) => {
        if (e.key === 'truck_active_tabs') {
          this.calculateActiveTabs();
        }
      });
    }
  }

  private sendHeartbeat() {
    try {
      const raw = localStorage.getItem('truck_active_tabs');
      let tabs: Record<string, number> = raw ? JSON.parse(raw) : {};

      const now = Date.now();
      tabs[this.tabId] = now;

      // Clean dead tabs older than 8 seconds
      Object.keys(tabs).forEach((id) => {
        if (now - tabs[id] > 8000) {
          delete tabs[id];
        }
      });

      localStorage.setItem('truck_active_tabs', JSON.stringify(tabs));
      this.channel?.postMessage({ type: 'ping', tabId: this.tabId });
      this.updateCount(Math.max(1, Object.keys(tabs).length));
    } catch {
      this.updateCount(1);
    }
  }

  private calculateActiveTabs() {
    try {
      const raw = localStorage.getItem('truck_active_tabs');
      let tabs: Record<string, number> = raw ? JSON.parse(raw) : {};
      const now = Date.now();

      let active = 0;
      Object.keys(tabs).forEach((id) => {
        if (now - tabs[id] <= 8000) {
          active++;
        }
      });

      this.updateCount(Math.max(1, active));
    } catch {
      this.updateCount(1);
    }
  }

  private removeTab() {
    try {
      const raw = localStorage.getItem('truck_active_tabs');
      if (raw) {
        let tabs: Record<string, number> = JSON.parse(raw);
        delete tabs[this.tabId];
        localStorage.setItem('truck_active_tabs', JSON.stringify(tabs));
      }
      this.channel?.postMessage({ type: 'update' });
    } catch {}
  }

  private updateCount(newCount: number) {
    this.currentCount = newCount;
    this.listeners.forEach((fn) => fn(newCount));
  }

  public subscribe(fn: ListenerCallback): () => void {
    this.listeners.push(fn);
    fn(this.currentCount);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  public getCount(): number {
    return this.currentCount;
  }
}

export const presenceManager = new RealtimePresenceManager();
