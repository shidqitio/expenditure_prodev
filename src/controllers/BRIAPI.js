const { jsonFormat } = require("../utils/jsonFormat");
const BRI = require("../utils/BRI");
const axios = require("axios");
const axiosRetry  = require("axios-retry")
const { QueryTypes,Op,fn,col, DATE } = require("sequelize");
const db = require("../config/database");
const fs = require('fs');
const https = require('https');
const path = require("path");
const request = require('request');
const qs = require('qs');
const TokenBRI = require('../models/token_BRI')
const TrxResponBank = require("../models/trx_respon_bank");
const TrxTransferBRI = require("../models/trx_transfer_BRI");
const CryptoJS = require('crypto-js');
/* FROM BRI */
const client_id = 'u6tJ6Sewgbjr71SxLHGGwGfGFfWHQGwI';
const client_secret = 'P3SkQ408XweP34Y4';
let timestamp = new Date().toISOString();
const remark = "REMARK TEST"
const FeeType = "OUR"
const hostBRI = `https://sandbox.partner.api.bri.co.id`
const hostSiakunPengeluaran = `https://dev-sippp.ut.ac.id:4200/siakun/internal/jurnal/create-pengeluaran-new`
 


/* Generate signature */
function BRIVAgenerateSignature(path, verb, token, timestamp, data, secret) {
  let payloads = `path=${path}&verb=${verb}&token=Bearer ${token}&timestamp=${timestamp}&body=${data}`; 
  var hmacSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(payloads,secret));
  return hmacSignature;
}
/* Generate signature V2*/
function BRIVAgenerateSignatureV2(path, verb, token, data) {
  let payloads = `path=${path}&verb=${verb}&token=Bearer ${token}&timestamp=${timestamp}&body=${data}`; 
  var hmacSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(payloads,client_secret));
  return hmacSignature;
}

/* Generate config*/
function BRIConfig(path,verb,token,data){
  let signature = BRIVAgenerateSignatureV2(path,verb,token,data);

  let BRIConfig = {
    method: verb,
    url: hostBRI+path,
    headers: { 
      'Content-Type': 'application/json', 
      'BRI-Timestamp': timestamp, 
      'BRI-Signature': signature, 
      'Authorization': `Bearer ${token}`, 
    },
    data : data
  }
  return BRIConfig
}

function WaktuSekarang(){
const dt = new Date();
const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
let waktu = `${padL(dt.getMonth()+1)}-${padL(dt.getDate())}-${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`
return waktu
}



exports.ujicoba = async(req,res,next)=>{
  const data = BRI.getToken()
  jsonFormat(res,"success","Berhasil Membuat token", data)
}
// Generate Token 
exports.GetTokenAuth = async(req,res,next)=>{
    let data = qs.stringify({
      'client_id': client_id,
      'client_secret': client_secret
      });
      let config = {
        method: 'post',
        url: 'https://partner.api.bri.co.id/oauth/client_credential/accesstoken?grant_type=client_credentials',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'TS01218f6f=01143418464d58b8bbe02a7fa41cb55c0367a2314cd05b0f1b59d15ad5d0270ce9605d87e27553372b4e04e56fcd3f766da438660c'
        },
        data : data
      };
      

      axios(config)
      .then( (response)=> {
        const Timestampnew = new Date(timestamp).getTime()
        const timestampplus = Timestampnew + 180000000;
        const expired = new Date(timestampplus)
        TokenBRI.create({
            kode_token:1,
            modul_token:"AuthicationBRI",
            access_token:response.data.access_token,
            token_create:timestamp,
            expired_in:expired
        }).then((data)=>{
            jsonFormat(res,"success","Berhasil Membuat token", data.access_token)
        }).catch((err)=>{
            next(err)
        })
        // console.log(JSON.stringify(response.data));
      })
      .catch( (error) => {
        return next(error);
      });
}

