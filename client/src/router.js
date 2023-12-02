import { createBrowserRouter } from 'react-router-dom';

import HomePage from 'pages/HomePage';
import SignInPage from 'pages/SignInPage';
import SignUpPage from 'pages/SignUpPage';
import DashBoardPage from 'pages/DashBoardPage';
import UserPage from 'pages/UserPage';
import ChangePassword from 'pages/ChangePassword';
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
    path: '*',
    element: <C404 />
  }
]);
