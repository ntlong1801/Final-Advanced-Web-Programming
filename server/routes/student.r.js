const studentController = require('../app/controllers/student.c');
const middlewareController = require("../middleware/middleware.js");

const router = require("express").Router();

// router.post("/getGradeStructure", middlewareController.verifyToken, studentController.getGradeCompositionByStudent);
router.post("/getGradeStructure", studentController.getGradeCompositionByStudent);

module.exports = router;