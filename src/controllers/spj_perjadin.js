const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const SuratTugasPerjadin = require("../models/ref_surat_tugas_perjadin");
const KomponenPerjadin_1 = require("../models/trx_komponen_perjadin_1");
const KomponenPerjadinRealisasi = require("../models/trx_komponen_perjadin_realisasi");
const fileRealisasiPerjadin = require("../models/trx_file_realisasi_perjadin");
const trxSPPD = require("../models/trx_sppd")
const spjPerorang =require("../models/trx_spj_perorang_perjadin");
const { type } = require("express/lib/response");
const { QueryTypes,Op,fn,col } = require("sequelize");
const db = require("../config/database");
const { error } = require("console");
const hostProdevPanutannew = process.env.hostProdevPanutannew
const hostPevita = process.env.hostPevita
const idAPI = require("../lang/id-api.json")

exports.nestedspj = async (req,res,next) => {
    try {
    const filekomponenperjadin = await fileRealisasiPerjadin.findAll({where:{id_surat_tugas:req.params.id_surat_tugas}})
    
    const sumfilekomponen = await fileRealisasiPerjadin.findAll({attributes: [
        'nip','kode_kota_tujuan','kode_komponen_honor',
        [fn('sum', col('biaya')), 'total_biaya'],
      ],where:{id_surat_tugas:req.params.id_surat_tugas},
        group: ['nip','kode_kota_tujuan','kode_komponen_honor'],raw:true})

    const surat = await SuratTugasPerjadin.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas}
    })
    const petugasgroup = await PetugasPerjadinBiaya.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas},
        group:'nip'
    })
    const petugas = await PetugasPerjadinBiaya.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas}
    })
    const Komponen = await KomponenPerjadin_1.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas, kode_komponen_honor:{[Op.not]:4}}
    })
    const KomponenRealisasi = await KomponenPerjadinRealisasi.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas}
    })
    
    let arrsurat = [];
    surat.map((sr)=>{
    let arrpetugasgroup = [];
    petugasgroup.map((s)=>{
       let arrpetugas = [];
       petugas.map((p)=>{
           if(s.nip === p.nip){
           let arrkomponen = [];
           Komponen.map((k)=>{
               if(k.nip === p.nip && k.kode_kota_tujuan === p.kode_kota_tujuan){
                  
                let arrFileKomponen = [];
                   let tbfile = filekomponenperjadin?.filter((p) => p.id_surat_tugas === k.id_surat_tugas && 
                   p.nip === k.nip && p.kode_komponen_honor === k.kode_komponen_honor && p.kode_kota_tujuan === k.kode_kota_tujuan)
                   let biaya_realisasi = 0 
                   sumfilekomponen.map((sfk)=>{
                    if(sfk.nip===k.nip && sfk.kode_kota_tujuan === k.kode_kota_tujuan && k.kode_komponen_honor === sfk.kode_komponen_honor ){
                        biaya_realisasi = sfk.total_biaya
                    }
                   })
                   filekomponenperjadin.map((p)=>{
                    if(p.id_surat_tugas === k.id_surat_tugas && 
                        p.nip === k.nip && p.kode_komponen_honor === k.kode_komponen_honor && p.kode_kota_tujuan === k.kode_kota_tujuan){
                    arrFileKomponen.push({
                       id_trx:p.id_trx,
                       keterangan: p.keterangan,
                       id_surat_tugas:p.id_surat_tugas,
                       nip:p.nip,
                       kode_kota_tujuan:p.kode_kota_tujuan,
                       kode_komponen_honor:p.kode_komponen_honor,
                       tahun: p.tahun,
                       link_file:p.link_file,
                       biaya:p.biaya
                     })}
                   })
                   arrkomponen.push({
                       id_surat_tugas:k.id_surat_tugas,
                       nip:k.nip,
                       kode_komponen_honor:k.kode_komponen_honor,
                       keterangan_komponen:k.keterangan_komponen,
                       kode_tempat_tujuan:k.kode_kota_tujuan,
                       kode_satuan:k.kode_satuan,
                       biaya_perkomponen:k.total,
                       biaya_realisasi: biaya_realisasi,
                       sisa_belanja: k.total-biaya_realisasi,
                        arrlink:arrFileKomponen
                   })
                   
               }
           })
           arrpetugas.push({
               id_surat_tugas: p.id_surat_tugas,
               kode_kata_tujuan:p.kode_kota_tujuan,
               nama_kota_tujuan:p.nama_kota_tujuan,
               kode_kata_tujuan:p.kode_kota_tujuan,
               nama_kota_tujuan:p.nama_kota_tujuan,
               tanggal_pergi:p.tanggal_pergi,
               tanggal_pulang:p.tanggal_pulang,
               lama_perjalanan: p.lama_perjalanan,
               biaya_perperjalanan_petugas_total:p.biaya,
               komponen:arrkomponen
           })
    }
})
       arrpetugasgroup.push({
        id_surat_tugas:s.id_surat_tugas,
        nip:s.nip,
        nama_petugas:s.nama_petugas,
        detail_kota:arrpetugas, 
        })
    })
    arrsurat.push({
        id_surat_tugas: sr.id_surat_tugas,
        id_surat_tugas:sr.id_surat_tugas,
        tanggal_surat_tugas:sr.tanggal_surat_tugas,
        petugas: arrpetugasgroup
    })
})

    
        jsonFormat(res, "success", "Berhasil menambahkan data", arrsurat);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }

}

