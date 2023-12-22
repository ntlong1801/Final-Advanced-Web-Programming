export const AUTH = {
  REGISTER: 'auth/register',
  LOGIN: 'auth/login',
  GOOGLE: 'auth/google',
  FACEBOOK: 'auth/facebook',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: 'auth/logout'
};

export const CLASS = {
  CREATE_CLASS: 'class/addClass',
  UPDATE_CLASS: 'class/updateClassInfo',
  ADD_NEW_USER: 'class/addUserToClass',

  GET_ALL_CLASS: 'class/classes',
  GET_CLASS_BY_ID: (id) => `class/classes?id=${id}`,
  GET_ALL_USER_OF_CLASS: (id) => `class/all-user?id=${id}`,
  GET_ALL_CLASS_OF_USER: (id) => `class/classesByUserId?id=${id}`
};

export const USER = {
  GET_INFO: (id) => `user/profile?id=${id}`,
  UPDATE_INFO: 'user/updatePRofile',
  CHANGE_PASSWORD: 'user/changePassword',
};