// FUND Transfer Sesama BANK Rakyat Indonesia
exports.CekAkun = async(req,res,next) =>{
  //Mengambil Token
  
  const Token = await TokenBRI.findOne({where:{
      modul_token:'AuthicationBRI',token_create:{
          [Op.lt]:timestamp
      },expired_in:{
          [Op.gt]:timestamp
      }
  }, order:[['id_trx','DESC']]})

  //Membuat Kondisi Token
  let access_token
  if(Token === null){
       const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
       access_token = newToken.data.data
  }else{
      access_token = Token.access_token
  }

  //variable deklaire
  let data = ""
  //TIMESTAMP
  
  let config = BRIConfig(`/v3/transfer/internal/accounts?sourceaccount=${req.params.sourceaccount}&beneficiaryaccount=${req.params.beneficiaryaccount}`,"GET",access_token,data )
    

    axios(config)
      .then( (response)=> {
        return jsonFormat(res,"success","check akun", response.data)
        })
      .catch( (error) => {
        return next(error);
      });

}

exports.TransferInternal = async(req,res,next) =>{

    //Mengambil Token
    
    const Token = await TokenBRI.findOne({where:{
        modul_token:'AuthicationBRI',token_create:{
            [Op.lt]:timestamp
        },expired_in:{
            [Op.gt]:timestamp
        }
    }, order:[['id_trx','DESC']]})

    //Membuat Kondisi Token
    let access_token
    if(Token === null){
         const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
         access_token = newToken.data.data
    }else{
        access_token = Token.access_token
    }

    let data = JSON.stringify({
        "NoReferral": req.body.NoReferral,
        "sourceAccount": req.body.sourceAccount,
        "beneficiaryAccount": req.body.beneficiaryAccount,
        "amount": req.body.amount,
        "FeeType": req.body.FeeType,
        "transactionDateTime": req.body.transactionDateTime,
        "remark": req.body.remark
      });

      let config = BRIConfig(`/v3/transfer/internal`,"POST",access_token,data )

      axios(config)
      .then( (response)=> {
        console.log(response)
        return jsonFormat(res,"success","Berhasil Membuat token", response.data)
        // console.log(JSON.stringify(response.data));
      })
      .catch( (error) => {
        console.log(error)
        return next(error);
      });
}

exports.CekStatusTransfer = async(req,res,next) =>{
  //Mengambil Token
  
  const Token = await TokenBRI.findOne({where:{
      modul_token:'AuthicationBRI',token_create:{
          [Op.lt]:timestamp
      },expired_in:{
          [Op.gt]:timestamp
      }
  }, order:[['id_trx','DESC']]})

  //Membuat Kondisi Token
  let access_token
  if(Token === null){
       const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
       access_token = newToken.data.data
  }else{
      access_token = Token.access_token
  }

  //variable deklaire
  let data = ""


  let config = BRIConfig(`/v3/transfer/internal?noreferral=${req.params.noReferral}`,"GET",access_token,data )
   
      
      axios(config)
      .then( (response)=> {
        return jsonFormat(res,"success","Berhasil Mendapatkan ", response.data)
        // console.log(JSON.stringify(response.data));
      })
      .catch( (err) => {
        console.log(err)
        return next(err);
      });
}

// Transfer Antar Bank dari BRI

exports.CekAkunOther = async(req,res,next)=>{
    //Mengambil Token
    
    const Token = await TokenBRI.findOne({where:{
        modul_token:'AuthicationBRI',token_create:{
            [Op.lt]:timestamp
        },expired_in:{
            [Op.gt]:timestamp
        }
    }, order:[['id_trx','DESC']]})

    //Membuat Kondisi Token
    let access_token
    if(Token === null){
         const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
         access_token = newToken.data.data
    }else{
        access_token = Token.access_token
    }
      //variable deklaire
      let data = "";
      let config = BRIConfig(`/accounts?bankcode=${req.params.bankcode}&beneficiaryaccount=${req.params.beneficiaryaccount}`,"GET",access_token,data )
  

  
  axios(config)
      .then( (response)=> {
        return jsonFormat(res,"success","Berhasil Memvalidasi data ", response.data)
      })
      .catch( (err) => {
        return next(err);
      });
}

exports.ShowOtherBank = async(req,res,next) =>{

  //Mengambil Token
  
  const Token = await TokenBRI.findOne({where:{
      modul_token:'AuthicationBRI',token_create:{
          [Op.lt]:timestamp
      },expired_in:{
          [Op.gt]:timestamp
      }
  }, order:[['id_trx','DESC']]})

  //Membuat Kondisi Token
  let access_token
  if(Token === null){
       const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
       access_token = newToken.data.data
  }else{
      access_token = Token.access_token
  }

  //Declair Variable
  let data = "";
    let config = BRIConfig(`/v2/transfer/external/accounts`,"GET",access_token,data )
  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil menampilkan data ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });
}

