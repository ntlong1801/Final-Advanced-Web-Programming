export const AUTH = {
  REGISTER: 'auth/register',
  REGISTER_BY_EMAIL: 'auth/register-email',
  LOGIN: 'auth/login',
  GOOGLE: 'auth/google',
  GOOGLE_CALLBACK: (search) => `auth/google/callback${search}`,
  FACEBOOK_CALLBACK: (search) => `auth/facebook/callback${search}`,
  FACEBOOK: 'auth/facebook',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: 'auth/logout',
  CONFIRM_REGISTER: (token) => `auth/verify-email${token}`
};

export const CLASS = {
  CREATE_CLASS: 'class/addClass',
  UPDATE_CLASS: 'class/updateClassInfo',
  ADD_NEW_USER: 'class/addUserToClass',
  INVITE_BY_EMAIL: 'class/inviteByMail',

  GET_ALL_CLASS: 'class/classes',
  GET_CLASS_BY_ID: (id) => `class/class?id=${id}`,
  GET_ALL_USER_OF_CLASS: (id) => `class/all-user?id=${id}`,
  GET_ALL_CLASS_OF_USER: (id) => `class/classesByUserId?id=${id}`,
  IS_TEACHER: 'class/isTeacher',
  JOIN_CLASS_BY_LINK: 'class/join',
  JOIN_CLASS_BY_EMAIL: (tokenFromMail) => `class/join/${tokenFromMail}`
};

export const USER = {
  GET_INFO: (id) => `user/profile?id=${id}`,
  UPDATE_INFO: 'user/updatePRofile',
  CHANGE_PASSWORD: 'user/changePassword',
  FORGOT_PASSWORD: 'user/forgot-password-email',
  RENEW_PASSWORD: (token) => `user/renew-password-by-forgot-email/${token}`
};
