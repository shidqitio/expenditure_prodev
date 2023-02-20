const DokumenModel = require("../../models/trx_dokumen_kirim_ke_panutan");
const kode_aplikasi = process.env.kode_aplikasi
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const { jsonFormat } = require("../../utils/jsonFormat");
const axios = require("axios")

const trigerTTE = async(req,res,next)=>{
    let id_transaksi = req.body.id_transaksi
    try{
    const dataDokumen = await DokumenModel.findOne({where:{id_trx:id_transaksi}})
    let response = await axios .get(`${hostProdevPanutannew}/api/external/get_detail_apl_external/${kode_aplikasi}/${dataDokumen.id_file}/${id_transaksi}`)
    console.log(response.data.data[0].path_final_dok)
    if(response.data.data[0].path_final_dok){
        let link_file = `${hostProdevPanutannew}/${response.data.data[0].path_final_dok}`
         DokumenModel.update({aktif:2,link_file:link_file},{where:{id_trx:id_transaksi}})
    }
    jsonFormat(res,"success","berhasil",[])
    }catch(err){
    next(err)
    }
}
module.exports = {
    trigerTTE
}
