import { Schema, model, Types } from 'mongoose'

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
      validators: {
        match: [
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          'Please add a valid email string to the email path.',
        ],
      },
    },
    photo: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    accessToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.index({ location: '2dsphere' })

export default model('User', UserSchema)
