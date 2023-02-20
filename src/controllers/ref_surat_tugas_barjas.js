  const axios = require("axios");
  const {Op} = require("sequelize")
  const { jsonFormat } = require("../utils/jsonFormat");
  const db = require("../config/database");
  const SuratBarjas = require("../models/ref_surat_barjas");
  const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
  const { validationResult } = require("express-validator");
  const request = require("request");
  const hostProdevPanutan = process.env.hostProdevPanutan
  const hostProdevPanutannew = process.env.hostProdevPanutannew
  const hostEbudgeting = process.env.hostEbudgeting
  const hostEbudgeting2 = process.env.hostEbudgeting2
  const hostExpenditure = process.env.hostExpenditure
  const hostPevita = process.env.hostPevita
  const hostSibela = process.env.hostSibela
  const idAPI = require("../lang/id-api.json")
  const fs = require('fs');
  //const fsPromise = require('fs/promises');
  const puppeteer  = require("puppeteer");
  const path = require("path");
  const https = require('https');
  const FormData = require('form-data');
  const generate = require("../utils/generate");

  exports.allpanutanBarjas = async (req, res, next) => {
      await axios
        .get(`${hostSibela}${idAPI.sibela.permintaan}`)
        .then((r) => {
          let panutan = [];
          for(const key in r.data.permintaan){
              const mappedData = {
                ...r.data.permintaan[key]
              };
              panutan.push(mappedData);
            }
          jsonFormat(res, "success", "Berhasil menampilkan data", panutan);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    exports.detailbarjaspanutan = async (req, res, next) => {
      await axios
        .get(`${hostSibela}${idAPI.sibela.permintaan}`)
        .then((r) => {
          let panutan = [];
          for(const key in r.data.permintaan){
              const mappedData = {
                ...r.data.permintaan[key]
              };
              panutan.push(mappedData);
            }
            let permintaan_id = req.params.id_permintaan
            const panutanFilter = panutan.filter((pan)=> ""+pan.id_permintaan === permintaan_id);
          jsonFormat(res, "success", "Berhasil menampilkan data", panutanFilter);
        })
        .catch((err) => {
          jsonFormat(res, "failed", err.errors, []);
        });
    };

    exports.getdetailpembayaran = async (req, res, next) => {
      await axios
        .get(`${hostSibela}${idAPI.sibela.pembayaran}/${req.params.id_level}/${req.params.id_permintaan}`)
        .then((r) => {
          jsonFormat(res, "success", "Berhasil menampilkan data", r.data);
        })
        .catch((err) => {
          jsonFormat(res, "failed", err.errors, []);
        });
    };

    exports.nestedfrompanutan = async (req,res, next) =>{
      await axios
      .get(`${hostSibela}${idAPI.sibela.permintaan}`)
      .then((r) => {
        let panutan = [];
        for(const key in r.data.permintaan){
            const mappedData = {
              ...r.data.permintaan[key]
            };
            panutan.push(mappedData);
          }
          let permintaan_id = req.params.id_permintaan
          const panutanFilter = panutan.filter((pan)=> ""+pan.id_permintaan === permintaan_id);
          console.log("panutan filter:",panutanFilter.id_level)
        axios .get(`${hostSibela}${idAPI.sibela.pembayaran}/${panutanFilter[0].id_level}/${permintaan_id}`).then((p)=>{
          let output =  []
        pembayaran = p.data.pembayaran
        panutanFilter.map((pf)=>
        {
          output.push({
            "id_permintaan": pf.id_permintaan,
            "nama_permintaan": pf.nama_permintaan,
            "unit_kerja": pf.uni_kerja,
            "nama_vendor": pf.nama_vendor,
            "jenis_belanja": pf.jenis_belanja,
            "total": pf.total,
            "id_unit_sub": pf.id_unit_sub,
            "id_level": pf.id_level,
            "pembayaran":pembayaran
          })
        }
        )
          jsonFormat(res, "success", "Berhasil menampilkan data", output);
        })
      })
      .catch((err) => {
        jsonFormat(res, "failed", err, []);
      });
  };

  exports.nestedlistfrompanutan = async (req,res, next) =>{
    await axios
        .get(`${hostSibela}${idAPI.sibela.permintaan}`)
        .then((r) => {
          let panutan = [];
          for(const key in r.data.permintaan){
              const mappedData = {
                ...r.data.permintaan[key]
              };
              panutan.push(mappedData);
            }

            let detail = []
            for(let a = 0;a<panutan.length;a++){
            axios .get(`${hostSibela}${idAPI.sibela.pembayaran}/${panutan[a].id_level}/${panutan[a].id_permintaan}`).then((pem)=>{
                  
              detail.push(pem.data.pembayaran);
                
                console.log("permintaan",pem)
              }).catch()
            }
            let output = []
            panutan.map((pf)=>{
              let pembayaran = []
              detail.map((d)=>{
              pembayaran.push(d)  
              })
              output.push({
                "id_permintaan": pf.id_permintaan,
                "nama_permintaan": pf.nama_permintaan,
                "unit_kerja": pf.uni_kerja,
                "nama_vendor": pf.nama_vendor,
                "jenis_belanja": pf.jenis_belanja,
                "total": pf.total,
                "id_unit_sub": pf.id_unit_sub,
                "id_level": pf.id_level,
                "pembayaran":pembayaran
              })
            })
            jsonFormat(res, "success", "Berhasil menampilkan data", output);
        })
        .catch((err) => {
          jsonFormat(res, "failed", err, []);
        });
    
  };

  exports.nestedAll = async(req,res,next) =>{
    
    await axios .get(`${hostSibela}${idAPI.sibela.pembayaran}`).then((data)=>{
      let dataPembayaran = data.data.pembayaran

      let panutan = dataPembayaran.filter(item => item.length !== 0)
      let panutan1 = []
      panutan.map((item) => {
        item.map((data)=>{
          data.nama_aplikasi = "SIBELA"
          panutan1.push(data)
        })
      });
      jsonFormat(res, "success", "Berhasil menampilkan data", panutan1);
    }).catch((err) => {
      jsonFormat(res, "failed", err.message, []);
    })

    }

    exports.panutanexcludeexpenditure = async(req,res,next) =>{
    
      const dataexp = await SuratBarjas.findAll({attributes:['kode_permintaan']},{where:{tahun:req.params.tahun}})
      let arrdata = [0]
      dataexp.map((d)=>{arrdata.push(d.kode_permintaan)}) 

      await axios .get(`${hostSibela}${idAPI.sibela.pembayaran}`).then((data)=>{
        let dataPembayaran = data.data.pembayaran
    
        let panutan = dataPembayaran.filter(item => item.length !== 0)
        let panutan1 = []
        panutan.map((item) => {
          item.map((data)=>{
            data.nama_aplikasi = "SIBELA"
            if(!arrdata.includes(data.id_permintaan)){
            panutan1.push(data)}
          })
        });
        jsonFormat(res, "success", "Berhasil menampilkan data", panutan1);
      }).catch((err) => {
        jsonFormat(res, "failed", err.message, []);
      })
    
      }

    exports.detailBarjas = async(req,res,next) =>{
      const dokumentasi = await dokumenKirimPanutan.findAll({where:{id_surat_tugas:req.params.id_permintaan}});
      await axios .get(`${hostSibela}${idAPI.sibela.pembayaran}`).then((data)=>{
        let dataPembayaran = data.data.pembayaran
    
        let panutan = dataPembayaran.filter(item => item.length !== 0)
        let panutan1 = []
        panutan.map((item) => {
          item.map((data)=>{
            panutan1.push(data)
          })
        });
        let panutan2 = panutan1.find(item => item.id_permintaan === parseInt(req.params.id_permintaan) && item.id_kontrak === parseInt(req.params.id_kontrak))
        panutan2.spm = dokumentasi.length
        jsonFormat(res, "success", "Berhasil menampilkan data", panutan2);
      }).catch((err) => {
        jsonFormat(res, "failed", err.message, []);
      })    
      }

      exports.allexpenditure = async(req,res,next)=>{
        await SuratBarjas.findAll().then((data)=>{
          if(data.length==0){
            throw Error('data kosong')
          }
          jsonFormat(res,"success","berhasil menampilkan data", data);
        }).catch((err)=>{
          jsonFormat(res,"failed",err.message, []);
        })
      }

    exports.nestedexpenditure = async(req,res,next)=>{
        await SuratBarjas.findOne({where:{kode_permintaan: req.params.kode_permintaan,
          kode_kontrak: req.params.kode_kontrak},include:{
            model:dokumenKirimPanutan,
            where:{katagori_surat:"SPM-suratbarjas",
            id_surat_tugas:req.params.kode_permintaan},
            require:true
          }}).then((data)=>{
          if(data==null){
            throw Error('data kosong')
          }
          jsonFormat(res,"success","berhasil menampilkan data", data);
        }).catch((err)=>{
          jsonFormat(res,"failed",err.message, []);
        })
      }

      exports.transferdata = async(req,res,next) =>{
        try{
        await axios .post(`${hostPevita}${idAPI.pevita.login}`).then((apiToken)=>{
          if(apiToken.data.access_token){
        let token = apiToken.data.access_token
        if(token === null){
          throw Error("token tidak didapat")
        }
        return axios .post(`${hostPevita}${idAPI.pevita.lat_surat}`,{
              "aplikasi":"expenditure",
              "sifat_surat":"b",
              "id_surat": req.body.kode_permintaan,
              "id_jenis_surat":req.body.id_jenis_surat,
              "id_jenis_nd":req.body.id_jenis_nd,
              "perihal":"SPM-suratbarjas",
              "id_klasifikasi":req.body.kode_klasifikasi,
              "id_sub_unit":req.body.kode_sub_unit,
              "id_user":req.body.ucr,        
              "nama_pembuat":req.body.nama_pembuat,
              "tanggal":req.body.tanggal_buat
        },{ headers: { Authorization: `Bearer ${token}` }}).then((apiNomor)=>{
          let nomor = apiNomor.data
          if(nomor === null){
            throw Error("nomor tidak didapat")
          }
          return db.transaction().then((t)=>{
              dokumenKirimPanutan.destroy({where:{katagori_surat:"SPM-suratbarjas",
              id_surat_tugas:req.body.kode_permintaan,
              kode_unit:req.body.kode_unit,
              tahun:req.body.tahun},transaction:t}).then((del)=>{
                dokumenKirimPanutan.create({
                  katagori_surat:"SPM-suratbarjas",
                  id_surat_tugas:req.body.kode_permintaan,
                  kode_unit:req.body.kode_unit,
                  tahun:req.body.tahun,
                  tanggal:req.body.tanggal_buat,
                  jenis_surat:"SPM",
                  id_nomor:nomor.id_nomor,
                  nomor:nomor.nomor,
                  aktif:1
              },{transaction:t}).then((dataDokumen)=> {
                SuratBarjas.create({
                  kode_permintaan: req.body.kode_permintaan,
                  kode_kontrak: req.body.kode_kontrak,
                  kode_vendor: req.body.kode_vendor,
                  tahun: req.body.tahun,
                  kode_rup: req.body.kode_rup,
                  nomor_rup: req.body.nomor_rup,
                  kode_rka: req.body.kode_rka,
                  kode_periode: req.body.kode_periode,
                  no_rekening_tujuan: req.body.no_rek,
                  pemilik_rekening:req.body.pemilik_rekening,
                  nomor_rekening_dipakai:req.body.nomor_rekening_dipakai,
                  kode_bank_tujuan: req.body.kode_bank,
                  nama_bank: req.body.nama_bank,
                  kode_kriteria: req.body.kode_kriteria,
                  kode_jenis_pembayaran: req.body.kode_jenis_pembayaran,
                  nama_permintaan: req.body.nama_permintaan,
                  metode_pembayaran: req.body.metode_pembayaran,
                  persen: req.body.persen,
                  total: req.body.total,
                  status_pembayaran: req.body.status_pembayaran,
                  path_spp: req.body.path_spp,
                  path_sptb: req.body.path_sptb,
                  path_rk: req.body.path_rk,
                  kode_unit: req.body.kode_unit,
                  kode_sub_unit: req.body.kode_sub_unit,
                  tanggal_permintaan: req.body.tanggal_permintaan,
                  nomor_surat_tugas:req.body.nomor_surat_tugas,
                  kode_status: 4,
                  ucr: req.body.ucr,
                },{transaction:t}).then((createBarjas)=>{
                  t.commit()
                  jsonFormat(res, "success", "berhasil membuat nomor", createBarjas) 
                }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "gak bisa create barjas")})
              }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "gak bisa create dokumen terkirim")})
              }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "error delete")})     
          }).catch((err)=>{ jsonFormat(res, "failed", err.message, "API get nomor error")})
        }).catch((err)=>{ jsonFormat(res, "failed", err.message, "API get nomor error")})
      } else{
      let err = new Error("API pevita tidak merespon")
      throw err
      }
      }).catch((err)=>{ jsonFormat(res, "failed", err.message, "dua")})
    }catch(err){
      next(err)
    }
    }

    exports.renderkrirmspm = async(req,res,next) =>{
      try{
      let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      pdf =(
        req.body.scriptHtml
      );
      browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox","--use-gl=egl"],headless : true})
      page = await browser.newPage()
      await page.setContent(pdf)
      randomchar = '';
        charactersLength = characters.length;
        for ( let i = 0; i < 15; i++ ) {
            randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        folderpath = "./src/public/barjas"
        fs.mkdir(folderpath,function(e){
      });
      buffer = await page.pdf({
            path : folderpath+'/expsipppbj_spm_'+randomchar+'.pdf',
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
          // kirim ke panutan
          let filename = 'expsipppbj_spm_'+randomchar+'.pdf'
          let pathpdf = path.join(__dirname,"../public/barjas/",'/expsipppbj_spm_'+randomchar+'.pdf');
        generate.kirimpanutan(pathpdf,filename,req.body.sifat_surat,req.body.id_trx,req.body.nomor_surat,req.body.perihal,req.body.tanggal_surat,req.body.nip_pembuat,req.body.nip_penandatangan,req.body.tahun)
        jsonFormat(res, "success", "berhasil membuat dokumen", [])
      }catch(err){
        jsonFormat(res,'failed',err.message,[])
      }
    }
    // exports.renderkrirmspm = async(req,res,next) =>{
    // try{
    // let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // pdf =(
    //   req.body.scriptHtml
    // );
    // browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox","--use-gl=egl"],headless : true})
    // page = await browser.newPage()
    // await page.setContent(pdf)
    // randomchar = '';
    //   charactersLength = characters.length;
    //   for ( let i = 0; i < 15; i++ ) {
    //       randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
    //   }
    //   folderpath = "./src/public/barjas"
    //   fs.mkdir(folderpath,function(e){
    // });
    // buffer = await page.pdf({
    //       path : folderpath+'/expsipppbj_spm_'+randomchar+'.pdf',
    //     // paperWidth:8.5,
    //     // paperHeight:13,
    //     format: 'Legal',
    //       printBackground: true,
    //       margin: {
    //           left: '0px',
    //           top: '0px',
    //           right: '0px',
    //           bottom: '0px'
    //       }
    //   })
    //   await browser.close();

    // await axios .post(`${hostPevita}${idAPI.pevita.login}`).then((token) =>{
    //   // if(!token.data.access_token){
    //   //   throw Error('Token tidak didapat')
    //   // }
    //     // kirim ke panutan
    //     let pathpdf = path.join(__dirname,"../public/barjas/",'/expsipppbj_spm_'+randomchar+'.pdf');
    //     let fileexist = fs.existsSync(pathpdf)
    //     console.log("file exist:", req.body.nip_penandatangan);

    //     let pdfupload = fs.createReadStream(pathpdf);
    //   data = new FormData();
    //   data.append('email', 'expenditure@ecampus.ut.ac.id');
    //   data.append('password', 'password123');
    //   data.append('id_aplikasi', '4');
    //   data.append('id_trx', req.body.id_trx);
    //   data.append('sifat_surat', req.body.sifat_surat);
    //   data.append('nomor_surat', req.body.nomor_surat);
    //   data.append('perihal', req.body.perihal);
    //   data.append('tanggal_surat', req.body.tanggal_surat);
    //   data.append('nip_pembuat',req.body.nip_pembuat);
    //   req.body.nip_penandatangan.forEach((item) => data.append("nip_penandatangan[]", item))
    //   //data.append('nip_penandatangan[]',req.body.nip_penandatangan);
    //   data.append('email_penandatangan', req.body.email_penandatangan);
    //   data.append('pdf', pdfupload);
      
    //   var config = {
    //     method: 'post',
    //     url: `${hostProdevPanutannew}${idAPI.panutan.send_data}`,
    //     headers: { 
    //       Authorization: `Bearer ${token}`, 
          
    //       ...data.getHeaders()
    //     },
    //     data : data
    //   };
      
    //   return axios(config).then((kirim)=>{
    //     fs.unlink(pathpdf, (err) => {console.log("unlink error", err);})
    //     let link_file = generate.linkfilepanutan(req.body.tahun,kirim.data.id,kirim.data.dokumen)
    //     return dokumenKirimPanutan.update({link_file:link_file},{where:{
    //       id_trx:req.body.id_trx
    //     }}).then((updateDokumen)=>{
    //       jsonFormat(res, "success", "berhasil membuat dokumen", updateDokumen)
    //     }).catch((err)=>{
    //       fs.unlink(pathpdf, (err) => {
    //         console.log("unlink error", err);
    //       });
    //       jsonFormat(res, "failed", err.message, "satu")})
    //   }).catch((err)=>{
    //     fs.unlink(pathpdf, (err) => {
    //       console.log("unlink error", err);
    //     });
    //     console.log(err)
    //     jsonFormat(res, "failed", err.message, "dua")})
      
    // }).catch((err)=>{
    //   jsonFormat(res, "failed", err.message, "tiga")})
    // }catch(err){
    //   next(err)
    // }
    // }

    exports.listSPM = async(req,res,next) =>{
    try{
      const dataexp = await dokumenKirimPanutan.findAll({where:{katagori_surat:"SPM-suratbarjas"}})
      const dataexp1 = await dokumenKirimPanutan.findAll({where:{katagori_surat:"SPTD-suratbarjas"}})
      let arrdata1 = [0]
      dataexp1.map((d)=>{arrdata1.push(d.id_trx)}) 
      console.log(dataexp)

      await axios .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`).then((panutan)=>{
        const panutan1 = panutan.data.data
        const panutan2 = panutan1.filter((p1)=>p1.perihal === "SPM Barang dan Jasa");
        let panutan3 = []
        panutan2.map((p2)=>{
          if(!arrdata1.includes(p2.id_trx)){
            let arrExp = []
            dataexp.map((de)=>{
              if(p2.id_trx === de.id_trx){
                arrExp.push(de)
              }
            })
            p2.datadetail = arrExp;
            panutan3.push(p2)
          }
        })

        jsonFormat(res,"success","berhasil menampilkan data", panutan3);
      })
    }catch(err){
      next(err)
    }
    }

  exports.BarjasByUnit =  (req, res, next) => {
       SuratBarjas.findAll({where:{kode_unit:req.params.kode_unit}})
        .then((data) => {
          if (data.length == 0) {
            throw Error("data kosong");
          }
          jsonFormat(res, "success", "berhasil menampilkan data", data);
        })
        .catch((err) => {
          jsonFormat(res, "failed", err.message, []);
        });
    };

    exports.UpdateStatusBarjas = async(req,res,next)=>{
      try{
        const data = req.body 
        const update = await updateStatus(data.kode_permintaan,data.aplikasi,data.status)
        jsonFormat(res, "success", 'Berhasil Mengupdate status',[] )
      }catch(error){
        next(error)
      }
    }


    exports.store = async(req,res,next) =>{
      try{
        const data = req.body.data
        if(data.length === 0){
          throw new Error('data tidak ada yang diinput')
        }

        const storeData = await SuratBarjas.bulkCreate(data)
        jsonFormat(res, "success", 'Berhasil Menambah data',storeData )
      }catch(error){
        res.statusCode = 401
        jsonFormat(res, "failed", error.message,error?.errors )
      } 
    } 

    exports.storeOne = async(req,res,next) =>{
      try{
        const body = req.body
        const storeData = await SuratBarjas.create(body)
        jsonFormat(res, "success", 'Berhasil Menambah data',storeData )
      }catch(error){
        res.statusCode = 401
        jsonFormat(res, "failed", error.message,error?.errors )
      }
    }

    exports.getNomorSpm = async(req,res,next) => {
      try{
      const maksKode = parseInt(await dokumenKirimPanutan.max('id_trx'))+1;
      const nomor = await getNomorPevita(req.body,`barjas-${req.body.aplikasi}-keuangan`,maksKode);
      return db.transaction().then((t)=>{
        dokumenKirimPanutan.destroy({where:{katagori_surat:`barjas-${req.body.aplikasi}-keuangan`,
        id_surat_tugas:req.body.kode_permintaan,
        kode_unit:req.body.kode_unit,
        tahun:req.body.tahun},transaction:t}).then((del)=>{
          dokumenKirimPanutan.create({
            id_trx:maksKode,
            katagori_surat:`barjas-${req.body.aplikasi}-keuangan`,
            id_surat_tugas:req.body.kode_permintaan,
            kode_unit:req.body.kode_unit,
            tahun:req.body.tahun,
            tanggal:req.body.tanggal_buat,
            jenis_surat:"SPM",
            id_nomor:nomor.id_nomor,
            nomor:nomor.nomor,
            aktif:1
        },{transaction:t}).then((dataDokumen)=> {
          SuratBarjas.update({
            kode_status: 4,
          },{where:{kode_permintaan:req.body.kode_permintaan,kode_kontrak:req.body.kode_kontrak,aplikasi:req.body.aplikasi},transaction:t}).then((createBarjas)=>{
            t.commit()
            jsonFormat(res, "success", "berhasil membuat nomor", dataDokumen) 
          }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "gak bisa update barjas")})
        }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "gak bisa create dokumen terkirim")})
        }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "error delete")})     
    })
  }catch(error){
     next(error)
  }
  }

  exports.NestedBarjas = async(req,res,next)=>{
    try{
      const kode_permintaan = req.params.kode_permintaan
      const kode_kontrak = req.params.kode_kontrak
      const tahun = req.params.tahun
      const Barjas = await SuratBarjas.findOne({where:{kode_permintaan:kode_permintaan,kode_kontrak:kode_kontrak,tahun:tahun}})

      if(Barjas == null){
        throw new Error('Data tidak ada pada sistem')
      }
      
      const dokumenPanutan = await dokumenKirimPanutan.findAll({where:{id_surat_tugas:kode_permintaan,tahun:tahun,aktif:{[Op.in]:[1,2]}}})
      //dokumen panutan
      const APIPanutan = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`)
      const dokumenDariPanutan = APIPanutan?.data?.data
      //ebudgeting
      //data RKA dari Ebudgeting
      const RKADariEbudgeting = await axios .get(`${hostEbudgeting}${idAPI.ebudgeting.apiv1_rkatu_bulan}/${Barjas.kode_rka}/${Barjas.kode_periode}`,{
        headers: {
          id_user: req.headers.id_user,
          kode_group: req.headers.kode_group,
          token_lama: `${req.headers.token_lama}`,
          token_baru: `${req.headers.token_baru}`,
        },
      })
      .then((data)=>{
        return data.data
      })
      .catch((err)=>
      {
        return {
          "message":err.message,
          "values":[]
        }
      })

      
        let ArrdokumenPanutan = []
        dokumenPanutan.map((dp)=>{
        let filterPanutan = dokumenDariPanutan.filter((f)=> f.id_trx == dp.id_trx);
        let link_file = ""
        let status_tandatangan = ""
        if(dp.aktif === 2){
        status_tandatangan = "sudah di tandatangani"
        }else{
        status_tandatangan = "belum ditandatangani"
        }
        ArrdokumenPanutan.push({
              "id_trx": dp.id_trx,
              "katagori_surat": dp.katagori_surat,
              "id_surat_tugas": dp.id_surat_tugas,
              "kode_unit": dp.kode_unit,
              "tahun": dp.tahun,
              "jenis_surat": dp.jenis_surat,
              "id_nomor": dp.id_nomor,
              "nomor": dp.nomor,
              "tanggal": dp.tanggal,
              "link_file": dp.link_file,
              "status_tandatangan":status_tandatangan,
              "aktif": dp.aktif
      })
    })

    dataBarjas = {
      DetailBarjas: Barjas,
      DokumenBarjas: ArrdokumenPanutan,
      Ebudgeting: RKADariEbudgeting
    }

      jsonFormat(res, "success", "berhasil menampilkan_data", dataBarjas) 

    }catch(err){
    next(err)
    //next(err)
    }
    

  }


    const updateStatus = (kode_permintaan,aplikasi,status) =>{
      return SuratBarjas.update({kode_status:status},{where:{kode_permintaan:kode_permintaan,aplikasi:aplikasi}})
    }

    const getNomorPevita = async(data,perihal,id_surat) =>{
      let token = await axios .post(`${hostPevita}${idAPI.pevita.login}`)
      let nomor = await axios .post(`${hostPevita}${idAPI.pevita.lat_surat}`,{
        "aplikasi":"expenditure",
        "sifat_surat":data.sifat_surat,
        "id_surat": id_surat,
        "id_jenis_surat":data.id_jenis_surat,
        "id_jenis_nd":data.id_jenis_nd,
        "perihal":perihal,
        "id_klasifikasi":data.kode_klasifikasi,
        "id_sub_unit":data.kode_sub_unit,
        "id_user":data.ucr,        
        "nama_pembuat":data.nama_pembuat,
        "tanggal":data.tanggal_buat
  },{ headers: { Authorization: `Bearer ${token.data.access_token}` }})
    return nomor?.data
    }