exports.nestedspjperorang = async (req,res,next) => {
    try{
    const filekomponenperjadin = await fileRealisasiPerjadin.findAll({where:{id_surat_tugas:req.params.id_surat_tugas}})
    const sumfilekomponen = await fileRealisasiPerjadin.findAll({attributes: [
        'nip','kode_kota_asal','kode_komponen_honor',
        [fn('sum', col('biaya')), 'total_biaya'],
      ],where:{id_surat_tugas:req.params.id_surat_tugas},
        group: ['nip','kode_kota_asal','kode_komponen_honor'],raw:true})

    const surat = await SuratTugasPerjadin.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas}
    })
    const petugasgroup = await PetugasPerjadinBiaya.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas},
        group:'nip'
    })
    const petugas = await PetugasPerjadinBiaya.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas}
    })
    const Komponen = await KomponenPerjadin_1.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas, kode_komponen_honor:{[Op.not]:4}}
    })
    const KomponenRealisasi = await KomponenPerjadinRealisasi.findAll({
        where:{id_surat_tugas:req.params.id_surat_tugas}
    })

    

    
    let arrsurat = [];
    surat.map((sr)=>{
    let arrpetugasgroup = [];
    petugasgroup.map((s)=>{
       let arrpetugas = [];
       petugas.map((p)=>{
           if(s.nip === p.nip){
           let arrkomponen = [];
           Komponen.map((k)=>{
               if(k.nip === p.nip && k.kode_kota_asal === p.kode_kota_asal){
                  
                let arrFileKomponen = [];
                   let tbfile = filekomponenperjadin?.filter((p) => p.id_surat_tugas === k.id_surat_tugas && 
                   p.nip === k.nip && p.kode_komponen_honor === k.kode_komponen_honor && p.kode_kota_asal === k.kode_kota_asal)
                   let biaya_realisasi = 0 
                   sumfilekomponen.map((sfk)=>{
                    if(sfk.nip===k.nip && sfk.kode_kota_asal === k.kode_kota_asal && k.kode_komponen_honor === sfk.kode_komponen_honor ){
                        biaya_realisasi = sfk.total_biaya
                    }
                   })
                   filekomponenperjadin.map((p)=>{
                    if(p.id_surat_tugas === k.id_surat_tugas && 
                        p.nip === k.nip && p.kode_komponen_honor === k.kode_komponen_honor && p.kode_kota_asal === k.kode_kota_asal){
                    arrFileKomponen.push({
                       id_trx:p.id_trx,
                       keterangan: p.keterangan,
                       id_surat_tugas:p.id_surat_tugas,
                       nip:p.nip,
                       kode_kota_asal:p.kode_kota_asal,
                       kode_komponen_honor:p.kode_komponen_honor,
                       tahun: p.tahun,
                       link_file:p.link_file,
                       biaya:p.biaya
                     })}
                   })
                   arrkomponen.push({
                       id_surat_tugas:k.id_surat_tugas,
                       nip:k.nip,
                       kode_komponen_honor:k.kode_komponen_honor,
                       keterangan_komponen:k.keterangan_komponen,
                       kode_kota_asal:k.kode_kota_asal,
                       kode_kota_tujuan:k.kode_kota_tujuan,
                       kode_satuan:k.kode_satuan,
                       biaya_perkomponen:k.total,
                       biaya_realisasi: biaya_realisasi,
                       sisa_belanja: k.total-biaya_realisasi,
                    arrlink:arrFileKomponen
                   })
                   
               }
           })
           arrpetugas.push({
               id_surat_tugas: p.id_surat_tugas,
               kode_kata_asal:p.kode_kota_asal,
               nama_kota_asal:p.nama_kota_asal,
               kode_kata_tujuan:p.kode_kota_tujuan,
               nama_kota_tujuan:p.nama_kota_tujuan,
               tanggal_pergi:p.tanggal_pergi,
               tanggal_pulang:p.tanggal_pulang,
               lama_perjalanan: p.lama_perjalanan,
               biaya_perperjalanan_petugas_total:p.biaya,
               komponen:arrkomponen
           })
    }
})
       arrpetugasgroup.push({
        id_surat_tugas:s.id_surat_tugas,
        nip:s.nip,
        nama_petugas:s.nama_petugas,
        detail_kota:arrpetugas, 
        })
    })
    arrsurat.push({
        id_surat_tugas: sr.id_surat_tugas,
        id_surat_tugas:sr.id_surat_tugas,
        tanggal_surat_tugas:sr.tanggal_surat_tugas,
        petugas: arrpetugasgroup
    })
})
        jsonFormat(res, "success", "Berhasil menambahkan data", arrsurat);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }

}

