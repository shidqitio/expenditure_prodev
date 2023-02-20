const refPajakHonorarium = require("../../models/ref_sbm_honorarium/ref_pajak_honorarium");
const { jsonFormat } = require("../../utils/jsonFormat");

const index = async(req,res,next)=>{
    try{
        const Pajak = await refPajakHonorarium.findAll()
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",Pajak)
    }catch(err){
        err.statusCode = 404
        next(err)
    }
}

const show = async(req,res,next) =>{
    try{
        const Pajak = await refPajakHonorarium.findOne({where:{golongan:req.params.golongan,status_npwp:req.params.status_npwp}})
        .then((a)=>{if(a==null){let err = new Error('Data tidak ditemukan'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menampilkan Data",Pajak)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const edit = async(req,res,next)=>{
    try{
        const Pajak = await refPajakHonorarium.update({besaran_pajak:req.body.besaran_pajak},{where:{golongan:req.params.golongan,status_npwp:req.params.status_npwp}})
        .then((a)=>{if(a==0){let err = new Error('Data tidak ada yang diubah'); err.statusCode = 400; throw err } return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Mengubah Data",Pajak)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const store = async(req,res,next)=>{
    try{
        const Pajak = await refPajakHonorarium.create(req.body)
        .then((a)=>{return a}).catch((err)=>{throw err})
        return jsonFormat(res,"success","Berhasil Menambahkan Data",Pajak)
    }catch(err){
        err.statusCode = 404
        next(err) 
    }
}

const showunik = async(golongan,status_npwp)=>{
    let data = await refPajakHonorarium.findOne({where:{golongan:golongan,status_npwp:status_npwp}})
    return data
}
const showtrx = async(kode_trx)=>{
    let data = await refPajakHonorarium.findOne({where:{kode_trx:kode_trx}})
    return data
}

module.exports ={
    index,
    show,
    edit,
    store,
    showunik,
    showtrx
}