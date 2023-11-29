// import { expressjwt as jwt, GetVerificationKey } from 'express-jwt'
// import { Request } from 'express'
// import { ParamsDictionary } from 'express-serve-static-core'
// import { JwtPayload } from 'jsonwebtoken'
// import jwks from 'jwks-rsa'

import { Request, Response, NextFunction } from 'express'
import jwt, { decode } from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import axios from 'axios'

const cognitoPoolId = 'ap-southeast-2:767e310c-45d0-445a-98c0-553014cfd8ee'
const region = 'ap-southeast-2'

export interface DecodedUser {
  sub: string
  email: string
  // Add more properties as needed based on your token claims
}

// Function to get Cognito public keys
async function getCognitoPublicKeys() {
  const url = `https://cognito-idp.${region}.amazonaws.com/${cognitoPoolId}/.well-known/jwks.json`
  const response = await axios.get(url)
  return response.data.keys
}

// Middleware function to verify JWT tokens
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(403).json({ error: 'No token provided' })
  }

  try {
    // Decode the token to get the kid (Key ID)
    const decodedToken = decode(token, { complete: true }) as {
      header: { kid: string }
    }
    const kid = decodedToken?.header?.kid

    if (!kid) {
      return res.status(403).json({ error: 'Invalid token' })
    }

    // Get Cognito public keys
    const keys = await getCognitoPublicKeys()

    // Find the public key that matches the kid
    const jwk = keys.find((key) => key.kid === kid)

    if (!jwk) {
      return res.status(403).json({ error: 'Invalid token' })
    }

    // Convert JWK to PEM format
    const pem = jwkToPem(jwk)

    // Verify the token using the public key
    jwt.verify(token, pem, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' })
      }

      // Attach the decoded user information to the request object
      req.user = decoded as DecodedUser
      next()
    })
  } catch (error) {
    console.error('Error verifying token:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

// const checkJwt = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `${domain}/.well-known/jwks.json`,
//   }) as GetVerificationKey,
//   audience: audience,
//   issuer: `${domain}/`,
//   algorithms: ['RS256'],
// })

// export default checkJwt

// export interface JwtRequest<TReq = any, TRes = any>
//   extends Request<ParamsDictionary, TRes, TReq> {
//   auth?: JwtPayload
// }