exports.listspjperorang = (req,res,next) =>{
    PetugasPerjadinBiaya.findAll({attributes:{exclude:['ucr','uch','udcr','udch']},include:['surat'],where:{nip:req.params.nip,status_pengusulan:{[Op.in]:["0","1","2","3"]}},group:'id_surat_tugas'}).then((ppbg)=>{
            if(ppbg.length === 0){
            res.statusCode = 404;
            let err = new Error('Data tidak ada')
            throw err
        }
    

        
        jsonFormat(res, "success", "Berhasil menampilkan data", ppbg);
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, []);
    })
}

exports.detailspjperorang = async (req, res, next) => {
  try {
    let ppbg = await PetugasPerjadinBiaya.findAll({
      include: ["surat"],
      where: { nip: req.params.nip, id_surat_tugas: req.params.id_surat_tugas },
      group: "id_surat_tugas",
    });

    let ppb = await PetugasPerjadinBiaya.findAll({
      where: {
        nip: req.params.nip,
        id_surat_tugas: req.params.id_surat_tugas,
      },
    });

    let kp = await KomponenPerjadin_1.findAll({
      where: {
        nip: req.params.nip,
        id_surat_tugas: req.params.id_surat_tugas,
        kode_komponen_honor: { [Op.not]: 4 },
      },
    });

    let frp = fileRealisasiPerjadin.findAll({
      where: {
        nip: req.params.nip,
        id_surat_tugas: req.params.id_surat_tugas,
      },
    });

    let sppd = await trxSPPD.findAll({
      where: {
        nip: req.params.nip,
        kode_surat_tugas: req.params.id_surat_tugas,
      },
    });

    let arrppbg = [];
    ppbg.map((a) => {
      let arrppb = [];
      ppb.map((b) => {
        let arrkp = [];
        let sppdDokumen = [];
        let biayaperorangperjalanan = 0;
        sppd.map((msppd) => {
          if (msppd.kode_kota_tujuan === b.kode_kota_tujuan) {
            sppdDokumen.push(msppd);
          }
        });
        kp.map((c) => {
          let arrfrp = [];
          let biayarealisasi = 0;
          if (c.kode_kota_tujuan === b.kode_kota_tujuan) {
            biayaperorangperjalanan =
              biayaperorangperjalanan + parseInt(c.total);
            frp.map((d) => {
              if (
                c.kode_komponen_honor == d.kode_komponen_honor &&
                c.kode_kota_tujuan == d.kode_kota_tujuan
              ) {
                biayarealisasi = biayarealisasi + parseInt(d.biaya);
                arrfrp.push({
                  id_trx: d.id_trx,
                  keterangan: d.keterangan,
                  link_file: d.link_file,
                  biaya: d.biaya,
                });
              }
            });
            arrkp.push({
              kode_komponen_honor: c.kode_komponen_honor,
              keterangan_komponen: c.keterangan_komponen,
              kode_satuan: c.kode_satuan,
              biaya: c.total,
              realisasi: biayarealisasi,
              fileralisasi: arrfrp,
            });
          }
        });
        if (b.kode_unit_tujuan == "") {
          kode_unit_tujuan = null;
          barcode = null;
        } else {
          kode_unit_tujuan = b.kode_unit_tujuan;
          barcode = b.id_surat_tugas + "-" + b.nip + "-" + b.kode_unit_tujuan;
        }
        arrppb.push({
          kode_provinsi_asal: b.kode_provinsi_asal,
          kode_kota_asal: b.kode_kota_asal,
          nama_kota_asal: b.nama_kota_asal,
          kode_provinsi_tujuan: b.kode_provinsi_tujuan,
          kode_kota_tujuan: b.kode_kota_tujuan,
          nama_kota_tujuan: b.nama_kota_tujuan,
          kode_unit_tujuan: kode_unit_tujuan,
          barcode_sppd: barcode,
          tahun: b.tahun,
          tanggal_pergi: b.tanggal_pergi,
          tanggal_pulang: b.tanggal_pulang,
          lama_perjalanan: b.lama_perjalanan,
          transport: b.transport,
          biaya: biayaperorangperjalanan,
          sppd: sppdDokumen,
          komponen: arrkp,
        });
      });
      arrppbg.push({
        id_surat_tugas: a.id_surat_tugas,
        kode_rka: a.surat.kode_rka,
        kode_periode: a.surat.kode_periode,
        nomor_surat: a.surat.id_surat_tugas,
        nip: a.nip,
        nama_petugas: a.nama_petugas,
        detail: arrppb,
      });
    });

    jsonFormat(res, "success", "Berhasil menampilkan data", arrppbg);
  } catch (err) {
    jsonFormat(res, "failed", err.message, []);
  }
};

