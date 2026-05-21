# Edustrem - Real-World School Management System

A comprehensive, production-ready School Management System built with React, Vite, and modern web technologies. This project demonstrates real-world problem-solving with actual API integration, data management, and interactive dashboards.

## 🚀 Features

### Core Functionality
- **Real Dashboard**: Live data fetching with loading states and error handling
- **Authentication System**: Login/register with token-based auth
- **Student Management**: CRUD operations with real API calls
- **Attendance Tracking**: Mark and view attendance with real-time updates
- **Grade Management**: Comprehensive grading system
- **Teacher Portal**: Teacher management and assignment tracking
- **Reports & Analytics**: Real-time analytics with interactive charts
- **Communication Center**: Parent-teacher communication
- **Schedule Management**: Class scheduling and timetable
- **Enrollment System**: Student admissions and management

### Technical Features
- **Real API Integration**: Express.js mock server with realistic data
- **Data Caching**: Intelligent caching with offline support
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Loading States**: Skeleton loaders and progress indicators
- **Responsive Design**: Mobile-first responsive UI
- **Modern UI/UX**: Framer Motion animations and professional design

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router
- **Backend**: Express.js (Mock API)
- **Styling**: CSS Variables, Custom Components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context + Custom Hooks

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sms_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Mock API Server** (in one terminal)
   ```bash
   npm run mock-server
   ```
   Server will run on http://localhost:3001

4. **Start the Development Server** (in another terminal)
   ```bash
   npm run dev
   ```
   App will run on http://localhost:5176

## 🎯 Real-World Problem Solving

This project solves actual school management challenges:

### 1. **Data Management**
- Real API calls with proper error handling
- Intelligent caching to reduce server load
- Offline support for critical operations
- Data synchronization when back online

### 2. **User Experience**
- Loading states prevent user confusion
- Error boundaries catch and handle crashes
- Responsive design works on all devices
- Intuitive navigation and workflows

### 3. **Performance**
- Code splitting for faster initial loads
- Lazy loading of routes and components
- Optimized bundle sizes
- Efficient re-renders with React best practices

### 4. **Scalability**
- Modular architecture for easy feature addition
- Reusable components and utilities
- Clean separation of concerns
- Extensible API design

## 📁 Project Structure

```
src/
├── authentication/          # Auth pages and context
├── components/              # Reusable UI components
│   ├── common/             # Shared components
│   ├── custom/             # Custom form components
│   ├── layout/             # Layout components
│   └── premium/            # Premium UI components
├── contexts/               # React contexts
├── features/               # Feature modules
│   ├── dashboard/          # Dashboard functionality
│   ├── students/           # Student management
│   ├── teachers/           # Teacher management
│   ├── attendance/         # Attendance tracking
│   └── ...
├── pages/                  # Page components
├── routes/                 # Route configurations
├── services/               # API services and utilities
│   ├── apiService.js       # API client
│   ├── dataManager.js      # Data management layer
│   └── axiosInstance.js    # HTTP client config
└── utils/                  # Utility functions
```

## 🔧 API Endpoints

The mock server provides realistic API endpoints:

- `GET /api/reports/dashboard` - Dashboard analytics
- `GET /api/activities/recent` - Recent activities
- `POST /api/auth/login` - User authentication
- `GET /api/students` - Student data
- `POST /api/students` - Create student
- `GET /api/teachers` - Teacher data
- `GET /api/attendance/date/:date` - Attendance data
- `POST /api/attendance/mark` - Mark attendance

## 🚀 Usage

1. **Landing Page**: Visit the home page for an overview
2. **Authentication**: Login with any email/password combination
3. **Dashboard**: View real-time analytics and data
4. **Navigation**: Use sidebar to access different modules
5. **Quick Actions**: Use dashboard buttons for common tasks

## 🧪 Testing Real Functionality

### Dashboard Features
- **Refresh Data**: Click the refresh button to reload data
- **Generate Report**: Download dashboard data as JSON
- **Quick Actions**: Functional navigation to different modules
- **Real Charts**: Interactive charts with real data
- **Recent Activity**: Live activity feed

### API Integration
- All data is fetched from the mock server
- Proper loading states during API calls
- Error handling for failed requests
- Caching prevents unnecessary API calls

## 📈 Performance Metrics

- **Bundle Size**: Optimized with code splitting
- **Load Time**: Fast initial page loads
- **API Response**: Realistic delays for real-world feel
- **Memory Usage**: Efficient React patterns

## 🔒 Security Features

- JWT token-based authentication
- Protected routes with role-based access
- Secure API communication
- Input validation and sanitization

## 🎨 Design System

- **Colors**: Professional color palette
- **Typography**: Consistent font hierarchy
- **Components**: Reusable, accessible components
- **Animations**: Smooth, purposeful animations

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Adaptive layouts

## 🔄 Development Workflow

1. **Feature Development**: Create components in feature folders
2. **API Integration**: Add endpoints to mock server
3. **Testing**: Test with real data flows
4. **Optimization**: Profile and optimize performance

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include loading states
4. Test with real API calls
5. Update documentation

## 📄 License

This project is for educational and demonstration purposes.

---

**Built with ❤️ for real-world problem solving in education technology.**
