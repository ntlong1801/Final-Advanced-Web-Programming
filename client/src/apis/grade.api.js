import instance from 'config';
import { GRADE } from './_constant';

export const getTemplateStudentList = ({ classId }) =>
  instance.get(GRADE.GET_TEMPLATE_STUDENT_LIST(classId));

export const getClassGradeBoard = (id) =>
  instance.get(GRADE.GET_CLASS_GRADE_BORAD(id));

export const getGradeTemplate = ({ classId, compositionId }) =>
  instance.get(GRADE.GET_GRADE_TEMPLATE_FOR_ASSIGNMENT(classId, compositionId));

export const getGradeBoard = ({ classId }) =>
  instance.get(GRADE.GET_GRADE_BOARD(classId));

export const getListGradeReviews = (id) =>
  instance.get(GRADE.GET_LIST_GRADE_REVIEWS(id));

export const getDetailGradeReviews = (id) =>
  instance.get(GRADE.GET_DETAIL_REVIEWS(id));

export const postStudentList = (body = {}) =>
  instance.post(GRADE.POST_STUDENT_LIST, body);

export const postSingleGradeAssignment = (body = {}) =>
  instance.post(GRADE.POST_SINGLE_GRADE_ASSIGNMENT, body);

export const postAllGradesAssignment = (body = {}) =>
  instance.post(GRADE.POST_ALL_GRADE_ASSIGNMENT, body);

export const postFinalized = (body = {}) =>
  instance.post(GRADE.POST_FINALIZED, body);

export const mapStudentId = (body = {}) =>
  instance.post(GRADE.MAP_STUDENT_ID, body);

export const postFeedbackOnReview = (body = {}) =>
  instance.post(GRADE.POST_FEEDBACK_ON_REVIEWS, body);

export const postFinalizedDecision = (body = {}) =>
  instance.post(GRADE.POST_FINALIZED_DECISION, body);
