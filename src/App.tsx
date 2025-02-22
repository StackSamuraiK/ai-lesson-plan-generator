import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginForm from './pages/LoginForm';
import LessonPlanForm from './pages/LessonPlanForm';
import Layout from './pages/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/planner"
          element={
            <PrivateRoute>
              <LessonPlanForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;