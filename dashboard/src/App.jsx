import { useSensorData } from './hooks/useSensorData';

function MetricCard({ label, value, unit, status }) {
  const colors = { good: '#EAF3DE', warn: '#FAEEDA', danger: '#FCEBEB' };
  return (
    <div style={{ background: colors[status] || '#F1EFE8', borderRadius: 10, padding: '12px 16px' }}>
      <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 500 }}>
        {value ?? '--'}<span style={{ fontSize: 13, color: '#888' }}> {unit}</span>
      </div>
    </div>
  );
}

export default function App() {
  const { data, connected } = useSensorData();
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500 }}>SmartEco-Column Dashboard</h1>
        <span style={{ fontSize: 12, color: connected ? 'green' : 'red' }}>
          {connected ? '● Live' : '○ Disconnected'}
        </span>
      </div>

      <h2 style={{ fontSize: 13, color: '#27500A', marginBottom: 8 }}>🌿 Air Layer</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <MetricCard label="Temperature" value={data.air.temperature} unit="°C" status="good"/>
        <MetricCard label="Humidity"    value={data.air.humidity}    unit="%" status="good"/>
      </div>

      <h2 style={{ fontSize: 13, color: '#633806', marginBottom: 8 }}>🌱 Soil Layer</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <MetricCard label="Moisture"        value={data.soil.moisture} unit="%" status="warn"/>
        <MetricCard label="Light intensity" value={data.soil.light}    unit="lux" status="good"/>
      </div>

      <h2 style={{ fontSize: 13, color: '#0C447C', marginBottom: 8 }}>💧 Water Layer</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <MetricCard label="pH level"    value={data.water.ph}          unit=""   status="good"/>
        <MetricCard label="Temperature" value={data.water.temperature} unit="°C" status="good"/>
      </div>

      <p style={{ fontSize: 11, color: '#aaa', textAlign: 'right' }}>
        Last updated: {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : '--'}
      </p>
    </div>
  );
}
