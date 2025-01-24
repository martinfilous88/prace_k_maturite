/* @jsxImportSource react */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { LibraryPage } from './pages/LibraryPage';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { CartPage } from './pages/CartPage';
import { GameDetailPage } from './pages/GameDetailPage';
import AccountPage from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { GameManagementPage } from './pages/admin/GameManagementPage';
import { OrderManagementPage } from './pages/admin/OrderManagementPage';
import { GamesManagementPage } from './pages/admin/GamesManagementPage';

// Komponenta pro ladění routování
const RouteLogger = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    console.log('Aktuální cesta:', location.pathname);
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <RouteLogger />
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/game/:id" element={<GameDetailPage />} />
            <Route path="/library" element={
              <PrivateRoute>
                <LibraryPage />
              </PrivateRoute>
            } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
            <Route path="/admin/dashboard" element={<PrivateRoute adminOnly={true}><AdminDashboardPage /></PrivateRoute>} />
            <Route path="/admin/page" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
            <Route path="/admin/games" element={<PrivateRoute adminOnly={true}><GamesManagementPage /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute adminOnly={true}><OrderManagementPage /></PrivateRoute>} />
            <Route path="/admin/games-management" element={<PrivateRoute><GamesManagementPage /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;