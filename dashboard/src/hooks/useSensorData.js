import { useState, useEffect } from 'react';

export function useSensorData() {
  const [data, setData] = useState({
    air:   { temperature: null, humidity: null },
    soil:  { moisture: null, light: null },
    water: { ph: null, temperature: null },
    timestamp: null
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onopen    = () => setConnected(true);
    ws.onclose   = () => setConnected(false);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'init') {
        setData(msg.data);
      } else {
        setData(prev => ({
          ...prev,
          [msg.layer]: { ...prev[msg.layer], ...msg.data },
          timestamp: msg.timestamp
        }));
      }
    };
    return () => ws.close();
  }, []);

  return { data, connected };
}
