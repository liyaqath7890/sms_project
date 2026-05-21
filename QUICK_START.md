# Premium SMS - Quick Start Guide

## 🚀 Getting Started with Premium Features

This guide will help you quickly implement and use the premium components and features in your SMS project.

---

## 📦 Installation & Setup

### 1. Ensure AcademicSessionProvider is Wrapped in App.jsx

Your `App.jsx` should already have this, but verify:

```jsx
import { AcademicSessionProvider } from './services/academicSessionContext';

function App() {
  return (
    <AuthProvider>
      <AcademicSessionProvider>
        <Router>
          {/* Your routes */}
        </Router>
      </AcademicSessionProvider>
    </AuthProvider>
  );
}
```

### 2. Import Premium Components

```javascript
import {
  PremiumButton,
  PremiumCard,
  PremiumInput,
  StatCard,
  PremiumTable,
  SessionSwitcher,
  BarChart,
  LineChart
} from '@/components/premium';
```

---

## 🎨 Component Examples

### PremiumButton

```jsx
import { PremiumButton } from '@/components/premium';
import { Plus, Download } from 'lucide-react';

export default function MyPage() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Primary Button */}
      <PremiumButton
        variant="primary"
        size="md"
        icon={Plus}
        onClick={() => console.log('clicked')}
      >
        Add New
      </PremiumButton>

      {/* Secondary Button */}
      <PremiumButton variant="secondary" size="md" icon={Download}>
        Export
      </PremiumButton>

      {/* Success Button */}
      <PremiumButton variant="success" fullWidth>
        Save Changes
      </PremiumButton>

      {/* Loading State */}
      <PremiumButton isLoading={true}>Saving...</PremiumButton>

      {/* Disabled Button */}
      <PremiumButton disabled>Disabled</PremiumButton>
    </div>
  );
}
```

### StatCard

```jsx
import { StatCard } from '@/components/premium';
import { Users, TrendingUp, Award } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem'
    }}>
      {/* Basic Stat Card */}
      <StatCard
        label="Total Students"
        value={1234}
        icon={Users}
        color="#3b82f6"
      />

      {/* With Trend */}
      <StatCard
        label="Active Students"
        value={892}
        icon={Users}
        color="#10b981"
        trend="12% increase"
        trendDirection="up"
      />

      {/* Different Colors */}
      <StatCard
        label="Revenue"
        value="₹2.4M"
        icon={Award}
        color="#f59e0b"
      />

      {/* Downward Trend */}
      <StatCard
        label="Dropout Rate"
        value="2.5%"
        icon={TrendingUp}
        color="#ef4444"
        trend="0.3% decrease"
        trendDirection="down"
      />
    </div>
  );
}
```

### PremiumInput

```jsx
import { PremiumInput } from '@/components/premium';
import { Mail, Lock, Search } from 'lucide-react';
import { useState } from 'react';

export default function FormPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <div style={{ maxWidth: '500px' }}>
      {/* Basic Input */}
      <PremiumInput
        label="Email Address"
        placeholder="Enter your email"
        icon={Mail}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* With Error */}
      <PremiumInput
        label="Password"
        placeholder="Enter password"
        icon={Lock}
        type="password"
        error={error ? 'Password must be 8+ characters' : ''}
      />

      {/* Search Input */}
      <PremiumInput
        placeholder="Search students..."
        icon={Search}
      />

      {/* Required Field */}
      <PremiumInput
        label="Full Name"
        required={true}
        placeholder="Enter your name"
      />
    </div>
  );
}
```

### PremiumCard

```jsx
import { PremiumCard } from '@/components/premium';

export default function CardExample() {
  return (
    <div>
      {/* Basic Card */}
      <PremiumCard>
        <h3>Basic Card</h3>
        <p>Content goes here</p>
      </PremiumCard>

      {/* Gradient Card */}
      <PremiumCard gradient>
        <h3>Gradient Card</h3>
        <p>This card has a nice gradient background</p>
      </PremiumCard>

      {/* Card with Badge */}
      <PremiumCard badge="New" badgeColor="#10b981">
        <h3>New Feature</h3>
        <p>This is a new feature</p>
      </PremiumCard>

      {/* Interactive Card */}
      <PremiumCard interactive>
        <h3>Click me!</h3>
        <p>This card has hover effects</p>
      </PremiumCard>
    </div>
  );
}
```

