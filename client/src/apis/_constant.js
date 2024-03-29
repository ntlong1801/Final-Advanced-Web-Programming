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
  RENEW_PASSWORD: (token) => `user/renew-password-by-forgot-email/${token}`,
  GET_STUDENT_ID: (id) => `user/studentId?userId=${id}`,

  TEACHER_NOTIFICATION: 'teacher/getNotification',
  STUDENT_NOTIFICATION: 'student/getNotification',
};

export const GRADE = {
  GET_TEMPLATE_STUDENT_LIST: (classId) => `teacher/getTemplateStudentList?classId=${classId}`,
  GET_CLASS_GRADE_BORAD: (id) => `teacher/getClassGradeBoard?id_class=${id}`,
  GET_GRADE_TEMPLATE_FOR_ASSIGNMENT: (classId, compositionId) =>
    `teacher/getGradingTemplate?id_class=${classId}&compositionId=${compositionId}`,
  GET_GRADE_BOARD: (id) => `teacher/getGradeBoard?classId=${id}`,
  GET_LIST_GRADE_REVIEWS: (id) => `teacher/getListGradeReview?userId=${id}`,
  GET_DETAIL_REVIEWS: (id) => `teacher/getDetailGradeReview?review_id=${id}`,

  POST_STUDENT_LIST: 'teacher/postStudentList',
  POST_SINGLE_GRADE_ASSIGNMENT: 'teacher/postSingleGradeAssignment',
  POST_ALL_GRADE_ASSIGNMENT: 'teacher/postAllGradesAssignment',
  POST_FINALIZED: 'teacher/postFinalizedComposition',
  MAP_STUDENT_ID: 'teacher/mapStudentId',
  POST_FEEDBACK_ON_REVIEWS: 'teacher/postFeedbackOnReview',
  POST_FINALIZED_DECISION: 'teacher/postFinalizedGradeReview',
  GET_STUDENT_NOT_MAP_STUDENT_ID: (id) => `teacher/getStudentNotMapStudentId?classId=${id}`,
};

export const STUDENT = {
  GET_GRADE_STRUCTURE: 'student/getGradeStructure',
  POST_REQUEST_REVIEW: 'student/requestReview',
  POST_COMMENT: 'student/postComment',
  GET_COMMENT: 'student/getComment',
};

export const ADMIN = {
  GET_ALL_USERS: 'admin/getAllUsers',
  ADD_NEW_USER: 'admin/addUser',
  UPDATE_USER: 'admin/updateUser',
  DELETE_USER: (id) => `admin/deleteUser?userId=${id}`,
  BAN_USER: 'admin/banUser',
  ACTIVE_CLASS: 'admin/activeClass',
  MAP_STUDENT_ID: 'admin/mapStudentId',
  POST_LIST_STUDENT_ID: 'admin/postListStudentId',
  GET_TEMPLATE_STUDENT_LIST_ID: (id) => `admin/getStudentListIdTemplate?userId=${id}`,
  GET_QUANTITY_USER_AND_CLASS: 'admin/quantityUserAndClass',
};
