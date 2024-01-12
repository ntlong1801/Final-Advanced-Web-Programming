import instance from 'config';
import { STUDENT } from './_constant';

export const getGradeStructure = (studentId, classId) =>
  instance.get(STUDENT.GET_GRADE_STRUCTURE, {
    params: { studentId, classId },
  });

export const postRequestReview = (body = {}) =>
  instance.post(STUDENT.POST_REQUEST_REVIEW, body);

export const postComment = (body = {}) =>
  instance.post(STUDENT.POST_COMMENT, body);

export const getComment = (studentId, classId) =>
  instance.get(STUDENT.GET_COMMENT, {
    params: { studentId, classId },
  });