exports.TransferOther = async(req,res,next) =>{
   //Mengambil Token
   
   const Token = await TokenBRI.findOne({where:{
       modul_token:'AuthicationBRI',token_create:{
           [Op.lt]:timestamp
       },expired_in:{
           [Op.gt]:timestamp
       }
   }, order:[['id_trx','DESC']]})
 
   //Membuat Kondisi Token
   let access_token
   if(Token === null){
        const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
        access_token = newToken.data.data
   }else{
       access_token = Token.access_token
   }
     //variable deklaire 
   let data = JSON.stringify({
    "noReferral": req.body.noReferral,
    "bankCode": req.body.bankCode,
    "sourceAccount": req.body.sourceAccount,
    "beneficiaryAccount": req.body.beneficiaryAccount,
    "beneficiaryAccountName": req.body.beneficiaryAccountName,
    "Amount": req.body.Amount
  });
 

     let config = BRIConfig(`/v2/transfer/external`,"POST",access_token,data )

  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil transfer other bank ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });
}

// Virtual Account

exports.CreateVA = async(req,res,next) =>{
  //Mengambil Token
  
  const Token = await TokenBRI.findOne({where:{
      modul_token:'AuthicationBRI',token_create:{
          [Op.lt]:timestamp
      },expired_in:{
          [Op.gt]:timestamp
      }
  }, order:[['id_trx','DESC']]})

  //Membuat Kondisi Token
  let access_token
  if(Token === null){
       const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
       access_token = newToken.data.data
  }else{
      access_token = Token.access_token
  }

  let data = JSON.stringify({
    "institutionCode": req.body.institutionCode,
    "brivaNo": req.body.brivaNo,
    "custCode": req.body.custCode,
    "nama": req.body.nama,
    "amount": req.body.amount,
    "keterangan": req.body.keterangan,
    "expiredDate": req.body.expiredDate
  });

   
   //SIGNATURE
   let config = BRIConfig(`/v1/briva`,"POST",access_token,data )
  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil membuat VA ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });
  
}

exports.ShowReportTime = async(req,res,next) =>{
  //Mengambil Token
  
  const Token = await TokenBRI.findOne({where:{
      modul_token:'AuthicationBRI',token_create:{
          [Op.lt]:timestamp
      },expired_in:{
          [Op.gt]:timestamp
      }
  }, order:[['id_trx','DESC']]})

  //Membuat Kondisi Token
  let access_token
  if(Token === null){
       const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
       access_token = newToken.data.data
  }else{
      access_token = Token.access_token
  }

  let data = "";
   let config = BRIConfig(`/v1/briva/report/${req.params.institutionCode}/${req.params.brivaNo}/${req.params.startDate}/${req.params.EndDate}`,"GET",access_token,data )
  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil mengecek VA ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });

}

exports.ShowBriva = async(req,res,next) =>{
//Mengambil Token

const Token = await TokenBRI.findOne({where:{
    modul_token:'AuthicationBRI',token_create:{
        [Op.lt]:timestamp
    },expired_in:{
        [Op.gt]:timestamp
    }
}, order:[['id_trx','DESC']]})

//Membuat Kondisi Token
let access_token
if(Token === null){
     const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
     access_token = newToken.data.data
}else{
    access_token = Token.access_token
}

let data = "";

 let config = BRIConfig(`/v1/briva/${req.params.institutionCode}/${req.params.brivaNo}/${req.params.custCode}`,"GET",access_token,data )
  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil menampilkan VA ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });
  
}

exports.DeleteVA = async(req,res,next) =>{
  //Mengambil Token
  
  const Token = await TokenBRI.findOne({where:{
      modul_token:'AuthicationBRI',token_create:{
          [Op.lt]:timestamp
      },expired_in:{
          [Op.gt]:timestamp
      }
  }, order:[['id_trx','DESC']]})

  //Membuat Kondisi Token
  let access_token
  if(Token === null){
       const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
       access_token = newToken.data.data
  }else{
      access_token = Token.access_token
  }

  let data = JSON.stringify({
      "institutionCode": req.body.institutionCode,
      "brivaNo": req.body.brivaNo,
      "custCode": req.body.custCode,
    });

    let config = BRIConfig(`/v1/briva`,"delete",access_token,data )

    axios(config)
    .then( (response)=> {
      return jsonFormat(res,"success","Berhasil Menghapus VA ", response.data)
    })
    .catch( (err) => {
      return next(err);
    });
}

