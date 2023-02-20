const axios = require("axios");
const qs = require('qs');
const TokenBRI = require('../models/token_BRI')
const { QueryTypes,Op,fn,col, DATE } = require("sequelize");
const CryptoJS = require('crypto-js');
const client_id = 'u6tJ6Sewgbjr71SxLHGGwGfGFfWHQGwI';
const client_secret = 'P3SkQ408XweP34Y4';

const changeTimezone = (date, timeZone) => {
    const invdate = new Date(date.toLocaleString('en-US', {
      timeZone: timeZone
    }));
  
    return new Date(date.getTime()); // needs to substract
  };

let timestamp = changeTimezone(new Date(), 'Asia/Jakarta').toISOString();

const token = () =>{
    console.log(timestamp);
    const Token =  TokenBRI.findOne({where:{
        token_create:{
            [Op.lt]:timestamp
        },expired_in:{
            [Op.gt]:timestamp
        }
    }, order:[['token_create','DESC']]}).then((Token)=>{
        if(Token == null){
            return axios( {method: 'post',
         url:`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`}).then((newToken)=>{
            return newToken.data.data
         }).catch((err)=>{
            return "new token Error"
         })

        }else{
            return Token.access_token
        }
    }).catch((err)=>{
        return "Token Tidak Bisa Diakses"
    })
}

exports.getToken = (test) =>{
    return token()+test
}
exports.BRIVAgenerateSignature = (path, verb, token, data ) => {
    let payloads = `path=${path}&verb=${verb}&token=Bearer ${token}&timestamp=${timestamp}&body=${data}`; 
    var hmacSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(payloads,client_secret));
    return hmacSignature;
  }

