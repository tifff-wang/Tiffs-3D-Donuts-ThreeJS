import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import { CognitoJwtVerifier } from 'aws-jwt-verify'

const poolId = 'ap-southeast-2_4bgERYGFZ'
const region = 'ap-southeast-2'

export interface DecodedUser {
  sub: string
  email: string
  // Add more properties as needed based on your token claims
}

// Function to get Cognito public keys
async function getCognitoPublicKeys() {
  const url = `https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`
  const response = await axios.get(url)
  return response.data.keys
}

// Middleware function to verify JWT tokens
async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: poolId,
    tokenUse: 'id',
    clientId: '367b7l2k2ho1kbop9eaavnd9b',
  })

  try {
    // Decode the token to get the kid (Key ID)
    const token = req.headers.authorization.split(' ')[1]
    const payload = await verifier.verify(token)
    console.log(`token is valid with payload: ${payload}`)
    req.user = payload
  } catch (error) {
    console.log(error)
    console.log('Token not valid')
  }
  next()
}

export default verifyToken