exports.listperUnit = (req,res,next)=>{
   
    PetugasPerjadinBiaya.findAll({attributes:{exclude:['ucr','uch','udcr','udch']},include:['surat'],where:{kode_unit_tujuan:req.params.kode_unit_tujuan},group:'id_surat_tugas'}).then((ppbg)=>{
        if(ppbg.length === 0){
        res.statusCode = 404;
        let err = new Error('Data tidak ada')
        throw err
    }
    jsonFormat(res, "success", "Berhasil menampilkan data", ppbg);
}).catch((err)=>{
    jsonFormat(res, "failed", err.message, "satu");
})
}

exports.detailspjperunit = (req,res,next) =>{
     PetugasPerjadinBiaya.findAll({include:['surat'],where:{kode_unit_tujuan:req.params.kode_unit_tujuan,id_surat_tugas:req.params.id_surat_tugas},group:'id_surat_tugas'}).then((data1)=>{
        if(data1.length == 0){
            res.statusCode = 404;
            let err = new error('Data tidak ada')
            throw err
        }
        return PetugasPerjadinBiaya.findAll({where:{kode_unit_tujuan:req.params.kode_unit_tujuan,id_surat_tugas:req.params.id_surat_tugas}}).then((data2)=>{
            let arr1 = []
            data1.map((d1)=>{
                let arr2 = []
                data2.map((d2)=>{
                    if(d1.kode_unit_tujuan == d2.kode_unit_tujuan && d1.id_surat_tugas == d2.id_surat_tugas){
                        arr2.push(d2)
                    }
                })
                arr1.push({
                    "kode_unit_tujuan":d1.kode_unit_tujuan,
                    "id_surat_tugas":d1.id_surat_tugas,
                    "surat":d1.surat,
                    "petugasperjadin":arr2
                })
                jsonFormat(res, "success", "Berhasil menampilkan data", arr1);
            })
        }).catch((err)=>{
            jsonFormat(res, "failed", err.message, "satu");
        })
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, "dua");
    })
}

