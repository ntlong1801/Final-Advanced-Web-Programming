const authRouter = require("./auth.r");
const userRouter = require("./user.r");

function router(app) {
  /**
   * @swagger
   *  components:
   *    schemas:
   *      UserInfo:
   *        type: object
   *        properties:
   *          id:
   *            type: integer
   *            description: user's id
   *          email:
   *            type: string
   *            description: user's email
   *          fullName:
   *            type: string
   *            description: user's name
   */

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
}

module.exports = router;
