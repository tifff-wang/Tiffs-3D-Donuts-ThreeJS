import { expressjwt as jwt, GetVerificationKey } from "express-jwt";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";
import jwks from "jwks-rsa";

// TODO: set the domain and audience (API Identifier)
const domain = "https://mako-tiffsdonuts.au.auth0.com";
const audience = "https://tiffsdonuts/api";

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${domain}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: audience,
  issuer: `${domain}/`,
  algorithms: ["RS256"],
});

export default checkJwt;

export interface JwtRequest<TReq = any, TRes = any>
  extends Request<ParamsDictionary, TRes, TReq> {
  auth?: JwtPayload;
}
