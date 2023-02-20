const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const axiosRetry = require("axios-retry")
const { QueryTypes,Op,fn,col,where } = require("sequelize");
const waitingTransfer = require("../models/trx_waiting_list_transfer")
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const SuratTugasPerjadin = require("../models/ref_surat_tugas_perjadin");
const SuratBarjas = require("../models/ref_surat_barjas");
const refSPTD = require("../models/ref_sptd")
const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
const transferExpenditure = require("../models/trx_transfer_expenditure")
const detailTransfer = require("../models/ref_detail_transfer");
const { validationResult } = require("express-validator");
const db = require("../config/database");
const { type } = require("express/lib/response");
const generate = require("../utils/generate");
const fs = require('fs');
//const fsPromise = require('fs/promises');
const puppeteer  = require("puppeteer");
const path = require("path");
const https = require('https');
const { workerData } = require("worker_threads");
const hostutpay = process.env.hostutpay
const hostPevita = process.env.hostPevita
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const hostExpenditure = process.env.hostExpenditure
const idAPI = require("../lang/id-api.json")




exports.create = async(req,res,next)=>{
    let transfer = req.body.transfer;
    try{
        const dataTransfer = await transfer.map((t)=>{
            return {
                kode_nomor_spm:t.kode_nomor_spm,
                nomor_spm:t.nomor_spm,
                nip:t.nip,
                tanggal_spm:t.tanggal_spm,
                nama:t.nama,
                nomor_rekening:t.nomor_rekening,
                nomor_rekening_dipakai:t.nomor_rekening_dipakai,
                nama_bank:t.nama_bank,
                kode_bank:t.kode_bank,
                jumlah:t.jumlah,
                kode_rka:t.kode_rka,
                kode_periode:t.kode_periode,
                tahun:t.tahun,
                pajak_potongan:t.pajak_potongan,
                kode_surat:t.kode_surat,
                sub_surat:t.sub_surat,
                kode_unit:t.kode_unit,
                MAK:t.MAK,
                perihal:t.perihal,
                status:0,
                ucr:t.ucr
            }
        });
        const dataCreate = await waitingTransfer.bulkCreate(dataTransfer).catch((err)=>{throw err})
        jsonFormat(res, "success", "Berhasil menambahkan data", dataCreate);
    }catch(err){
        next(err)
    }
}

exports.listGetAllbystatus = async(req,res,next)=>{
 let statparams = req.params.status;
 let status;
 if(statparams === "statnol"){status = 0}
 else if(statparams === "statsat"){status = 1}
 else if(statparams === "statdua"){status = 2}
 else if(statparams === "stattig"){status = 3}
 else if(statparams === "statemp"){status = 4}
 else if(statparams === "statlim"){status = 5}
 else{return jsonFormat(res, "failed", "Params "+statparams+" : undifine", []);}

waitingTransfer.findAll({where:{status:status}})
.then((r)=>{
    if(r.length===0){
        return jsonFormat(res, "success", "data kosong", r);    
    }
    return jsonFormat(res, "success", "Berhasil menampilkan data", r);
})
.catch((err)=>{return jsonFormat(res, "failed", err, [])});
}

exports.listGetAllbystatusnested = (req,res,next)=>{
    let statparams = req.params.status;
    let status;
    if(statparams === "statnol"){status = 0}
    else if(statparams === "statsat"){status = 1}
    else if(statparams === "statdua"){status = 2}
    else if(statparams === "stattig"){status = 3}
    else if(statparams === "statemp"){status = 4}
    else if(statparams === "statlim"){status = 5}
    else{return jsonFormat(res, "failed", "Params "+statparams+" : undifine", []);}
   
   waitingTransfer.findAll({where:{status:status},
    group: 'nomor_spm'})
   .then((r)=>{
       if(r.length===0){
           return jsonFormat(res, "success", "data kosong", r);    
       }
       waitingTransfer.findAll({attributes:['nomor_spm',[fn('sum', col('jumlah')), 'jumlah']]},{where:{status:status},
        group: 'nomor_spm'}).then((jgp)=>{
            waitingTransfer.findAll({where:{status:status}}).then((child)=>{
                let arrOut = []  
                r.map((rdata)=>{
                    let childOut = []
                     let jumlah_total = 0;
                    jgp.map((jg)=>{
                        if(jgp.nomor_spm === rdata.nomor_spm){
                            // jumlah_total.push(jgp)
                            
                        }
                    })
                    child.map((cdata)=>{
                        if(cdata.nomor_spm===rdata.nomor_spm){
                            childOut.push(cdata)
                            jumlah_total = jumlah_total+cdata.jumlah
                        }
                    }
                    )
                    arrOut.push({
                        nomor_spm:rdata.nomor_spm,
                        tanggal_spm:rdata.tanggal_spm,
                        perihal: rdata.perihal,
                        MAK:rdata.MAK,
                        jumlah_total:jumlah_total,
                        nomor_sptd:rdata.nomor_sptd,
                        childOut:childOut
                    })
                    })
                    return jsonFormat(res, "success", "Berhasil menampilkan data", arrOut);
                })
        })
       
       
   })
   .catch((err)=>{return jsonFormat(res, "failed", err, [])});
   }