exports.renderSPJ = async(req,res,next) =>{
    try{
    let dokumen = req.body.dokumen
    let datadokument = {
    'dokumen':req.body.dokumen,
    'scriptHtml':req.body.scriptHtml,
    'id_jenis_surat':req.body.id_jenis_surat,
    'id_jenis_nd':req.body.id_jenis_nd,
    'perihal':req.body.perihal,
    'id_klasifikasi':req.body.id_klasifikasi , 
    'id_trx':req.body.id_trx,
    'sifat_surat':req.body.sifat_surat,
    'id_nomor':req.body.id_nomor,
    'jenis_surat':req.body.jenis_surat,
    'nomor_surat':req.body.nomor_surat,
    'perihal':req.body.perihal,
    'tanggal_surat':req.body.tanggal_surat,
    'nip_penandatangan':req.body.nip_penandatangan,
    'email_penandatangan':req.body.email_penandatangan,
  }

  const gettoken = await axios .post(`${hostPevita}${idAPI.pevita.login}`).catch(function(error){
    jsonFormat(res, "failed", error.message, []);
  });
  const token = gettoken.data["access_token"];
 
let scriptHtml,id_jenis_surat,id_jenis_nd,perihal,id_klasifikasi,id_trx,sifat_surat,nomor_surat,tanggal_surat,nip_penandatangan,email_penandatangan,pdf,
browser,page,buffer,randomchar,charactersLength,folderpath, data,nip_pembuat;
let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
console.log("dokumen length:",dokumen.length)
let arrresponpanutan = [];
          for(let i =0; i<dokumen.length;i++){
            scriptHtml = datadokument.dokumen[i].scriptHtml
           id_jenis_surat = datadokument.dokumen[i].id_jenis_surat
           id_jenis_nd = datadokument.dokumen[i].id_jenis_nd
           perihal = datadokument.dokumen[i].perihal
           id_klasifikasi = datadokument.dokumen[i].id_klasifikasi
           id_trx = datadokument.dokumen[i].id_trx
           sifat_surat = datadokument.dokumen[i].sifat_surat
           id_nomor = datadokument.dokumen[i].id_nomor
           nomor_surat = datadokument.dokumen[i].nomor_surat
           tanggal_surat = datadokument.dokumen[i].tanggal_surat
           nip_pembuat = datadokument.dokumen[i].nip_pembuat
           nip_penandatangan = datadokument.dokumen[i].nip_penandatangan
           email_penandatangan = datadokument.dokumen[i].email_penandatangan
           //render pdf
           arrresponpanutan.push(datadokument.dokumen[i])
             pdf =(
              scriptHtml
            );
           browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox","--use-gl=egl"],headless : true})
           page = await browser.newPage()
          await page.setContent(pdf)
          randomchar = '';
              charactersLength = characters.length;
              for ( let i = 0; i < 15; i++ ) {
                  randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              folderpath = "./src/public/perjadin"
              fs.mkdir(folderpath,function(e){
            });

          buffer = await page.pdf({
                  path : folderpath+'/expsipppper_'+randomchar+'.pdf',
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

              

              await dokumenKirimPanutan.update({link_file:'expsipppper_'+randomchar+'.pdf'},{where:{
                id_trx:id_trx
              }}).catch(function (error){
                  arrresponpanutan.push('error input database')
              })
              

            // kirim ke panutan
              let pathpdf = path.join(__dirname,"../public/perjadin/",'/expsipppper_'+randomchar+'.pdf');
              let fileexist = fs.existsSync(pathpdf)
              console.log("file exist:", fileexist);
              let pdfupload = fs.createReadStream(pathpdf);
            data = new FormData();
            data.append('email', 'expenditure@ecampus.ut.ac.id');
            data.append('password', 'password123');
            data.append('id_aplikasi', '4');
            data.append('id_trx', id_trx);
            data.append('sifat_surat', sifat_surat);
            data.append('nomor_surat', nomor_surat);
            data.append('perihal', perihal);
            data.append('tanggal_surat', tanggal_surat);
            data.append('nip_pembuat',nip_pembuat);
            nip_penandatangan.forEach((item) => data.append("nip_penandatangan[]", item))
            //data.append('nip_penandatangan',nip_penandatangan );
            data.append('email_penandatangan', email_penandatangan);
            data.append('pdf', pdfupload);
            
            var config = {
              method: 'post',
              url: `${hostProdevPanutannew}${idAPI.panutan.send_data}`,
              headers: { 
                 Authorization: `Bearer ${token}`, 
                
                ...data.getHeaders()
              },
              data : data
            };
            
            await axios(config).then(function (response) {
             arrresponpanutan.push(response.data) 
             arrresponpanutan.push({"berhasil":"berhasil 123"}) 
            }).catch(function (error) {
             arrresponpanutan.push({"gagal":"gagal"})
            });
            }
            
            await PetugasPerjadinBiaya.update({nomor_rekening_dipakai:req.body.nomor_rekening_dipakai},{where:{id_surat_tugas:req.body.id_surat_tugas}})
              jsonFormat(res, "success", "berhasil merender", arrresponpanutan);
            }
            catch(error){jsonFormat(res, "failed", error.message, []);}
}

