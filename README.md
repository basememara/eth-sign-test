# Ethereum Sign Test
Sign and verify any message using [Ethers](https://github.com/ethers-io/ethers.js/).

It does the following in sequence:

1. Create private key using `crypto` random bytes
2. Create public key pair using `secp256k1` from Ethers
3. Hash message using `keccak256` from Ethers
4. Key pair signs hashed message to create signature using Ethers
5. Recover public key from hashed message and signature
6. Verify result matches original public key
7. Verify failure of a tampered message

```javascript
// 1
const privateKey = `0x${crypto.randomBytes(32).toString('hex')}`;

// 2
const signer = new ethers.SigningKey(privateKey);
const publicKey = signer.publicKey;

// 3
const message = "Message for signing";
const messageBytes = toUtf8Bytes(message);
const messageHashed = keccak256(messageBytes);

// 4
const signature = signer.sign(messageHashed);

// 5
const recoveredPublicKey = ethers.SigningKey.recoverPublicKey(messageHashed, signature);

// 6
const valid = recoveredPublicKey === publicKey; // true

// 7
const tamperedMessage = "Tampered message";
const tamperedMessageHashed = keccak256(toUtf8Bytes(tamperedMessage));
const tamperedRecoveredPublicKey = SigningKey.recoverPublicKey(tamperedMessageHashed, signature);
const tamperedValid = tamperedRecoveredPublicKey === publicKey; // false
```

## Usage
Run `yarn install && npx node ./` and see similar results:

```
-------------------
Private key (64 hex): 0x37448c145afac9e2b2e1241e25e8c40b61126f3409b6e2f814520f4ac1d24f0f
Public key (128 hex): 0x0442c6eb35ecee5235e0b6d52199cde7833dc558fddf43cc689d807c0c36b3d92e2c05957ce3e18c017841867ee960f810aab6922b3197b43177f52a2e43847335
Ethereum address: 0x4CAcc6cd596C43Dc2Bf8D4E41BbaA8605E5CeaF2
-------------------
Message: Message for signing
Signature : 0x89a2c3a1728a2e23adf2a9dde01f8c389838d0ab5413851b33503ff11090cc9e459bd83833376faaf3007aab52be64d93c649e253961317528978f8a5b2ad66f1b
Signature (variables): {
        r: 0x89a2c3a1728a2e23adf2a9dde01f8c389838d0ab5413851b33503ff11090cc9e,
        s: 0x459bd83833376faaf3007aab52be64d93c649e253961317528978f8a5b2ad66f,
        v: 27
}
-------------------
Recovered public key: 0x0442c6eb35ecee5235e0b6d52199cde7833dc558fddf43cc689d807c0c36b3d92e2c05957ce3e18c017841867ee960f810aab6922b3197b43177f52a2e43847335
Signature valid? true
-------------------
Message (tampered): Tampered message
Recovered public key (tampered): 0x0406d08c1b9305c23aa2a48e9971dac7e432cdfe6e61efe4869bbf0c46740972894f7d2673c3659263b4ca5d2c1144626b449ec4e8035793ba065a92ce486e715a
Signature valid (tampered)? false
```

## Todo
- [ ] Add checksum: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