exports.getnomor = async (req,res,next) =>{
    const errors = validationResult(req);
if (!errors.isEmpty()) {
    return jsonFormat(res, "failed", "validation failede", errors);
}

 axios .post(`${hostPevita}${idAPI.pevita.login}`).then((apiToken)=>{
    
    if(apiToken.data.access_token){}
        refSPTD.findAll({
            attributes: [             
             [fn('max', col('kode_surat_trx')), 'kode_surat_trx']
            ]
        }).then((fsppd)=>{
           let token = apiToken.data.access_token;
           console.log(token)
           let id_surat = fsppd[0].kode_surat_trx+1 
             axios .post(`${hostPevita}${idAPI.pevita.lat_surat}`,{
             "aplikasi":"expenditure",
            "sifat_surat":req.body.sifat_surat,
            "id_surat": id_surat,
            "id_jenis_surat":req.body.id_jenis_surat,
            "id_jenis_nd":req.body.id_jenis_nd,
            "perihal":req.body.perihal,
            "id_klasifikasi":req.body.id_klasifikasi,
            "id_sub_unit":req.body.id_sub_unit,
            "id_user":req.body.id_user,        
            "nama_pembuat":req.body.ucr,
            "tanggal":req.body.tanggal
        },{ headers: { Authorization: `Bearer ${token}` }})
        .then((dataNomor)=>{
            console.log(dataNomor);
            let nomor = dataNomor.data.nomor
            let id_nomor = dataNomor.data.id_nomor
            db.transaction()
            .then((t)=>{
                return refSPTD.create({
                    kode_nomor:id_nomor,
                    nomor:nomor,
                    nomor_rekening_asal:req.body.nomor_rekening_asal,
                    kode_bank_asal:req.body.kode_bank_asal,
                    ucr:req.body.ucr,
                },{transaction:t})
                .then((createrefSPTD)=>{
                    dokumenKirimPanutan.destroy({where:{
                                katagori_surat:"ALL",
                                kode_unit:req.body.kode_unit,
                                tahun:req.body.tahun,
                                jenis_surat:"SPTD",
                                id_nomor:id_nomor,
                                nomor:nomor
                              },transaction:t})
                              .then((destroyDokument)=>{
                                dokumenKirimPanutan.create({
                                            katagori_surat:"ALL",
                                            id_surat_tugas:id_surat,
                                            kode_unit:req.body.kode_unit,
                                            tahun:req.body.tahun,
                                            jenis_surat:"SPTD",
                                            id_nomor:id_nomor,
                                            tanggal:req.body.tanggal,
                                            nomor:nomor,
                                            aktif:1
                                        },{transaction:t})
                                        .then((createdokumen)=>{
                                           let transfer = req.body.transfer;
                                           let mapTransfer = transfer.map((tr)=>tr.nip+"-"+tr.kode_surat+"-"+tr.sub_surat);
                                           waitingTransfer.update({kode_nomor:id_nomor,nomor_sptd:nomor,status:1,nomor_rekening_dipakai:req.body.nomor_rekening_asal,kode_bank_asal:req.body.kode_bank_asal}
                                            ,{where:[
                                            where(
                                                fn('CONCAT', col('nip'), '-', col('kode_surat'), '-', col('sub_surat')), 
                                                { [Op.in]:mapTransfer } )
                                        ],transaction:t})
                                        .then((updatetrans)=>{
                                            if(updatetrans === 0){
                                                throw Error("Tidak ada Data yang diupdate")
                                            }
                                            t.commit()
                                            return jsonFormat(res, "success", "datatoken", updatetrans)})
                                        }).catch((err)=>{t.rollback();jsonFormat(res, "success", err.message, "gagal update transfer")})
                                        }).catch((err)=>{t.rollback();jsonFormat(res, "success", err.message, "gagal update transfer")})    
                              }).catch((err)=>{t.rollback();jsonFormat(res, "success", err.message, "gagal update transfer")})
                }).catch((err)=>{jsonFormat(res, "success", err.message, "gagal update transfer")})
            }).catch((err)=>{jsonFormat(res, "success", err.message, "gagal update transfer")})
        }).catch((err)=>{jsonFormat(res, "success", err.message, "gagal update transfer")})
 }).catch((err)=>{jsonFormat(res, "success", err.message, "gagal update transfer")})
}

