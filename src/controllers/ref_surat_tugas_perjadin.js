const { jsonFormat } = require("../utils/jsonFormat");
const request = require("request");
const SuratTugasPerjadin = require("../models/ref_surat_tugas_perjadin");
const SuratTugasRKAPerjadin = require("../models/ref_surat_tugas_rka_perjadin");
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const KomponenPerjadin_1 = require("../models/trx_komponen_perjadin_1");
const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
const Status = require("../models/ref_status");
const Skema = require("../models/ref_skema_perjadin");
const { validationResult } = require("express-validator");
const transferExpenditure = require("../models/trx_transfer_expenditure")
const db = require("../config/database");
const { QueryTypes,Op,fn,col } = require("sequelize");
const axios = require("axios");
const { type } = require("express/lib/response");
const { setDefaultResultOrder } = require("dns");
const hostEbudgeting = process.env.hostEbudgeting;
const hostEbudgeting2 = process.env.hostEbudgeting2
const hostHRIS = process.env.hostHRIS
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const hostExpenditure = process.env.hostExpenditure
const idAPI = require("../lang/id-api.json")
const APISURATDETAILPANUTAN = `${hostProdevPanutannew}${idAPI.panutan.detail_perjadin}`
const APISURATPANUTAN = `${hostProdevPanutannew}${idAPI.panutan.surtug_perjadin}`
const komentarRevisi = require("../models/komentar_revisi")

