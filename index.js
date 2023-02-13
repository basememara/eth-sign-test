import { randomBytes } from "crypto";
import { ethers, keccak256, SigningKey } from "ethers";

const index = async () => {
  // Generate random private key
  const privateKey = `0x${randomBytes(32).toString("hex")}`;
  
  // Create public key pair using the ECDSA secp256k1 curve
  const signer = new SigningKey(privateKey);
  const publicKey = signer.publicKey;
  console.log("-------------------");
  console.log("Private key (64 hex):", privateKey);
  console.log("Public key (128 hex):", publicKey);
  console.log("Ethereum address:", ethers.computeAddress(publicKey));

  // Sign message using the ECDSA secp256k1 curve and keccak-256
  const message = "Message for signing";
  const messageBytes = ethers.toUtf8Bytes(message);
  const messageHashed = keccak256(messageBytes);
  const signature = signer.sign(messageHashed);
  console.log("-------------------");
  console.log("Message:", message);
  console.log("Signature :", signature.serialized);
  console.log("Signature (variables):", `{\n\tr: ${signature.r},\n\ts: ${signature.s},\n\tv: ${signature.v}\n}`);
  
  // Verify signature
  const recoveredPublicKey = SigningKey.recoverPublicKey(messageHashed, signature);
  const valid = recoveredPublicKey === publicKey;
  console.log("-------------------");
  console.log("Recovered public key:", recoveredPublicKey);
  console.log("Signature valid?", valid);

  // Tamper with message and verify signature
  const tamperedMessage = "Tampered message";
  const tamperedMessageBytes = ethers.toUtf8Bytes(tamperedMessage);
  const tamperedMessageHashed = keccak256(tamperedMessageBytes);
  const tamperedRecoveredPublicKey = SigningKey.recoverPublicKey(tamperedMessageHashed, signature);
  const tamperedValid = tamperedRecoveredPublicKey === publicKey;
  console.log("-------------------");
  console.log("Message (tampered):", tamperedMessage);
  console.log("Recovered public key (tampered):", tamperedRecoveredPublicKey);
  console.log("Signature valid (tampered)?", tamperedValid);
};

index()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
