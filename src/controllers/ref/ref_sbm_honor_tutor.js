const refSBMHonorTutor = require("../../models/ref_sbm_honorarium/ref_sbm_honor_tutor");
const { jsonFormat } = require("../../utils/jsonFormat");

const index = async(req,res,next)=>{
    try{
        const SBM = await refSBMHonorTutor.findAll()
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err)
    }
}

const show = async(req,res,next) =>{
    try{
        const SBM = await refSBMHonorTutor.findOne({where:{jenjang_ngajar:req.params.jenjang_ngajar}})
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const edit = async(req,res,next)=>{
    try{
        const SBM = await refSBMHonorTutor.update({besaran:req.body.besaran,uch:req.body.uch},{where:{jenjang_ngajar:req.params.jenjang_ngajar}})
        .then((a)=>{if(a==0){let err = new Error('Data tidak ada yang diubah'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Mengubah Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const store = async(req,res,next)=>{
    try{
        const SBM = await refSBMHonorTutor.create(req.body)
        .then((a)=>{return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menambahkan Data",SBM)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const showunik = async(body,data)=>{
    let response = await refSBMHonorTutor.findOne({where:{kode_klasifikasi:body.kode_klasifikasi,katagori:data.katagori,tugas:data.tugas,jenjang:data.jenjang,gol:data.gol,eselon:data.eselon,jabatan:data.jabatan,}})
    return response
}

module.exports ={
    index,
    show,
    edit,
    store,
    showunik
}