exports.getAll = async (req, res, next) => {
  try {
    const data = await SuratTugasPerjadin.findAll({
      order:[['udcr','desc']],
        include:[{
          model:Status,
          as:"status"
        },{
          model:Skema,
          as:"skema"
        }]
      
      
    });
    jsonFormat(res, "success", "Berhasil memuat data", data);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.getAllUnit = async (req, res, next) => {
  try {
    const data = await SuratTugasPerjadin.findAll({
      where:{kode_status:3},order:[['udcr','desc']],
        include:[{
          model:Status,
          as:"status"
        },{
          model:Skema,
          as:"skema"
        }]
      
      
    });
    jsonFormat(res, "success", "Berhasil memuat data", data);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.getAllKeuangan = async (req, res, next) => {
  try {
    const data = await SuratTugasPerjadin.findAll({
      where:{kode_status:4},order:[['udcr','desc']],
        include:[{
          model:Status,
          as:"status"
        },{
          model:Skema,
          as:"skema"
        }]
      
      
    });
    jsonFormat(res, "success", "Berhasil memuat data", data);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};


exports.getAllwithPanutan = async (req,res,next) => {
  try{
  let statusexp,keteranganstatus,skemaexp,keteranganskema,idsuratexpenditure,daripanutan,keterangan_panutan;
  let panutan = [];
    daripanutan = await axios.get(`${APISURATPANUTAN}/${req.params.id}`);
   panutan = daripanutan.data.data
  keterangan_panutan = "Belum diproses";

  const dataBAC = await axios.get(
    `${hostProdevPanutannew}${idAPI.panutan.data_list_bac}/${req.params.id}`
  );

  const datafilter = dataBAC.data.data
  

  if(panutan === null)
   {
    let panutan = await SuratTugasPerjadin.findAll({
      order:[['udcr','desc']],
        include:[{
          model:Status,
          as:"status"
        },{
          model:Skema,
          as:"skema"
        }]
      
      
    });
    keterangan_panutan = "server panutan sedang diperbaiki"
  }


  const expenditure = await SuratTugasPerjadin.findAll({
    order:[['udcr','desc']],
      include:[{
        model:Status,
        as:"status"
      },{
        model:Skema,
        as:"skema"
      }]
    
    
  });



  idsuratexpenditure = expenditure.map((expen) => expen.id_surat_tugas);
  let arrsurat = [];
  console.log("dari panutan",panutan);
 
  panutan.map((pn) => { 
    let dataBerita = []
    if (datafilter.length > 0){
      dataBerita = datafilter.filter((a) => a.id_surat_tugas === pn.id_surat);
    }
      if (idsuratexpenditure.includes(pn.id_surat)) {
        expenditure.map((ex) => {
          if (ex.id_surat_tugas === pn.id_surat) {
            keteranganstatus = ex.status.keterangan_status;
            statusexp = ex.status.kode_status;
          }
        });
      } else {
        keteranganstatus = keterangan_panutan;
        statusexp = 0;
      }
    arrsurat.push({
      nama_unit: pn.nama_unit,
        total_petugas: pn.total_petugas,
        id_surat: pn.id_surat,
        nomor_surat: pn.nomor_surat,
        perihal: pn.perihal,
        tempat_surat: pn.tempat_surat,
        tanggal_surat: pn.tanggal_surat,
        created_at: pn.created_at,
        status: statusexp,
        dataBAC:dataBerita,
        keterangan_status:keteranganstatus,
        petugas: pn.petugas
    })
  });
  
  
  jsonFormat(res, "success", "Berhasil memuat data", arrsurat);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}

exports.getlistPanutan = (req,res,next)=>{
  axios.get(`${APISURATPANUTAN}/${req.params.id}`).then((panutan)=>{
    if(panutan.data.data === null || panutan.data.data.length == 0){
      throw new Error("tidak ada data di panutan")
    }
    jsonFormat(res,"success","berhasil",panutan.data.data)
  }).catch((err)=>{
    next(err)
  })
}

exports.toTransport = async (req, res, next) => {
  try {
    const data = await SuratTugasPerjadin.findAll({
      where: {
        id_surat_tugas: req.params.id,
      },
    });
    if (data.length === 0)
      return jsonFormat(res, "failed", "kode rka tidak ada", []);

    jsonFormat(res, "success", "masuk ke dalam pemilihan skema", data[0]);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.create = async (req, res, next) => {
  try {
  let cekstatus = await SuratTugasPerjadin.findAll({
    where: {   id_surat_tugas: req.body.id_surat_tugas,kode_status:{[Op.in]:[5,6,7,8,9,10]} }
  });
  if (cekstatus.length > 0){
    return jsonFormat(res, "failed","Tidak Bisa merubah RKA", []);
  }
  
  const cek = await SuratTugasPerjadin.destroy({
    where: {
      id_surat_tugas: req.body.id_surat_tugas,
    },
  });

  // set request surat ke
  const countSurat = await db.query(
    `SELECT ifnull(max(request_nomor_surat_ke),0) as maks FROM ref_surat_tugas_perjadin WHERE kode_rka = ${req.body.kode_rka}`,
    {
      type: QueryTypes.SELECT,
    }
  );

  const count = countSurat[0].maks + 1;
  
   let createsurat=  await SuratTugasPerjadin.create({
      id_surat_tugas: req.body.id_surat_tugas,
      kode_kegiatan_ut_detail: req.body.kode_kegiatan_ut_detail,
      kode_aktivitas_rkatu:req.body.kode_aktivitas_rkatu,
      kode_rka: req.body.kode_rka,
      kode_periode: req.body.kode_periode,
      nomor_surat_tugas: req.body.nomor_surat_tugas,
      tanggal_surat_tugas: req.body.tanggal_surat_tugas,
      data_pengusulan:req.body.data_pengusulan,
      request_nomor_surat_ke: count,
      kode_sub_unit:req.body.kode_sub_unit,
      kode_unit: req.body.kode_unit,
      kode_skema:0,
      kode_status:2,
      tahun: req.body.tahun,
      ucr: req.body.ucr,
    });
    jsonFormat(res, "success", "Berhasil membuat data", createsurat);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.getByRka = async (req, res, next) => {
  try {
    const data = await SuratTugasPerjadin.findAll({
      where: {
        kode_rka: req.params.id,
      },
    });
    if (data.length === 0)
      return jsonFormat(res, "failed", "kode rka tidak ada", []);

    jsonFormat(res, "success", "Berhasil memuat data", data[0]);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.getByUnit = async (req, res, next) => {
  try {
    const surtug = await SuratTugasPerjadin.findAll({
      where: {
        kode_unit: req.params.id,
      },
       order:[['udcr','desc']],
        include:[{
          model:Status,
          as:"status"
        },{
          model:Skema,
          as:"skema"
        }],
    });

    if (surtug.length === 0){
      let err = new Error('Data Tidak Ada')
      throw err
    }
      

    jsonFormat(res, "success", "Berhasil memuat data", surtug);
  } catch (error) {
    error.statusCode = 422
    next(error)
  }
};

exports.getByUnitStatus = async (req, res, next) => {
  try {
    let status = req.params.status.split("-")
    const surtug = await SuratTugasPerjadin.findAll({
      where: {
        kode_unit: req.params.id,
        kode_status:{[Op.in]:status}
      },
      order: [["udcr", "desc"]],
      include: [
        {
          model: Status,
          as: "status",
        },
        {
          model: Skema,
          as: "skema",
        },
      ],
    });

    if (surtug.length === 0) {
      let err = new Error("Data Tidak Ada");
      throw err;
    }

    jsonFormat(res, "success", "Berhasil memuat data", surtug);
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};




exports.update = async (req, res, next) => {
  try {
    const data = await SuratTugasPerjadin.findOne({
      where: { kode_rka: req.params.id },
    });

    if (data === null)
      return jsonFormat(res, "failed", "kode rka tidak ada", []);

    await SuratTugasPerjadin.update(req.body, {
      where: {
        kode_rka: req.params.id,
      },
    });

    jsonFormat(res, "success", "Berhasil memperbarui data", []);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const data = await SuratTugasPerjadin.findOne({
      where: { id_surat_tugas: req.params.id },
    });

    if (data === null)
      return jsonFormat(res, "failed", "id_surat tidak ada", []);

    await SuratTugasPerjadin.destroy({
      where: {
        id_surat_tugas: req.params.id,
      },
    });
    jsonFormat(res, "success", "Berhasil menghapus data", []);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.getByIdSurat = async (req, res, next) => {
  try{
  let cekdata,message_data;
  let data = [];
  cekdata = await SuratTugasPerjadin.findOne({
    where: {
      id_surat_tugas: req.params.id,
    },include:['hsurat']
  });
  if (cekdata === null)
  {
    let suratpanutan = await axios.get(`${APISURATDETAILPANUTAN}/${req.params.id}`);

    console.log("api panutan",suratpanutan.data)
    suratpanutan.data.data.map((surat) => {
      let hsurat = surat.petugas.map((p)=>{
        console.log("petugas",p)
        let provinsi_asal = ""
        let provinsi_tujuan = ""
        if(p.kode_pokjar_asal){provinsi_asal = p.kode_pokjar_asal.substring(0, 5)}
        if(p.kode_pokjar_tujuan){provinsi_tujuan = p.kode_pokjar_tujuan.substring(0, 5)}
        return{
          "id_surat_tugas": surat.id_surat,
          "nip": p.nip,
          "kode_kota_asal": p.kode_pokjar_asal,
          "kode_kota_tujuan": p.kode_pokjar_tujuan,
          "urut_tugas": null,
          "nama_petugas": p.nama,
          "nama_bank": p.nama_bank_petugas,
          "gol": p.gol,
          "eselon": p.nama_eselon,
          "kode_bank_tujuan": p.kode_bank_petugas,
          "nomor_rekening": p.no_rekening_petugas,
          "nomor_rekening_dipakai": null,
          "kode_bank_asal": null,
          "npwp": p.npwp,
          "kode_provinsi_asal": provinsi_asal,
          "nama_kota_asal": p.nama_pokjar_asal,
          "kode_provinsi_tujuan": provinsi_tujuan,
          "nama_kota_tujuan": p.nama_pokjar_tujuan,
          "kode_unit_tujuan": p.kode_unit_tujuan,
          "tahun": surat.tahun_surat,
          "tanggal_pergi": p.tanggal_awal,
          "tanggal_pulang": p.tanggal_akhir,
          "lama_perjalanan": p.lama_perjalanan,
          "transport": null,
          "biaya": null,
          "keterangan_dinas":p.keterangan_dinas,
          "status_pengusulan": 0,
          "kekurangan_dan_pengembalian": null,
          "status_kurang_dan_lebih": null,
          "status_sppd": null
        }
      })
      data.push({
        "id_surat_tugas": surat.id_surat,
        "kode_kegiatan_ut_detail": null,
        "kode_aktivitas_rkatu": null,
        "kode_rka": null,
        "kode_periode": null,
        "nomor_surat_tugas": surat.nomor_surat,
        "tanggal_surat_tugas": surat.tanggal_surat,
        "tahun": surat.tahun_surat,
        "keperluan":surat.keperluan,
        "dokumen":surat.dokumen,
        "request_nomor_surat_ke": null,
        "kode_skema": 0,
        "kode_unit": surat.kode_unit_kerja,
        "kode_sub_unit": null,
        "kode_status": 0,
        "ucr": null,
        "uch": null,
        "hsurat": hsurat
    })
    })
    // data = suratpanutan.data.data;
    message_data= "data masih dari panutan";
  }else{
    data.push(cekdata);
    message_data= "data telah ada di expenditure";
  }
  try { 
    jsonFormat(res, "success", message_data, data);
  } catch (error) {
    return next(error)
  }
}catch(err){
  return next(err)
}
};

exports.nestedbaru = async (req,res,next) => {
  try { 
  let suratPerjadin,tbPetugas,tbKomponen,arrnip,tbgroupPetugas,kdRKA,bas,filekomponenperjadin,jumlah_rka;
  let tbSuratPerjadin = await db.query(`SELECT sp.*,s.keterangan_status,sk.nama_skema_perjadin FROM ref_surat_tugas_perjadin AS sp
  LEFT JOIN ref_skema_perjadin as sk ON (sp.kode_skema=sk.kode_skema_perjadin) LEFT JOIN ref_status AS s 
  ON (sp.kode_status=s.kode_status)
   WHERE id_surat_tugas = ${req.params.id}`, {
    type: QueryTypes.SELECT,
  });
  if(tbSuratPerjadin.length === 0){return jsonFormat(res, "failed", "data tidak ada", []);}

  let tbrka = await db.query(`SELECT ifnull(sum(jumlah_budget),0) as jumlah_terpakai FROM ref_surat_tugas_rka_perjadin WHERE kode_rka = ${tbSuratPerjadin[0].kode_rka} 
  AND kode_periode = ${tbSuratPerjadin[0].kode_periode} 
  AND kode_aktivitas_rkatu = ${tbSuratPerjadin[0].kode_aktivitas_rkatu}  AND id_surat_tugas NOT IN(${req.params.id})`,
  {type:QueryTypes.SELECT});
 
  let rka_terpakai = tbrka[0].jumlah_terpakai;    

  let cekrkapagu = await axios.get(`${hostEbudgeting}${idAPI.ebudgeting.rka_bulan}/${tbSuratPerjadin[0].kode_rka}/${tbSuratPerjadin[0].kode_periode}`).catch((err)=>{return []});
  sumSurat = await db.query(`SELECT ifnull(sum(biaya),0) AS total_biaya FROM trx_petugas_perjadin_biaya WHERE id_surat_tugas = ${req.params.id}`, {
    type: QueryTypes.SELECT,
  });

   let cekrka = cekrkapagu.data.values;
console.log("cek rka",cekrka)
  if (
    cekrka.length === 0
    // !cekrkapagu.data.values
    ){
  jumlah_rka = 0;
  bas = "";
   }else{jumlah_rka = cekrka[0].jumlah;
  bas = cekrka.bas;}
  console.log("cek jumlah", jumlah_rka)
 
  let sisa_rka = jumlah_rka-rka_terpakai;
  let total_biaya_persurat = sumSurat[0].total_biaya;
  let sisa_rka_setelah_dikurang = sisa_rka - total_biaya_persurat;
  
  let pagu = cekrka[0]




  tbgroupPetugas = await db.query(`SELECT *,sum(biaya) AS total_biaya FROM trx_petugas_perjadin_biaya WHERE id_surat_tugas = ${req.params.id} GROUP BY id_surat_tugas,nip`, {
    type: QueryTypes.SELECT,
  });

  if(tbgroupPetugas.length === 0){
    tbgroupPetugas = await db.query(`SELECT id_surat as id_surat_tugas,nip,nama as nama_petugas,nama_bank,nomor_rekening,npwp,0 AS total_biaya FROM t_petugas_dummy WHERE id_surat= ${req.params.id} GROUP BY id_surat,nip`, {
      type: QueryTypes.SELECT,
    });
  }

  arrnip = tbgroupPetugas.map((petugas) => petugas.nip);
  let arrkepegawaian = [{"nip":"0"}];

  for(let a=0; a<arrnip.length;a++){
   let kepegawaian =  await axios .get(`${hostHRIS}${idAPI.hris.pegawai_show}/`+arrnip[a])
  if(kepegawaian.data.data){
    arrkepegawaian.push(kepegawaian.data.data)
  }
  }

  console.log("kepegawaian console",arrkepegawaian);
  console.log("kepegawaian console",arrnip);

  tbPetugas = await PetugasPerjadinBiaya.findAll({
    where: { id_surat_tugas: req.params.id,nip:arrnip },
  });
  if(tbPetugas.length === 0){
    tbPetugas = await db.query(`SELECT id_surat as id_surat_tugas,nip,id_provinsi_asal AS kode_provinsi_asal,id_provinsi_tujuan AS kode_provinsi_tujuan,
    id_tempat_asal AS kode_kota_asal ,nama_tempat_asal AS nama_kota_asal ,id_tempat_tujuan as kode_kota_tujuan,
    nama_tempat_tujuan as nama_kota_tujuan,tanggal_awal as tanggal_pergi,tanggal_akhir as tanggal_pulang,
    lama_perjalanan,"-" as transport,0 AS biaya FROM t_petugas_dummy WHERE id_surat = ${req.params.id}`, {
      type: QueryTypes.SELECT,
    });
  }
 
  const ppkdarikepegawaian =  await axios .get(`${hostHRIS}${idAPI.hris.pegawai_ppk}/`+req.params.kode_unit);
  let datapenandatangan = ppkdarikepegawaian.data.data


  const dokumentable = await dokumenKirimPanutan.findAll({where:{id_surat_tugas:req.params.id, aktif:{[Op.in]:[1,2]},katagori_surat:{[Op.in]:["Perjalanan-Dinas","perjadin-keuangan"]}}})
  const panutandummy = [{
    "status": "success",
    "data": [
        {
            "id_surat": 141,
            "aplikasi": "E-Expenditure",
            "sifat_surat": "B",
            "id_trx": 0,
            "nomor_surat": "0",
            "perihal": "",
            "tanggal_surat": "",
            "name": "",
            "nip_penandatangan": "",
            "nama_dokumen": "",
            "dokumen_asli": "",
            "id_signature": null,
            "path_final_dok": "",

        }]}]

  // let ttdpanutan = await
  let datattdpanutan = 
  await axios .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`).then((ttdpanutan)=>{
    datattdpanutan = ttdpanutan.data.data
   }).catch(
     datattdpanutan = panutandummy.data
  );
  
  const transfer = await transferExpenditure.findAll({where:{kode_surat:req.params.id}});
  

  if(arrnip.length > 0){
    tbKomponen = await KomponenPerjadin_1.findAll({
      where: { nomor_surat_tugas: req.params.id, }
    });
  }else{tbKomponen = [];}
  let arrdata = []
  
  tbSuratPerjadin.map((sp) => {
  let arrgrpetugas = [];
  let arrdokumentable = []
  
  arrdata.push({
    id_surat_tugas:sp.id_surat_tugas,
    nomor_surat_tugas:sp.nomor_surat_tugas,
    tanggal_surat_tugas:sp.tanggal_surat_tugas,
    kode_rka:sp.kode_rka,
    bas:bas,
    total_rka:jumlah_rka,
    rka_terpakai:rka_terpakai,
    sisa_rka:sisa_rka,
    total_biaya_persurat:total_biaya_persurat,
    sisa_rka_setelah_dikurang:sisa_rka_setelah_dikurang,
    kode_skema_perjadin: sp.kode_skema,
    nama_skema_perjadin: sp.nama_skema_perjadin,
    status:sp.kode_status,
    keterangan_status:sp.keterangan_status,
    pagu:pagu,
    document:arrdokumentable,
    petugas: arrgrpetugas,
    datapenandatangan: datapenandatangan
  })

  dokumentable.map((dt)=>{
    let arrttd = datattdpanutan.filter((dtp)=> dtp.id_trx===dt.id_trx)
    let link_file = ""
    let status_ttd = ""
    if(arrttd.length === 1){
      link_file += `${hostProdevPanutannew}/`+arrttd[0].path_final_dok

      status_ttd = dt.jenis_surat +" Telah Ditandatangani"
    }else{link_file += `${hostExpenditure}${idAPI.expenditure.view_file_komponen_realisasi_perjadin}/`+dt.link_file;
    status_ttd = dt.jenis_surat +" Belum Ditandatangani"
  }
    
    arrdokumentable.push({
      id_trx : dt.id_trx,
      id_surat_tugas:dt.id_surat_tugas,
      kode_unit:dt.kode_unit,
      tahun:dt.tahun,
      tanggal:dt.tanggal,
      jenis_surat:dt.jenis_surat,
      id_nomor:dt.id_nomor,
      nomor:dt.nomor,
      status_ttd:status_ttd,
      link_file:link_file
    })
  })
  tbgroupPetugas.map((gptg) => {
   let arrkepegawaiannested = [];
    arrkepegawaian.map((ark)=>
    {
      if(gptg.nip === ark.nip){
        arrkepegawaiannested.push(ark)
      }
    }
    )
    let arrPetugas = [];
    arrgrpetugas.push({
      id_surat_tugas: gptg.id_surat_tugas,
      nip: gptg.nip,
      nama: gptg.nama_petugas,
      biaya: gptg.total_biaya,
      nama_bank:gptg.nama_bank,
      nomor_rekening:gptg.nomor_rekening,
      npwp:gptg.npwp,
      darikepegawaian: arrkepegawaiannested,
      detail: arrPetugas
    });
  tbPetugas.map((ptg) => {
    let arrTransfer = [];
    if(ptg.nip === gptg.nip && ptg.id_surat_tugas === gptg.id_surat_tugas ){
      transfer.map((tf)=>{
         if(tf.nip === ptg.nip && tf.sub_surat === ptg.kode_kota_tujuan){
          arrTransfer.push(tf);
          console.log("cek console",tf)
         }
      })
    let arrKomponen = [];
    arrPetugas.push({
      id_surat_tugas: gptg.id_surat_tugas,
      nip: ptg.nip,
      kode_provinsi_asal:ptg.kode_provinsi_asal,
      kode_kota_asal: ptg.kode_kota_asal,
      nama_kota_asal: ptg.nama_kota_asal,
      kode_provinsi_tujuan:ptg.kode_provinsi_tujuan,
      kode_kota_tujuan: ptg.kode_kota_tujuan,
      nama_kota_tujuan: ptg.nama_kota_tujuan,
      tanggal_pergi: ptg.tanggal_pergi,
      tanggal_pulang: ptg.tanggal_pulang,
      lama_perjalanan:ptg.lama_perjalanan,
      transport: ptg.transport,
      biaya: ptg.biaya,
      transfer:arrTransfer,
    komponen: arrKomponen});   
    tbKomponen.map((kpn)=> {
      if(kpn.nip === ptg.nip 
        && kpn.kode_tempat_asal === ptg.kode_kota_asal 
        && kpn.kode_tempat_tujuan === ptg.kode_kota_tujuan
        && kpn.id_surat_tugas === ptg.nomor_surat_tugas
        ){
          
        arrKomponen.push({
          nomor_surat_tugas: kpn.nomor_surat_tugas,
          nip: kpn.nip,
          kode_tempat_tujuan:kpn.kode_tempat_tujuan,
          kode_komponen_honor:kpn.kode_komponen_honor,
          keterangan_komponen:kpn.keterangan_komponen,
          biaya_satuan: kpn.biaya_satuan,
          kode_satuan: kpn.kode_satuan,
          jumlah:kpn.jumlah,
          total:kpn.total
        })
      }
     
    })
  }

  })
  
})
});
  // console.log("transer:",transfer);


    jsonFormat(res, "success", "cek", arrdata);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}

exports.nestedperorang = async (req,res,next) => {
  try { 
  let suratPerjadin,tbPetugas,tbKomponen,arrnip,tbgroupPetugas,kdRKA,bas;
  tbSuratPerjadin = await db.query(`SELECT sp.*,s.keterangan_status,sk.nama_skema_perjadin FROM ref_surat_tugas_perjadin AS sp
  LEFT JOIN ref_skema_perjadin as sk ON (sp.kode_skema=sk.kode_skema_perjadin) LEFT JOIN ref_status AS s 
  ON (sp.kode_status=s.kode_status)
   WHERE id_surat_tugas = ${req.params.id}`, {
    type: QueryTypes.SELECT,
  });
  if(tbSuratPerjadin.length === 0){return jsonFormat(res, "failed", "data tidak ada", []);}

  let tbrka = await db.query(`SELECT ifnull(sum(jumlah_budget),0) as jumlah_terpakai FROM ref_surat_tugas_rka_perjadin WHERE kode_rka = ${tbSuratPerjadin[0].kode_rka} 
  AND kode_periode = ${tbSuratPerjadin[0].kode_periode} 
  AND kode_aktivitas_rkatu = ${tbSuratPerjadin[0].kode_aktivitas_rkatu}  AND id_surat_tugas NOT IN(${req.params.id})`,
  {type:QueryTypes.SELECT});
 
  let rka_terpakai = tbrka[0].jumlah_terpakai;    

  let cekrka = await axios.get(`${hostEbudgeting}${idAPI.ebudgeting.rka_bulan}/${tbSuratPerjadin[0].kode_rka}/${tbSuratPerjadin[0].kode_periode}`);
  sumSurat = await db.query(`SELECT ifnull(sum(biaya),0) AS total_biaya FROM trx_petugas_perjadin_biaya WHERE id_surat_tugas = ${req.params.id}`, {
    type: QueryTypes.SELECT,
  });

  if (cekrka.data.values.length === 0){
  jumlah_rka = 0;
  bas = "";
   }else{jumlah_rka = cekrka.data.values[0].jumlah;
  bas = cekrka.data.values[0].bas;}
 
  let sisa_rka = jumlah_rka-rka_terpakai;
  let total_biaya_persurat = sumSurat[0].total_biaya;
  let sisa_rka_setelah_dikurang = sisa_rka - total_biaya_persurat;

 let tbpagu = await axios.get(`${hostEbudgeting}${idAPI.ebudgeting.expenditure_pagu}/${tbSuratPerjadin[0].kode_rka}`);
 console.log("cek RKA" ,cekrka.data.values);
  if(tbpagu.data.values[0].jumlah === null)
{return jsonFormat(res, "failed", "data RKA atau pagu tidak ditemukan", []);}

  tbgroupPetugas = await db.query(`SELECT *,sum(biaya) AS total_biaya FROM trx_petugas_perjadin_biaya WHERE id_surat_tugas = ${req.params.id} AND nip = ${req.params.nip} GROUP BY id_surat_tugas,nip`, {
    type: QueryTypes.SELECT,
  });
  arrnip = tbgroupPetugas.map((petugas) => petugas.nip);
  if(tbgroupPetugas.length === 0){
    tbgroupPetugas = await db.query(`SELECT id_surat as id_surat_tugas,nip,nama as nama_petugas,nama_bank,nomor_rekening,npwp,0 AS total_biaya FROM t_petugas_dummy WHERE id_surat= ${req.params.id} AND nip = ${req.params.nip} GROUP BY id_surat,nip`, {
      type: QueryTypes.SELECT,
    });
  }

  tbPetugas = await PetugasPerjadinBiaya.findAll({
    where: { id_surat_tugas: req.params.id,nip:arrnip },
  });
  if(tbPetugas.length === 0){
    tbPetugas = await db.query(`SELECT id_surat as id_surat_tugas,nip,id_provinsi_asal AS kode_provinsi_asal,id_provinsi_tujuan AS kode_provinsi_tujuan,
    id_tempat_asal AS kode_kota_asal ,nama_tempat_asal AS nama_kota_asal ,id_tempat_tujuan as kode_kota_tujuan,
    nama_tempat_tujuan as nama_kota_tujuan,tanggal_awal as tanggal_pergi,tanggal_akhir as tanggal_pulang,
    lama_perjalanan,"-" as transport,0 AS biaya FROM t_petugas_dummy WHERE id_surat = ${req.params.id} AND nip = ${req.params.nip}`, {
      type: QueryTypes.SELECT,
    });
  }


  if(arrnip.length > 0){
    tbKomponen = await KomponenPerjadin_1.findAll({
      where: { nomor_surat_tugas: req.params.id,nip:req.params.nip }
    });
  }else{tbKomponen = [];}
  let arrdata = []
  
  tbSuratPerjadin.map((sp) => {
  let arrgrpetugas = [];
  arrdata.push({
    id_surat_tugas:sp.id_surat_tugas,
    kode_rka:sp.kode_rka,
    bas:bas,
    total_rka:jumlah_rka,
    rka_terpakai:rka_terpakai,
    sisa_rka:sisa_rka,
    total_biaya_persurat:total_biaya_persurat,
    sisa_rka_setelah_dikurang:sisa_rka_setelah_dikurang,
    kode_skema_perjadin: sp.kode_skema,
    nama_skema_perjadin: sp.nama_skema_perjadin,
    status:sp.kode_status,
    keterangan_status:sp.keterangan_status,
    pagu:tbpagu.data.values,
    petugas: arrgrpetugas,
  })
  tbgroupPetugas.map((gptg) => {
    let arrPetugas = [];
    arrgrpetugas.push({
      id_surat_tugas: gptg.id_surat_tugas,
      nip: gptg.nip,
      nama: gptg.nama_petugas,
      nama_bank:gptg.nama_bank,
      nomor_rekening:gptg.nomor_rekening,
      npwp:gptg.npwp,
      biaya: gptg.total_biaya,
      detail: arrPetugas
    });
  tbPetugas.map((ptg) => {
    if(ptg.nip === gptg.nip && ptg.id_surat_tugas === gptg.id_surat_tugas ){
    let arrKomponen = [];
    arrPetugas.push({
      id_surat_tugas: gptg.id_surat_tugas,
      nip: ptg.nip,
      kode_provinsi_asal:ptg.kode_provinsi_asal,
      kode_kota_asal: ptg.kode_kota_asal,
      nama_kota_asal: ptg.nama_kota_asal,
      kode_provinsi_tujuan:ptg.kode_provinsi_tujuan,
      kode_kota_tujuan: ptg.kode_kota_tujuan,
      nama_kota_tujuan: ptg.nama_kota_tujuan,
      tanggal_pergi: ptg.tanggal_pergi,
      tanggal_pulang: ptg.tanggal_pulang,
      lama_perjalanan:ptg.lama_perjalanan,
      transport: ptg.transport,
      biaya: ptg.biaya,
    komponen: arrKomponen});   
    tbKomponen.map((kpn)=> {
      if(kpn.nip === ptg.nip 
        && kpn.kode_tempat_asal === ptg.kode_kota_asal 
        && kpn.kode_tempat_tujuan === ptg.kode_kota_tujuan
        && kpn.id_surat_tugas === ptg.nomor_surat_tugas
        ){
        arrKomponen.push({
          nomor_surat_tugas: kpn.nomor_surat_tugas,
          nip: kpn.nip,
          kode_tempat_tujuan:kpn.kode_tempat_tujuan,
          kode_komponen_honor:kpn.kode_komponen_honor,
          keterangan_komponen:kpn.keterangan_komponen,
          biaya_satuan: kpn.biaya_satuan,
          kode_satuan: kpn.kode_satuan,
          jumlah:kpn.jumlah,
          total:kpn.total
        })
      }
     
    })
  }

  })
  
})
});
  
    jsonFormat(res, "success", "cek", arrdata);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}


exports.verifikasi = async (req,res,next) =>{
  try{const surat = SuratTugasPerjadin.findOne({where:{id_surat_tugas:req.params.id_surat_tugas}});
  if(surat.length === 0){
    return jsonFormat(res, "failed", "id_surat tidak ada", []);
  }
  await SuratTugasPerjadin.update(req.body, {
    where: {
      id_surat_tugas: req.params.id_surat_tugas,
    },
  });
  jsonFormat(res, "success", "Berhasil memverifikasi data", []);
}
catch (error) {
  jsonFormat(res, "failed", error.message, []);
}
}

exports.nesteddokumensppnominatif = async(req,res,next) =>{
  try{
  let suratPerjadin,tbPetugas,tbKomponen,arrnip,tbgroupPetugas,kdRKA,bas,filekomponenperjadin,jumlah_rka;
  
  tbSuratPerjadin = await db.query(`SELECT sp.*,s.keterangan_status,sk.nama_skema_perjadin FROM ref_surat_tugas_perjadin AS sp
  LEFT JOIN ref_skema_perjadin as sk ON (sp.kode_skema=sk.kode_skema_perjadin) LEFT JOIN ref_status AS s 
  ON (sp.kode_status=s.kode_status)
   WHERE id_surat_tugas = ${req.params.id}`, {
    type: QueryTypes.SELECT,
  });}
  catch(err){
    next(err)
  }
}

exports.updatestatus = async (req, res, next) => {
  try {
    // const data = await SuratTugasPerjadin.findOne({
    //   where: { id_surat_tugas: req.params.id_surat_tugas,kode_unit:req.params.kode_unit,tahun:req.params.tahun },
    // });

    // if (data === null)
    //   return jsonFormat(res, "failed", "data tidak ada", []);

    await SuratTugasPerjadin.update(
      { kode_status: req.body.kode_status },
      {
        where: {
          id_surat_tugas: req.params.id_surat_tugas,
          kode_unit: req.params.kode_unit,
          tahun: req.params.tahun
        },
      }
    );

    jsonFormat(res, "success", "Berhasil memperbarui status", []);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.panutanExcludeExpenditure = async (req,res,next)=>{
  try{
  await axios  .get(`${APISURATPANUTAN}/${req.params.id}`).then((daripanutan)=>{
    let panutan = daripanutan.data.data;
    return SuratTugasPerjadin.findAll({where:{kode_sub_unit:req.params.id,tahun:req.params.tahun}}).then((data)=>{
      let dataOutput = []
      if(data.length==0){
        dataOutput = panutan
      }else{
        let kode_surat = data.map((data)=>data.kode_surat);
        panutan.map((p)=>{
          if(kode_surat.includes(p.id_surat)==false){
            dataOutput.push(p)
          }
        })
      }
      jsonFormat(res,"success","berhasil memuat data",dataOutput);
    }).catch((err)=>{
      jsonFormat(res, "failed", "error 1", []);
    })
  }).catch((err)=>{
    jsonFormat(res, "failed", "err.message", []);
  })}
  catch(err){
    next(err)
  }
}

//#region  nested new lama
// exports.nestednew = async(req,res,next)=>{
//   try{
//     let id = req.params.id
//     console.log("test 2")
//     // get data nomor surat
//     const surtug = await SuratTugasPerjadin.findAll({
//       where: {
//         id_surat_tugas: id,
//       },
//        order:[['udcr','desc']],
//         include:[{
//           model:Status,
//           as:"status"
//         },{
//           model:Skema,
//           as:"skema"
//         },
//         {
//           model:PetugasPerjadinBiaya,
//           as:"hsurat",
//           group:["nip"],
//           }
//         ],
//         row:true
//     });
//     console.log("test surtug:",surtug)
//     if(surtug.length == 0){
//       let err = new Error('data surat tugas perjadin tidak ditemukan')
//       err.statusCode = 422;
//       throw err
//     }
    
    
//   //table dokumen
//   const dokumenPanutan = await dokumenKirimPanutan.findAll({where:{id_surat_tugas:id,aktif:{[Op.in]:[1,2]},katagori_surat:{[Op.in]:["Perjalanan-Dinas","perjadin-keuangan"]}}})
//   //dokumen panutan
//   const APIPanutan = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`)
//   .catch((err) => {return new Error('Data dari Panutan Error: ',err.message)})
//   const dokumenDariPanutan = APIPanutan?.data?.data
  
//   //table pegawai
//   const hsurat = await PetugasPerjadinBiaya.findAll({where:{id_surat_tugas:id},group:"nip"})
//   //table pegawai
//   const pegawai = await PetugasPerjadinBiaya.findAll({where:{id_surat_tugas:id}})
//   console.log("test 2:" ,pegawai)
//   //table komponen
//   const komponen = await KomponenPerjadin_1.findAll({where:{id_surat_tugas:id},order:['kode_komponen_honor']})
//   console.log("test 3:" ,komponen)
//   //Data RKA Terpakai
//   const RKATerpakaiPerjadin = await SuratTugasRKAPerjadin.sum('jumlah_budget',
//   {where:{kode_rka:surtug[0].kode_rka,kode_periode:surtug[0].kode_periode, id_surat_tugas:{[Op.not]:id}}})

//   console.log("test 4:" ,RKATerpakaiPerjadin)
//   //data pegawai sebelum dipilih skema
//   let tbpetugasPanutan = []
//   if(pegawai.length == 0){
//     console.log("kesini dulu");
//     tbpetugasPanutan = await db.query(`SELECT * FROM t_petugas_dummy WHERE id_surat = ${id} GROUP BY id_surat,nip,id_tempat_tujuan`, {
//       type: QueryTypes.SELECT,
//     })
//   }

// console.log(req.headers.token_baru);
//   //data RKA dari Ebudgeting
//   const RKADariEbudgeting = await axios
//     .get(
//       `${hostEbudgeting}${idAPI.ebudgeting.rka_bulan}/${surtug[0].kode_rka}/${surtug[0].kode_periode}`
//       // ,
//       // {
//       //   headers: {
//       //     id_user: req.headers.id_user,
//       //     kode_group: req.headers.kode_group,
//       //     token_lama: req.headers.token_lama,
//       //     token_baru: req.headers.token_baru,
//       //   },
//       // }
//     )
//     .then((data) => {
//       let dataReturn = data.data;
//       return dataReturn;
//     })
//     .catch((err) => {
//       let erro = {
//         message: err.message,
//         values: [],
//       };
//       return erro;
//     });

//   //Join Surat Tugas dan Pegawai menggunakan map
//   //array surat tugas paling atas
//   let arrSurtugNested = []
//   surtug.map((st)=>{
//     //array pegawai yang di group by 
//     let ArrdokumenPanutan = []
//     dokumenPanutan.map((dp)=>{
//       let filterPanutan = dokumenDariPanutan.filter((f)=> f.id_trx == dp.id_trx);
//       let link_file = ""
//       let status_tandatangan = ""
//       if(dp.aktif > 1){
//         status_tandatangan = "sudah di tandatangani"
//       }else{
//         status_tandatangan = "belum ditandatangani"
//       }
//       ArrdokumenPanutan.push({
//               "id_trx": dp.id_trx,
//               "katagori_surat": dp.katagori_surat,
//               "id_surat_tugas": dp.id_surat_tugas,
//               "kode_unit": dp.kode_unit,
//               "tahun": dp.tahun,
//               "jenis_surat": dp.jenis_surat,
//               "id_nomor": dp.id_nomor,
//               "nomor": dp.nomor,
//               "tanggal": dp.tanggal,
//               "link_file": dp.link_file,
//               "status_tandatangan":status_tandatangan,
//               "aktif": dp.aktif
//       })
//     })
//     let arrPegawaiGroup = []
//     if(hsurat.length > 0){
//       hsurat.map((pg)=>{
//         //array detail perjalanan pegawai
//         let arrDetailPerjalanan = []
//         let total_biaya = 0
//         let pegawaiFilter = pegawai.filter((p)=>p.nip === pg.nip);
//         pegawaiFilter.map((p)=>{
//           let komponenFilter = komponen.filter((k)=>k.nip == p.nip && k.kode_kota_asal == p.kode_kota_asal)
//           let arrKomponen = []
//           let biayaDetail = 0
//           komponenFilter.map((kf)=>{
//             arrKomponen.push({
//               "id_surat_tugas": kf.id_surat_tugas,
//               "nip": kf.nip,
//               "kode_kota_asal": kf.kode_kota_asal,
//               "kode_kota_tujuan": kf.kode_kota_tujuan,
//               "urut_tugas": kf.urut_tugas,
//               "kode_komponen_honor": kf.kode_komponen_honor,
//               "keterangan_komponen": kf.keterangan_komponen,
//               "kode_satuan": kf.kode_satuan,
//               "biaya_satuan": kf.biaya_satuan,
//               "pajak_persen": kf.pajak_persen,
//               "jumlah_pajak": kf.jumlah_pajak,
//               "jumlah": kf.jumlah,
//               "total": kf.total
//             })
//             biayaDetail += parseInt(kf.total)
//           })
//           // Mapping Komponen 
//             arrDetailPerjalanan.push({
//                 "kode_kota_asal": p.kode_kota_asal,
//                 "kode_kota_tujuan": p.kode_kota_tujuan,
//                 "urut_tugas": p.urut_tugas,
//                 "nama_petugas": p.nama_petugas,
//                 "nama_bank": p.nama_bank,
//                 "nomor_rekening": p.nomor_rekening,
//                 "nomor_rekening_dipakai": p.nomor_rekening_dipakai,
//                 "npwp": p.npwp,
//                 "kode_provinsi_asal": p.kode_provinsi_asal,
//                 "nama_kota_asal": p.nama_kota_asal,
//                 "kode_provinsi_tujuan": p.kode_provinsi_tujuan,
//                 "nama_kota_tujuan": p.nama_kota_tujuan,
//                 "kode_unit_tujuan": p.kode_unit_tujuan,
//                 "tahun": p.tahun,
//                 "tanggal_pergi": p.tanggal_pergi,
//                 "tanggal_pulang": p.tanggal_pulang,
//                 "lama_perjalanan": p.lama_perjalanan,
//                 "transport": p.transport,
//                 "biaya": biayaDetail,
//                 "komponen": komponenFilter
//             })
//             total_biaya += biayaDetail
//         })
//       arrPegawaiGroup.push({
//         "nip":pg.nip,
//         "nama_pegawai":pg.nama_petugas,
//         "total_biaya":total_biaya,
//         "nama_bank":pg.nama_bank,
//         "nomor_rekening":pg.nomor_rekening,
//         "nomor_rekening_dipakai":pg.nomor_rekening_dipakai,
//         "npwp":pg.npwp,
//         "detail_perjalanan":arrDetailPerjalanan
//       })
//       })
//     }
//     arrSurtugNested.push({
//       "id_surat_tugas": st.id_surat_tugas,
//       "kode_kegiatan_ut_detail": st.kode_kegiatan_ut_detail,
//       "kode_aktivitas_rkatu": st.kode_aktivitas_rkatu,
//       "kode_rka": st.kode_rka,
//       "kode_periode": st.kode_periode,
//       "nomor_surat_tugas": st.nomor_surat_tugas,
//       "tanggal_surat_tugas": st.tanggal_surat,
//       "tahun": st.tahun,
//       "tanggal_surat_tugas":st.tanggal_surat_tugas,
//       "kode_unit": st.kode_unit,
//       "kode_sub_unit": st.kode_sub_unit,
//       "data_pengusulan":st.data_pengusulan,
//       "ucr": st.ucr,
//       "uch": st.uch,
//       "udcr": st.udcr,
//       "udch": st.udch,
//       "status":st.status,
//       "skema":st.skema,
//       "dokumen":ArrdokumenPanutan,
//       "hsurat":arrPegawaiGroup
//     })
    
//   })



//   //susun data untuk di passing ke body API
//   let dataOutput = [];
//   dataOutput.push({
//     "surtug": arrSurtugNested,
//     "RKADariEbudgeting": RKADariEbudgeting,
//     "RKATerpakaiPerjadin": RKATerpakaiPerjadin,
//     "petugasDummy": tbpetugasPanutan
//   })
//   //lemparan data
//   jsonFormat(res,"success","berhasil memuat data",dataOutput);
//   }catch(error){
//     next(error)
//   }
  
// }
//#endregion

exports.nestednew = async(req,res,next)=>{
  try{
    let id = req.params.id
    console.log("test 2")
    // get data nomor surat
    const surtug = await SuratTugasPerjadin.findAll({
      where: {
        id_surat_tugas: id,
      },
       order:[['udcr','desc']],
        include:[{
          model:Status,
          as:"status"
        },{
          model:Skema,
          as:"skema"
        },
        {
          model:PetugasPerjadinBiaya,
          as:"hsurat",
          group:["nip"],
          }
        ],
        row:true
    });
    // console.log("test surtug:",surtug)
    if(surtug.length == 0){
      let err = new Error('data surat tugas perjadin tidak ditemukan')
      err.statusCode = 422;
      throw err
    }
    
    
    
  //table dokumen
  const dokumenPanutan = await dokumenKirimPanutan.findAll({where:{id_surat_tugas:id,aktif:{[Op.in]:[1,2]},katagori_surat:{[Op.in]:["Perjalanan-Dinas","perjadin-keuangan"]}}})
  //dokumen panutan
  const APIPanutan = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`)
  .catch((err) => {return new Error('Data dari Panutan Error: ',err.message)})
  const dokumenDariPanutan = APIPanutan?.data?.data
  
  const APIBeritaAcara = await axios.get(`${hostProdevPanutannew}${idAPI.panutan.data_api_beritaacara}/${id}`)
  .catch((err) => {return new Error('Data dari Panutan Error: ',err.message)})
  const dataPanutanget = APIBeritaAcara?.data?.data

  const APIPengganti = await panutanCek(id)
  const datapegawaiganti = APIPengganti?.data.data_petugas
  // const data_path =APIPengganti.data?.path
  

    //table pegawai
    const hsurat = await PetugasPerjadinBiaya.findAll({where:{id_surat_tugas:id},group:"nip"})
    //table pegawai
    const pegawai = await PetugasPerjadinBiaya.findAll({where:{id_surat_tugas:id}})
    // console.log("test 2:" ,pegawai)
    //table komponen
    const komponen = await KomponenPerjadin_1.findAll({where:{id_surat_tugas:id},order:['kode_komponen_honor']})
    console.log("test 3:" ,komponen)
    //Data RKA Terpakai
    const RKATerpakaiPerjadin = await SuratTugasRKAPerjadin.sum('jumlah_budget',
    {where:{kode_rka:surtug[0].kode_rka,kode_periode:surtug[0].kode_periode, id_surat_tugas:{[Op.not]:id}}})
  
    console.log("test 4:" ,RKATerpakaiPerjadin)
    //data pegawai sebelum dipilih skema
    let tbpetugasPanutan = []
    if(pegawai.length == 0){
      // console.log("kesini dulu");
      tbpetugasPanutan = await db.query(`SELECT * FROM t_petugas_dummy WHERE id_surat = ${id} GROUP BY id_surat,nip,id_tempat_tujuan`, {
        type: QueryTypes.SELECT,
      })
    }

    // komentar revisi
    let komentar = await komentarRevisi.findAll({where:{kode_surat:id,aktif:"AKTIF"}})
  
  console.log(req.headers.token_lama);
  console.log(req.headers.token_baru);
    //data RKA dari Ebudgeting
    const RKADariEbudgeting = await axios
      .get(
        `${hostEbudgeting}${idAPI.ebudgeting.rka_bulan}/${surtug[0].kode_rka}/${surtug[0].kode_periode}`
        // ,
        // {
        //   headers: {
        //     id_user: req.headers.id_user,
        //     kode_group: req.headers.kode_group,
        //     token_lama: req.headers.token_lama,
        //     token_baru: req.headers.token_baru,
        //   },
        // }
      )
      .then((data) => {
        let dataReturn = data.data;
        return dataReturn;
      })
      .catch((err) => {
        let erro = {
          message: err.message,
          values: [],
        };
        return erro;
      });
  
    //Join Surat Tugas dan Pegawai menggunakan map
    //array surat tugas paling atas
    let arrSurtugNested = []
    if(dataPanutanget.length === 0 ) {
      surtug.map((st)=>{
        //array pegawai yang di group by 
        let ArrdokumenPanutan = []
        dokumenPanutan.map((dp)=>{
          let filterPanutan = dokumenDariPanutan.filter((f)=> f.id_trx == dp.id_trx);
          let link_file = ""
          let status_tandatangan = ""
          if(dp.aktif > 1){
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
        let arrPegawaiGroup = []
        if(hsurat.length > 0){
          hsurat.map((pg)=>{
            //array detail perjalanan pegawai
            let arrDetailPerjalanan = []
            let total_biaya = 0
            let pegawaiFilter = pegawai.filter((p)=>p.nip === pg.nip);
          
            
            pegawaiFilter.map((p)=>{
  
              let komponenFilter = komponen.filter((k)=>k.nip == p.nip && k.kode_kota_asal == p.kode_kota_asal)
              let arrKomponen = []
              let biayaDetail = 0
              komponenFilter.map((kf)=>{
                arrKomponen.push({
                  "id_surat_tugas": kf.id_surat_tugas,
                  "nip": kf.nip,
                  "kode_kota_asal": kf.kode_kota_asal,
                  "kode_kota_tujuan": kf.kode_kota_tujuan,
                  "urut_tugas": kf.urut_tugas,
                  "kode_komponen_honor": kf.kode_komponen_honor,
                  "keterangan_komponen": kf.keterangan_komponen,
                  "kode_satuan": kf.kode_satuan,
                  "biaya_satuan": kf.biaya_satuan,
                  "pajak_persen": kf.pajak_persen,
                  "jumlah_pajak": kf.jumlah_pajak,
                  "jumlah": kf.jumlah,
                  "total": kf.total
                })
                biayaDetail += parseInt(kf.total)
              })
              // Mapping Komponen 
                arrDetailPerjalanan.push({
                    "kode_kota_asal": p.kode_kota_asal,
                    "kode_kota_tujuan": p.kode_kota_tujuan,
                    "urut_tugas": p.urut_tugas,
                    "nama_petugas": p.nama_petugas,
                    "nama_bank": p.nama_bank,
                    "nomor_rekening": p.nomor_rekening,
                    "nomor_rekening_dipakai": p.nomor_rekening_dipakai,
                    "npwp": p.npwp,
                    "kode_provinsi_asal": p.kode_provinsi_asal,
                    "nama_kota_asal": p.nama_kota_asal,
                    "kode_provinsi_tujuan": p.kode_provinsi_tujuan,
                    "nama_kota_tujuan": p.nama_kota_tujuan,
                    "kode_unit_tujuan": p.kode_unit_tujuan,
                    "tahun": p.tahun,
                    "tanggal_pergi": p.tanggal_pergi,
                    "tanggal_pulang": p.tanggal_pulang,
                    "lama_perjalanan": p.lama_perjalanan,
                    "transport": p.transport,
                    "biaya": biayaDetail,
                    "komponen": komponenFilter
                })
                total_biaya += biayaDetail
            })
          arrPegawaiGroup.push({
            "nip":pg.nip,
            "nama_pegawai":pg.nama_petugas,
            "total_biaya":total_biaya,
            "nama_bank":pg.nama_bank,
            "nomor_rekening":pg.nomor_rekening,
            "nomor_rekening_dipakai":pg.nomor_rekening_dipakai,
            "npwp":pg.npwp,
            "detail_perjalanan":arrDetailPerjalanan,
          })
          })
        }
        arrSurtugNested.push({
          "id_surat_tugas": st.id_surat_tugas,
          "kode_kegiatan_ut_detail": st.kode_kegiatan_ut_detail,
          "kode_aktivitas_rkatu": st.kode_aktivitas_rkatu,
          "kode_rka": st.kode_rka,
          "kode_periode": st.kode_periode,
          "nomor_surat_tugas": st.nomor_surat_tugas,
          "tanggal_surat_tugas": st.tanggal_surat,
          "tahun": st.tahun,
          "tanggal_surat_tugas":st.tanggal_surat_tugas,
          "kode_unit": st.kode_unit,
          "kode_sub_unit": st.kode_sub_unit,
          "ucr": st.ucr,
          "uch": st.uch,
          "udcr": st.udcr,
          "udch": st.udch,
          "status":st.status,
          "skema":st.skema,
          "dokumen":ArrdokumenPanutan,
          "komentar":komentar,
          "hsurat":arrPegawaiGroup
        })
        
      })
        //susun data untuk di passing ke body API
    let dataOutput = [];
    dataOutput.push({
      "surtug": arrSurtugNested,
      "RKADariEbudgeting": RKADariEbudgeting,
      "RKATerpakaiPerjadin": RKATerpakaiPerjadin,
      "petugasDummy": tbpetugasPanutan
    })
    //lemparan data
    jsonFormat(res,"success","berhasil memuat data",dataOutput);
    }
   
    else {
      surtug.map((st)=>{
        //array pegawai yang di group by 
        let ArrdokumenPanutan = []
        dokumenPanutan.map((dp)=>{
          let filterPanutan = dokumenDariPanutan.filter((f)=> f.id_trx == dp.id_trx);
          let link_file = ""
          let status_tandatangan = ""
          if(dp.aktif > 1){
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
        let arrPegawaiGroup = []
        if(hsurat.length > 0){
          hsurat.map((pg)=>{
            //array detail perjalanan pegawai
            let arrDetailPerjalanan = []
            let total_biaya = 0
            let pegawaiFilter = pegawai.filter((p)=>p.nip === pg.nip);
            let cek_data = datapegawaiganti.filter(petugas => petugas.nip_petugas_diganti === pg.nip).map((a) => a)
            console.log(cek_data[0].nip_petugas_pengganti)
            pegawaiFilter.map((p)=>{
  
              let komponenFilter = komponen.filter((k)=>k.nip == p.nip && k.kode_kota_asal == p.kode_kota_asal)
              let pegawaiFilter = datapegawaiganti.filter(petugas => petugas.nip_petugas_diganti === p.nip)
              let arrKomponen = []
              let biayaDetail = 0
              komponenFilter.map((kf)=>{
                arrKomponen.push({
                  "id_surat_tugas": kf.id_surat_tugas,
                  "nip": cek_data[0].nip_petugas_pengganti,
                  "kode_kota_asal": kf.kode_kota_asal,
                  "kode_kota_tujuan": kf.kode_kota_tujuan,
                  "urut_tugas": kf.urut_tugas,
                  "kode_komponen_honor": kf.kode_komponen_honor,
                  "keterangan_komponen": kf.keterangan_komponen,
                  "kode_satuan": kf.kode_satuan,
                  "biaya_satuan": kf.biaya_satuan,
                  "pajak_persen": kf.pajak_persen,
                  "jumlah_pajak": kf.jumlah_pajak,
                  "jumlah": kf.jumlah,
                  "total": kf.total
                })
                biayaDetail += parseInt(kf.total)
              })
              // Mapping Komponen 
                arrDetailPerjalanan.push({
                    "kode_kota_asal": p.kode_kota_asal,
                    "kode_kota_tujuan": p.kode_kota_tujuan,
                    "urut_tugas": p.urut_tugas,
                    "nama_petugas": cek_data[0].nama_petugas_pengganti,
                    "nama_bank": p.nama_bank,
                    "nomor_rekening": p.nomor_rekening,
                    "nomor_rekening_dipakai": p.nomor_rekening_dipakai,
                    "npwp": p.npwp,
                    "kode_provinsi_asal": p.kode_provinsi_asal,
                    "nama_kota_asal": p.nama_kota_asal,
                    "kode_provinsi_tujuan": p.kode_provinsi_tujuan,
                    "nama_kota_tujuan": p.nama_kota_tujuan,
                    "kode_unit_tujuan": p.kode_unit_tujuan,
                    "tahun": p.tahun,
                    "tanggal_pergi": p.tanggal_pergi,
                    "tanggal_pulang": p.tanggal_pulang,
                    "lama_perjalanan": p.lama_perjalanan,
                    "transport": p.transport,
                    "biaya": biayaDetail,
                    "komponen": komponenFilter
                })
                total_biaya += biayaDetail
            })
          arrPegawaiGroup.push({
            "nip":cek_data[0].nip_petugas_pengganti,
            "nama_pegawai":cek_data[0].nama_petugas_pengganti,
            "total_biaya":total_biaya,
            "nama_bank":pg.nama_bank,
            "nomor_rekening":pg.nomor_rekening,
            "nomor_rekening_dipakai":pg.nomor_rekening_dipakai,
            "npwp":pg.npwp,
            "detail_perjalanan":arrDetailPerjalanan,
          })
          })
        }
        arrSurtugNested.push({
          id_surat_tugas: st.id_surat_tugas,
          kode_kegiatan_ut_detail: st.kode_kegiatan_ut_detail,
          kode_aktivitas_rkatu: st.kode_aktivitas_rkatu,
          kode_rka: st.kode_rka,
          kode_periode: st.kode_periode,
          nomor_surat_tugas: st.nomor_surat_tugas,
          tanggal_surat_tugas: st.tanggal_surat,
          tahun: st.tahun,
          tanggal_surat_tugas: st.tanggal_surat_tugas,
          kode_unit: st.kode_unit,
          kode_sub_unit: st.kode_sub_unit,
          komentar: komentar,
          ucr: st.ucr,
          uch: st.uch,
          udcr: st.udcr,
          udch: st.udch,
          status: st.status,
          skema: st.skema,
          dokumen: ArrdokumenPanutan,
          hsurat: arrPegawaiGroup,
        });
        
      })
       //susun data untuk di passing ke body API
    let dataOutput = [];
    dataOutput.push({
      "path" : "https://panutan.ut.ac.id/" +  APIPengganti.data?.path,
      "surtug": arrSurtugNested,
      "RKADariEbudgeting": RKADariEbudgeting,
      "RKATerpakaiPerjadin": RKATerpakaiPerjadin,
      "petugasDummy": tbpetugasPanutan
    })
    //lemparan data
    jsonFormat(res,"success","berhasil memuat data",dataOutput);
    }
  
  
   
    }catch(error){
      next(error)
    }
  
  
}

const panutanCek = async (id_surat) => {
  let data = await axios
    .get(
      `${hostProdevPanutannew}${idAPI.panutan.data_pegawai_ganti}/${id_surat}`
    )
    .catch((err) => {
      return new Error("Data Dari Panutan Error"), err.message;
    });
  return data.data;
};

exports.showdokumen = async(req,res,next)=>{
  try{
  await SuratTugasPerjadin.findOne({
    where: {
      id_surat_tugas: req.params.id,
    },
     order:[['udcr','desc']],
      include:[{
        model:Status,
        as:"status"
      },{
        model:Skema,
        as:"skema"
      },{
        model:dokumenKirimPanutan,
        as:"dokumen",
        where:{aktif:{[Op.in]:[1,2]}}
      }
      ],
      row:true
  }).then((data)=>{
    if(!data){
      let err = new Error('data surat tugas perjadin tidak ditemukan')
      err.statusCode = 422;
      throw err
    }
    let dataArr = []
    data.map((sp)=>{
      dataArr.push({
        id_surat_tugas:sp.id_surat_tugas,
        kode_rka:sp.kode_rka,
        kode_skema_perjadin: sp.skema,
        status:sp.kode_status,
        keterangan_status:sp.keterangan_status,
        nomor_surat_tugas:sp.nomor_surat_tugas
      })
    })
    
  })
}
catch(err){
  next(err)
}
}

exports.createNew = async (req, res, next) => {
 
  try{

    const cekpernahdiinput = await SuratTugasPerjadin.count({where:{id_surat_tugas: req.body.id_surat_tugas}}).catch((err)=>{throw err});
    
    if(cekpernahdiinput>0){
    
      const cekStatus = await SuratTugasPerjadin.count({where:{id_surat_tugas: req.body.id_surat_tugas,kode_status:{[Op.in]:[3,4,5,6,7,8,9,10]}}})
      .then((hitung)=>{
      if(hitung>0){
        let err = new Error('surat ini sudah tidak Bisa merubah RKA')
        throw err
      }
      return hitung
    })
    .catch((err)=>{throw err})
    
    const update = await SuratTugasPerjadin.update({kode_rka:req.body.kode_rka,kode_periode:req.body.kode_periode,data_pengusulan: req.body.data_pengusulan},{where:{id_surat_tugas:req.body.id_surat_tugas}})
    .then((up)=>{
      return jsonFormat(res,"success","Berhasil mengubah RKA",up)
    })
    .catch((err)=>{throw err})

  }else{
    const create = await db.transaction().then((t)=>{
      return SuratTugasPerjadin.create(
        {
          data_pengusulan: req.body.data_pengusulan,
          id_surat_tugas: req.body.id_surat_tugas,
          kode_kegiatan_ut_detail: req.body.kode_kegiatan_ut_detail,
          kode_aktivitas_rkatu: req.body.kode_aktivitas_rkatu,
          kode_rka: req.body.kode_rka,
          kode_periode: req.body.kode_periode,
          nomor_surat_tugas: req.body.nomor_surat_tugas,
          tanggal_surat_tugas: req.body.tanggal_surat_tugas,
          kode_sub_unit: req.body.kode_sub_unit,
          kode_unit: req.body.kode_unit,
          path_dokumen: req.body.dokumen,
          kode_skema: 0,
          kode_status: 2,
          tahun: req.body.tahun,
          ucr: req.body.ucr,
        },
        { transaction: t }
      )
        .then((surat) => {
          console.log(surat)
          const pegawai = req.body.pegawai.map((p) => {
            return {
              id_surat_tugas: req.body.id_surat_tugas,
              nip: p.nip,
              kode_kota_asal: p.kode_kota_asal,
              kode_kota_tujuan: p.kode_kota_tujuan,
              tahun: req.body.tahun,
              nama_petugas: p.nama_petugas,
              kode_bank_tujuan: p.kode_bank_tujuan,
              nama_bank: p.nama_bank,
              nomor_rekening: p.nomor_rekening,
              gol: p.gol,
              eselon: p.eselon,
              npwp: p.npwp,
              kode_provinsi_asal: p.kode_provinsi_asal,
              kode_provinsi_tujuan: p.kode_provinsi_tujuan,
              nama_kota_asal: p.nama_kota_asal,
              nama_kota_tujuan: p.nama_kota_tujuan,
              kode_unit_tujuan: p.kode_unit_tujuan,
              tanggal_pergi: p.tanggal_pergi,
              tanggal_pulang: p.tanggal_pulang,
              lama_perjalanan: p.lama_perjalanan,
              keterangan_dinas: p.keterangan_dinas,
            };
          });

          return PetugasPerjadinBiaya.bulkCreate(pegawai, { transaction: t })
            .then((pegInsert) => {
              t.commit();
              axios.post(
                `${hostProdevPanutannew}${idAPI.panutan.update_status_perjadin}/${req.body.kode_unit}/${req.body.id_surat_tugas}`
              );
              return jsonFormat(
                res,
                "success",
                "Berhasil menginputkan data",
                pegInsert
              );
            })
            .catch((err) => {
              t.rollback();
              return next(err);
            });
        })
        .catch((err) => {
          t.rollback();
          return next(err);
        });
    })
  }
    
  }catch(err){
    return next(err)
  }

};

