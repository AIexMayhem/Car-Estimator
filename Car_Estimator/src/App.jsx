import { useCallback, useEffect, useState } from 'react';
import DashboardPage from './components/DashboardPage.jsx';
import EstimatorPage from './components/EstimatorPage.jsx';

const getRoute = () => {
  return window.location.pathname.startsWith('/dashboard') ? 'dashboard' : 'estimator';
};

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute());

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((nextRoute) => {
    const path = nextRoute === 'dashboard' ? '/dashboard' : '/';

    window.history.pushState({}, '', path);
    setRoute(nextRoute);
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  if (route === 'dashboard') {
    return <DashboardPage onNavigate={navigate} />;
  }

  return <EstimatorPage onNavigate={navigate} />;
}