exports.listSPTDByStatus = async(req,res,next)=>{
    let statparams = req.params.status;
    let status;
    if(statparams === "statnol"){status = 0}
    else if(statparams === "statsat"){status = 1}
    else if(statparams === "statdua"){status = 2}
    else if(statparams === "stattig"){status = 3}
    else if(statparams === "statemp"){status = 4}
    else if(statparams === "statlim"){status = 5}
    else{return jsonFormat(res, "failed", "Params "+statparams+" : undifine", []);}
   
   refSPTD.findAll({where:{status:status}})
   .then((r)=>{
       if(r.length===0){
           return jsonFormat(res, "success", "data kosong", r);    
       }
       return jsonFormat(res, "success", "Berhasil menampilkan data", r);
   })
   .catch((err)=>{return jsonFormat(res, "failed", err, [])});
   }

exports.merubahstatus = async(req,res,next) =>{
    const errors = validationResult(req);
if (!errors.isEmpty()) {
    return jsonFormat(res, "failed", "validation failede", errors);
}
   let transfer = req.body.transfer;
    let uch = req.body.uch
                for(let a=0; a<transfer.length;a++){
                updateStatusWaitingTF(transfer[a],transfer[a].status)
                }
                
                try{
                    return jsonFormat(res, "success", "berhasil memperoses",[] )
                }catch(err){
                    jsonFormat(res, "failed", err, [])
                }
   }


