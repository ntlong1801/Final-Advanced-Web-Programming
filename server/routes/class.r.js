const classController = require('../app/controllers/class.c');
const middlewareController = require("../middleware/middleware.js");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: /class
 *   description: API for class actions
 */

/**
 * @swagger
 * /class/addClass:
 *  post:
 *   summary: add new classroom
 *   tags: [/class]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: name of class
 *             description:
 *               type: string
 *               description: detail about class
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Add class successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     '500':
 *       description: Internal server error
 */
router.post("/addClass", middlewareController.verifyToken, classController.addClass);

/**
 * @swagger
 * /class/classes:
 *  get:
 *   summary: get all classes
 *   tags: [/class]
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Class list
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *             $ref: '#/components/schemas/Class'
 *     '500':
 *       description: Internal server error
 */
router.get("/classes", middlewareController.verifyToken, classController.getClasses);

/**
 * @swagger
 * /class/class?id={id}:
 *  get:
 *   summary: get information of a class
 *   tags: [/class]
 *   parameters:
 *     - name: id
 *       in: path
 *       description: Class's ID
 *       required: true
 *       type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Class information
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     '500':
 *       description: Internal server error
 */
router.get("/class", middlewareController.verifyToken, classController.getClass);

/**
 * @swagger
 * /class/updateClassInfo:
 *  post:
 *   summary: update a class's information
 *   tags: [/class]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Class'
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: update info successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     '500':
 *       description: Internal server error
 */
router.post("/updateClassInfo", middlewareController.verifyToken, classController.updateClassInfo);

/**
 * @swagger
 * /class/addUserToClass:
 *  post:
 *   summary: add new user (teacher or student) to class
 *   tags: [/class]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ClassWithUser'
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Add user to class successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassWithUser'
 *     '500':
 *       description: Internal server error
 */
router.post("/addUserToClass", middlewareController.verifyToken, classController.addUserToClass);

/**
 * @swagger
 * /class/all-user?id={id}:
 *  get:
 *   summary: get all user of a class
 *   tags: [/class]
 *   parameters:
 *     - name: id
 *       in: path
 *       description: Class's ID
 *       required: true
 *       type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: All user of class
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     '500':
 *       description: Internal server error
 */
router.get("/all-user", middlewareController.verifyToken, classController.getAllUserFromClass);

/**
 * @swagger
 * /class/classesByUserId:
 *  get:
 *   summary: get all classes that user attended
 *   tags: [/class]
 *   parameters:
 *     - name: id
 *       in: path
 *       description: Class's ID
 *       required: true
 *       type: string
 *   security:
 *     - tokenAuth: []
 *   responses:
 *     '200':
 *       description: Class list
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *             $ref: '#/components/schemas/Class'
 *     '500':
 *       description: Internal server error
 */
router.get("/classesByUserId", middlewareController.verifyToken, classController.getClassesByUserId);

// join class by link
router.post("/join", middlewareController.verifyToken, classController.inviteUserByLink);

router.get('/isTeacher', middlewareController.verifyToken, classController.checkTeacherOfClassById);
// Handle class participation by email
router.get("/join/:token", classController.inviteUserByEmail);

// send invitation mail to user 
router.post("/inviteByMail", middlewareController.isTeacherOfClass, middlewareController.verifyToken, classController.sendEmailInvitation);
// router.post("/inviteByMail", middlewareController.isTeacherOfClass, classController.sendEmailInvitation);

router.post("/joinClassByCode", middlewareController.verifyToken, classController.joinClassByCode);

module.exports = router;
