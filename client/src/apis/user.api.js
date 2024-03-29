import instance from 'config';
import { USER } from './_constant';

export const getAllUsers = () =>
  instance.get(USER.GET_ALL_USER);

export const updateProfile = (body = {}) =>
  instance.post(USER.UPDATE_INFO, body);

export const changePassword = (body = {}) =>
  instance.post(USER.CHANGE_PASSWORD, body);

export const forgotPassword = (body = {}) =>
  instance.post(USER.FORGOT_PASSWORD, body);

export const changePasswordByForgot = ({ token, body }) =>
  instance.post(USER.RENEW_PASSWORD(token), body);

export const getNotificationStudent = (body = {}) =>
  instance.post(USER.STUDENT_NOTIFICATION, body);

export const getNotificationTeacher = (body = {}) =>
  instance.post(USER.TEACHER_NOTIFICATION, body);

export const getProfile = (id) =>
  instance.get(USER.GET_INFO(id));

export const getStudentId = (id) =>
  instance.get(USER.GET_STUDENT_ID(id));
