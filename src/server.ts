// Ref Web: https://medium.com/@lucchesilorenzo/set-up-a-simple-express-js-server-with-typescript-for-rest-apis-9044fee78017
// Install dependencies: npm install express cors morgan helmet ts-patch typescript-transform-paths helmet zod dotenv aws-sdk node-forge bcryptjs uuid
// Install dev dependencies: npm i typescript ts-node ts-node-dev @types/express @types/node @types/morgan @types/cors @eslint/js -D
// Install dev dependencies for linting and prettify: npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin

import https from 'https';
import fs from 'fs';
import forge from 'node-forge';
import path from 'path';
import app from './app';
import env from './validations/env.validation';

// Generating Self Signed Certificates for Dev server
const CERTS_DIR = env.CERTS_DIR;

if (!fs.existsSync(CERTS_DIR)) {
  fs.mkdirSync(CERTS_DIR, { recursive: true });
}

const certPath = path.join(CERTS_DIR, 'dev-cert.pem');
const keyPath = path.join(CERTS_DIR, 'dev-key.pem');

// Check if certificate exists and is valid for at least 30 days
let generateCert = true;
if (fs.existsSync(certPath)) {
  const certData = fs.readFileSync(certPath, 'utf-8');
  const certObj = forge.pki.certificateFromPem(certData);
  const expiryDate = certObj.validity.notAfter;
  const daysRemaining =
    (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  generateCert = daysRemaining < 30;
}

if (generateCert) {
  console.log('Generating new self-signed certificate...');
  const keys = forge.pki.rsa.generateKeyPair(2048);
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  cert.setSubject([{ name: 'commonName', value: 'localhost' }]);
  cert.setIssuer([{ name: 'commonName', value: 'localhost' }]);
  cert.sign(keys.privateKey);

  fs.writeFileSync(certPath, forge.pki.certificateToPem(cert));
  fs.writeFileSync(keyPath, forge.pki.privateKeyToPem(keys.privateKey));
}

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const server = https.createServer(options, app);

server.listen(env.PORT, () => {
  console.log(`Secure server running on https://localhost:${env.PORT}`);
});
