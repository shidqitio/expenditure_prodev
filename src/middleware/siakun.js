const hostSiakunBe1 = process.env.hostSiakunBe1;
const idAPI = require("../lang/id-api.json");
const axios = require("axios");
const log4js = require("log4js");
const { response } = require("express");
exports.storePagu = (
  tahun,
  kode_menu,
  id_surat_tugas,
  tanggal,
  nomor_surat_tugas,
  kode_rkatu,
  kode_periode,
  nominal,
  ucr
) => {
 let dataSiakun = {
   tahun: tahun,
   kode_aplikasi: "08",
   kode_menu: kode_menu,
   kode_surat: id_surat_tugas,
   kode_sub_surat: "-",
   tanggal_transaksi: tanggal,
   keterangan: `Transaksi - Nomor surat:${nomor_surat_tugas}`,
   kode_rkatu: kode_rkatu,
   bulan_rkatu: kode_periode,
   nominal: nominal,
   ucr: ucr,
 };
  try {
    axios.post(`${hostSiakunBe1}${idAPI.siakun.pagu_store}`, dataSiakun).then((res)=>{
    log4js.getLogger().debug(res.data.data);  
    });
    return null;
  } catch (err) {
    log4js.getLogger().debug(err);
    return null;
  }
};

exports.storePaguBalikan = async(
  tahun,
  kode_menu,
  id_surat_tugas,
  tanggal,
  nomor_surat_tugas,
  kode_rkatu,
  kode_periode,
  nominal,
  ucr
) => {
  let dataSiakun = {
    tahun: tahun,
    kode_aplikasi: "08",
    kode_menu: kode_menu,
    kode_surat: id_surat_tugas,
    kode_sub_surat: "-",
    tanggal_transaksi: tanggal,
    keterangan: `Transaksi - Nomor surat:${nomor_surat_tugas}`,
    kode_rkatu: kode_rkatu,
    bulan_rkatu: kode_periode,
    nominal: nominal,
    ucr: ucr,
  };
  try {
    let response = await axios
      .post(`${hostSiakunBe1}${idAPI.siakun.pagu_store}`, dataSiakun)
      
        log4js.getLogger().debug(response.data.data);
      return response.data.data;
  } catch (err) {
    log4js.getLogger().debug(err);
    return err;
  }
};

exports.ReversalPagu = (
  tahun,
  kode_menu,
  id_surat_tugas,
  tanggal,
  nomor_surat_tugas,
  kode_rkatu,
  kode_periode,
  nominal,
  ucr
) => {
 let dataSiakun = {
    tahun: tahun,
    kode_aplikasi: "08",
    kode_menu: kode_menu,
    kode_surat: id_surat_tugas,
    kode_sub_surat: "-",
    tanggal_transaksi: tanggal,
    keterangan: `Reversal - Nomor surat:${nomor_surat_tugas}`,
    kode_rkatu: kode_rkatu,
    bulan_rkatu: kode_periode,
    nominal: nominal,
    ucr: ucr,
  };
  try {
   axios.post(`${hostSiakunBe1}${idAPI.siakun.pagu_reversal}`, dataSiakun).then((res)=>{
    if(res.data.status === "failed"){
    log4js.getLogger().debug(res);
    }
    return null
   }).catch((err)=>{throw err});
    return null;
  } catch (err) {
        log4js.getLogger().debug(err);
    return null;
  }
};


