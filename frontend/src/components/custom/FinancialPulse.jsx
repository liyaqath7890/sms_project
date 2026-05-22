import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', income: 45000, expense: 32000 },
  { day: 'Tue', income: 52000, expense: 35000 },
  { day: 'Wed', income: 48000, expense: 38000 },
  { day: 'Thu', income: 61000, expense: 40000 },
  { day: 'Fri', income: 55000, expense: 36000 },
  { day: 'Sat', income: 67000, expense: 42000 },
  { day: 'Sun', income: 59000, expense: 39000 },
];

const FinancialPulse = () => {
  return (
    <div className="card-premium" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Financial Pulse</h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Revenue vs Expenses this week</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Total Revenue</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontWeight: 700 }}>
              <IndianRupee size={16} />
              <span>3.87L</span>
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Expenses</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)', fontWeight: 700 }}>
              <IndianRupee size={16} />
              <span>2.45L</span>
              <ArrowDownRight size={16} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: '200px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-light)', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-light)', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 'var(--radius-md)', 
                border: 'none', 
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(4px)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#ef4444" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorExpense)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        backgroundColor: 'var(--bg-main)', 
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-light)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Wallet size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Available Funds</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>School Savings Account</p>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>₹12.48L</p>
      </div>
    </div>
  );
};

export default FinancialPulse;
