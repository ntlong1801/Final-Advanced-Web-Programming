export const AUTH = {
  REGISTER: 'auth/register',
  REGISTER_BY_EMAIL: 'auth/register-email',
  LOGIN: 'auth/login',
  GOOGLE: 'auth/google',
  GOOGLE_CALLBACK: (search) => `auth/google/callback${search}`,
  FACEBOOK_CALLBACK: (search) => `auth/facebook/callback${search}`,
  FACEBOOK: 'auth/facebook',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: 'auth/logout',
  CONFIRM_REGISTER: (token) => `auth/verify-email${token}`
};

export const CLASS = {
  CREATE_CLASS: 'class/addClass',
  UPDATE_CLASS: 'class/updateClassInfo',
  ADD_NEW_USER: 'class/addUserToClass',
  INVITE_BY_EMAIL: 'class/inviteByMail',

  GET_ALL_CLASS: 'class/classes',
  GET_CLASS_BY_ID: (id) => `class/class?id=${id}`,
  GET_ALL_USER_OF_CLASS: (id) => `class/all-user?id=${id}`,
  GET_ALL_CLASS_OF_USER: (id) => `class/classesByUserId?id=${id}`,
  IS_TEACHER: 'class/isTeacher',
  JOIN_CLASS_BY_LINK: 'class/join',
  JOIN_CLASS_BY_EMAIL: (tokenFromMail) => `class/join/${tokenFromMail}`,
  JOIN_CLASS_BY_CODE: 'class/joinClassByCode',

  GET_GRADE_STRUCTURE: (classId) => `teacher/gradeStructure?class_id=${classId}`,
  EDIT_GRADE_STRUCTURE: 'teacher/editGradeStructure'
};

export const USER = {
  GET_ALL_USER: 'user/allUsers',
  GET_INFO: (id) => `user/profile?id=${id}`,
  UPDATE_INFO: 'user/updatePRofile',
  CHANGE_PASSWORD: 'user/changePassword',
  FORGOT_PASSWORD: 'user/forgot-password-email',
  RENEW_PASSWORD: (token) => `user/renew-password-by-forgot-email/${token}`
};

export const GRADE = {
  GET_TEMPLATE_STUDENT_LIST: (classId) => `teacher/getTemplateStudentList?classId=${classId}`,
  GET_CLASS_GRADE_BORAD: (id) => `teacher/getClassGradeBoard?id_class=${id}`,
  GET_GRADE_TEMPLATE_FOR_ASSIGNMENT: (classId, compositionId) =>
    `teacher/getGradingTemplate?id_class=${classId}&compositionId=${compositionId}`,
  GET_GRADE_BOARD: (id) => `teacher/getGradeBoard?classId=${id}`,

  POST_STUDENT_LIST: 'teacher/postStudentList',
  POST_SINGLE_GRADE_ASSIGNMENT: 'teacher/postSingleGradeAssignment',
  POST_ALL_GRADE_ASSIGNMENT: 'teacher/postAllGradesAssignment',
  POST_FINALIZED: 'teacher/postFinalizedComposition',
  MAP_STUDENT_ID: 'teacher/mapStudentId',
};
