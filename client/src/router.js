import { createBrowserRouter } from 'react-router-dom';

import HomePage from 'pages/HomePage';
import SignInPage from 'pages/SignInPage';
import SignUpPage from 'pages/SignUpPage';
import DashBoardPage from 'pages/DashBoardPage';
import UserPage from 'pages/UserPage';
import ChangePassword from 'pages/ChangePassword';
import ForgotPassword from 'pages/ForgotPassword';
import WaitingConfirmEmail from 'pages/WaitingConfirmEmail';
import C404 from 'pages/404Page';

export default createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/signin',
    element: <SignInPage />
  },
  {
    path: '/signup',
    element: <SignUpPage />
  },
  {
    path: '/dashboard',
    element: <DashBoardPage />
  },
  {
    path: '/me',
    element: <UserPage />
  },
  {
    path: '/changepassword',
    element: <ChangePassword />
  },
  {
    path: '/forgot-password-email',
    element: <ForgotPassword />
  },
  {
    path: '/verify-token-email/:type/:token',
    element: <WaitingConfirmEmail />
  },
  {
    path: '*',
    element: <C404 />
  }
]);
