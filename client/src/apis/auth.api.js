import instance from 'config';
import { AUTH } from './_constant';

export const register = (body = {}) =>
  instance.post(AUTH.REGISTER, body);

export const registerByEmail = (body = {}) =>
  instance.post(AUTH.REGISTER_BY_EMAIL, body);

export const confirmEmail = (token) =>
  instance.get(AUTH.CONFIRM_REGISTER(token));

export const login = (body = {}) =>
  instance.post(AUTH.LOGIN, body);

export const logout = (body = {}) =>
  instance.post(AUTH.LOGOUT, body);

export const googleAuth = () =>
  instance.get(AUTH.GOOGLE);

export const googleAuthCallback = (search) =>
  instance.get(AUTH.GOOGLE_CALLBACK(search));

export const facebookAuth = () =>
  instance.get(AUTH.FACEBOOK);

export const facbookAuthCallback = (search) =>
  instance.get(AUTH.FACEBOOK_CALLBACK(search));
