import { createBrowserRouter } from 'react-router-dom';

import HomePage from 'pages/HomePage';
import SignInPage from 'pages/SignInPage';
import SignUpPage from 'pages/SignUpPage';
import DashBoardPage from 'pages/DashBoardPage';
import UserPage from 'pages/UserPage';
import ChangePassword from 'pages/ChangePassword';
import ForgotPassword from 'pages/ForgotPassword';
import WaitingConfirmForgotEmail from 'pages/WaitingConfirmForgotEmail';
import WaitingConfirmSignupEmail from 'pages/WaitingConfirmSignupEmail';
import GoogleAuthCallback from 'pages/GoogleAuthCallBack';
import FacebookAuthCallBack from 'pages/FacebookAuthCallBack';
import DetailCoursePage from 'pages/DetailCoursePage';
import InvitationPage from 'pages/InvitationPage';
import InvitationEmailPage from 'pages/InvitationEmailPage';
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
    path: '/auth/google/callback',
    element: <GoogleAuthCallback />
  },
  {
    path: '/auth/facebook/callback',
    element: <FacebookAuthCallBack />
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
    path: '/verify-token-email/forgot-password/:token',
    element: <WaitingConfirmForgotEmail />
  },
  {
    path: '/verify-token-email/sigup-email/:token',
    element: <WaitingConfirmSignupEmail />
  },
  {
    path: '/c',
    children: [
      {
        index: true,
        element: <DashBoardPage />,
      },
      {
        path: ':classId',
        element: <DetailCoursePage />,
      },
    ]
  },
  {
    path: '/invite',
    children: [
      {
        path: ':code',
        element: <InvitationPage />
      }
    ]
  },
  {
    path: '/inviteByEmail',
    element: <InvitationEmailPage />
  },
  {
    path: '*',
    element: <C404 />
  }
]);
