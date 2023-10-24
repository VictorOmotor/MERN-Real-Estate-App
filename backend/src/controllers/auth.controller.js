import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { config } from '../config/index.js'
import { generateToken } from '../utils/jwt.utils.js'

export default class AuthController {
  static async googleAuth(req, res) {
    const { email, username, photo } = req.body
    // console.log(req.body)
    const user = await User.findOne({ email })
    if (user) {
      const { password: pass, ...rest } = user._doc
      await user.save()
      res
        .cookie('access_token', accessToken, { httpOnly: true })
        .status(200)
        .json({
          status: 'Success',
          message: 'Login successful',
          rest,
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
        // accessToken: generateToken(newUser)
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

  // static async facebookAuth(req, res) {
  //   passport.authenticate('facebook')(req, res);
  // }

  // static async googleCallback(req, res) {
  //   passport.authenticate('google', { session: false }, async (err, user) => {
  //     if (err || !user) {
  //       return res.status(400).json({
  //         status: 'Failed',
  //         message: 'Google authentication failed.',
  //       });
  //     }
  //     // Generate access and refresh tokens
  //     const token = generateToken(user);
  //     // const refresh = refreshToken(user);
  //     // Update the user's refresh token in the database
  //     // user.refreshToken = refresh;
  //     // user.accessToken = token;
  //     await user.save();
  //     const userData = user.toObject();
  //     // delete userData._id;
  //     delete userData.password;
  //     // delete userData.googleId;
  //     const maxAge = config.cookie_max_age;
  //     res.cookie("refresh_token", refresh, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'none',
  //     maxAge
  //   });
  //     res.status(200).json({
  //       status: 'Success',
  //       message: 'Login successful',
  //       userData,
  //     });

  //   })(req, res);
  // }

  // static async facebookCallback(req, res) {
  //   passport.authenticate('facebook', { session: false }, async(err, user) => {
  //     if (err || !user) {
  //       return res.status(400).json({
  //         status: 'Failed',
  //         message: 'Facebook authentication failed.',
  //       });
  //     }
  //     // Generate access and refresh tokens
  //     const token = generateToken(user);
  //     const refresh = refreshToken(user);
  //     // Update the user's refresh token in the database
  //     user.refreshToken = refresh;
  //     user.accessToken = token;
  //     await user.save();
  //     const userData = user.toObject();
  //     // delete userData._id;
  //     delete userData.password;
  //     const maxAge = config.cookie_max_age;
  //     res.cookie("refresh_token", refresh, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'none',
  //     maxAge
  //   });
  //   res.status(200).json({
  //     status: 'Success',
  //     message: 'Login successful',
  //     data: {
  //       user: userData
  //     },
  //   });

  //   })(req, res);
  // }
}

// export const redirectCallback = (req, res) => {
//   const token = generateToken(user);
//   res.redirect(`http://localhost:3000/dashboard?token=${token}`);
// };
