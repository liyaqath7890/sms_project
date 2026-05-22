import React from 'react';
import { Bell, CalendarCheck, ClipboardList, GraduationCap, TrendingUp, Users } from 'lucide-react';

const iconMap = {
  attendance: CalendarCheck,
  grades: GraduationCap,
  users: Users,
  activity: ClipboardList,
  notifications: Bell,
  trend: TrendingUp
};

const RoleDashboardShell = ({ title, subtitle, metrics, feed, accent = '#4f46e5' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <section style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <p style={{ color: accent, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Enterprise Dashboard</p>
        <h1 style={{ fontSize: '2rem', marginTop: '0.35rem', color: 'var(--text-main)' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '760px', marginTop: '0.5rem' }}>{subtitle}</p>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {metrics.map((metric) => {
          const Icon = iconMap[metric.icon] || TrendingUp;
          return (
            <article key={metric.label} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem' }}>{metric.label}</p>
                  <strong style={{ display: 'block', fontSize: '1.8rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>{metric.value}</strong>
                </div>
                <span style={{
                  width: 42,
                  height: 42,
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  color: accent,
                  background: `${accent}14`
                }}>
                  <Icon size={22} />
                </span>
              </div>
              <p style={{ color: metric.tone || 'var(--success)', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.85rem' }}>{metric.delta}</p>
            </article>
          );
        })}
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.6fr)',
        gap: '1rem'
      }}>
        <article style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Activity Feed</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {feed.map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: accent, marginTop: 7 }} />
                <div>
                  <p style={{ fontWeight: 700 }}>{item.title}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Operational Snapshot</h2>
          <div style={{ height: 180, display: 'grid', alignItems: 'end', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {[52, 78, 64, 90, 72, 86].map((height, index) => (
              <span key={height + index} style={{
                height: `${height}%`,
                borderRadius: '6px 6px 0 0',
                background: index === 3 ? accent : `${accent}55`
              }} />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default RoleDashboardShell;
