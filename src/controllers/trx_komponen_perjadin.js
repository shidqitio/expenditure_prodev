const { jsonFormat } = require("../utils/jsonFormat");
const KomponenPerjadin = require("../models/trx_komponen_perjadin");
const axios = require("axios");
//const { validationResult } = require("express-validator");
const hostEbudgeting = process.env.hostEbudgeting
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const idAPI = require("../lang/id-api.json")
const db = require("../config/database");
const { QueryTypes } = require("sequelize");

exports.getByIdSurat = async (req, res, next) =>{
    let tbPetugas,petugasData,tbKomponen,nipId,tbrka,tbSumKomponen,tbSumSurat;
    tbPetugas = await axios.get(`${hostProdevPanutannew}${idAPI.panutan.petugas_perjadin}/${req.params.id_surat}`);
    tbrka = await axios.get(`${hostEbudgeting}${idAPI.ebudgeting.rka_byid_5}`);
    console.log(tbrka);
    let rkadata = tbrka.data.values
    petugasData = tbPetugas.data;
    nipId = petugasData.map((petugas) => petugas.nip);
   
    tbSumSurat = await db.query(
        `SELECT sum(total) as total_sum_surat FROM trx_komponen_perjadin 
         WHERE nomor_surat_tugas = (:nomor_surat_tugas)`,
        {
          replacements: {nomor_surat_tugas: petugasData[0].id_surat },
          type: QueryTypes.SELECT,
        }
        
      );
    
     if(nipId.length > 0){
      tbKomponen = await db.query(
        `SELECT tkp.*,nama_komponen_perjadin,kode_satuan FROM trx_komponen_perjadin AS tkp JOIN ref_komponen_perjadin AS rkp
        ON (tkp.kode_komponen_honor = rkp.kode_komponen_perjadin)
         WHERE nip IN (:nip) AND nomor_surat_tugas = (:nomor_surat_tugas)`,
        {
          replacements: { nip: nipId,nomor_surat_tugas:petugasData[0].id_surat },
          type: QueryTypes.SELECT,
        }
        
      );
      tbSumKomponen = await db.query(
        `SELECT sum(total) as total_sum, nip FROM trx_komponen_perjadin 
         WHERE nip IN (:nip) AND nomor_surat_tugas = (:nomor_surat_tugas) GROUP BY nip`,
        {
          replacements: { nip: nipId,nomor_surat_tugas:petugasData[0].id_surat },
          type: QueryTypes.SELECT,
        }
        
      );
      
     }
     let arrSemua = [];
     let arrPetugas = [];
     let arrrka = [];
     let arrsumsurat = [];
     arrSemua.push({
      detail_rka: arrrka,
      jumlah_biaya: arrsumsurat,
       petugas: arrPetugas,
     });
     
     rkadata.map((rka)=>{
       arrrka.push({kode_rka: rka.kode_rka,
      sub_kegatan:rka.sub_kegatan,
      jumlah:rka.jumlah,
      jumlah_sbm:rka.jumlah_sbm
    });
    
  
     });

     tbSumSurat.map((surat) => {
      arrsumsurat.push({
        total_sum_surat: surat.total_sum_surat
      })
    })
    petugasData.map((petugas) => {
      let arrKomponen = [];
      let arrSumKomponen = [];
      arrPetugas.push({
          id_surat: petugas.id_surat,
          nip: petugas.nip,
          nama: petugas.nama,
          kendaraan:petugas.kendaraan,
          email: petugas.email,
          jabatan: petugas.jabatan,
          unit: petugas.unit,
          gol: petugas.gol,
          id_tempat_asal: petugas.id_tempat_asal,
          tempat_asal: petugas.tempat_asal,
          id_tempat_tujuan: petugas.id_tempat_tujuan,
          tempat_tujuan: petugas.tempat_tujuan,
          lokasi: petugas.lokasi,
          lama_perjalanan: petugas.lama_perjalanan,
          keterangan:petugas.keterangan,
          tanggal_awal: petugas.tanggal_awal,
          tanggal_akhir: petugas.tanggal_akhir,
          total_sum:arrSumKomponen,
          komponen: arrKomponen,
      });
  
      tbSumKomponen.map((sumKomponen) => {
        if(sumKomponen.nip === petugas.nip) {
          arrSumKomponen.push({
            total_sum:sumKomponen.total_sum
          });
        }
      });
      tbKomponen.map((komponen) => {
  
        if (komponen.nip === petugas.nip) {
           arrKomponen.push({
            kode_komponen_honor: komponen.kode_komponen_honor,
            nama_komponen_perjadin: komponen.nama_komponen_perjadin,
            kode_satuan: komponen.kode_satuan,
            pajak_persen: komponen.pajak_persen,
            jumlah_pajak: komponen.jumlah_pajak,
            jumlah: komponen.jumlah,
            biaya_satuan: komponen.biaya_satuan,
            total: komponen.total,
          });
          
  
        }
    });
  });
  
  try { jsonFormat(res, "success", "menampilkan data", arrSemua);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
    
  
  };
 
exports.update = async (req, res, next) => {
    try {
      const data = await KomponenPerjadin.findOne({
        where: { nomor_surat_tugas: req.params.id },
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "nomor surat tidak ada", []);
  
      await KomponenPerjadin.update(req.body, {
        where: {
          nomor_surat_tugas: req.params.id,
        },
      });
  
      jsonFormat(res, "success", "Berhasil memperbarui data", []);
    } catch (error) {
      next(err)
    }
  };