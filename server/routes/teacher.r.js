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
 *       description: Add class successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     '500':
 *       description: Internal server error
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
 *       description: Add class successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassWithUser'
 *     '500':
 *       description: Internal server error
 */
router.post("/postStudentList", middlewareController.verifyToken, teacherController.postStudentList);

module.exports = router;