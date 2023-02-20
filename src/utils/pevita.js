const axios = require("axios");
const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
const hostPevita = process.env.hostPevita;
const idAPI = require("../lang/id-api.json");
const aplikasi = process.env.aplikasi
const log4js = require("log4js");
exports.generateNomor = async (
  id_surat_tugas,
  katagori_surat,
  kode_unit,
  tahun,
  type_surat,
  sifat_surat,
  id_jenis_surat,
  id_jenis_nd,
  perihal,
  id_klasifikasi,
  id_sub_unit,
  id_user,
  ucr,
  tanggal,
  tokenpevita,
  datake
) => {
  return dokumenKirimPanutan
    .max("id_trx")
    .then((maxTrx) => {
      let kode_trx = maxTrx + datake;
      let datanomor = {
        aplikasi: aplikasi,
        sifat_surat: sifat_surat,
        id_surat: kode_trx,
        id_jenis_surat: id_jenis_surat,
        id_jenis_nd: id_jenis_nd,
        perihal: perihal,
        id_klasifikasi: id_klasifikasi,
        id_sub_unit: id_sub_unit,
        id_user: id_user,
        nama_pembuat: ucr,
        tanggal: tanggal,
      };
        return axios
          .post(`${hostPevita}${idAPI.pevita.lat_nosurat}`, datanomor, {
            headers: { Authorization: `Bearer ${tokenpevita}` },
          })
          .then((nomor) => {
            let kode_trx = maxTrx + datake;
            let datadokumen = {
              id_trx: kode_trx,
              katagori_surat: katagori_surat,
              id_surat_tugas: id_surat_tugas,
              kode_unit: kode_unit,
              tahun: tahun,
              tanggal: tanggal,
              jenis_surat: type_surat,
              id_nomor: nomor.data?.id_nomor,
              nomor: nomor.data?.nomor,
              aktif: 1,
            };

            return dokumenKirimPanutan.create(datadokumen).then((createa) => {
                            return null
            });
          });
      })
    .catch((err) => {
              log4js.getLogger().debug(err);
              return null;
    });
};

exports.generateNomorBalikan = async (
  id_surat_tugas,
  katagori_surat,
  kode_unit,
  tahun,
  type_surat,
  sifat_surat,
  id_jenis_surat,
  id_jenis_nd,
  perihal,
  id_klasifikasi,
  id_sub_unit,
  id_user,
  ucr,
  tanggal,
  tokenpevita,
  datake
) => {
 dokumenKirimPanutan
    .max("id_trx")
    .then((maxTrx) => {
                // console.log(maxTrx);
      let kode_trx = maxTrx + datake;
      let datanomor = {
        aplikasi: aplikasi,
        sifat_surat: sifat_surat,
        id_surat: kode_trx,
        id_jenis_surat: id_jenis_surat,
        id_jenis_nd: id_jenis_nd,
        perihal: perihal,
        id_klasifikasi: id_klasifikasi,
        id_sub_unit: id_sub_unit,
        id_user: id_user,
        nama_pembuat: ucr,
        tanggal: tanggal,
      };
       axios
        .post(`${hostPevita}${idAPI.pevita.lat_nosurat}`, datanomor, {
          headers: { Authorization: `Bearer ${tokenpevita}` },
        })
        .then((nomor) => {
          // console.log(nomor)
          let kode_trx = maxTrx + datake;
          let datadokumen = {
            id_trx: kode_trx,
            katagori_surat: katagori_surat,
            id_surat_tugas: id_surat_tugas,
            kode_unit: kode_unit,
            tahun: tahun,
            tanggal: tanggal,
            jenis_surat: type_surat,
            id_nomor: nomor.data?.id_nomor,
            nomor: nomor.data?.nomor,
            aktif: 1,
          };

           dokumenKirimPanutan.create(datadokumen).then((createa) => {
            console.log("Console Nomor : ", createa.dataValues);
            return createa;
          });
        });
    })
    .catch((err) => {
      log4js.getLogger().debug(err);
      return err;
    });
};

exports.getNomorPevita =
  (id_surat_tugas,
  katagori_surat,
  kode_unit,
  tahun,
  type_surat,
  sifat_surat,
  id_jenis_surat,
  id_jenis_nd,
  perihal,
  id_klasifikasi,
  id_sub_unit,
  id_user,
  ucr,
  tanggal) =>{
    let newTrx
    let datanomor
    let tokenpevita = tokenPevita();
    let response
     dokumenKirimPanutan.max("id_trx").then((maxTrx) => {
      newTrx = maxTrx + 1;
      datanomor = {
        aplikasi: aplikasi,
        sifat_surat: sifat_surat,
        id_surat: newTrx,
        id_jenis_surat: id_jenis_surat,
        id_jenis_nd: id_jenis_nd,
        perihal: perihal,
        id_klasifikasi: id_klasifikasi,
        id_sub_unit: id_sub_unit,
        id_user: id_user,
        nama_pembuat: ucr,
        tanggal: tanggal,
      };
      if(tokenpevita === null){
        throw new Error('Tidak mendapatkan token')
      }
      response = axios
        .post(`${hostPevita}${idAPI.pevita.lat_nosurat}`, datanomor, {
          headers: { Authorization: `Bearer ${tokenpevita}` }})
    .then((nomor)=>{
      return nomor;
    })
    }).catch((err)=>{
      return err

    })
    return response
  }


exports.token = async () => {
  const gettoken = await axios
    .post(`${hostPevita}${idAPI.pevita.login}`)
  return gettoken.data.access_token;
};

const tokenPevita = async () => {
  const gettoken = await axios.post(`${hostPevita}${idAPI.pevita.login}`);
  return gettoken.data.access_token;
};

