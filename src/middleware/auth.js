const axios = require('axios')
const hostUsman = process.env.hostUsman

exports.authenticate = (req,res,next) => {
    let id_user = req.headers.id_user
    let kode_group = req.headers.kode_group
    let tokenLama = req.headers.token_lama
    let tokenBaru = req.headers.token_baru

    let data = {
        id_user : id_user,
        kode_group : kode_group,
        token : tokenBaru
    }
    if(!id_user) {
        res.json({
            code : 401,
            status : "error",
            message : "Id_User Tidak Boleh Kosong"
        })
    }
    else if(!kode_group){
        res.json({
            code : 401,
            status : "error",
            message : "Kode Group Tidak Boleh Kosong"
        })
    }
    else if(!tokenLama){
        res.json({
            code : 401,
            status : "error",
            message : "User Unauthorized"
        })
    }
    else if(!tokenBaru){
        res.json({
            code : 401,
            status : "error",
            message : "User Unauthorized"
        })
    }
    else {
        axios.post(`${hostUsman}/check-token`, data, {
           headers : {
               Authorization : tokenLama
           }
       })
       .then((respons) => {
        console.log("data_usman:",respons.data)
           console.log("Respons Usman", respons.data.status)
           if(!respons) {
               let error = new Error("Data Tidak Ada")
               error.statusCode = 422; 
               throw error
           }
           if(respons.data.status === "failed" || respons.data.status === "error" ) {
              return res.json({
                code : 400,
               status : "error",
               message : respons.data.error[0].msg
               })
           }
           else if(respons.data.status === "success"){
            return next()
           }
           else{
            let error = new Error("Status Tidak Ada")
            error.statusCode = 422; 
            throw error         
           }
       })
       .catch((err) => {
           if(!err.statusCode) {
               err.statusCode = 500;
           }
           next(err)
       })
    }
}