### PremiumTable

```jsx
import { PremiumTable } from '@/components/premium';
import { useState } from 'react';

export default function TablePage() {
  const [data] = useState([
    { id: 1, name: 'John Doe', email: 'john@school.com', grade: 'A', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@school.com', grade: 'B', status: 'Active' },
    // ... more rows
  ]);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    {
      key: 'grade',
      label: 'Grade',
      sortable: true,
      render: (value) => (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: '#dbeafe',
          color: '#0369a1',
          fontWeight: 'bold'
        }}>
          {value}
        </span>
      )
    },
    { key: 'status', label: 'Status', sortable: true }
  ];

  const rowActions = [
    {
      label: 'View',
      color: '#3b82f6',
      onClick: (row) => console.log('View', row)
    },
    {
      label: 'Edit',
      color: '#f59e0b',
      onClick: (row) => console.log('Edit', row)
    },
    {
      label: 'Delete',
      color: '#ef4444',
      onClick: (row) => console.log('Delete', row)
    }
  ];

  return (
    <PremiumTable
      columns={columns}
      data={data}
      rowActions={rowActions}
      pagination={true}
      itemsPerPage={10}
    />
  );
}
```

### SessionSwitcher

```jsx
import { SessionSwitcher } from '@/components/premium';
import { useAcademicSession } from '@/services/academicSessionContext';

export default function ClassPage() {
  const { currentSession, currentStandard, currentDivision } = useAcademicSession();

  return (
    <div>
      {/* Session Switcher Component */}
      <SessionSwitcher />

      {/* Use the current values */}
      <h2>
        Current: {currentSession.name} - Std {currentStandard}-{currentDivision}
      </h2>
    </div>
  );
}
```

### Charts

```jsx
import { BarChart, LineChart } from '@/components/premium';
import { PremiumCard } from '@/components/premium';

export default function ChartsPage() {
  const attendanceData = [
    { label: 'Monday', value: 92 },
    { label: 'Tuesday', value: 95 },
    { label: 'Wednesday', value: 88 },
    { label: 'Thursday', value: 96 },
    { label: 'Friday', value: 94 }
  ];

  const performanceData = [
    { label: 'Week 1', value: 78 },
    { label: 'Week 2', value: 82 },
    { label: 'Week 3', value: 85 },
    { label: 'Week 4', value: 88 },
    { label: 'Week 5', value: 91 }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    }}>
      {/* Bar Chart */}
      <PremiumCard gradient>
        <BarChart
          data={attendanceData}
          label="Weekly Attendance"
          color="#3b82f6"
          height={200}
        />
      </PremiumCard>

      {/* Line Chart */}
      <PremiumCard gradient>
        <LineChart
          data={performanceData}
          label="Performance Trend"
          color="#10b981"
          height={200}
        />
      </PremiumCard>
    </div>
  );
}
```

---

## 🎯 Working with Academic Sessions

### Using the useAcademicSession Hook

```jsx
import { useAcademicSession } from '@/services/academicSessionContext';

export default function MyComponent() {
  const {
    sessions,              // Array of all sessions
    currentSession,        // Current active session
    currentStandard,       // Selected standard (1-10)
    currentDivision,       // Selected division (A, B, C)
    switchSession,         // Function to change session
    switchStandard,        // Function to change standard
    switchDivision,        // Function to change division
    getStandards,          // Get all standards
    getSubjectsForStandard, // Get subjects for a standard
    getDivisionsForStandard, // Get divisions for a standard
    getCurrentClassInfo,   // Get info about current class
    getSessionStatusColor, // Get color based on session status
    getClassStudents       // Get students for current class
  } = useAcademicSession();

  // Use these in your component
  const subjects = getSubjectsForStandard(currentStandard);
  const classInfo = getCurrentClassInfo();
  const students = getClassStudents();

  return (
    <div>
      <h3>{currentSession.name} - Std {currentStandard}-{currentDivision}</h3>
      <p>Subjects: {subjects.join(', ')}</p>
      <p>Students: {classInfo.students}</p>
    </div>
  );
}
```

