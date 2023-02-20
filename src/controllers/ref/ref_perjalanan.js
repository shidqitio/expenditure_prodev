const refPerjalanan = require("../../models/ref_perjalanan");
const trxPerjalananSBM = require("../../models/trx_perjalanan_sbm")
const SBMTransport = require("../../models/ref_sbm_transpor_perjadin")
const {jsonFormat} = require("../../utils/jsonFormat")
const db = require("../../config/database")

exports.create = (req,res,next) =>{
    refPerjalanan.create(req.body).then((Response)=>{
        jsonFormat(res,"success","Berhasil membuat",Response)
    }).catch((err)=>{
        jsonFormat(res,"failed",err.message,[])
    })
}

exports.createBulk= (req,res,next) =>{
    refPerjalanan.max('kode_trx').then((max)=>{
       return db.transaction().then((t)=>{
            let Permax = max+1
            return refPerjalanan.create({kode_trx:Permax,kode_trx_katagori:req.body.kode_trx_katagori,kode_tempat_asal:req.body.kode_tempat_asal,asal:req.body.asal,
                kode_tempat_tujuan:req.body.kode_tempat_tujuan,tujuan:req.body.tujuan,eselon:req.body.eselon,gol:req.body.gol,transpor:req.body.transpor,ucr:req.body.ucr}
                ,{transaction:t}).then((createPerjalanan)=>{
                    let Permax2 = max+1
                    let dataTrx = req.body.trxSBM.map((sbm)=>{
                        return{
                            kode_trx_perjalanan:Permax2,
                            kode_trx_sbm:sbm.kode_trx_sbm,
                            ucr:req.body.ucr
                        }
                    })
                    return trxPerjalananSBM.bulkCreate(dataTrx,{transaction:t}).then((trx)=>{
                        t.commit()
                        jsonFormat(res,"success","berhasil",trx)
                    })
                }).catch((err2)=>{
                    t.rollback()
                    jsonFormat(res,"success",err2.message,[])
                })
        })
    }).catch((err)=>{
        jsonFormat(res,"success",err.message,[])
    })
}



exports.untukkomponen = (kode_trx_katagori,kode_tempat_asal,kode_tempat_tujuan,Transpor) =>{
    return refPerjalanan.findOne({
      where: {
        kode_trx_katagori:kode_trx_katagori,
        kode_tempat_asal: kode_tempat_asal,
        kode_tempat_tujuan: kode_tempat_tujuan,
        Transpor: Transpor,
      },
      include: {
        model: trxPerjalananSBM,
        as: "htrxsbm",
        include: {
          model: SBMTransport,
          as: "bsbmtranspor",
        },
      },
    }).then((perjalanan)=>{
        if(perjalanan?.htrxsbm.length > 0){

        }
    })
}

exports.forkomponen = (
  req,res,next
) => {
  return refPerjalanan
    .findOne({
      where: {
        kode_trx_katagori: kode_trx_katagori,
        kode_tempat_asal: kode_tempat_asal,
        kode_tempat_tujuan: kode_tempat_tujuan,
        Transpor: Transpor,
      },
      include: {
        model: trxPerjalananSBM,
        as: "htrxsbm",
        include: {
          model: SBMTransport,
          as: "bsbmtranspor",
        },
      },
    })
    .then((perjalanan) => {
     perjalanan.map((jalan)=>{
       jalan.htrxsbm.map((sbm)=>{
        data = {
            
        }
       })
     })
    });
};

