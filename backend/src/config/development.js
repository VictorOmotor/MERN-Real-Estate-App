import dotenv from 'dotenv'
dotenv.config()

export const development = {
  mongodb_connection_url: process.env.DEV_MONGODB_CONNECTION_URL,
  bycrypt_salt_round: +process.env.DEV_BCRYPT_SALT_ROUND,
  jwt_secret_key: process.env.DEV_JWT_SECRET,
  refresh_secret_key: process.env.DEV_REFRESH_SECRET_KEY,
  port: +process.env.PORT,
  jwt_expiry: process.env.DEV_JWT_EXPIRY,
  refresh_expiry: process.env.DEV_REFRESH_EXPIRY,
  token_expiry: +process.env.DEV_TOKEN_EXPIRY,
  cookie_max_age: process.env.DEV_COOKIE_MAX_AGE,
}
