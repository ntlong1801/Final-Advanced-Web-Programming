const studentController = require('../app/controllers/student.c');
const middlewareController = require("../middleware/middleware.js");

const router = require("express").Router();

// router.post("/getGradeStructure", middlewareController.verifyToken, studentController.getGradeCompositionByStudent);
router.get("/getGradeStructure", studentController.getGradeCompositionByStudent);

router.post("/requestReview", studentController.postRequestReviewComposition);

router.post("/postComment", studentController.commentGradeReview);

router.get("/getComment", studentController.getCommentReview);


module.exports = router;