exports.UpdateVA = async(req,res,next) =>{
      //Mengambil Token
    
    const Token = await TokenBRI.findOne({where:{
        modul_token:'AuthicationBRI',token_create:{
            [Op.lt]:timestamp
        },expired_in:{
            [Op.gt]:timestamp
        }
    }, order:[['id_trx','DESC']]})

    //Membuat Kondisi Token
    let access_token
    if(Token === null){
        const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
        access_token = newToken.data.data
    }else{
        access_token = Token.access_token
    }


    let data = JSON.stringify({
      "institutionCode": req.body.institutionCode,
      "brivaNo": req.body.brivaNo,
      "custCode": req.body.custCode,
      "nama": req.body.nama,
      "amount": req.body.amount,
      "keterangan": req.body.keterangan,
      "expiredDate": req.body.expiredDate
    });
    
    //SIGNATURE
    let config = BRIConfig(`/v1/briva`,"PUT",access_token,data )
      
      axios(config)
      .then( (response)=> {
        return jsonFormat(res,"success","Berhasil Merubah VA ", response.data)
      })
      .catch( (err) => {
        return next(err);
      });
}

exports.UpdateStatusVA = async(req,res,next) =>{

    //Mengambil Token
    
    const Token = await TokenBRI.findOne({where:{
        modul_token:'AuthicationBRI',token_create:{
            [Op.lt]:timestamp
        },expired_in:{
            [Op.gt]:timestamp
        }
    }, order:[['id_trx','DESC']]})

    //Membuat Kondisi Token
    let access_token
    if(Token === null){
        const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
        access_token = newToken.data.data
    }else{
        access_token = Token.access_token
    }


    let data = JSON.stringify({
      "institutionCode": req.body.institutionCode,
      "brivaNo": req.body.brivaNo,
      "custCode": req.body.custCode,
      "statusBayar": req.body.statusBayar,
    });
    let config = BRIConfig(`/v1/briva/status`,"PUT",access_token,data )
  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil Merubah Status VA ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });
}

exports.ShowStatusVA = async(req,res,next) =>{

  //Mengambil Token

const Token = await TokenBRI.findOne({where:{
    modul_token:'AuthicationBRI',token_create:{
        [Op.lt]:timestamp
    },expired_in:{
        [Op.gt]:timestamp
    }
}, order:[['id_trx','DESC']]})

//Membuat Kondisi Token
let access_token
if(Token === null){
     const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
     access_token = newToken.data.data
}else{
    access_token = Token.access_token
}

let data = "";

 //variable deklaire
 let path = `	/v1/briva/briva/${req.params.institutionCode}/${req.params.brivaNo}/${req.params.custCode}`
 let verb = "GET"
 let secret = client_secret
 //TIMESTAMP
 
 //SIGNATURE
 let signature = BRIVAgenerateSignature(path,verb,access_token,timestamp,data,secret)

  var config = {
    method: 'get',
    url: `https://sandbox.partner.api.bri.co.id/v1/briva/status/${req.params.institutionCode}/${req.params.brivaNo}/${req.params.custCode}`,
    headers: { 
      'BRI-Timestamp': timestamp, 
      'BRI-Signature': signature, 
      'Authorization': `Bearer ${access_token}`
    }
  };
  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil menampilkan Status VA ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });
}

exports.ShowReportHour = async(req,res,next) =>{
      //Mengambil Token
    
    const Token = await TokenBRI.findOne({where:{
        modul_token:'AuthicationBRI',token_create:{
            [Op.lt]:timestamp
        },expired_in:{
            [Op.gt]:timestamp
        }
    }, order:[['id_trx','DESC']]})

    //Membuat Kondisi Token
    let access_token
    if(Token === null){
        const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
        access_token = newToken.data.data
    }else{
        access_token = Token.access_token
    }

    let data = "";
    let config = BRIConfig(`/v1/briva/report_time/${req.params.institutionCode}/${req.params.brivaNo}/${req.params.startDate}/${req.params.startHour}/${req.params.EndDate}/${req.params.EndHour}`,"GET",access_token,data )
  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil menampilkan Report VA perjam ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });
}

// informasi Mutas

