import instance from 'config';
import { CLASS } from './_constant';

export const createClass = (body = {}) =>
  instance.post(CLASS.CREATE_CLASS, body);

export const updateClass = (body = {}) =>
  instance.post(CLASS.UPDATE_CLASS, body);

export const addUserToClass = (body = {}) =>
  instance.post(CLASS.ADD_NEW_USER, body);

export const inviteByEmail = (body = {}) =>
  instance.post(CLASS.INVITE_BY_EMAIL, body);

export const editGradeStructure = (body = {}) =>
  instance.post(CLASS.EDIT_GRADE_STRUCTURE, body);

export const getAllClass = () =>
  instance.get(CLASS.GET_ALL_CLASS);

export const getClassByID = (id) =>
  instance.get(CLASS.GET_CLASS_BY_ID(id));

export const getAllUserOfClass = (id) =>
  instance.get(CLASS.GET_ALL_USER_OF_CLASS(id));

export const getAllClassOfUser = async (id) =>
  instance.get(CLASS.GET_ALL_CLASS_OF_USER(id));

export const isTeacherOfClass = (userId, classId) =>
  instance.get(CLASS.IS_TEACHER, {
    params: { user_id: userId, class_id: classId }
  });

export const joinClassByLink = (email, link) =>
  instance.get(CLASS.JOIN_CLASS_BY_LINK, {
    params: { email, link }
  });

export const joinClassByEmail = (tokenFromMail, userId) =>
  instance.get(CLASS.JOIN_CLASS_BY_EMAIL(tokenFromMail), { params: { userId } });

// eslint-disable-next-line camelcase
export const getGradeStructure = (class_id) =>
  instance.get(CLASS.GET_GRADE_STRUCTURE(class_id));
