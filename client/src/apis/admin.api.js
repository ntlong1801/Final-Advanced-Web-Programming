import instance from 'config';
import { ADMIN } from './_constant';

export const getAllUsers = (userId) =>
  instance.get(ADMIN.GET_ALL_USERS, { params: { userId } });

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

export const getStudentListIdTemplate = ({ userId }) =>
  instance.get(ADMIN.GET_TEMPLATE_STUDENT_LIST_ID(userId));

export const getQuantityUserAndClass = (userId) =>
  instance.get(ADMIN.GET_QUANTITY_USER_AND_CLASS, { params: { userId } });
