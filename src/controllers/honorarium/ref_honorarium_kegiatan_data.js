const { stat } = require('fs/promises');
const { QueryTypes,Op } = require("sequelize");
//ref DATA
const dataHonor = (data) =>{
    return {
      kode_surat: data?.id_surat+'-honorarium',
      tahun: data?.tahun,
      id_surat_panutan: data?.id_surat,
      id_sub_unit:data?.id_sub_unit,
      kode_kegiatan_ut_detail:data?.kode_kegiatan_ut_detail,
      kode_aktivitas_rkatu:data?.kode_aktivitas_rkatu,
      kode_rka:data?.kode_rka,
      kode_periode:data?.kode_periode,
      nomor_surat:data?.nomor_surat,
      tanggal_surat:data?.tanggal_surat,
      kode_unit:data?.kode_unit,
      perihal:data?.perihal,
      penandatangan:data?.penandatangan,
      path_sk:data?.path_sk,
      kode_status:data?.kode_status,
      data_pengusulan:data?.data_pengusulan,
      jenis_honor:data?.jenis_honor,
      nama_honor:data?.nama_honor,
      ucr:data?.ucr
    }  
  }
  
  const dataHonorPanutan = (data) =>{
    return {
      kode_surat: data?.kode_surat+'-honorarium',
      tahun: data?.tahun,
      id_surat_panutan: data?.kode_surat,
      id_sub_unit:data?.id_sub_unit,
      nomor_surat:data?.nomor_surat,
      tanggal_surat:data?.tanggal_surat,
      perihal:data?.perihal,
      penandatangan:data?.penandatangan,
      path_sk:data?.path_sk,
      kode_status:0,
      jenis_honor:data?.jenis_honor,
      nama_honor:data?.nama_honor,
      data_pengusulan:data?.data_pengusulan,
      ucr:data?.ucr
  }
}

const dataHonorPanitiaKegiatan = (body,data) =>{
  return{
      kode_trx_surat:body.kode_trx,
      kode_surat:body.kode_surat+`-honorarium`,
      tahun:body.tahun,
      nip:data.nip,
      tugas:data.tugas,
      nama:data?.nama,
      gol:data?.gol,
      npwp:data?.npwp,
      kode_bank:data?.kode_bank,
      nama_bank:data?.nama_bank,
      no_rekening:data?.no_rekening,
      atas_nama_rekening:data?.atas_nama_rekening,
      keterangan:data?.keterangan,
      status:1,
      ucr:body?.ucr
  }
}

  const dataPetugasHonor = async(body,data,sbm,pajak,trx_surat) =>{
    let jumlah_biaya = sbm.besaran * data.volume
    let biaya_pajak = jumlah_biaya * (pajak.besaran_pajak/100)
    let jumlah_diterima = jumlah_biaya - biaya_pajak   
    return{
          kode_trx_surat:trx_surat,
          kode_trx_sbm:sbm.kode_trx,
          kode_trx_pajak:pajak.kode_trx,
          kode_surat:body.kode_surat+`-honorarium`,
          tahun:body.tahun,
          nip:data.nip,
          tugas:data.tugas,
          nama:data?.nama,
          gol:data?.gol,
          npwp:data?.npwp,
          satuan_biaya:sbm?.besaran,
          satuan:data?.satuan,
          volume:data?.volume,
          jumlah_biaya:jumlah_biaya,
          pajak:biaya_pajak,
          diterima:jumlah_diterima,
          kode_bank:data?.kode_bank,
          nama_bank:data?.nama_bank,
          no_rekening:data?.no_rekening,
          atas_nama_rekening:data?.atas_nama_rekening,
          keterangan:data?.keterangan,
          status:1,
          ucr:body?.ucr
      }
  }

const dataGetNomor = (body,data,kode_trx) =>{
  return {
        "aplikasi":"expenditure",
        "sifat_surat":data.sifat_surat,
        "id_surat":kode_trx,
        "id_jenis_surat":data.id_jenis_surat,
        "id_jenis_nd":data.id_jenis_nd,
        "perihal":data.perihal,
        "id_klasifikasi":data.id_klasifikasi,
        "id_sub_unit":body.id_sub_unit,
        "id_user":body.id_user,        
        "nama_pembuat":body.ucr,
        "tanggal":body.tanggal
  }
}

