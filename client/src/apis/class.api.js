import instance from 'config';
import { CLASS } from './_constant';

export const createClass = (body = {}) =>
  instance.post(CLASS.CREATE_CLASS, body);

export const updateClass = (body = {}) =>
  instance.post(CLASS.UPDATE_CLASS, body);

export const addUserToClass = (body = {}) =>
  instance.post(CLASS.ADD_NEW_USER, body);

export const getAllClass = () =>
  instance.get(CLASS.GET_ALL_CLASS);

export const getClassByID = (id) =>
  instance.get(CLASS.GET_CLASS_BY_ID(id));

export const getAllUserOfClass = (id) =>
  instance.get(CLASS.GET_ALL_USER_OF_CLASS(id));

export const getAllClassOfUser = async (id) =>
  instance.get(CLASS.GET_ALL_CLASS_OF_USER(id));
