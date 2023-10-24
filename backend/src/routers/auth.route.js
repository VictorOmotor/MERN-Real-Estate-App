import { Router } from 'express'
import AuthController from '../controllers/auth.controller.js'
import { tryCatchHandler } from '../utils/tryCatch.handler.js'

const router = Router()

router.post('/google', tryCatchHandler(AuthController.googleAuth))
router.get('/facebook', tryCatchHandler(AuthController.facebookAuth))
// router.get('/google/login', AuthController.googleLogin);
router.get(
  '/login/google/callback',
  tryCatchHandler(AuthController.googleCallback),
)
router.get(
  '/login/facebook/callback',
  tryCatchHandler(AuthController.facebookCallback),
)
// router.get('/login/google/callback', googleAuthCallback);

export { router }
