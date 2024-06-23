import crypto from 'crypto'

function generateJwtKeys(passphrase: string) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: passphrase,
    },
  })
  console.log('Public Key:')
  console.log(publicKey)
  console.log('Private Key:')
  console.log(privateKey)
}

export { generateJwtKeys }
