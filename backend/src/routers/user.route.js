// Destructure Router from express
import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import { userAuthMiddleWare } from '../middlewares/auth.middleware.js'
// Setting up the Router
const router = Router()
// Setting up the User signup/login routes
router.post('/signup', tryCatchHandler(UserController.createUser))
// router.post('/verify/', tryCatchHandler(UserController.verifyUser));
router.post('/signin', tryCatchHandler(UserController.loginUser))
router.get(
  '/refresh',
  userAuthMiddleWare,
  tryCatchHandler(UserController.refresh),
)
router.get(
  '/signout',
  userAuthMiddleWare,
  tryCatchHandler(UserController.logout),
)
router.get('/:id', userAuthMiddleWare, tryCatchHandler(UserController.getUser))

// router.post("/forgotpassword", tryCatchHandler(UserController.forgotPassword));
// router.post("/resetpassword/code", tryCatchHandler(UserController.resetPasswordCode));
// router.put("/resetpassword/:resetPasswordToken", tryCatchHandler(UserController.resetPassword));
router.get('/users', tryCatchHandler(UserController.findAll)) // Move this route before routes with URL parameters
// router.get("/profile", userAuthMiddleWare, tryCatchHandler(UserController.getProfile));
router.put(
  '/profile/:id',
  userAuthMiddleWare,
  tryCatchHandler(UserController.updateUserInfo),
)
// router.put("/profile/addressinfo", userAuthMiddleWare, tryCatchHandler(UserController.updateAddressInfo));
// router.put("/profile/photo", userAuthMiddleWare, tryCatchHandler(UserController.profilePhotoUpload));
// router.get("/:email", tryCatchHandler(UserController.findUser));
// router.get("/:id", tryCatchHandler(UserController.findDevUser));
router.delete('/deleteall', tryCatchHandler(UserController.deleteAll))
// router.delete("/deleterequest", userAuthMiddleWare, tryCatchHandler(UserController.requestUserDelete));
router.delete(
  '/deleteuser/:id',
  userAuthMiddleWare,
  tryCatchHandler(UserController.deleteUser),
)
// router.delete("/deleteuser/:id", tryCatchHandler(UserController.deleteDevUser));

//Exporting the User Router
export { router }