exports.listsptdnested = async(req,res,next)=>{
    let statparams = req.params.status;
    let status;
    if(statparams === "statnol"){status = 0}
    else if(statparams === "statsat"){status = 1}
    else if(statparams === "statdua"){status = 2}
    else if(statparams === "stattig"){status = 3}
    else if(statparams === "statemp"){status = 4}
    else if(statparams === "statlim"){status = 5}
    else{return jsonFormat(res, "failed", "Params "+statparams+" : undifine", []);}
    refSPTD.findAll({where:{status:status},includes:{model:dokumenKirimPanutan}}).then((a)=>{
        waitingTransfer.findAll({
            group: 'nomor_spm'})
           .then((r)=>{
               if(r.length===0){
                   return jsonFormat(res, "success", "data kosong", r);    
               }
                    waitingTransfer.findAll().then((child)=>{
                        transferExpenditure.findAll().then((tfe)=>{
                            detailTransfer.findAll().then((dt)=>{
                                let arrOut = []
                                a.map((am)=>{
                                    let dataspm = []
                                    r.map((rdata)=>{
                                        let childOut = []
                                        let jumlah_total = 0;
                                        if(am.kode_nomor === rdata.kode_nomor){
                                            child.map((cdata)=>{
                                                let arrtfbank = []
                                                        if(cdata.nomor_spm===rdata.nomor_spm && am.kode_nomor===cdata.kode_nomor){
                                                            tfe.map((tfem)=>{
                                                                if(cdata.nip===tfem.nip && cdata.kode_surat===tfem.kode_surat && cdata.sub_surat===tfem.kode_sub_surat){
                                                                    
                                                                    let arrdetail = []
                                                                    dt.map((a)=>{
                                                                        if(a.nip===tfem.nip && a.kode_surat===tfem.kode_surat && a.kode_sub_surat===tfem.kode_sub_surat)
                                                                        {arrdetail.push({
                                                                            "unit_bank":a.unit_bank,
                                                                            "waktu_transfer":a.waktu_transfer,
                                                                            "nama_penentrasfer":a.nama_penentrasfer
                                                                        })}
                                                                    })
                                                                    arrtfbank.push(
                                                                    {"nip": tfem.nip,
                                                                    "nama":tfem.nama,
                                                                    "kode_surat": tfem.kode_surat,
                                                                    "kode_sub_surat": tfem.kode_sub_surat,
                                                                    "nomor_rekening": tfem.nomor_rekening,
                                                                    "kode_bank": tfem.kode_bank,
                                                                    "nama_bank": tfem.nama_bank,
                                                                    "nominal": tfem.nominal,
                                                                    "perihal": tfem.perihal,
                                                                    "status": tfem.status,
                                                                    "detail":arrdetail});
                                                                }
                                                            })
                                                            childOut.push({
                                                                "nip": cdata.nip,
                                                                "nama": cdata.nama,
                                                                "nominal": cdata.jumlah,
                                                                "pajak_potongan": cdata.pajak_potongan,
                                                                "kode_surat": cdata.kode_surat,
                                                                "sub_surat": cdata.sub_surat,
                                                                "transfer":arrtfbank
                                                            })
                                                            jumlah_total = jumlah_total+cdata.jumlah
                                                        }
                                                    }
                                                )
                                                dataspm.push({
                                                            nomor_spm:rdata.nomor_spm,
                                                            tanggal_spm:rdata.tanggal_spm,
                                                            perihal: rdata.perihal,
                                                            MAK:rdata.MAK,
                                                            jumlah_total:jumlah_total,
                                                            nomor_sptd:rdata.nomor_sptd,
                                                            childOut:childOut
                                                        })
                                            }
                                            
                                   }
                                    )
                                    arrOut.push({
                                        kode_surat_trx:am.kode_surat_trx,
                                        kode_nomor:am.kode_nomor,
                                        nomor_sptd:am.nomor,
                                        panutan:am.dokumen,
                                        status:am.status,
                                        arrspm:dataspm
                                    })     
                                    
                                })  
                                console.log(a)
                                    return jsonFormat(res, "success", "Berhasil menampilkan data", arrOut);
                            })
                        })
                        
                        
                        })
                
               
               
           })

    }).catch((err)=>{
        return jsonFormat(res, "failed", err, []);
    })
}

exports.sptdbyidnested = async(req,res,next)=>{
    refSPTD.findAll({where:{kode_surat_trx:req.params.kode_surat_trx}}).then((rsptd)=>{
        if(rsptd.length === 0){
            return jsonFormat(res, "failed","data yang dicari tidak ada" ,  [])
        }
        waitingTransfer.findAll({where:{kode_nomor:rsptd[0].kode_nomor, status:2}}).then((wt)=>{
            dokumenKirimPanutan.findAll({where:{id_surat_tugas:req.params.kode_surat_trx}}).then((dok)=>{
                let arrSPTDOutput = []
                rsptd.map((a)=>{
                    let arrwaiting = [];
                    let arrdokumen = [];
                    wt.map((w)=>
                    {arrwaiting.push(w)})
                    dok.map((d)=>{
                        arrdokumen.push(d)
                    })
                    arrSPTDOutput.push({
                        kode_surat_trx:a.kode_surat_trx,
                        kode_nomor:a.kode_nomor,
                        nomor:a.nomor,
                        status:a.status,
                        nomor_rekening_asal:a.nomor_rekening_asal,
                        kode_bank_asal:a.kode_bank_asal,
                        dokumen:arrdokumen,
                        subspm:arrwaiting
                        
                    })
                    return jsonFormat(res, "success", "Berhasil menampilkan data", arrSPTDOutput);
                })
            })
        })
        
    }).catch((err)=>{
       
        return jsonFormat(res, "failed", err,  []);})
}


