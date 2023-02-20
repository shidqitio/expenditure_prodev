const { jsonFormat } = require("../utils/jsonFormat");
require("dotenv").config();
const axios = require("axios");
const { QueryTypes,Op } = require("sequelize");
const aplikasigetdata = require("../models/aplikasi_get_data");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth")

exports.register = async(req,res,next)=>{
   
    const {password,username} = req.body
    let encryptedPassword = await bcrypt.hash(password, 10);


    await aplikasigetdata.findOne({where:{username:req.body.username}}).then((data)=>{
        if(data){
            let error = new Error("data pernah diinputkan")
            throw error
        }
        return aplikasigetdata.create({
            username:username,
            password:encryptedPassword
        }).then((create)=>{

            const token = jwt.sign(
                { username },
                process.env.SECRET,
                {
                  expiresIn: "2h",
                }
              );
              let arrcreate = []
              
            //   newc.map((c)=>{
                arrcreate.push({
                    user:create,
                    token:token
                })
            //   })
              jsonFormat(res, "success", "Berhasil menambah data", arrcreate);
        }).catch((err)=>{
            jsonFormat(res, "failed", err.message, []);
        })
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, []);
    })


}

exports.login = async(req,res,next)=>{
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    // return jsonFormat(res, "failed", "validation failed", errors);
    // }
    try{
    const {password,username,ucr,role} = req.body
    let user = await aplikasigetdata.findOne({where:{username:username}});
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
                        { ucr, username,role },
                        process.env.SECRET,
                        {
                          expiresIn: "1h",
                        }
                      );
                      
                      let arrcreate = []
                      
                    //   newc.map((c)=>{
                        arrcreate.push({
                            user:username,
                            token:token
                        })
                        jsonFormat(res, "success", "Berhasil login", arrcreate);
    }else{
        let error = new Error('Username dan Password Salah')
        throw error
    }
}catch(err){
    jsonFormat(res, "failed", err.message, []);
}
}