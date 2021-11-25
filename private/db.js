const axios = require('axios')
const { AUTH_KEY } = require('./config')

const authHeader = {}

module.exports.establish = async () => {
  try {
    // authenticate
    const response = await axios.post('http://api.dssd.team/auth/local/', {
      identifier: 'api@dssd.team',
      password: AUTH_KEY
    })

    // record jwt in authorization header
    authHeader.Authorization = 'Bearer ' + response.data.jwt
    console.log("Successfully connected to API.")
  } catch(error) {
    // recursively call function if failed
    console.log("Failed API connection. Trying again in 10 seconds.")
    setTimeout(module.exports.establish, 10000)
  }
}

module.exports.get = async (request) => {
  return axios.get(request, {
    headers: authHeader
  })
}