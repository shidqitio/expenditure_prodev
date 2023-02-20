const refSbmHonorariumPanitiaKegiatan = require("../../models/ref_sbm_honorarium/ref_sbm_kegiatan_bidang_akademik");
const { jsonFormat } = require("../../utils/jsonFormat");

const index = async(req,res,next)=>{
    try{
        const SBM = await refSbmHonorariumPanitiaKegiatan.findAll()
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err)
    }
}

const show = async(req,res,next) =>{
    try{
        const SBM = await refSbmHonorariumPanitiaKegiatan.findOne({where:{bentuk_kegiatan:req.params.bentuk_kegiatan,sub_kegiatan:req.params.sub_kegiatan,komponen:req.params.komponen,kategori:req.params.kategori}})
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const edit = async(req,res,next)=>{
    try{
        const SBM = await refSbmHonorariumPanitiaKegiatan.update({besaran:req.body.besaran,satuan:req.body.satuan,keterangan:req.body.keterangan},{where:{bentuk_kegiatan:req.params.bentuk_kegiatan,sub_kegiatan:req.params.sub_kegiatan,komponen:req.params.komponen,kategori:req.params.kategori}})
        .then((a)=>{if(a==0){let err = new Error('Data tidak ada yang diubah'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Mengubah Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const store = async(req,res,next)=>{
    try{
        const SBM = await refSbmHonorariumPanitiaKegiatan.create(req.body)
        .then((a)=>{return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menambahkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

module.exports ={
    index,
    show,
    edit,
    store
}