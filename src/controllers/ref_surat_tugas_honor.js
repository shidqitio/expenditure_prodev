const { jsonFormat } = require("../utils/jsonFormat");
const request = require("request");
const SuratTugasHonor = require("../models/ref_surat_tugas_honor");
//const dokumenHonor = require("../models/trx_dokumen_honor");
const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
const { validationResult } = require("express-validator");
const db = require("../config/database");
const { QueryTypes,Op } = require("sequelize");
const axios = require("axios");
const Status = require("../models/ref_status");
const hostProdevPanutannew = process.env.hostProdevPanutannew
const hostEbudgeting = process.env.hostEbudgeting
const hostExpenditure = process.env.hostExpenditure
const idAPI = require("../lang/id-api.json")

exports.getAll = async (req, res, next) => {
  try {
    //const data = await SuratTugasHonor.findAll();
    const tbdata = await SuratTugasHonor.findAll({
      order:[['udcr','desc']],
        include:{
          model:Status,
          as:"status"
        },
        row:true
    });
    jsonFormat(res, "success", "Berhasil memuat data", tbdata);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}; 

exports.create = async (req, res, next) => {
  try {
  let cekstatus = await SuratTugasHonor.findAll({
    where: {   id_surat_tugas: req.body.id_surat_tugas,kode_status:{[Op.in]:[3,4,5]} }
  });
  console.log("mau cek status",cekstatus);
  if (cekstatus.length > 0){
    return jsonFormat(res, "failed","Tidak Bisa merubah RKA", []);
  }
  const cek = await SuratTugasHonor.destroy({
    where: {
      id_surat_tugas: req.body.id_surat_tugas,
    },
  });
      await SuratTugasHonor.create({
      id_surat_tugas: req.body.id_surat_tugas,
      kode_kegiatan_ut_detail: req.body.kode_kegiatan_ut_detail,
      kode_aktivitas_rkatu:req.body.kode_aktivitas_rkatu,
      kode_rka: req.body.kode_rka,
      kode_periode: req.body.kode_periode,
      nomor_surat_tugas: req.body.nomor_surat_tugas,
      tanggal_surat_tugas: req.body.tanggal_surat_tugas,
      kode_unit: req.body.kode_unit,
      kode_status:2,
      tahun: req.body.tahun,
      ucr: req.body.ucr,
    });
    jsonFormat(res, "success", "Berhasil membuat data", []);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.withPanutan = async(req,res,next)=>{
  try{
  const panutan = await axios.get(`${hostProdevPanutannew}${idAPI.panutan.sk_by_honor}?id=${req.params.id}&metode=${req.params.jenis_honor}&nama=${req.params.nama}}`);
  const honor = await SuratTugasHonor.findAll({where:{id_sub_unit:req.body.id,jenis_honor:req.params.jenis_honor,nama_honor:req.params.nama}})
  const ArrIdSurat = await honor.map((a)=>a.id_surat_tugas)
  let data = []
  panutan.map((p)=>{
    if(!ArrIdSurat.includes(p.id_surat)){
      data.push(p)
    }
  })
  jsonFormat(res,"success","Berhasil Membuat Data",data)
  }catch(arr){
    next(err)
  }
}

exports.getByRka = async (req, res, next) => {
  try {
    const data = await SuratTugasHonor.findAll({
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
    const surtug = await SuratTugasHonor.findAll({
      where: {
        kode_unit: req.params.id,
      },
    });

    if (surtug.length === 0)
      return jsonFormat(res, "failed", "kode unit tidak ada", []);

    jsonFormat(res, "success", "Berhasil memuat data", surtug[0]);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await SuratTugasHonor.findOne({
      where: { kode_rka: req.params.id },
    });

    if (data === null)
      return jsonFormat(res, "failed", "kode rka tidak ada", []);

    await SuratTugasHonor.update(req.body, {
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
    const data = await SuratTugasHonor.findOne({
      where: { id_surat_tugas: req.params.id },
    });

    if (data === null)
      return jsonFormat(res, "failed", "id_surat tidak ada", []);

    await SuratTugasHonor.destroy({
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
  try { 
  let cekdata,message_data;
  let data = [];
  cekdata = await SuratTugasHonor.findAll({
    where: {
      id_surat_tugas: req.params.id,
    },
  });
  if (cekdata.length === 0)
  {
    let suratpanutan = await axios.get(`${hostProdevPanutannew}${idAPI.panutan.detail_perjadin}/${req.params.id}`);
    suratpanutan.data.data.map((surat) => {
      data.push({
        id_surat_tugas: surat.id_surat,
        kode_kegiatan_ut_detail: 1,
        kode_rka: null,
        nomor_surat_tugas: surat.nomor_surat,
        tanggal_surat_tugas: surat.tanggal_surat,
        tahun: surat.tahun,
      })
    })
    // data = suratpanutan.data.data;
    message_data= "data masih dari panutan";
  }else{
    data.push(cekdata[0]);
    message_data= "data telah ada di expenditure";
  }

    jsonFormat(res, "success", message_data, data);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.nested = async (req,res,next) => {
  try { 
  const data = await db.query(`SELECT * FROM ref_surat_tugas_honor sh LEFT JOIN ref_status AS s 
  ON (sh.kode_status=s.kode_status)
   WHERE id_surat_tugas = ${req.params.id}`, {
    type: QueryTypes.SELECT,
  })
  if(data.length === 0)
  return jsonFormat(res, "failed", "data tidak ada ", []);

  const petugas = await db.query(`SELECT * FROM trx_petugas_dummy_honor 
  WHERE id_surat_tugas = :id `,{
    replacements:{id:req.params.id},
    type:QueryTypes.SELECT
  });

let arrSurat = [];
let arrpetugas = [];

let cekrka = await axios.get(`${hostEbudgeting}${idAPI.ebudgeting.rka_bulan}${data[0].kode_rka}/${data[0].kode_periode}`);

if(cekrka.data.values[0].jumlah === null)
  {return jsonFormat(res, "failed", "data RKA atau pagu tidak ditemukan", []);}


let jumlah_pagu = cekrka.data.values[0].alokasi_pagu_unit;
let jumlah_RKA = cekrka.data.values[0].jumlah;

// let jumlah_pagu = cekrka[0].alokasi_pagu_unit;
// let jumlah_RKA = cekrka[0].jumlah;

let tbrkaterpakai = await db.query(`SELECT ifnull(sum(jumlah_budget),0) as jumlah_setelah_dikurangi,
ifnull(sum(case when id_surat_tugas <> ${req.params.id} then jumlah_budget else 0 end),0) as jumlah_terpakai FROM ref_surat_tugas_rka_honor WHERE kode_rka = ${data[0].kode_rka} AND id_surat_tugas NOT IN(${req.params.id})`,
    {type:QueryTypes.SELECT});
   
    let rka_terpakai = tbrkaterpakai[0].jumlah_terpakai; 
    let sisa_rka = jumlah_RKA-rka_terpakai;
    let sisa_rka_setelah_dikurangi =  jumlah_RKA-tbrkaterpakai[0].jumlah_setelah_dikurangi;  
   
    let datapenandatangan ={
      jabatan: "PPK-PBJ Kegiatan Strategis dan Pelaksana Tugas Lain Universitas",
      nama:"Adrian Sutawijaya, S.E., M.Si.",
      nip:"199711242021TKT1442",
      email:"muqsith@ecampus.ut.ac.id"
    }
  
    const dokumentable = await dokumenKirimPanutan.findAll({where:{id_surat_tugas:req.params.id, aktif:1,katagori_surat:{[Op.in]:["Honorarium","honorarium-keuangan"]}}})
    let ttdpanutan = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`);
    let datattdpanutan = ttdpanutan.data.data;  
    let arrdokumentable = []
    dokumentable.map((dt)=>{
      let arrttd = datattdpanutan.filter((dtp)=> dtp.id_trx===dt.id_trx)
      let link_file = ""
      let status_ttd = ""
      if(arrttd.length === 1){
        link_file += `${hostProdevPanutannew}/`+arrttd[0].path_final_dok
  
        status_ttd = dt.jenis_surat +" Telah Ditandatangani"
      }else{link_file += `${hostExpenditure}${idAPI.expenditure.view_file_komponen_realisasi_honor}/`+dt.link_file;
      status_ttd = dt.jenis_surat +" Belum Ditandatangani"
    }
      
      arrdokumentable.push({
        id_trx : dt.id_trx,
        id_surat_tugas:dt.id_surat_tugas,
        kode_unit:dt.kode_unit,
        tahun:dt.tahun,
        jenis_surat:dt.jenis_surat,
        id_nomor:dt.id_nomor,
        nomor:dt.nomor,
        status_ttd:status_ttd,
        link_file:link_file
      })
    })

  for(let x = 0;x < petugas.length;x++){
    let tbHonor = [],pph;

     if(petugas[x].sub_katagori_peran == "SBMOK"){
     tbHonor = await db.query(`SELECT satuan,besaran FROM ref_sbm_orang_kegiatan 
      WHERE peran IN (:peran) AND jabatan IN (:jabatan) `,{
    replacements:{
      peran: petugas[x].peran, jabatan:petugas[x].jabatan
    },
    type:QueryTypes.SELECT
      });
      pph = 0;
     }else{
       tbHonor = await db.query(`SELECT satuan,besaran FROM ref_sbm_honor_orang_paket_pagu 
       WHERE kode_uraian IN (:kode_uraian) AND kode_sub IN (:kode_sub)
       AND min_pagu < :pagu AND max_pagu >= :pagu `,{
     replacements:{
       kode_uraian: petugas[x].peran, kode_sub:petugas[x].sub_katagori_peran,
      pagu:jumlah_pagu
     }, 
     type:QueryTypes.SELECT
       });

       let tbpajak = await db.query(`SELECT pph FROM ref_pajak_pph_pergolongan 
       WHERE gol in (:gol)`,{
     replacements:{
       gol: petugas[x].gol
     },
     type:QueryTypes.SELECT
       });
       pph = tbpajak[0].pph;

     }

     
     

    
    arrpetugas.push({
      id_unit: petugas[x].id_unit,
      id_surat_tugas:petugas[x].id_surat_tugas,
      nip:petugas[x].nip,
      nama:petugas[x].nama,
      peran:petugas[x].peran,
      sub_katagori_peran:petugas[x].sub_katagori_peran,
      gol:petugas[x].gol,
      jabatan:petugas[x].jabatan,
      kode_satuan:tbHonor[0].satuan,
      besaran:tbHonor[0].besaran,
      volume:petugas[x].volume,
      pphpersen:pph+"%",
      pph:tbHonor[0].besaran*petugas[x].volume*pph/100,
      terima:(tbHonor[0].besaran*petugas[x].volume)-(tbHonor[0].besaran*petugas[x].volume*pph/100)
    });
  
  }
 

  arrSurat.push({
    id_surat_tugas: data[0].id_surat_tugas,
    kode_kegiatan_ut_detail: data[0].kode_kegiatan_ut_detail,
    kode_rka: data[0].kode_rka,
    jumlah_RKA:jumlah_RKA,
    jumlah_pagu: jumlah_pagu,
    rka_terpakai:rka_terpakai,
    sisa_rka:sisa_rka,
    sisa_rka_setelah_dikurangi:sisa_rka_setelah_dikurangi,
    nomor_surat_tugas: data[0].nomor_surat_tugas,
    tanggal_surat_tugas:data[0].tanggal_surat_tugas,
    tahun:data[0].tahun,
    kode_unit:data[0].kode_unit,
    status: data[0].kode_status,
    keterangan_status:data[0].keterangan_status,
    petugas:arrpetugas,
    pagudariebudgeting:cekrka.data.values[0],
    document:arrdokumentable,
    datapenandatangan: datapenandatangan
  });


  console.log("array surat",arrSurat);
   

    jsonFormat(res, "success", "SEPERTINYA RIO SUDAH BOLEH PULANG", arrSurat);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}

exports.getAllwithPanutan = async (req,res,next) => {
  try{
  let statusexpenditure,statussurat,idsuratexpenditure;
  const daripanutan = await axios.get(`${hostProdevPanutannew}${idAPI.panutan.surtug_perjadin}/${req.params.id}`);
  const panutan = [];
  for(const key in daripanutan.data){
    const mappedData = {
      ...daripanutan.data[key]
    };
    panutan.push(mappedData);
  }
  const expenditure = await SuratTugasHonor.findAll({
    order:[['udcr','desc']],
      include:{
        model:Status,
        as:"status"
      },

  })

  idsuratexpenditure = expenditure.map((expen) => expen.id_surat_tugas);
  let arrsurat = [];
  console.log("dari panutan",panutan);
  console.log("dari expenditure",expenditure);  
  panutan.map((pn) => { 
    if(idsuratexpenditure.includes(pn.id_surat)){
    expenditure.map((ex) => {
      if(ex.id_surat_tugas === pn.id_surat){
        statussurat = ex.status.keterangan_status;
        statusexp = ex.status.kode_status;
      }
    })
  }else{statussurat = "Belum dikaitkan dengan RKA";statusexp = 0;}
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
        keterangan_status:statussurat,
        petugas: pn.petugas
    })
  });
  jsonFormat(res, "success", "Berhasil memuat data", arrsurat);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}

exports.insertPanutan = async(req,res,next) =>{
  try{
    const createSuratHonor = await SuratTugasHonor.create(req.body)
    jsonFormat(res, "success", "Berhasil menginput data", createSuratHonor);
  }catch(err){
    err.statusCode = 400
    next(err)
  }
}

const updatehonor = (dataUpdate,dataKondisi) =>{
  return SuratTugasHonor.update({dataUpdate},{where:{dataKondisi}})
}