exports.sptdbyidnestednew = async(req,res,next)=>{
    let dokumentTransfer = await axios .get(`${hostProdevPanutannew}/api/external/get_data_apl_external/4`);
    refSPTD.findAll({where:{kode_surat_trx:req.params.kode_surat_trx}}).then((rsptd)=>{
        if(rsptd.length === 0){
            return jsonFormat(res, "failed","data yang dicari tidak ada" ,  [])
        }
       
        waitingTransfer.findAll({where:{kode_nomor:rsptd[0].kode_nomor},include:['suratwaiting','suratwaitingbarjas']}).then((wt)=>{
            dokumenKirimPanutan.findAll({where:{id_surat_tugas:req.params.kode_surat_trx}}).then((dok)=>{
                
                let arrSPTDOutput = []
                rsptd.map((a)=>{
                    let arrwaiting = [];
                    let arrdokumen = [];
                    wt.map((w)=>
                    {arrwaiting.push(w)})
                    dok.map((d)=>{
                        let link_file = "";
                        let status_tandatangan = "Belum ditandatangani";
                        if(d.aktif === 2){
                            status_tandatangan = "sudah ditandatangani";
                        }
                        // if(dokumentTransfer){
                        //     let dokumenTable = dokumentTransfer.data.data;
                        //     let dokumenFilter = dokumenTable.filter((dt)=>dt.id_trx===d.id_trx);
                            
                        //     if(dokumenFilter.length>0){
                        //         link_file = `${hostProdevPanutannew}/`+dokumenFilter[0].path_final_dok
                        //         status_tandatangan = "sudah ditandatangani";
                        //     }else{
                        //         link_file = `${hostExpenditure}/view-file-komponen-realisasi-sptd/`+d.link_file
                        //     }
                        // }else{
                        //     link_file = `${hostExpenditure}/view-file-komponen-realisasi-sptd/`+d.link_file
                        // }
                        arrdokumen.push({
                        "id_trx": d.id_trx,
                        "katagori_surat": d.katagori_surat,
                        "id_surat_tugas": d.id_surat_tugas,
                        "kode_unit":d.kode_unit,
                        "tahun": d.tahun,
                        "jenis_surat": d.jenis_surat,
                        "id_nomor": d.id_nomor,
                        "nomor": d.nomor,
                        "tanggal": d.tanggal,
                        "status_ditandatangani":status_tandatangan,
                        "link_file": d.link_file})
                        
                    })
                    arrSPTDOutput.push({
                        kode_surat_trx:a.kode_surat_trx,
                        kode_nomor:a.kode_nomor,
                        nomor:a.nomor,
                        status:a.status,
                        nomor_rekening_asal:a.nomor_rekening_asal,
                        kode_bank_asal:a.kode_bank_asal,
                        dokumen:arrdokumen,
                        subspm:arrwaiting
                        
                    })
                    return jsonFormat(res, "success", "Berhasil menampilkan data", arrSPTDOutput);
                })
            })
        })
        
    }).catch((err)=>{   
        return jsonFormat(res, "failed", err,  []);})
    }

