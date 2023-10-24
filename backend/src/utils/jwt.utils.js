import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export function generateToken(user) {
  const payload = {
    _id: user._id,
  }
  const token = jwt.sign(payload, config.jwt_secret_key, {
    expiresIn: config.jwt_expiry,
  })
  return token
}
export function refreshToken(user) {
  const payload = { _id: user._id }
  const token = jwt.sign(payload, config.refresh_secret_key, {
    expiresIn: config.refresh_expiry,
  })
  return token
}
export function verifyToken(token) {
  return jwt.verify(token, config.jwt_secret_key)
}
