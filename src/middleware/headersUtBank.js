const CryptoJS = require("crypto-js");
const secret_key = process.env.ut_secret_key;

const getSignature = (httpMethod, requestPath) => {
    var timestamp = new Date().toISOString();

    const plaint_text = `path=${requestPath}&verb=${httpMethod}&timestamp=${timestamp}`;
    console.log("signature payload :", plaint_text);

    let key = CryptoJS.enc.Utf8.parse(secret_key); 
    let text = CryptoJS.enc.Utf8.parse(plaint_text); 

    encrypted = CryptoJS.AES.encrypt(text, key, { 
            keySize: 128, 
            mode: CryptoJS.mode.ECB, 
            padding: CryptoJS.pad.Pkcs7 
        }); 
    encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    const header = {
      "UT-SIGNATURE": encrypted,
      "UT-TIMESTAMP": timestamp
    };

    return header
}

module.exports = {
    getSignature
}