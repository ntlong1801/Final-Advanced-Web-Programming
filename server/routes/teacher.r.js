const teacherController = require('../app/controllers/teacher.c');
const middlewareController = require('../middleware/middleware.js');
const { route } = require('./class.r.js');

const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: /teacher
 *   description: API for teacher actions in class
 */

/**
 * @swagger
 * /teacher/getTemplateStudentList:
 *  get:
 *   summary: Download default csv template for student list (StudentId, FullName)
 *   tags: [/teacher]
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Get file  successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.get("/getTemplateStudentList", middlewareController.verifyToken, teacherController.getTemplateStudentList);

/**
 * @swagger
 * /teacher/postStudentList:
 *  post:
 *   summary: Class owner uploads a csv/xlsx file with student list (StudentId, Full name)
 *   tags: [/teacher]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             student_id:
 *               type: array
 *               items:
 *                 type: string
 *             full_name:
 *               type: array
 *               items:
 *                 type: string
 *             id_class:
 *               type: string
 *               description: id of class
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Update student list successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassWithUser'
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.post("/postStudentList", middlewareController.verifyToken, teacherController.postStudentList);

/**
 * @swagger
 * /teacher/getClassGradeBoard?id_class={id_class}:
 *  get:
 *   summary: Show Students (pre-upload full student list) x Grades board
 *   tags: [/teacher]
 *   parameters:
 *     - name: id_class
 *       in: path
 *       description: Class's ID
 *       required: true
 *       type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response. Returns the grade board.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               properties:
 *                 student_id:
 *                   type: string
 *                 id_user:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 compositionNameArr:
 *                   type: array
 *                   items:
 *                     type: string
 *                 gradeScaleArr:
 *                   type: array
 *                   items:
 *                     type: string
 *                 gradeArray:
 *                   type: array
 *                   items:
 *                     type: string
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.get("/getClassGradeBoard", middlewareController.verifyToken, teacherController.getClassGradeBoard);

/**
 * @swagger
 * /teacher/postSingleGradeAssignment:
 *  post:
 *   summary: Input grade for a student at a specific assignment
 *   tags: [/teacher]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             class_id:
 *               type: string
 *             student_id:
 *               type: string
 *             composition_id:
 *               type: string
 *             grade:
 *               type: number
 *               format: float
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response. Return updated assignment grade of student
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: string
 *               student_id:
 *                 type: string
 *               composition_id:
 *                 type: string
 *               grade:
 *                 type: number
 *                 format: float
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.post("/postSingleGradeAssignment", middlewareController.verifyToken, teacherController.postSingleGradeAssignment);

/**
 * @swagger
 * /teacher/getGradingTemplate?id_class={id_class}:
 *  get:
 *   summary: Download default csv/Excel (xlsx) template for grades for an assignment (StudentId, Grade)
 *   tags: [/teacher]
 *   parameters:
 *     - name: id_class
 *       in: path
 *       description: Class's ID
 *       required: true
 *       type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response. Returns the grading template csv file.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.get("/getGradingTemplate", middlewareController.verifyToken, teacherController.getGradingTemplate);

/**
 * @swagger
 * /teacher/postAllGradesAssignment:
 *  post:
 *   summary: Teacher uploads a csv/xlsx file for grades of all students for a specific assignment
 *   tags: [/teacher]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             class_id:
 *               type: string
 *             student_id_arr:
 *               type: array
 *               items:
 *                 type: string
 *             composition_id:
 *               type: string
 *             grade_arr:
 *               type: array
 *               items:
 *                 type: number
 *                 format: float
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response. Return all updated assignment grades of student
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               properties:
 *                 class_id:
 *                   type: string
 *                 student_id:
 *                   type: string
 *                 composition_id:
 *                   type: string
 *                 grade:
 *                   type: number
 *                   format: float
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.post("/postAllGradesAssignment", middlewareController.verifyToken, teacherController.postAllGradesAssignment);

/**
 * @swagger
 * /teacher/postFinalizedComposition:
 *  post:
 *   summary: Mark a grade composition as finalized
 *   tags: [/teacher]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             composition_id:
 *               type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: successful message
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.post("/postFinalizedComposition", middlewareController.verifyToken, teacherController.postFinalizedComposition);

router.get("/gradeStructure", teacherController.getGradeDataOfClass);

router.post("/editGradeStructure", middlewareController.isTeacherOfClass, teacherController.handleGradeStructure);
// router.post("/editGradeStructure",  teacherController.handleGradeStructure);

router.get("/getGradeBoard", middlewareController.verifyToken, teacherController.getGradeBoard);

router.post('/mapStudentId', middlewareController.verifyToken, teacherController.mapStudentId);


/**
 * @swagger
 * /teacher/getListGradeReview?user_id={user_id}:
 *  get:
 *   summary: View list of grade reviews requested by students
 *   tags: [/teacher]
 *   parameters:
 *     - name: user_id
 *       in: path
 *       description: teacher's user ID
 *       required: true
 *       type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response. Returns list of grade review for teacher.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   type: string
 *                 student_id:
 *                   type: string
 *                 composition_id:
 *                   type: string
 *                 current_grade:
 *                   type: number
 *                 student_expected_grade:
 *                   type: number
 *                 student_explain:
 *                   type: string
 *                 feedback:
 *                   type: string
 *                 review_success:
 *                   type: boolean
 *                 composition_name:
 *                   type: string
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.get("/getListGradeReview", middlewareController.verifyToken, teacherController.getListGradeReview);

/**
 * @swagger
 * /teacher/getDetailGradeReview?review_id={review_id}:
 *  get:
 *   summary: View grade review details 
 *   tags: [/teacher]
 *   parameters:
 *     - name: review_id
 *       in: path
 *       description: grade review's ID
 *       required: true
 *       type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response. Returns detail of the grade review.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   type: string
 *                 student_id:
 *                   type: string
 *                 composition_id:
 *                   type: string
 *                 current_grade:
 *                   type: number
 *                 student_expected_grade:
 *                   type: number
 *                 student_explain:
 *                   type: string
 *                 feedback:
 *                   type: string
 *                 review_success:
 *                   type: boolean
 *                 student_name:
 *                   type: string
 *                 class_id:
 *                   type: string
 *                 composition_name:
 *                   type: string
 *                 grade_scale:
 *                   type: string
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.get("/getDetailGradeReview", middlewareController.verifyToken, teacherController.getDetailGradeReview);

/**
 * @swagger
 * /teacher/postFeedbackOnReview:
 *  post:
 *   summary: Comment on a student review
 *   tags: [/teacher]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             review_id:
 *               type: string
 *             user_id:
 *               type: string
 *             feedback:
 *               type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: successful message
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.post("/postFeedbackOnReview", middlewareController.verifyToken, teacherController.postFeedbackOnReview);

/**
 * @swagger
 * /teacher/postFinalizedGradeReview:
 *  post:
 *   summary: Mark the final decision for a student review with an updated grade
 *   tags: [/teacher]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             review_id:
 *               type: string
 *             accepted:
 *               type: boolean
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Successful response.
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: success or failed message
 *               - type: object
 *                 properties:
 *                   class_id:
 *                     type: string
 *                   student_id:
 *                     type: string
 *                   composition_id:
 *                     type: string
 *                   grade:
 *                     type: number
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.post("/postFinalizedGradeReview", middlewareController.verifyToken, teacherController.postFinalizedGradeReview);

router.post("/getNotification", teacherController.getAllNotificationsByTeacherId);

router.get('/getStudentNotMapStudentId', middlewareController.verifyToken, teacherController.getStudentNotMapStudentId);

module.exports = router; 