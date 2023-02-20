const refSbmHonorariumPanitiaKegiatan = require("../../models/ref_sbm_honorarium/ref_sbm_honorarium_panitia_kegiatan");
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
        const SBM = await refSbmHonorariumPanitiaKegiatan.findOne({where:{tugas:req.params.tugas,gol:req.params.gol}})
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const edit = async(req,res,next)=>{
    try{
        const SBM = await refSbmHonorariumPanitiaKegiatan.update({besaran:req.body.besaran,satuan:req.body.satuan},{where:{tugas:req.params.tugas,gol:req.params.gol}})
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

const showunik = async(tugas,gol)=>{
    let data = await refSbmHonorariumPanitiaKegiatan.findOne({where:{tugas:tugas,gol:gol}})
    return data
}

module.exports ={
    index,
    show,
    edit,
    store,
    showunik
}