exports.rendersptd = async(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return jsonFormat(res, "failed", "validation failede", errors);
        }
      
        let dokumen = req.body.dokumen
        pdf =(
            req.body.scriptHtml
            );
                 browser = await puppeteer.launch(
                    { args: ["--no-sandbox", "--disabled-setupid-sandbox","--use-gl=egl"],headless : true})
                 page = await browser.newPage()
                await page.setContent(pdf)
                characters = '1234567890qwertyuiopasdfghjklzxcvbnm'
                randomchar = '';
                    charactersLength = characters.length;
                    for ( let i = 0; i < 15; i++ ) {
                        randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    folderpath = "./src/public/sptd"
                    fs.mkdir(folderpath,function(e){
                  });
        
                buffer = await page.pdf({
                        path : folderpath+'/sppd_'+randomchar+'.pdf',
                      // paperWidth:8.5,
                      // paperHeight:13,
                      format: 'Legal',
                        printBackground: true,
                        margin: {
                            left: '0px',
                            top: '0px',
                            right: '0px',
                            bottom: '0px'
                        }
                    })
                    await browser.close(); 
                    let link_path = folderpath+'/sppd_'+randomchar+'.pdf'
                    let cek_file = fs.existsSync(link_path)
                    const pathpdf = path.join(__dirname,"../public/sptd/sppd_"+randomchar+".pdf");
                    let filename = "sppd_"+randomchar+".pdf"
                  generate.kirimpanutanSPTD(
                    pathpdf,
                    filename,
                    req.body.sifat_surat,
                    req.body.id_trx,
                    req.body.nomor_surat,
                    req.body.perihal,
                    req.body.tanggal_surat,
                    req.body.nip_pembuat,
                    req.body.nip_penandatangan,
                    req.body.tahun,
                    req.body.kode_nomor_sptd,
                    req.body.kode_surat_trx
                  );
                //     if(cek_file){
                //          // kirim ke panutan
                  
                //   let fileexist = fs.existsSync(pathpdf);
                //   console.log("file exist:", fileexist);
                //   let pdfupload = fs.createReadStream(pathpdf);
                //     data = new FormData();
                //     data.append('email', 'expenditure@ecampus.ut.ac.id');
                //     data.append('password', 'password123');
                //     data.append('id_aplikasi', '4');
                //     data.append('id_trx', req.body.id_trx);
                //     data.append('sifat_surat', req.body.sifat_surat);
                //     data.append('nomor_surat', req.body.nomor_surat);
                //     data.append('perihal', req.body.perihal);
                //     data.append('tanggal_surat', req.body.tanggal_surat);
                //     data.append('nip_pembuat',req.body.nip_pembuat);
                //     req.body.nip_penandatangan.forEach((item) => data.append("nip_penandatangan[]", item))
                //     //data.append('nip_penandatangan',req.body.nip_penandatangan );
                //     data.append('email_penandatangan', req.body.email_penandatangan);
                //     data.append('pdf', pdfupload);
                
                //     //token
                //     const gettoken = await axios .post(`${hostPevita}/utapi/public/api/login?email=expenditure@ecampus.ut.ac.id&password=password123`).catch(function(error){
                //         jsonFormat(res, "failed", error.message, []);
                //       });
                //       const token = gettoken.data["access_token"];


                //         var config = {
                //         method: 'post',
                //         url: `${hostProdevPanutannew}/api/external/send_data`,
                //         headers: { 
                //             Authorization: `Bearer ${token}`, 
                            
                //             ...data.getHeaders()
                //         },
                //         data : data
                //         };
                //     }
                //     console.log("ceeeeeeeeeek",data)
                //      axios(config)
                //     .then((pnt)=>{
                //        // let pathpdf = path.join(__dirname,"../public/sptd/sppd_"+randomchar+".pdf");
                //         fs.unlink(pathpdf, (err) => {console.log("unlink error", err);})
                //         db.transaction()
                //         .then((t)=>{
                //             let link_file = `${hostProdevPanutannew}/archive_external/${req.body.tahun}/E-Expenditure/${pnt.data.id}/${pnt.data.dokumen}`  
                //             return dokumenKirimPanutan.update({link_file:link_file,id_file:pnt.data.id,status:1},{where:{
                //      id_trx:req.body.id_trx},transaction:t
                //     }).then((updateDokumen)=>{
                //         waitingTransfer.update({status:2},{where:{kode_nomor:req.body.kode_nomor_sptd},transaction:t})
                //      .then((updatewait)=>{
                //         if(updatewait == 0){
                //             throw Error("tidak ada data yang dikirim")
                //         }
                //          refSPTD.update({link_file:link_file,id_file:pnt.data.id,status:1},{where:{
                //             kode_nomor:req.body.kode_nomor_sptd,
                //             kode_surat_trx:req.body.kode_surat_trx
                //         }}).then((updaterefSPTD)=>{
                //             t.commit()
                //             jsonFormat(res, "success", "berhasil merender",[] )
                //         }).catch((err)=>{t.rollback();jsonFormat(res, "failed", err.message,  "satu");})
                //      }).catch((err)=>{t.rollback();jsonFormat(res, "failed", err.message,  "dua");})
                //     }).catch((err)=>{jsonFormat(res, "failed", err.message,  "tiga");})
                //     }).catch((err)=>{jsonFormat(res, "failed", err.message,  "empat");})
                // }).catch((err)=>{jsonFormat(res, "failed", err.message,  "lima");})
                jsonFormat(res,"success","berhasil")
            }catch(err){
                jsonFormat(res,"failed",err.message,[])
            }     
}

// exports.rendersptd = async(req,res,next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return jsonFormat(res, "failed", "validation failede", errors);
//     }
  
//     let dokumen = req.body.dokumen
//     pdf =(
//         req.body.scriptHtml
//         );
//              browser = await puppeteer.launch(
//                 { args: ["--no-sandbox", "--disabled-setupid-sandbox","--use-gl=egl"],headless : true})
//              page = await browser.newPage()
//             await page.setContent(pdf)
//             characters = '1234567890qwertyuiopasdfghjklzxcvbnm'
//             randomchar = '';
//                 charactersLength = characters.length;
//                 for ( let i = 0; i < 15; i++ ) {
//                     randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
//                 }
//                 folderpath = "./src/public/sptd"
//                 fs.mkdir(folderpath,function(e){
//               });
    
