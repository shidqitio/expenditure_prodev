const axios = require("axios")
const Authorize = require("../../models/authorize")
const hostUsman = process.env.hostUsman

const token = (req, res, next) => {
    let token = req.body.token   
    let id_user = req.body.id_user
    let kode_group = req.body.kode_group
    // global._token = token
    
    console.log(token)
    return Authorize.create({
        id_user : id_user, 
        kode_group : kode_group, 
        token : token
    })
    .then((data) => {
        if(!data) {
            console.log("ini data",data)
            const error = new Error("Gagal Simpan Token")
            error.statusCode = 422
            throw error
        }

        return res.json({
            status : "Success", 
            message : "Token Berhasil Disimpan", 
            data : data
        })
    })
    .catch((err) => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });

}

// const token = (req, res, next) => {
//     let token = req.body.token   
    
//     global._token = token
//     if( global._token !== NULL){
//         res.json({
//             status : "Success", 
//             message : "Token Berhasil Diinput", 
//             data : global._token
//         })
//     }
//     else {
//         res.json({
//             status : "Failed", 
//             message : "Token Gagal Diinput"
//         })
//     }
    
// }

const get_token = (req, res, next) => {
    const token = global._token
    try {
        if(!token) {
            const error = new Error("Token Tidak Ada")
            error.statusCode = 422 
            throw error
        }
        return res.json({
            status : "Success", 
            message : "Token Tersimpan", 
            data : token
        })
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
}

const indextes = (req, res, next) => {
    return Authorize.findOne({
        where : {
            id_user : req.body.id_user, 
            kode_group : req.body.kode_group      
        },
        limit : 1, 
        raw : true
    })
    .then((auth) => {
        if(!auth) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422 
            throw error
        }
        console.log(auth)
        console.log(auth.token)
        let data = {
            id_user : req.body.id_user,
            kode_group : req.body.kode_group, 
            token : auth.token 
        }
        let header = {
            Authorization : auth.token
        }
        let data_token = auth.token
        
        return axios.post(`https://be2.ut.ac.id/usmenu`,data, {
            headers : header
        })
        .then((respons) => {
            if(!respons) {
                const error = new Error("Data gagal kirim")
                error.statusCode = 422 
                throw error
            }
          
            Authorize.destroy({
                where : {
                    id_user : req.body.id_user, 
                    kode_group : req.body.kode_group
                }
            })
            .then((del) => {
                if(!del) {
                const error = new Error("Data gagal kirim")
                error.statusCode = 422 
                throw error
                }
                let respon = {
                    data : respons.data.data.data, 
                    aplikasi : respons.data.data.aplikasi,
                    menu : respons.data.data.menu,
                    user : respons.data.data.user, 
                    token_lama : data_token, 
                    token_baru : respons.data.data.token
                }
                console.log(respon)
                return res.json({
                    status : "Success", 
                    message : "Data Berhasil Diinput",
                    data : respon
                })
            })
        })
    })
    .catch((err) => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
}

const auth = (req, res, next) => {
    let data = {
        id_user : global._id ,
        kode_group : global._kodegroup,
        token  : global._tokennew
    }
    axios.post(`${hostUsman}/check-token`, data)
    .then((respons) => {
        console.log("ini reponse",data)
       if(!respons) {
            const error = new Error("Data Gagal Kirim")
            error.statusCode = 422 
            throw error
       }
       console.log(respons.data.data)
       return res.json({
        status : "Success",
        message : "Data Berhasil Diambil",
        data : respons.data
       })
    })
}

module.exports = {token, get_token,  auth, indextes}