const dataCreatedokumen = (body,data,kode_trx,id_nomor,nomor)=>{
  return {
    id_trx:kode_trx,
    katagori_surat:data.katagori_surat,
    id_surat_tugas:body.id_surat_tugas,
    kode_unit:body.kode_unit,
    tahun:body.tahun,
    tanggal:body.tanggal,
    jenis_surat:data.jenis_surat,
    id_nomor:id_nomor,
    nomor:nomor,
    aktif:1
  }
}

const whereUpdatedokumen = (body,data)=>{
  return {
    katagori_surat:data.katagori_surat,
    id_surat_tugas:body.id_surat_tugas,
    kode_unit:body.kode_unit,
    tahun:body.tahun,
    jenis_surat:data.jenis_surat,
  }
}

const randomchar = (panjang,type) =>{
  let characters
  let randomchars = ''
  if(type == "number"){
  characters ='0123456789'
  }else if(type == "abjadsemua"){
    characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  }else if(type == "abjadbesar"){
    characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }else if(type = "abjadkecil"){
    characters = 'abcdefghijklmnopqrstuvwxyz'
  }else{
    characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  }
  for ( let i = 0; i < panjang; i++ ) {
    randomchars += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomchars
}

const dataDokumennested = (dokumen) =>{
  let status_tte = "Belum ditandatangani"
  if(dokumen.aktif == 2){
    status_tte = "Sudah ditandatangani"
  }else{status_tte = "Belum ditandatangani"}
  return {
    "katagori_surat":dokumen.katagori_surat,
    "id_trx":dokumen.id_trx,
    "id_surat_tugas":dokumen.id_surat_tugas,
    "kode_unit":dokumen.kode_unit,
    "tahun":dokumen.tahun,
    "jenis_surat":dokumen.jenis_surat,
    "id_nomor":dokumen.id_nomor,
    "nomor":dokumen.nomor,
    "link_file":dokumen.link_file,
    "status_tandatangan":status_tte
  }
}

const dataKirimPanutan = (dokumen,pdfupload) =>{
            data = new FormData();
            data.append('email', 'expenditure@ecampus.ut.ac.id');
            data.append('password', 'password123');
            data.append('id_aplikasi', '4');
            data.append('id_trx', dokumen.id_trx);
            data.append('sifat_surat', dokumen.sifat_surat);
            data.append('nomor_surat', dokumen.nomor_surat);
            data.append('perihal', dokumen.perihal);
            data.append('tanggal_surat', dokumen.tanggal_surat);
            data.append('nip_pembuat',dokumen.nip_pembuat);
            dokumen.nip_penandatangan.forEach((item) => data.append("nip_penandatangan[]", item))
            //data.append('nip_penandatangan',nip_penandatangan );
            data.append('email_penandatangan', dokumen.email_penandatangan);
            data.append('pdf', pdfupload);

          return data
}

const dataHonorPengisiKegiatan = async(body,data,sbm,pajak,trx_surat) =>{
  let jumlah_biaya = sbm.besaran * data.volume_1 * data.volume_2
  let biaya_pajak = jumlah_biaya * (pajak.besaran_pajak/100)
  let jumlah_diterima = jumlah_biaya - biaya_pajak 
  return{
      kode_trx_surat:trx_surat,
      kode_trx_sbm:sbm.kode_trx,
      kode_trx_pajak:pajak.kode_trx,
      kode_surat:body.kode_surat+`-honorarium`,
      tahun:body.tahun,
      nip:data.nip,
      tugas:data.tugas,
      nama:data?.nama,
      jabatan:data?.jabatan,
      eselon:data?.eselon,
      npwp:data?.npwp,
      satuan_biaya:sbm.besaran,
      satuan_1:data.satuan_1,
      volume_1:data.volume_1,
      satuan_2:data.satuan_2,
      volume_2:data.volume_2,
      jumlah_biaya:jumlah_biaya,
      pajak:biaya_pajak,
      diterima:jumlah_diterima,
      kode_bank:data?.kode_bank,
      nama_bank:data?.nama_bank,
      no_rekening:data?.no_rekening,
      atas_nama_rekening:data?.atas_nama_rekening,
      keterangan:data?.keterangan,
      status:1,
      ucr:body?.ucr
  }
}

const dataHonorPenulisSoal = (body,data) =>{
  return{
      kode_trx_surat:body.kode_trx,
      kode_surat:body.kode_surat+`-honorarium`,
      tahun:body.tahun,
      nip:data.nip,
      tugas:data.tugas,
      nama:data?.nama,
      gol:data.gol,
      kode_mk:data.kode_mk,
      nama_mk:data.nama_mk,
      npwp:data?.npwp,
      kode_bank:data?.kode_bank,
      nama_bank:data?.nama_bank,
      no_rekening:data?.no_rekening,
      atas_nama_rekening:data?.atas_nama_rekening,
      keterangan:data?.keterangan,
      status:1,
      ucr:body?.ucr
  }
}

const dataHonorTutor = (body,data,sbm,pajak,trx_surat) =>{
  let jumlah_biaya = sbm.besaran * data.volume
  let biaya_pajak = jumlah_biaya * (pajak.besaran_pajak/100)
  let jumlah_diterima = jumlah_biaya - biaya_pajak 
  return{
    kode_trx_surat:body.kode_trx,
    kode_surat:body.kode_surat+`-honorarium`,
    kode_trx_surat:trx_surat,
    kode_trx_pajak:pajak.kode_trx,
    jenjang_ngajar:data.jenjang_ngajar,
    tahun:body.tahun,
    nip:data.nip,
    nama:data?.nama,
    gol:data.gol,
    email:data.email,
    npwp:data?.npwp,
    kelas:data?.kelas,
    keterangan_izin_kelas:data?.keterangan_izin_kelas,
    satuan_biaya:data?.satuan_biaya,
    kode_mk:data.kode_mk,
    nama_mk:data.nama_mk,
    kode_tutor:data.kode_tutor,
    kode_tutorial:data.kode_tutorial,
    institusi_tutor:data.institusi_tutor,
    tempat_pelaksana:data.tempat_pelaksana,
    masa:data.masa,
    jumlah_mhs:data.jumlah_mhs,
    satuan:data.satuan,
    volume:data.volume,
    jumlah_biaya:jumlah_biaya,
    pajak:biaya_pajak,
    diterima:jumlah_diterima,
    kode_bank:data?.kode_bank,
    nama_bank:data?.nama_bank,
    no_rekening:data?.no_rekening,
    atas_nama_rekening:data?.atas_nama_rekening,
    keterangan:data?.keterangan,
    status:1,
    ucr:body?.ucr
  }
}

const dataWhereSK = async(data)=>{
    return {
      kode_surat :`${data.kode_surat}-honorarium`,
      tahun:data.tahun
      }
}

const dataupdateSK = async(data) =>{
  return {
    perihal:data?.perihal,
    penandatangan:data?.penandatangan,
    path_sk:data?.path_sk,
    jenis_honor:data?.jenis_honor,
    nama_honor:data?.nama_honor,
    tanggal_surat:data?.tanggal_surat,
    uch:data?.ucr
  }
}

const dataWhereRKA = async(data)=>{
  return {
    kode_surat :`${data.kode_surat}-honorarium`,
    tahun:data.tahun,
    kode_status:{[Op.in]:[0,1,2,3,4,5,]}
  }
}
const dataupdateRKA = async(data) =>{
  return {
    kode_kegiatan_ut_detail:data.kode_kegiatan_ut_detail,
    kode_aktivitas_rkatu:data.kode_aktivitas_rkatu,
    kode_rka:data.kode_rka,
    kode_periode:data.kode_periode,
    kode_status:2
  }
}

const dataPetugasHonorarium = async(body,data,sbm,pajak,trx_surat) =>{
  let satuan_biaya = sbm.satuan_biaya
  let jumlah_biaya = sbm.satuan_biaya * data.volume_1 * data.volume_2
  let biaya_pajak = jumlah_biaya * (pajak.besaran_pajak/100)
  let jumlah_diterima = jumlah_biaya - biaya_pajak 
  return{
    kode_trx_surat:trx_surat,
    kode_trx_pajak:pajak.kode_trx,
    kode_trx_sbm:sbm.kode_trx,
    kode_klasifikasi:body.kode_klasifikasi,
    nip:data.nip,
    kode_surat:body.kode_surat+`-honorarium`,
    tahun:body.tahun,
    katagori:data.katagori,
    tugas:data.tugas,
    jenjang:data.jenjang,
    gol:data.gol,
    eselon:data.eselon,
    jabatan:data.jabatan,
    nama:data.nama,
    email:data.email,
    npwp:data.npwp,
    satuan_1:data.satuan_1,
    volume_1:data.volume_1,
    satuan_2:data.satuan_2,
    volume_2:data.volume_2,
    satuan_biaya:satuan_biaya,
    jumlah_biaya:jumlah_biaya,
    pajak:biaya_pajak,
    jumlah_diterima:jumlah_diterima,
    kode_bank:data.kode_bank,
    nama_bank:data.nama_bank,
    no_rekening:data.no_rekening,
    atas_nama_rekening:data.atas_nama_rekening,
    keterangan_1:data?.keterangan_1,
    keterangan_2:data?.keterangan_2,
    keterangan_3:data?.keterangan_3,
    keterangan_4:data?.keterangan_4,
    keterangan_5:data?.keterangan_5,
    keterangan_6:data?.keterangan_6,
    keterangan_7:data?.keterangan_7,
    keterangan_8:data?.keterangan_8,
    keterangan_9:data?.keterangan_9,
    keterangan_10:data?.keterangan_10,
    keterangan_11:data?.keterangan_11,
    keterangan_12:data?.keterangan_12,
    keterangan_13:data?.keterangan_13,
    keterangan_14:data?.keterangan_14,
    keterangan_15:data?.keterangan_15,
    kode_status:0,
    ucr:body.ucr
  }
}

const data_siakun = (body) =>{
return {
  "tahun":body.tahun,
  "kode_aplikasi":"08",
  "kode_menu":"M08.01.04",
  "kode_surat":body.id_surat_tugas,
  "kode_sub_surat":"-",
  "tanggal_transaksi":body.tanggal,
  "keterangan":`Honorarium - Nomor surat:${body.nomor_surat_tugas}`,
  "kode_rkatu":body.kode_rkatu,
  "bulan_rkatu":body.bulan_rkatu,
  "nominal":body.nominal,
  "ucr":body.ucr
}
}

const data_update_nominal_petugas = (pajak,satuan_biaya,honor) =>{
  let persenPajak = pajak.besaran_pajak/100
  let jumlah_biaya = satuan_biaya*honor.volume_1*honor.volume_2
  let biayapajak = jumlah_biaya*persenPajak
  let jumlah_diterima  = jumlah_biaya - biayapajak
  return {
    satuan_biaya:satuan_biaya,
    jumlah_biaya:jumlah_biaya,
    pajak:biayapajak,
    jumlah_diterima:jumlah_diterima
  }

}

const datahonorpluskomentar = (data, komentar) => {
  return {
    kode_surat: data?.kode_surat,
    tahun: data?.tahun,
    id_surat_panutan: data?.id_surat,
    id_sub_unit: data?.id_sub_unit,
    kode_kegiatan_ut_detail: data?.kode_kegiatan_ut_detail,
    kode_aktivitas_rkatu: data?.kode_aktivitas_rkatu,
    kode_rka: data?.kode_rka,
    kode_periode: data?.kode_periode,
    nomor_surat: data?.nomor_surat,
    tanggal_surat: data?.tanggal_surat,
    kode_unit: data?.kode_unit,
    perihal: data?.perihal,
    penandatangan: data?.penandatangan,
    path_sk: data?.path_sk,
    kode_status: data?.kode_status,
    data_pengusulan: data?.data_pengusulan,
    jenis_honor: data?.jenis_honor,
    nama_honor: data?.nama_honor,
    ucr: data?.ucr,
    komentar: komentar
  };
};

  module.exports = {
    dataHonor,
    dataPetugasHonor,
    dataGetNomor,
    dataCreatedokumen,
    whereUpdatedokumen,
    randomchar,
    dataKirimPanutan,
    dataDokumennested,
    dataHonorPanutan,
    dataHonorPanitiaKegiatan,
    dataHonorPengisiKegiatan,
    dataHonorPenulisSoal,
    dataWhereSK,
    dataupdateSK,
    dataWhereRKA,
    dataupdateRKA,
    dataHonorTutor,
    dataPetugasHonorarium,
    data_siakun,
    data_update_nominal_petugas,
    datahonorpluskomentar,
  };