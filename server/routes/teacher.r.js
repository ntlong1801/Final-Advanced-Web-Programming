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
 *                 gradeArray:
 *                   type: array
 *                   items:
 *                     type: string
 *             
 *     '500':
 *       description: Internal server error. Something went wrong on the server.
 */
router.get("/getClassGradeBoard", middlewareController.verifyToken, teacherController.getClassGradeBoard);
module.exports = router;