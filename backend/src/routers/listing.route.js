import { Router } from 'express'
import { tryCatchHandler } from '../utils/tryCatch.handler.js'
import ListingController from '../controllers/listing.controller.js'
import { userAuthMiddleWare } from '../middlewares/auth.middleware.js'

const router = Router()

router.post(
  '/create',
  userAuthMiddleWare,
  tryCatchHandler(ListingController.createListing),
)
router.get(
  '/listings/:id',
  userAuthMiddleWare,
  tryCatchHandler(ListingController.getUserListings),
)
router.delete(
  '/delete/:id',
  userAuthMiddleWare,
  tryCatchHandler(ListingController.deleteListing),
)
router.put(
  '/update/:id',
  userAuthMiddleWare,
  tryCatchHandler(ListingController.updateListing),
)
router.get('/get/:id', tryCatchHandler(ListingController.getListing))
router.get('/get', tryCatchHandler(ListingController.getListings))

export { router }
