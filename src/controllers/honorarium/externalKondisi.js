const axios = require("axios");
const dokumenKirimPanutan = require("../../models/trx_dokumen_kirim_ke_panutan");
const hostProdevPanutan = process.env.hostProdevPanutan
const idAPI = require("../../lang/id-api.json")

const dataLink = async(id_aplikasi,id,id_trx,aktif)=>{
    let response = await axios .get(`${hostProdevPanutan}${idAPI.panutan.detail_apl_external}/${id_aplikasi}/${id}/${id_trx}`)
    .then((a)=>{
        if(a.data.data){
            a.data.data
            let link_file = a.data.data[0].path_final_dok
            if(aktif == 1){
                dokumenKirimPanutan.update({aktif:2},{where:{id_trx:id_trx}})
            }
            return {
                link_file: link_file,
                status_tandatangan: "sudah ditandatangani"
            }
        }else{
            let link_file = a.data.path_final_dok
            let status_tandatangan = a.data.message
            return {
                link_file: link_file,
                status_tandatangan: status_tandatangan
            }
        }
    })
    .catch((err)=>{
        return {
        link_file: err.message,
        status_tandatangan: err.message
    }})
    console.log("rioooo:",response)
    return response
}

module.exports = {
    dataLink
}