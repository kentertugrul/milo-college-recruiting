import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UniversityDetail from './pages/UniversityDetail';
import Communications from './pages/Communications';
import Reminders from './pages/Reminders';
import Analytics from './pages/Analytics';
import SoccerDashboard from './pages/SoccerDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
          <Route path="/soccer" element={<SoccerDashboard />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