//             buffer = await page.pdf({
//                     path : folderpath+'/sppd_'+randomchar+'.pdf',
//                   // paperWidth:8.5,
//                   // paperHeight:13,
//                   format: 'Legal',
//                     printBackground: true,
//                     margin: {
//                         left: '0px',
//                         top: '0px',
//                         right: '0px',
//                         bottom: '0px'
//                     }
//                 })
//                 await browser.close(); 
//                 let link_path = folderpath+'/sppd_'+randomchar+'.pdf'
//                 let cek_file = fs.existsSync(link_path)
//                 const pathpdf = path.join(__dirname,"../public/sptd/sppd_"+randomchar+".pdf");
//                 if(cek_file){
//                      // kirim ke panutan
              
//               let fileexist = fs.existsSync(pathpdf);
//               console.log("file exist:", fileexist);
//               let pdfupload = fs.createReadStream(pathpdf);
//                 data = new FormData();
//                 data.append('email', 'expenditure@ecampus.ut.ac.id');
//                 data.append('password', 'password123');
//                 data.append('id_aplikasi', '4');
//                 data.append('id_trx', req.body.id_trx);
//                 data.append('sifat_surat', req.body.sifat_surat);
//                 data.append('nomor_surat', req.body.nomor_surat);
//                 data.append('perihal', req.body.perihal);
//                 data.append('tanggal_surat', req.body.tanggal_surat);
//                 data.append('nip_pembuat',req.body.nip_pembuat);
//                 req.body.nip_penandatangan.forEach((item) => data.append("nip_penandatangan[]", item))
//                 //data.append('nip_penandatangan',req.body.nip_penandatangan );
//                 data.append('email_penandatangan', req.body.email_penandatangan);
//                 data.append('pdf', pdfupload);
            
//                 //token
//                 const gettoken = await axios .post(`${hostPevita}/utapi/public/api/login?email=expenditure@ecampus.ut.ac.id&password=password123`).catch(function(error){
//                     jsonFormat(res, "failed", error.message, []);
//                   });
//                   const token = gettoken.data["access_token"];


//                     var config = {
//                     method: 'post',
//                     url: `${hostProdevPanutannew}/api/external/send_data`,
//                     headers: { 
//                         Authorization: `Bearer ${token}`, 
                        
//                         ...data.getHeaders()
//                     },
//                     data : data
//                     };
//                 }
//                 console.log("ceeeeeeeeeek",data)
//                  axios(config)
//                 .then((pnt)=>{
//                    // let pathpdf = path.join(__dirname,"../public/sptd/sppd_"+randomchar+".pdf");
//                     fs.unlink(pathpdf, (err) => {console.log("unlink error", err);})
//                     db.transaction()
//                     .then((t)=>{
//                         let link_file = `${hostProdevPanutannew}/archive_external/${req.body.tahun}/E-Expenditure/${pnt.data.id}/${pnt.data.dokumen}`  
//                         return dokumenKirimPanutan.update({link_file:link_file,id_file:pnt.data.id,status:1},{where:{
//                  id_trx:req.body.id_trx},transaction:t
//                 }).then((updateDokumen)=>{
//                     waitingTransfer.update({status:2},{where:{kode_nomor:req.body.kode_nomor_sptd},transaction:t})
//                  .then((updatewait)=>{
//                     if(updatewait == 0){
//                         throw Error("tidak ada data yang dikirim")
//                     }
//                      refSPTD.update({link_file:link_file,id_file:pnt.data.id,status:1},{where:{
//                         kode_nomor:req.body.kode_nomor_sptd,
//                         kode_surat_trx:req.body.kode_surat_trx
//                     }}).then((updaterefSPTD)=>{
//                         t.commit()
//                         jsonFormat(res, "success", "berhasil merender",[] )
//                     }).catch((err)=>{t.rollback();jsonFormat(res, "failed", err.message,  "satu");})
//                  }).catch((err)=>{t.rollback();jsonFormat(res, "failed", err.message,  "dua");})
//                 }).catch((err)=>{jsonFormat(res, "failed", err.message,  "tiga");})
//                 }).catch((err)=>{jsonFormat(res, "failed", err.message,  "empat");})
//             }).catch((err)=>{jsonFormat(res, "failed", err.message,  "lima");})
            
