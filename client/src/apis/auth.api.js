import instance from 'config';
import { AUTH } from './_constant';

export const register = (body = {}) =>
  instance.post(AUTH.REGISTER, body);

export const login = (body = {}) =>
  instance.post(AUTH.LOGIN, body);

export const logout = () =>
  instance.post(AUTH.LOGOUT);

export const googleAuth = () =>
  instance.get(AUTH.GOOGLE);

export const facebookAuth = () =>
  instance.get(AUTH.FACEBOOK);
