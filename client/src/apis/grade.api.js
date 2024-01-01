import instance from 'config';
import { GRADE } from './_constant';

export const getTemplateStudentList = (id) =>
  instance.get(GRADE.GET_TEMPLATE_STUDENT_LIST(id));

export const getClassGradeBoard = (id) =>
  instance.get(GRADE.GET_CLASS_GRADE_BORAD(id));

export const getGradeTemplate = (id) =>
  instance.get(GRADE.GET_GRADE_TEMPLATE_FOR_ASSIGNMENT(id));

export const postStudentList = (body = {}) =>
  instance.post(GRADE.POST_STUDENT_LIST, body);

export const postSingleGradeAssignment = (body = {}) =>
  instance.post(GRADE.POST_SINGLE_GRADE_ASSIGNMENT, body);

export const postAllGradesAssignment = (body = {}) =>
  instance.post(GRADE.POST_ALL_GRADE_ASSIGNMENT, body);

export const postFinalized = (body = {}) =>
  instance.post(GRADE.POST_FINALIZED, body);
