import dotenv from 'dotenv'
dotenv.config()
import { development } from './development.js'
import { production } from './production.js'

const environment = process.env.NODE_ENV

let config
if (!environment) throw new Error('No environment setup on the SERVER!!!')

console.log(`Server setup to ${environment}!!!`)

if (environment.trim() === 'production') {
  config = { ...production }
}
if (environment.trim() === 'development') {
  config = { ...development }
}

export { config }
