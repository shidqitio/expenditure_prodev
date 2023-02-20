const axios = require("axios");
const { jsonFormat } = require("../../utils/jsonFormat");
const hostProdevPanutannew = process.env.hostProdevPanutannew
const idAPI = require("../../lang/id-api.json")

exports.show = async(req,res,next)=>{
    try{
        let response = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.klasifikasi_honor}/${req.params.id}`)
        jsonFormat(res,'success','berhasil',response.data.data)
    }catch(err){
        next(err)
    }
}