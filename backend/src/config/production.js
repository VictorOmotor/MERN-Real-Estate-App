import dotenv from 'dotenv'
dotenv.config()

export const production = {
  mongodb_connection_url: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
  bycrypt_salt_round: +process.env.PRODUCTION_BCRYPT_SALT_ROUND,
  jwt_secret_key: process.env.PRODUCTION_JWT_SECRET,
  jwt_expiry: process.env.PRODUCTION_JWT_EXPIRY,
  token_expiry: +process.env.PRODUCTION_TOKEN_EXPIRY,
  port: +process.env.PORT,
  cookie_max_age: process.env.PRODUCTION_COOKIE_MAX_AGE,
}
