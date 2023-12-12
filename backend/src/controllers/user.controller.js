import {
  createUserValidator,
  loginUserValidator,
} from '../validators/user.validator.js'
import {
  BadUserRequestError,
  NotFoundError,
  UnAuthorizedError,
} from '../errors/error.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { config } from '../config/index.js'
import { generateToken } from '../utils/jwt.utils.js'
export default class UserController {
  static async createUser(req, res) {
    const { error } = createUserValidator.validate(req.body)
    if (error) throw error
    const { username, email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadUserRequestError(`An account with ${email} already exists.`)
    }
    const saltRounds = config.bycrypt_salt_round
    const hashedPassword = bcrypt.hashSync(password, saltRounds)
    const user = new User({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()
    res.status(201).json({
      status: 'Success',
      message: 'User created successfully.',
      user,
    })
  }

  static async loginUser(req, res) {
    const { error } = loginUserValidator.validate(req.body)
    if (error) throw new BadUserRequestError('Invalid login details')
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user) throw new UnAuthorizedError('Invalid login details')
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) throw new UnAuthorizedError('Invalid login details')
    const token = generateToken(user)
    user.accessToken = token
    await user.save()
    const userData = user.toObject()
    delete userData.password
    const maxAge = config.cookie_max_age
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge,
    })

    res.status(200).json({
      status: 'Success',
      message: 'Login successful',
      userData,
    })
  }

  static async logout(req, res) {
    const userId = req.user._id
    const user = await User.findById(userId)
    user.accessToken = null
    await user.save()
    res.status(200).json({
      status: 'Success',
      message: 'Logout successful',
    })
  }

  static async getUser(req, res) {
    // const userId = req.user._id;
    const id = req.params.id
    // Fetch the user from the database
    const user = await User.findById(id).select('-password')
    if (!user) throw new NotFoundError('User not found')
    res.status(200).json({
      status: 'Success',
      user,
    })
  }

  static async updateUserInfo(req, res) {
    const userId = req.user._id
    if (!userId) throw new UnAuthorizedError('Not authorized')
    if (userId !== req.params.id)
      throw new UnAuthorizedError('You can only change your own')
    // const { phone, firstName, lastName } = req.body;
    // Fetch the user from the database
    // const user = await User.findById(userId);
    // Update the personal information
    if (req.body.password) {
      const saltRounds = config.bycrypt_salt_round
      const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds)
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          photo: req.body.photo,
        },
      },
      { new: true },
    )

    const { password, ...userData } = updatedUser._doc
    res.status(200).json({
      status: 'Success',
      message: 'User information updated successfully',
      userData,
    })
  }

  static async guestUser(req, res) {
    res.status(200).json({
      status: 'Success',
      message: 'Log in successful',
    })
  }

  static async deleteUser(req, res) {
    const userId = req.user._id
    if (!userId) throw new UnAuthorizedError('Not authorized. Please sign in')
    if (userId !== req.params.id)
      throw new UnAuthorizedError('You can only delete your own account')
    const user = await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token')
    res.status(200).json({
      message: `User deleted successfully`,
      status: 'Success',
    })
  }

  //   static async deleteAll(req, res) {
  //     const users =  await User.find()
  //     if(users.length < 1) throw new NotFoundError('No user found')
  //     const deleteUsers = await User.deleteMany()
  //     res.status(200).json({
  //       status: "All users delete successfully",
  //     })
  //   }
  //
}