// }

exports.getPrimaryKey = async(req,res,next) =>{
    try{
        const waiting = await waitingTransfer.findOne({where:{nip:req.params.nip, kode_surat: req.params.kode_surat,sub_surat:req.params.kode_sub_surat}}).then((a)=>{
            if(a === null){
                throw new Error('Data Tidak Ada')
            }
            return a
        })

        let pegawai,surat
        if(waiting.perihal === 'Perjadin'){
        const pegawai = await PetugasPerjadinBiaya.findOne({where:{nip:req.params.nip, id_surat_tugas: req.params.kode_surat,kode_kota_tujuan:req.params.kode_sub_surat}}).then((a)=>{
            if(a === null){
                throw new Error('Data Tidak Ada')
            }
            return a
        })
        const surat = await SuratTugasPerjadin.findOne({where:{id_surat_tugas:req.params.kode_surat}}).then((a)=>{
            if(a === null){
                throw new Error('Data Tidak Ada')
            }
            return a
        })
    }
    else if(waiting.perihal === 'barjas'){
        let arrSubsurat = waiting.sub_surat.split(".");

        const surat = await SuratBarjas.findOne({where:{kode_permintaan:req.params.kode_surat, aplikasi:arrSubsurat[0]}}).then((a)=>{
            if(a === null){
                throw new Error('Data Tidak Ada')
            }
            return a
        })
    }

        let tambahan = ""
        if(waiting.status === "4"){
            tambahan = await axios.get(`${hostutpay}/response/show/${waiting.kode_bank_asal}/${waiting.NoReferral}`).then((Response)=>{
            return Response.data.data
            }).catch((err)=>{return err.message})
        }else if(waiting.status === "5"){
            tambahan = await axios.get(`${hostutpay}/transaksi/show/${waiting.kode_bank_asal}/${waiting.NoReferral}`).then((Response)=>{
                return Response.data.data
                }).catch((err)=>{return err.message})
        }

        let response = {waiting:waiting,pegawai:pegawai,surat:surat,tambahan:tambahan}

        jsonFormat(res,"success","Berhasil menampilkan data",response);
    }catch(error){
        next(error)
    }
}

exports.listNestedPerUnit = async(req,res,next)=>{
    let params = req.params
    try{
      const waitingGroup = await waitingTransfer.findAll({where:{kode_unit:params.kode_unit},group: 'nomor_spm'})
      const waitingData = await waitingTransfer.findAll({where:{kode_unit:params.kode_unit}})

      const output = await waitingGroup.map((wg)=>{
        let sum = 0
        let wd = waitingData.filter((wd)=>wg.nomor_spm === wd.nomor_spm)
        let total = waitingData.filter((wd)=>wg.nomor_spm === wd.nomor_spm).map((a)=>{
            sum += a.jumlah
        })
        return {
            nomor_spm:wg.nomor_spm,
            tanggal_spm:wg.tanggal_spm,
            perihal: wg.perihal,
            MAK:wg.MAK,
            akun_bas_realisasi: wg.akun_bas_realisasi,
            nomor_sptd:wg.nomor_sptd,
            total:sum,
            childOut:wd
        }
      })
      return jsonFormat(res, "success", "Berhasil menampilkan data", output);

    }catch(err){
        next(err)
    }
}

exports.passUnit = async(req,res,next)=>{
try{
let datawaiting = req.body.datawaiting
let dataConcat = datawaiting.map((d)=>d.nip+d.kode_surat+d.sub_surat)
let jumlahData = await waitingTransfer.count({where:{[Op.and]:[where(fn("CONCAT",col("nip"),col("kode_surat"),col("sub_surat")),{[Op.in]:dataConcat}),{status:2}]}})
if(jumlahData !== datawaiting.length){
    throw new Error("Data Tidak match dengan database");
}

let dataUpdate = await datawaiting.map((dw)=>{
    return updateStatusWaitingTF(dw,3)
})

return jsonFormat(res, "success", "berhasil memperoses",dataUpdate )

}catch(err){
    next(err)
}
}
const updateStatusWaitingTF = (data,status)=>{
    return waitingTransfer.update({status:status,uch:data.uch},{where:{nip:data.nip,kode_surat:data.kode_surat,sub_surat:data.sub_surat}}).then((a)=>{return a})
}

