import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnboardingPage from './pages/OnboardingPage';
import { axiosInstance } from './utils/axios';

const App = () => {
  //tanstack query

  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/checkAuth');
      return res.data;
    },
    retry: false,
  });

  const authUser = authData?.user;

  return (
    <div className=" h-screen" data-theme="coffee">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/call"
          element={authUser ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/onboarding"
          element={authUser ? <OnboardingPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
