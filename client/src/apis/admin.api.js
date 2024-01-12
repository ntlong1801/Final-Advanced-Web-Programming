import instance from 'config';
import { ADMIN } from './_constant';

export const getAllUsers = () =>
  instance.get(ADMIN.GET_ALL_USERS);

export const addUser = (body = {}) =>
  instance.post(ADMIN.ADD_NEW_USER, body);

export const updateUser = (body = {}) =>
  instance.post(ADMIN.UPDATE_USER, body);

export const deleteUser = ({ id }) =>
  instance.delete(ADMIN.DELETE_USER(id));

export const banUser = (body = {}) =>
  instance.post(ADMIN.BAN_USER, body);

export const activeClass = (body = {}) =>
  instance.post(ADMIN.ACTIVE_CLASS, body);

export const mapStudentId = (body = {}) =>
  instance.post(ADMIN.MAP_STUDENT_ID, body);
