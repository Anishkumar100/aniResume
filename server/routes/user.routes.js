import router from "express";
import protect from "../middlewares/userMiddleware.js"
import { registerUser, userLogin, getUserById} from "../controllers/user.controller.js";
import { getUserResumes } from "../controllers/resume.controller.js";

const userRouter = router.Router();


// Route for user registration
userRouter.post("/register", registerUser);

// Route for user login
userRouter.post("/login", userLogin);

// Route for getting a specific user with req.userId populated by auth middleware
userRouter.get("/data",protect, getUserById);


export default userRouter;