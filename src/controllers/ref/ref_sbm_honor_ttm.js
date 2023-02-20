const refSbmHonorTtm = require("../../models/ref_sbm_honorarium/ref_sbm_honor_ttm");
const { jsonFormat } = require("../../utils/jsonFormat");

const index = async(req,res,next)=>{
    try{
        const SBM = await refSbmHonorTtm.findAll()
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err)
    }
}

const show = async(req,res,next) =>{
    try{
        const SBM = await refSbmHonorTtm.findOne({where:{tugas:req.params.tugas,jenjang:req.params.jenjang,jabatan:req.params.jabatan}})
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const edit = async(req,res,next)=>{
    try{
        const SBM = await refSbmHonorTtm.update({besaran:req.body.besaran,satuan:req.body.satuan},{where:{tugas:req.params.tugas,jenjang:req.params.jenjang,jabatan:req.params.jabatan}})
        .then((a)=>{if(a==0){let err = new Error('Data tidak ada yang diubah'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Mengubah Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const store = async(req,res,next)=>{
    try{
        const SBM = await refSbmHonorTtm.create(req.body)
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