import dotenv from 'dotenv'
import _ from 'lodash'

const result = dotenv.config()

let envs: { [key: string]: string } = {}

if (!('error' in result)) {
  envs = result.parsed as { [key: string]: string }
} else {
  envs = {}
  _.each(process.env, (value, key) => (envs[key] = value || ''))
}

// module.exports = envs
export default envs
