import instance from 'config';
import { USER } from './_constant';

export const updateProfile = (body = {}) =>
  instance.post(USER.UPDATE_INFO, body);

export const changePassword = (body = {}) =>
  instance.post(USER.CHANGE_PASSWORD, body);

export const getProfile = (id) =>
  instance.get(USER.GET_INFO(id));