---

## 🎨 Color System

Use these standard colors throughout your app:

```javascript
const colors = {
  primary: '#3b82f6',      // Blue
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Amber
  danger: '#ef4444',       // Red
  secondary: '#8b5cf6',    // Purple
  emerald: '#10b981',      // Emerald
  gray: '#6b7280'          // Gray
};

// Use in components:
<StatCard color={colors.primary} />
```

---

## 📐 Spacing & Layout Conventions

```javascript
// Padding
padding: '1rem'      // 16px
padding: '1.5rem'    // 24px
padding: '2rem'      // 32px

// Gaps
gap: '0.5rem'        // 8px
gap: '1rem'          // 16px
gap: '1.5rem'        // 24px
gap: '2rem'          // 32px

// Border radius
borderRadius: 'var(--radius-md)'   // 0.375rem (6px)
borderRadius: 'var(--radius-lg)'   // 0.5rem (8px)
```

---

## 🚨 Common Patterns

### Full-Width Responsive Grid

```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem'
}}>
  {/* Cards/Components go here */}
</div>
```

### Flex Row with Wrapping

```jsx
<div style={{
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'center'
}}>
  {/* Items go here */}
</div>
```

### Centered Container

```jsx
<div style={{
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem'
}}>
  {/* Content goes here */}
</div>
```

---

## 🔍 Debugging Tips

### Check Session Values
```jsx
const session = useAcademicSession();
console.log('Current Session:', session.currentSession);
console.log('Current Standard:', session.currentStandard);
console.log('Current Division:', session.currentDivision);
```

### Verify Component Props
```jsx
<PremiumButton
  // Check that variant is one of: primary, secondary, success, danger
  variant="primary"
  // Check that size is one of: sm, md, lg
  size="md"
  // onClick handler should be defined
  onClick={() => {}}
>
  Text
</PremiumButton>
```

---

## 📱 Responsive Breakpoints

The system is responsive by default. Use these patterns:

```jsx
// For mobile-first design
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr',        // Mobile: 1 column
  gap: '1rem'
  // Grid will auto-fit columns on larger screens
}}>
  {/* Cards */}
</div>

// Using media queries if needed
@media (max-width: 768px) {
  // Mobile styles
}

@media (min-width: 769px) {
  // Tablet and desktop styles
}
```

---

## 🎬 Animation Customization

All components use Framer Motion. Customize animations:

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

---

## 🚀 Performance Tips

1. **Use React.memo for static components**
   ```jsx
   const MyCard = React.memo(({ data }) => <PremiumCard>{data}</PremiumCard>);
   ```

2. **Lazy load routes**
   ```jsx
   const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'));
   ```

3. **Optimize animations**
   - Don't animate too many elements simultaneously
   - Use `will-change` CSS property sparingly
   - Keep animations under 600ms

---

## ✅ Testing Checklist

Before deploying:
- [ ] All components render without errors
- [ ] Session switching works correctly
- [ ] Tables are sortable and paginate correctly
- [ ] Forms validate input properly
- [ ] Buttons have proper loading states
- [ ] Charts render with correct data
- [ ] Responsive design works on mobile
- [ ] No console errors

---

## 📞 Troubleshooting

### Issue: Components not rendering
**Solution**: Ensure AcademicSessionProvider wraps your component tree

### Issue: useAcademicSession returning null
**Solution**: Make sure your component is wrapped within AcademicSessionProvider

### Issue: Animations not smooth
**Solution**: Check browser hardware acceleration is enabled

### Issue: Table not sorting
**Solution**: Ensure `sortable: true` is set on column configuration

---

## 📚 Additional Resources

- Framer Motion Docs: https://www.framer.com/motion/
- Lucide Icons: https://lucide.dev/
- React Docs: https://react.dev/

---

**Happy Building! 🚀**

For more details, check `PREMIUM_FEATURES.md`
