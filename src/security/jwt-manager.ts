import crypto from 'crypto'
import { SignJWT, jwtVerify } from 'jose'

const ALG = 'RS512'
const issuer = 'FEDORANAToR'

const PRIVATE_KEY_PREFIX = '-----BEGIN ENCRYPTED PRIVATE KEY-----'
const PRIVATE_KEY_SUFFIX = '-----END ENCRYPTED PRIVATE KEY-----'
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const JWT_PASS_PHRASE = process.env.JWT_PASS_PHRASE
const PUBLIC_KEY_PREFIX = '-----BEGIN PUBLIC KEY-----'
const PUBLIC_KEY_SUFFIX = '-----END PUBLIC KEY-----'
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY

async function createToken(jwtPayload: any): Promise<string> {
  return await new SignJWT({ jwtPayload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('12h')
    .setAudience('audience')
    .sign(await getPrivateKey())
}

async function verifyToken(jwtToken: string) {
  try {
    const { payload } = await jwtVerify(
      jwtToken,
      (await getPublicKey()) as any,
      {
        algorithms: [ALG],
        audience: 'audience',
        iss: issuer,
      } as any
    )
    return payload
  } catch (err) {
    console.error(`Failed to verify JWT ${jwtToken} with error: ${err}`)
    return null
  }
}
async function getPrivateKey(): Promise<crypto.KeyObject> {
  const privateKeyString = `${PRIVATE_KEY_PREFIX}\n${JWT_PRIVATE_KEY}\n${PRIVATE_KEY_SUFFIX}`
  return crypto.createPrivateKey({
    key: privateKeyString,
    passphrase: JWT_PASS_PHRASE,
  })
}
async function getPublicKey(): Promise<crypto.KeyObject> {
  const publicKeyString = `${PUBLIC_KEY_PREFIX}\n${JWT_PUBLIC_KEY}\n${PUBLIC_KEY_SUFFIX}`
  return crypto.createPublicKey({ key: publicKeyString })
}

export { createToken, verifyToken }
