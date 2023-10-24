import User from '../models/user.model.js'
import { verifyToken } from '../utils/jwt.utils.js'

export async function userAuthMiddleWare(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1]
  // const token = req.cookies.access_token
  if (!token) {
    return res
      .status(401)
      .json({ message: 'You must provide an authorization token.' })
  }

  try {
    const user = await User.findOne({ accessToken: token })

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Access denied, invalid token.' })
  }
}
