import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { config } from '../config/index.js'
import { generateToken } from '../utils/jwt.utils.js'

export default class AuthController {
  static async googleAuth(req, res) {
    const { email, username, photo } = req.body
    const user = await User.findOne({ email })
    if (user) {
      const accessToken = generateToken(user)
      user.accessToken = accessToken
      await user.save()
      const { password: pass, ...userData } = user._doc
      res
        .cookie('access_token', accessToken, { httpOnly: true })
        .status(200)
        .json({
          status: 'Success',
          message: 'Login successful',
          userData,
        })
    } else {
      const saltRounds = config.bycrypt_salt_round
      const generatedPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = bcrypt.hashSync(generatedPassword, saltRounds)
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        photo,
      })
      const token = generateToken(newUser)
      newUser.accessToken = token
      await newUser.save()

      const { password: pass, ...userData } = newUser._doc

      res.cookie('access_token', token, { httpOnly: true }).status(201).json({
        status: 'Success',
        message: 'User created successfully.',
        userData,
      })
    }
  }
}