exports.ShowMutasi = async(req,res,next) =>{
  
  //Mengambil Token
  
  const Token = await TokenBRI.findOne({where:{
      modul_token:'AuthicationBRI',token_create:{
          [Op.lt]:timestamp
      },expired_in:{
          [Op.gt]:timestamp
      }
  }, order:[['id_trx','DESC']]})

  //Membuat Kondisi Token
  let access_token
  if(Token === null){
       const newToken = await axios .post(`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`)
       access_token = newToken.data.data
  }else{
      access_token = Token.access_token
  }

  let data = JSON.stringify({
    "accountNumber": req.body.accountNumber,
    "startDate": req.body.startDate,
    "endDate": req.body.endDate
  });
  let config = BRIConfig(`/v2.0/statement`,"POST",access_token,data )
  
  axios(config)
  .then( (response)=> {
    return jsonFormat(res,"success","Berhasil menampilkan info mutasi Rekening ", response.data)
  })
  .catch( (err) => {
    return next(err);
  });
}



// kombinasi API untuk kebutuhan 
exports.transferExpenditure = async(req,res,next)=>{
  try{
  //Mengambil TOKEN
  
  const access_token = await TokenBRI.findOne({where:{
      modul_token:'AuthicationBRI',token_create:{
          [Op.lt]:timestamp
      },expired_in:{
          [Op.gt]:timestamp
      }
  }, order:[['id_trx','DESC']]}).then((Token)=>{
    if(Token === null){
      return axios({method:'POST',
        url:`https://dev-sippp.ut.ac.id:5800/BRI-API/Token-Auth`}).then((newToken)=>{
          return newToken.data.data
        }).catch((err)=>{
          return err.message
        })
    }else{
      return Token.access_token
  }
  }).catch((err)=>{
    throw err.message
  })

  const dataSPM = req.body.dataSPM
  console.log("data SPM",dataSPM);

  let dataRespon = []
  let dataUpdate = ['0']
  /* AWAL LOOPING DATA SPM */
  for(let i = 0;i < dataSPM.length;i++){
  /* Variable dalam looping */
  let kode_surat = dataSPM[i].kode_surat
  let nip = dataSPM[i].nip
  let kode_tempat_asal = dataSPM[i].kode_kota_asal
  let Kode_RKA = dataSPM[i].kode_RKA
  let kode_periode = dataSPM[i].kode_periode
  let noReferral = dataSPM[i].noReferral
  let kode_bank_asal = dataSPM[i].kode_bank_asal
  let sourceAccount = dataSPM[i].no_rekening_asal
  let kode_bank_tujuan = dataSPM[i].kode_bank_tujuan
  let beneficiaryAccount = dataSPM[i].no_rekening_tujuan
  let beneficiaryAccountName = dataSPM[i].nama_pemilik_rekening_tujuan
  let amount = dataSPM[i].amount
  let keteranganTf = dataSPM[i].remark
  let transfer =[]
  let waktutf = WaktuSekarang();
console.log("waktu TF", waktutf)
  /*AWAL KONDISI BANK ASAL*/
  if(kode_bank_asal === "002"){
  
    /*AWAL KONDISI BANK TUJUAN*/
    if(kode_bank_tujuan === "002"){
      
      let data = JSON.stringify({
        "noReferral": noReferral,
        "sourceAccount": sourceAccount,
        "beneficiaryAccount": beneficiaryAccount,
        "amount": amount,
        "FeeType": FeeType,
        "transactionDateTime": waktutf ,
        "remark": keteranganTf
      });
      
      //SIGNATURE
      let config = BRIConfig("/v3/transfer/internal","POST",access_token,data)
      console.log(config)
      transfer = await axios(config).then( async(response)=> {
        let c ={
          "NoReferral":noReferral,
          "ResponseCode": response?.data?.responseCode,
          "ResponseDescription": response?.data?.responseDescription,
          "ErrorDescription": response?.data?.errorDescription,
          "StatusCode":response?.status,
          "Kode_Bank":"002",
          "status":"success"
          }
        let b 
        if(response?.data?.responseCode === '0200'){
          b = noReferral
          let lemparsiakun = await axios .post(hostSiakunPengeluaran,{
          "modul":"Perjalanan Dinas",
          "kode_modul":"M08.01.04",
          "kode_aplikasi":"08",
          "aplikasi":"E-Expenditure",
          "kode_surat":kode_surat,
          "kode_sub_surat":keteranganTf,
          "tanggal_transaksi": WaktuSekarang(),
          "keterangan":`Surat Tugas Perjadin ${keteranganTf}`,
          "tahun":req.body.tahun,
          "akun_bas":"524111",
          "nominal":amount,
          "kode_RKA":kode_RKA,
          "bulan_akhir":kode_periode,
          "norek_aktiva":beneficiaryAccount,
          "norek_pasiva":sourceAccount,
          "remark":keteranganTf,
          "ucr":req.body.ucr
          }).then((data)=>{return data})
        .catch((err)=>{throw err})
        }
        let cb = {
          c:c,
          b:b
        }
        return cb
      })
      .catch( (error) => {
        let c ={
          "NoReferral":noReferral,
          "ResponseCode": error?.data?.responseCode,
          "ResponseDescription": error?.message,
          "ErrorDescription": error?.message,
          "StatusCode":error?.status,
          "Kode_Bank":"002",
          "status":"error"
          }
          let cb = {
            c:c
          }
        return cb;
      });
    }else{
      let data = JSON.stringify({
        "noReferral": noReferral,
        "bankCode": kode_bank_tujuan,
        "sourceAccount": sourceAccount,
        "beneficiaryAccount": beneficiaryAccount,
        "beneficiaryAccountName": beneficiaryAccountName,
        "Amount": amount
      });
        //SIGNATURE
        let config = BRIConfig("/v2/transfer/external","POST",access_token,data)
         transfer = await axios(config).then( async(response)=> {
          let c ={
            "NoReferral":noReferral,
            "ResponseCode": response?.data?.responseCode,
            "ResponseDescription": response?.data?.responseDescription,
            "ErrorDescription": response?.data?.errorDescription,
            "StatusCode":response?.status,
            "Kode_Bank":"002",
            "status":"success"
            }
            let b
            if(response?.data?.responseCode === '0600'){
              b = noReferral
              let lemparsiakun = await axios .post(hostSiakunPengeluaran
                ,{
                "modul":"Perjalanan Dinas",
                "kode_modul":"M08.01.04",
                "kode_aplikasi":"08",
                "aplikasi":"E-Expenditure",
                "kode_surat":kode_surat,
                "kode_sub_surat":keteranganTf,
                "tanggal_transaksi":WaktuSekarang(),
                "keterangan":`Surat Tugas Perjadin  ${keteranganTf}`,
                "tahun":req.body.tahun,
                "akun_bas":"524111",
                "nominal":amount,
                "kode_RKA":kode_RKA,
                "bulan_akhir":kode_periode,
                "norek_aktiva":beneficiaryAccount,
                "norek_pasiva":sourceAccount,
                "remark":keteranganTf,
                "ucr":req.body.ucr
              }).then((data)=>{return noReferral})
            .catch((err)=>{return noReferral})
            }
            let cb = {
              c:c,
              b:b
            }
          return cb
          })
        .catch( (error) => {
          let c ={
            "NoReferral":noReferral,
            "ResponseCode": error?.data?.responseCode,
            "ResponseDescription": error?.message,
            "ErrorDescription": error?.message,
            "StatusCode":error?.status,
            "Kode_Bank":"002",
            "status":"error"
            }
            let cb = {
              c:c
            }
          return cb;
        });
    }
    /*AKHIR KONDISI BANK TUJUAN*/
  }
  /*AKHIR KONDISI BANK ASAL*/
  if(transfer.b){
    dataUpdate.push(transfer.b) 
}
dataRespon.push(transfer.c)
}

 db.transaction().then((t)=>{
  TrxResponBank.bulkCreate(dataRespon,{transaction:t}).then((R)=>{
    TrxTransferBRI.update({where:{NoReferral:{
      [Op.in]:dataUpdate
    }},transaction:t})
    .then((ut)=>{
      t.commit()
    return jsonFormat(res,"success","Berhasil Transaksi Transfer", R)
    })
    .catch((err)=>{
      t.rollback()
      return next(err)
    })
    // t.rollback()
    return jsonFormat(res,"success","Berhasil Transaksi Transfer", R)
  }).catch((err)=>{
    //t.rollback()
    return next(err)
  })
 })

  /* AKHIR LOOPING DATA SPM */
}catch(err){
return next(err)
}
}

