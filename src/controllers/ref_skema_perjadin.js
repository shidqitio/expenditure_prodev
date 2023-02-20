const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const SkemaPerjadin = require("../models/ref_skema_perjadin");
const { validationResult } = require("express-validator");
const Status = require("../models/ref_status");
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const KomponenPerjadin_1 = require("../models/trx_komponen_perjadin_1");
const SuratTugasPerjadin = require("../models/ref_surat_tugas_perjadin");
const trxKomponenPerjadin = require("../models/trx_komponen_skema_perjadin");
const KomponenPerjadin = require("../models/ref_komponen_perjadin");
const SbmTransport = require("../models/ref_sbm_transport");
const SbmTaksi = require("../models/ref_sbm_taksi");
const SbmUangHarian = require("../models/ref_sbm_uang_harian");
const SbmUangHarianDN = require("../models/sbm_uh_luardaerah_DN");
const SbmPenginapan = require("../models/ref_sbm_uang_penginapan");
const trxKomponenSuper = require("../models/trx_komponen_surat_perjadin");
const { QueryTypes, Op } = require("sequelize");
const db = require("../config/database");
const { type } = require("express/lib/response");
const e = require("express");

exports.getAll = async (req, res, next) => {
  try {
    const data = await SkemaPerjadin.findAll();
    console.log("data", data);
    jsonFormat(res, "success", "Berhasil memuat data", data);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.pilihskema = async (req, res, next) => {
  try {
    let cekstatus = await SuratTugasPerjadin.findAll({
      where: {
        id_surat_tugas: req.body.id_surat,
        kode_status: { [Op.in]: [4, 5, 6, 7, 8, 9, 10] },
      },
    }).catch();

    if (cekstatus.length > 0) {
      return jsonFormat(
        res,
        "failed",
        "usulan telah di verifikasi tidak bisa merubah skema",
        []
      );
    }

    await SuratTugasPerjadin.update(
      {
        kode_skema: req.body.kode_skema,
      },
      {
        where: {
          id_surat_tugas: req.body.id_surat,
        },
      }
    );

    await KomponenPerjadin_1.destroy({
      where: {
        id_surat_tugas: req.body.id_surat,
      },
    }).catch();
    await PetugasPerjadinBiaya.destroy({
      where: {
        id_surat_tugas: req.body.id_surat,
      },
    }).catch();

    let tbpetugas = await db
      .query(
        `SELECT * FROM t_petugas_dummy WHERE id_surat = ${req.body.id_surat} GROUP BY id_surat,nip,id_tempat_tujuan`,
        {
          type: QueryTypes.SELECT,
        }
      )
      .catch();

    let data = tbpetugas;
    const countdata = tbpetugas.length;
    let arrPetugas = [];
    tbpetugas.map((ptg) => {
      if (
        arrPetugas.includes({
          id_surat_tugas: ptg.id_surat,
          urut_tugas: 1,
          nip: ptg.nip,
          nama_bank: ptg.nama_bank,
          nomor_rekening: ptg.nomor_rekening,
          npwp: ptg.npwp,
          nama_petugas: ptg.nama,
          kode_provinsi_asal: ptg.id_provinsi_asal,
          kode_kota_asal: ptg.id_tempat_asal,
          nama_kota_asal: ptg.nama_tempat_asal,
          kode_provinsi_tujuan: ptg.id_provinsi_tujuan,
          kode_kota_tujuan: ptg.id_tempat_tujuan,
          nama_kota_tujuan: ptg.nama_tempat_tujuan,
          kode_unit_tujuan: ptg.kode_unit_tujuan,
          tanggal_pergi: ptg.tanggal_awal,
          tanggal_pulang: ptg.tanggal_akhir,
          lama_perjalanan: ptg.lama_perjalanan,
          tahun: ptg.tahun,
          transport: "udara",
          biaya: 0,
        }) === false
      ) {
        arrPetugas.push({
          id_surat_tugas: ptg.id_surat,
          urut_tugas: 1,
          nip: ptg.nip,
          nama_petugas: ptg.nama,
          nama_bank: ptg.nama_bank,
          nomor_rekening: ptg.nomor_rekening,
          npwp: ptg.npwp,
          kode_provinsi_asal: ptg.id_provinsi_asal,
          kode_kota_asal: ptg.id_tempat_asal,
          nama_kota_asal: ptg.nama_tempat_asal,
          kode_provinsi_tujuan: ptg.id_provinsi_tujuan,
          kode_kota_tujuan: ptg.id_tempat_tujuan,
          nama_kota_tujuan: ptg.nama_tempat_tujuan,
          kode_unit_tujuan: ptg.kode_unit_tujuan,
          tanggal_pergi: ptg.tanggal_awal,
          tanggal_pulang: ptg.tanggal_akhir,
          lama_perjalanan: ptg.lama_perjalanan,
          tahun: ptg.tahun,
          transport: "udara",
          biaya: 0,
        });
      }
    });

    await PetugasPerjadinBiaya.bulkCreate(arrPetugas).catch();
    let uang_harian_ket;
    if (req.body.kode_skema == 2) {
      uang_harian_ket = "dalamkota";
    } else if (req.body.kode_skema == 3) {
      uang_harian_ket = "diklat";
    } else {
      uang_harian_ket = "luarkota";
    }

    for (let i = 0; i < countdata; i++) {
      let komponen = await db.query(
        `SELECT "` +
          data[i].id_surat +
          `" AS id_surat_tugas,
      @urut:= @urut+1 urut_tugas, "` +
          data[i].nip +
          `" AS nip,
      ksp.kode_komponen_perjadin AS kode_komponen_honor,
      ` +
          data[i].id_tempat_asal +
          ` AS kode_kota_asal, 
          `+ data[i].tahun +` AS tahun,
      ` +
          data[i].id_tempat_tujuan +
          ` AS kode_kota_tujuan ,
      concat(kp.nama_komponen_perjadin,'',IF(ksp.kode_komponen_perjadin = 1,ket_transport.ket_transport,"")) as keterangan_komponen,
      (case WHEN ksp.kode_komponen_perjadin = 1  AND "` +
          data[i].ket_tujuan +
          `"="P" THEN "P" else kp.kode_satuan END) as kode_satuan,
      (case WHEN ksp.kode_komponen_perjadin = 1 THEN tbl_transport.biaya_transport*IF("` +
          data[i].ket_tujuan +
          `"="P",0.5,1)*1
      WHEN ksp.kode_komponen_perjadin = 2.1 THEN tbl_taksi_asal.biaya_taksi*1
      WHEN ksp.kode_komponen_perjadin = 2.2 THEN tbl_taksi_tujuan.biaya_taksi*1
      WHEN ksp.kode_komponen_perjadin = 3 THEN tbl_penginapan.eselon*1 
      WHEN ksp.kode_komponen_perjadin = 4 THEN tbl_harian.biaya_harian*1
       ELSE 0 END) AS biaya_satuan
      ,"0" AS pajak_persen,"0" AS jumlah_pajak,
      (CASE
        WHEN ksp.kode_komponen_perjadin = 3 THEN @jumlah_hari-1
        WHEN ksp.kode_komponen_perjadin = 4 THEN @jumlah_hari ELSE 1 END) jumlah,
      (case WHEN ksp.kode_komponen_perjadin = 1 THEN tbl_transport.biaya_transport*IF("` +
          data[i].ket_tujuan +
          `"="P",0.5,1)
      WHEN ksp.kode_komponen_perjadin = 2.1  THEN tbl_taksi_asal.biaya_taksi
      WHEN ksp.kode_komponen_perjadin = 2.2  THEN tbl_taksi_tujuan.biaya_taksi
      WHEN ksp.kode_komponen_perjadin = 3 THEN tbl_penginapan.eselon*(if(@jumlah_hari>0,@jumlah_hari,1)-1) 
     WHEN ksp.kode_komponen_perjadin = 4 THEN tbl_harian.biaya_harian*@jumlah_hari 
       ELSE 0 END) total
      
      FROM trx_komponen_skema_perjadin_1 AS ksp 
      JOIN ref_komponen_perjadin_1 AS kp 
      ON ksp.kode_komponen_perjadin = kp.kode_komponen_perjadin 
      
      JOIN (SELECT IFNULL((SELECT (CASE WHEN udara > 0 THEN udara when darat > 0 THEN darat else laut END) as biaya_transport FROM transpor_dalamdaerah_rio 
      WHERE asal = ` +
          data[i].id_tempat_asal +
          ` AND tujuan = ` +
          data[i].id_tempat_tujuan +
          ` ),0) as biaya_transport) as tbl_transport 
      
      JOIN (SELECT IFNULL((SELECT (CASE WHEN udara > 0 THEN "(udara)" when darat > 0 THEN "(darat)" else "(laut)" END) as biaya_transport FROM transpor_dalamdaerah_rio 
      WHERE asal = ` +
          data[i].id_tempat_asal +
          ` AND tujuan = ` +
          data[i].id_tempat_tujuan +
          ` ),0) as ket_transport) as ket_transport 
      
       JOIN (SELECT IFNULL((SELECT ${uang_harian_ket} AS biaya_harian
        FROM sbm_uh_luardaerah_DN WHERE id_provinsi = ` +
          data[i].id_provinsi_tujuan +
          `),0) AS biaya_harian ) AS tbl_harian
       
       JOIN (SELECT IFNULL((SELECT ` +
          data[i].gol +
          ` AS eselon
             FROM sbm_up_luardaerah_DN 
      WHERE id_provinsi = ` +
          data[i].id_provinsi_tujuan +
          ` ),0) AS eselon) AS tbl_penginapan 
      
      JOIN (SELECT IFNULL((SELECT biaya biaya_taksi 
            FROM ref_sbm_taksi_dalam_negeri_copy 
      WHERE kode_provinsi = ` +
          data[i].id_provinsi_asal +
          `),0) AS biaya_taksi ) AS tbl_taksi_asal
      
      JOIN (SELECT IFNULL((SELECT biaya as biaya_taksi 
            FROM ref_sbm_taksi_dalam_negeri_copy 
      WHERE kode_provinsi = ` +
          data[i].id_provinsi_tujuan +
          `),0) AS biaya_taksi) AS tbl_taksi_tujuan
      
       JOIN (SELECT @urut := 0, @jumlah_hari := ` +
          data[i].lama_perjalanan +
          ` , @biaya_harian := "luarkota" ) AS no_urut
      WHERE ksp.kode_skema_perjadin = ${req.body.kode_skema}`,
        {
          type: QueryTypes.SELECT,
        }
      );

      await KomponenPerjadin_1.bulkCreate(komponen).catch();
    }
    let komponen_get = await KomponenPerjadin_1.findAll({
      where: {
        id_surat_tugas: req.body.id_surat,
        keterangan_komponen: ["Transport (darat)", "Transport (laut)"],
      },
    }).catch();

    let nippetugas = komponen_get.map((ptgnt) => ptgnt.nip);

    if (nippetugas.length > 0) {
      await db.query(
        `DELETE FROM trx_komponen_perjadin_1 WHERE keterangan_komponen LIKE '%taksi%' 
    AND id_surat_tugas = ${req.body.id_surat} AND nip IN (:nip) `,
        {
          replacements: { nip: nippetugas },
          type: QueryTypes.DELETE,
        }
      );
    }


   

    for (let a = 0; a < countdata; a++) {
    let updateBiaya = await db.query(
       `UPDATE trx_petugas_perjadin_biaya AS a
        SET biaya = (SELECT SUM(total) as total FROM trx_komponen_perjadin_1 WHERE id_surat_tugas = ${req.body.id_surat} AND nip = ${data[a].nip} AND kode_kota_asal = ${data[a].id_tempat_asal} AND tahun = ${data[a].tahun})
        WHERE a.id_surat_tugas = ${req.body.id_surat} AND a.nip = ${data[a].nip} AND a.kode_kota_asal = ${data[a].id_tempat_asal} AND a.tahun = ${data[a].tahun}`,
      {
        type: QueryTypes.UPDATE,
      }
    );

    let updatetrans = await db.query(
      `UPDATE trx_petugas_perjadin_biaya AS a
      SET transport = (SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(keterangan_komponen, '(', -1),')', 1) FROM trx_komponen_perjadin_1 
      WHERE id_surat_tugas = ${req.body.id_surat} AND nip = ${data[a].nip} AND kode_kota_asal = ${data[a].id_tempat_asal} AND tahun = ${data[a].tahun} AND kode_komponen_honor = 1)
      WHERE a.id_surat_tugas = ${req.body.id_surat} AND a.nip = ${data[a].nip} AND a.kode_kota_asal = ${data[a].id_tempat_asal} AND a.tahun = ${data[a].tahun}`,
      {
        type: QueryTypes.UPDATE,
      }
    );

    }


    

    jsonFormat(res, "success", "skema telah dipilih", []);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.getByid = async (req, res, next) => {
  let tbPetugas,
    petugasData,
    tbKomponen,
    arrnip,
    tbrka,
    tbSumKomponen,
    tbSumSurat;

  tbPetugas = await PetugasPerjadinBiaya.findAll({
    where: { id_surat_tugas: req.params.id },
    //group: nip
  });
  arrnip = tbPetugas.map((petugas) => petugas.nip);

  if (arrnip.length > 0) {
    tbKomponen = await KomponenPerjadin_1.findAll({
      where: { id_surat_tugas: req.params.id },
    });
  }

  let arrPetugas = [];
  tbPetugas.map((ptg) => {
    let arrKomponen = [];
    arrPetugas.push({
      id_surat_tugas: ptg.id_surat_tugas,
      urut_tugas: 1,
      nip: ptg.nip,
      nama_petugas: ptg.nama_petugas,
      kode_kota_asal: ptg.kode_kota_asal,
      nama_kota_asal: ptg.nama_kota_asal,
      kode_kota_tujuan: ptg.kode_kota_tujuan,
      nama_kota_tujuan: ptg.nama_kota_tujuan,
      tanggal_pergi: ptg.tanggal_pergi,
      tanggal_pulang: ptg.tanggal_pulang,
      lama_perjalanan: ptg.lama_perjalanan,
      transport: ptg.transport,
      biaya: ptg.biaya,
      komponen: arrKomponen,
    });
    tbKomponen.map((kpn) => {
      if (
        kpn.nip === ptg.nip &&
        kpn.kode_kota_asal === ptg.kode_kota_asal &&
        kpn.kode_kota_tujuan === ptg.kode_kota_tujuan
      ) {
        arrKomponen.push({
          kode_komponen_honor: kpn.kode_komponen_honor,
          keterangan_komponen: kpn.keterangan_komponen,
          kode_satuan: kpn.kode_satuan,
          biaya_satuan: kpn.biaya_satuan,
          jumlah: kpn.jumlah,
          total: kpn.total,
        });
      }
    });
  });

  try {
    jsonFormat(res, "success", "cek", arrPetugas);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.nestedbaru = async (req, res, next) => {
  let suratPerjadin, tbPetugas, tbKomponen, arrnip, tbgroupPetugas, kdRKA, bas;

  tbSuratPerjadin = await db.query(
    `SELECT sp.*,s.keterangan_status,sk.nama_skema_perjadin FROM ref_surat_tugas_perjadin AS sp
    LEFT JOIN ref_skema_perjadin as sk ON (sp.kode_skema=sk.kode_skema_perjadin) LEFT JOIN ref_status AS s 
    ON (sp.kode_status=s.kode_status)
     WHERE id_surat_tugas = ${req.params.id}`,
    {
      type: QueryTypes.SELECT,
    }
  );
  if (tbSuratPerjadin.length === 0) {
    return jsonFormat(res, "failed", "data tidak ada", []);
  }

  let tbrka = await db.query(
    `SELECT ifnull(sum(jumlah_budget),0) as jumlah_terpakai FROM ref_surat_tugas_rka_perjadin WHERE kode_rka = ${tbSuratPerjadin[0].kode_rka} AND id_surat_tugas NOT IN(${req.params.id})`,
    { type: QueryTypes.SELECT }
  );

  let rka_terpakai = tbrka[0].jumlah_terpakai;

  let cekrka = await axios.get(
    `http://172.16.100.69:4900/e_budgeting/apiv1/expenditure/perjadin/${tbSuratPerjadin[0].kode_rka}`
  );
  sumSurat = await db.query(
    `SELECT ifnull(sum(biaya),0) AS total_biaya FROM trx_petugas_perjadin_biaya WHERE id_surat_tugas = ${req.params.id}`,
    {
      type: QueryTypes.SELECT,
    }
  );
  if (cekrka.data.values.length === 0) {
    jumlah_rka = 0;
    bas = "";
  } else {
    jumlah_rka = cekrka.data.values[0].jumlah;
    bas = cekrka.data.values[0].bas;
  }
  console.log("cek RKA", jumlah_rka);
  let sisa_rka = jumlah_rka - rka_terpakai;
  let total_biaya_persurat = sumSurat[0].total_biaya;
  let sisa_rka_setelah_dikurang = sisa_rka - total_biaya_persurat;

  let tbpagu = await axios.get(
    `http://172.16.100.69:4900/e_budgeting/apiv1/expenditure/pagu/${tbSuratPerjadin[0].kode_rka}`
  );
  if (tbpagu.data.values[0].jumlah === null) {
    return jsonFormat(res, "failed", "data RKA atau pagu tidak ditemukan", []);
  }

  tbgroupPetugas = await db.query(
    `SELECT *,sum(biaya) AS total_biaya FROM trx_petugas_perjadin_biaya WHERE id_surat_tugas = ${req.params.id} GROUP BY id_surat_tugas,nip`,
    {
      type: QueryTypes.SELECT,
    }
  );
  arrnip = tbgroupPetugas.map((petugas) => petugas.nip);
  if (tbgroupPetugas.length === 0) {
    tbgroupPetugas = await db.query(
      `SELECT id_surat as id_surat_tugas,nip,nama as nama_petugas,0 AS total_biaya FROM t_petugas_dummy WHERE id_surat= ${req.params.id} GROUP BY id_surat,nip`,
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  tbPetugas = await PetugasPerjadinBiaya.findAll({
    where: { id_surat_tugas: req.params.id, nip: arrnip },
  });
  if (tbPetugas.length === 0) {
    tbPetugas = await db.query(
      `SELECT id_surat as id_surat_tugas,nip,id_provinsi_asal AS kode_provinsi_asal,id_provinsi_tujuan AS kode_provinsi_tujuan,
      id_tempat_asal AS kode_kota_asal ,nama_tempat_asal AS nama_kota_asal ,id_tempat_tujuan as kode_kota_tujuan,
      nama_tempat_tujuan as nama_kota_tujuan,tanggal_awal as tanggal_pergi,tanggal_akhir as tanggal_pulang,
      lama_perjalanan,"-" as transport,0 AS biaya FROM t_petugas_dummy WHERE id_surat = ${req.params.id}`,
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  if (arrnip.length > 0) {
    tbKomponen = await KomponenPerjadin_1.findAll({
      where: { id_surat_tugas: req.params.id },
    });
  } else {
    tbKomponen = [];
  }
  let arrdata = [];

  tbSuratPerjadin.map((sp) => {
    let arrgrpetugas = [];
    arrdata.push({
      id_surat_tugas: sp.id_surat_tugas,
      kode_rka: sp.kode_rka,
      bas: bas,
      total_rka: jumlah_rka,
      rka_terpakai: rka_terpakai,
      sisa_rka: sisa_rka,
      total_biaya_persurat: total_biaya_persurat,
      sisa_rka_setelah_dikurang: sisa_rka_setelah_dikurang,
      kode_skema_perjadin: sp.kode_skema,
      nama_skema_perjadin: sp.nama_skema_perjadin,
      status: sp.kode_status,
      keterangan_status: sp.keterangan_status,
      pagu: tbpagu.data.values,
      petugas: arrgrpetugas,
    });
    tbgroupPetugas.map((gptg) => {
      let arrPetugas = [];
      arrgrpetugas.push({
        id_surat_tugas: gptg.id_surat_tugas,
        nip: gptg.nip,
        nama: gptg.nama_petugas,
        biaya: gptg.total_biaya,
        detail: arrPetugas,
      });
      tbPetugas.map((ptg) => {
        if (
          ptg.nip === gptg.nip &&
          ptg.id_surat_tugas === gptg.id_surat_tugas
        ) {
          let arrKomponen = [];
          arrPetugas.push({
            id_surat_tugas: gptg.id_surat_tugas,
            nip: ptg.nip,
            kode_provinsi_asal: ptg.kode_provinsi_asal,
            kode_kota_asal: ptg.kode_kota_asal,
            nama_kota_asal: ptg.nama_kota_asal,
            kode_provinsi_tujuan: ptg.kode_provinsi_tujuan,
            kode_kota_tujuan: ptg.kode_kota_tujuan,
            nama_kota_tujuan: ptg.nama_kota_tujuan,
            tanggal_pergi: ptg.tanggal_pergi,
            tanggal_pulang: ptg.tanggal_pulang,
            lama_perjalanan: ptg.lama_perjalanan,
            transport: ptg.transport,
            biaya: ptg.biaya,
            komponen: arrKomponen,
          });
          tbKomponen.map((kpn) => {
            if (
              kpn.nip === ptg.nip &&
              kpn.kode_kota_asal === ptg.kode_kota_asal &&
              kpn.kode_kota_tujuan === ptg.kode_kota_tujuan &&
              kpn.id_surat_tugas === ptg.nomor_surat_tugas
            ) {
              arrKomponen.push({
                nomor_surat_tugas: kpn.nomor_surat_tugas,
                nip: kpn.nip,
                kode_kota_tujuan: kpn.kode_kota_tujuan,
                kode_komponen_honor: kpn.kode_komponen_honor,
                keterangan_komponen: kpn.keterangan_komponen,
                biaya_satuan: kpn.biaya_satuan,
                kode_satuan: kpn.kode_satuan,
                jumlah: kpn.jumlah,
                total: kpn.total,
              });
            }
          });
        }
      });
    });
  });
  try {
    jsonFormat(res, "success", "cek", arrdata);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.updatekomponen = async (req, res, next) => {
  try {
    const data = await KomponenPerjadin_1.findOne({
      where: {
        nomor_surat_tugas: req.body.nomor_surat_tugas,
        nip: req.body.nip,
        kode_kota_tujuan: req.body.kode_kota_tujuan,
        kode_komponen_honor: req.body.kode_komponen_honor,
      },
    });

    if (data === null)
      return jsonFormat(res, "failed", "komponen tidak ada", []);

    await db.query(
      `UPDATE trx_komponen_perjadin_1 AS kpn
        SET biaya_satuan = ${req.body.biaya_satuan},
        total =  jumlah* ${req.body.biaya_satuan}
        WHERE
        kpn.nomor_surat_tugas =  ${req.body.nomor_surat_tugas}  
        AND nip = "${req.body.nip}"
        AND kode_kota_tujuan = ${req.body.kode_kota_tujuan}
        AND kode_komponen_honor = ${req.body.kode_komponen_honor} `,
      {
        type: QueryTypes.UPDATE,
      }
    );
    //update biaya

    await db.query(
      `UPDATE trx_petugas_perjadin_biaya AS ptg JOIN (SELECT nomor_surat_tugas, nip ,
          SUBSTRING_INDEX(SUBSTRING_INDEX(keterangan_komponen, '(', -1),')', 1)  transport,
        sum(total) all_total,kode_kota_asal,kode_kota_tujuan FROM trx_komponen_perjadin_1 GROUP BY 
        nomor_surat_tugas,nip,kode_kota_asal,kode_kota_tujuan) AS kpn
        ON (ptg.id_surat_tugas = kpn.nomor_surat_tugas AND
        ptg.nip = kpn.nip AND ptg.kode_kota_asal = kpn.kode_kota_asal AND
        ptg.kode_kota_tujuan = kpn.kode_kota_tujuan)
        
        SET ptg.transport = kpn.transport, ptg.biaya = kpn.all_total 

        WHERE id_surat_tugas =  ${req.body.nomor_surat_tugas}  
        AND ptg.nip = "${req.body.nip}"
        AND ptg.kode_kota_tujuan = ${req.body.kode_kota_tujuan}
    `,
      {
        type: QueryTypes.UPDATE,
      }
    );

    jsonFormat(res, "success", "Berhasil memperbarui data", []);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.updatetransport = async (req, res, next) => {
  try {
  let id_surat_tugas = req.body.id_surat_tugas;
  let nip = req.body.nip;
  let kode_kota_asal = req.body.kode_kota_asal;
  let kode_kota_tujuan = req.body.kode_kota_tujuan;
  let transport = req.body.transport;
  let id_provinsi_asal = req.body.id_provinsi_asal;
  let id_provinsi_tujuan = req.body.id_provinsi_tujuan;
  let kode_satuan = req.body.kode_satuan;
    await PetugasPerjadinBiaya.update(
      {
        transport: transport,
      },
      {
        where: {
          id_surat_tugas: id_surat_tugas,
          nip: nip,
          kode_kota_asal: kode_kota_asal,
          kode_kota_tujuan: kode_kota_tujuan,
        },
      }
    );

    await KomponenPerjadin_1.destroy({
      where: {
        id_surat_tugas: id_surat_tugas,
        nip: nip,
        kode_kota_asal: kode_kota_asal,
        kode_kota_tujuan: kode_kota_tujuan,
        kode_komponen_honor: [1, 2.1, 2.2],
      },
    });

    await db.query(
      `INSERT INTO trx_komponen_perjadin_1 
  SELECT 
    "` +
        id_surat_tugas +
        `" as id_surat_tugas,
    "1" as urut_tugas,
    "` +
        nip +
        `" as nip,
    "1" as kode_komponen_honor,
    asal AS kode_kota_asal,
    tujuan as kode_kota_tujuan,
    "transport (` +
        transport +
        `)" AS keterangan_komponen,
    "` +
        kode_satuan +
        `",
    ` +
        transport +
        `*if("` +
        kode_satuan +
        `" = "P",0.5,1) as biaya_satuan,
    0,0,"1" as jumlah,
    ` +
        transport +
        `*if("` +
        kode_satuan +
        `" = "P",0.5,1) as total
  FROM 
      transpor_dalamdaerah_rio 
  WHERE 
    asal IN (:kode_kota_asal) AND tujuan IN (:kode_kota_tujuan)`,
      {
        replacements: {
          kode_kota_asal: kode_kota_asal,
          kode_kota_tujuan: kode_kota_tujuan,
        },
        type: QueryTypes.INSERT,
      }
    );

    if (transport === "udara") {
      await db.query(
        `INSERT INTO trx_komponen_perjadin_1 
      SELECT 
          :id_surat_tugas as id_surat_tugas,
          "1" as urut_tugas,
          "` +
          nip +
          `" as nip,
          "2.1" as kode_komponen_honor,
          :kode_kota_asal AS kode_kota_asal,
          :kode_kota_tujuan as kode_kota_tujuan,
          "Transport Lokal (Taksi) asal" AS keterangan_komponen,
          "PP",
          biaya as biaya_satuan,
          0,0,"1" as jumlah,
          biaya as total
      FROM
       ref_sbm_taksi_dalam_negeri_copy
      WHERE 
        kode_provinsi = :id_provinsi_asal
      UNION
      SELECT 
          :id_surat_tugas as id_surat_tugas,
          "1" as urut_tugas,
          "` +
          nip +
          `" as nip,
          "2.2" as kode_komponen_honor,
          :kode_kota_asal AS kode_kota_asal,
          :kode_kota_tujuan as kode_kota_tujuan,
          "Transport Lokal (Taksi) tujuan" AS keterangan_komponen,
          "PP",
          biaya as biaya_satuan,
          0,0,"1" as jumlah,
          biaya as total
      FROM 
        ref_sbm_taksi_dalam_negeri_copy
      WHERE 
        kode_provinsi = :id_provinsi_tujuan `,
        {
          replacements: {
            kode_kota_asal: kode_kota_asal,
            kode_kota_tujuan: kode_kota_tujuan,
            id_surat_tugas: id_surat_tugas,
            nip: nip,
            id_provinsi_asal: id_provinsi_asal,
            id_provinsi_tujuan: id_provinsi_tujuan,
          },
          type: QueryTypes.INSERT,
        }
      );
    }

    await db.query(
      `UPDATE trx_petugas_perjadin_biaya AS ptg JOIN (SELECT id_surat_tugas, nip ,SUBSTRING_INDEX(SUBSTRING_INDEX(keterangan_komponen, '(', -1),')', 1)  transport,
        sum(total) all_total,kode_kota_asal,kode_kota_tujuan FROM trx_komponen_perjadin_1 GROUP BY 
        id_surat_tugas,nip,kode_kota_asal,kode_kota_tujuan) AS kpn
        ON (ptg.id_surat_tugas = kpn.id_surat_tugas AND
        ptg.nip = kpn.nip AND ptg.kode_kota_asal = kpn.kode_kota_asal AND
        ptg.kode_kota_tujuan = kpn.kode_kota_tujuan)
        
        SET ptg.transport = "` +
        transport +
        `", ptg.biaya = kpn.all_total 

        WHERE ptg.id_surat_tugas =  ${req.body.id_surat_tugas}  
        AND ptg.nip = "${req.body.nip}"
        AND ptg.kode_kota_tujuan = ${req.body.kode_kota_tujuan}
    `,
      {
        type: QueryTypes.UPDATE,
      }
    );

    jsonFormat(res, "success", "sukses merubah transport", []);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.pilihSkemanewII = async (req, res, next) => {
  const tahun = req.body.tahun;
  const petugas = await PetugasPerjadinBiaya.findAll({
    where: { id_surat_tugas: req.body.kode_surat },
  });
  if (petugas.length == 0) {
    jsonFormat(res, "failed", "Data Petugas Tidak Tersedia", []);
  }
  const rpsp = petugas.map((p) => p.kode_rpsp);

  const komponen = await trxKomponenPerjadin.findAll({
    where: { kode_skema_perjadin: req.body.kode_skema_perjadin },
  });
  if (komponen.length == 0 && petugas.length != 0) {
    jsonFormat(res, "failed", "Data Skema Tidak Tersedia", []);
  }
  let arrkomponen = [];
  for (let i = 0; i < petugas.length; i++) {
    let jenisT = "";
    for (let j = 0; j < komponen.length; j++) {
      let dataKomponen = null;
      if (komponen[j].kode_komponen_perjadin == "1") {
        dataKomponen = await SbmTransport.findOne({
          where: {
            kode_unit: req.body.kode_unit,
            asal: petugas[i].kode_kota_asal,
            tujuan: petugas[i].kode_kota_tujuan,
          },
        }).then((data) => {
          let finaleReturn = [];
          let jenisTransport = "Tidak Ditemukan";
          let dataReturn = [];
          let ketPerjalanan,ketTaksi = 0;
          if (data != null) {
            if (petugas[i].keterangan == "Pulang-Pergi") {
              ketPerjalanan = 1;
              ketTaksi = 2;
            } else {
              ketTaksi = 1;
              ketPerjalanan = 0.5;
            }
            if (data.udara > 0) {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Transpor (Udara)",
                biaya_satuan: data.udara * ketPerjalanan,
                jumlah_satuan: 1,
                biaya: data.udara * ketPerjalanan,
                ucr: req.body.ucr,
              };
              jenisTransport = { jenisTransport: "Udara" };
            } else if (data.darat > 0) {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Transpor (Darat)",
                biaya_satuan: data.darat * ketPerjalanan,
                jumlah_satuan: 1,
                biaya: data.darat * ketPerjalanan,
                ucr: req.body.ucr,
              };
              jenisTransport = { jenisTransport: "Darat" };
            } else {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Transpor (Laut)",
                biaya_satuan: data.laut * ketPerjalanan,
                jumlah_satuan: 1,
                biaya: data.laut * ketPerjalanan,
                ucr: req.body.ucr,
              };
              jenisTransport = { jenisTransport: "Laut" };
            }
          } else {
            dataReturn = {
              kode_rpsp: petugas[i].kode_rpsp,
              kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
              tahun: tahun,
              keterangan: "Data SBM Tidak Ditemukan",
              biaya_satuan: 0,
              jumlah_satuan: 1,
              biaya: 0,
              ucr: req.body.ucr,
            };
            jenisTransport = { jenisTransport: "Laut" };
          }

          finaleReturn.push(dataReturn, jenisTransport);
          return finaleReturn;
        });
        if (dataKomponen != null) {
          arrkomponen.push(dataKomponen[0]);
        }
        jenisT = dataKomponen[1].jenisTransport;
      }
      if (komponen[j].kode_komponen_perjadin == "2.1" && jenisT == "Udara") {
        dataKomponen = await SbmTaksi.findOne({
          where: { kode_provinsi: petugas[i].kode_provinsi_asal },
        }).then((data) => {
          let dataReturn = [];
          if (data != null) {
            dataReturn = {
              kode_rpsp: petugas[i].kode_rpsp,
              kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
              tahun: tahun,
              keterangan: "Biaya Taksi Asal",
              biaya_satuan: data.biaya*ketTaksi,
              jumlah_satuan: ketTaksi,
              biaya: data.biaya,
              ucr: req.body.ucr,
            };
          } else {
            dataReturn = {
              kode_rpsp: petugas[i].kode_rpsp,
              kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
              tahun: tahun,
              keterangan: "Data SBM Tidak Ditemukan",
              biaya_satuan: 0,
              jumlah_satuan: 1,
              biaya: 0,
              ucr: req.body.ucr,
            };
          }
          return dataReturn;
        });
        arrkomponen.push(dataKomponen);
      }
      if (komponen[j].kode_komponen_perjadin == "2.2" && jenisT == "Udara") {
        dataKomponen = await SbmTaksi.findOne({
          where: { kode_provinsi: petugas[i].kode_provinsi_tujuan },
        }).then((data) => {
          let dataReturn = [];
          if (data != null) {
            dataReturn = {
              kode_rpsp: petugas[i].kode_rpsp,
              kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
              tahun: tahun,
              keterangan: "Biaya Taksi Tujuan",
              biaya_satuan: data.biaya*ketTaksi,
              jumlah_satuan: ketTaksi,
              biaya: data.biaya,
              ucr: req.body.ucr,
            };
          } else {
            dataReturn = {
              kode_rpsp: petugas[i].kode_rpsp,
              kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
              tahun: tahun,
              keterangan: "Data SBM Tidak Ditemukan",
              biaya_satuan: 0,
              jumlah_satuan: 1,
              biaya: 0,
              ucr: req.body.ucr,
            };
          }
          return dataReturn;
        });
        arrkomponen.push(dataKomponen);
      }
      if (komponen[j].kode_komponen_perjadin == "3") {
        dataKomponen = await SbmPenginapan.findOne({
          where: { kode_provinsi: petugas[i].kode_provinsi_tujuan },
        }).then((data) => {
          let dataReturn = [];
          lamapenginapan = 0;
          if (petugas[i].lama_perjalanan > 1) {
            lamapenginapan = petugas[i].lama_perjalanan - 1;
          }
          if (data != null) {
            if (petugas[i].eselon == "eselonI") {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Penginapan",
                biaya_satuan: data.eselonI,
                jumlah_satuan: lamapenginapan,
                biaya: data.eselonI * lamapenginapan,
                ucr: req.body.ucr,
              };
            } else if (petugas[i].eselon == "eselonII") {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Penginapan",
                biaya_satuan: data.eselonII,
                jumlah_satuan: lamapenginapan,
                biaya: data.eselonII * lamapenginapan,
                ucr: req.body.ucr,
              };
            } else if (petugas[i].eselon == "eselonIII") {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Penginapan",
                biaya_satuan: data.eselonIII,
                jumlah_satuan: lamapenginapan,
                biaya: data.eselonIII * lamapenginapan,
                ucr: req.body.ucr,
              };
            } else if (petugas[i].eselon == "eselonIV") {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Penginapan",
                biaya_satuan: data.eselonIV,
                jumlah_satuan: lamapenginapan,
                biaya: data.eselonIV * lamapenginapan,
                ucr: req.body.ucr,
              };
            } else {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Penginapan",
                biaya_satuan: data.non_eselon,
                jumlah_satuan: lamapenginapan,
                biaya: data.non_eselon * lamapenginapan,
                ucr: req.body.ucr,
              };
            }
          } else {
            dataReturn = {
              kode_rpsp: petugas[i].kode_rpsp,
              kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
              tahun: tahun,
              keterangan: "Data SBM Tidak Ditemukan",
              biaya_satuan: 0,
              jumlah_satuan: lamapenginapan,
              biaya: 0,
              ucr: req.body.ucr,
            };
          }
          return dataReturn;
        });
        arrkomponen.push(dataKomponen);
      }
      if (komponen[j].kode_komponen_perjadin == "4") {
        dataKomponen = await SbmUangHarian.findOne({
          where: { kode_provinsi: petugas[i].kode_provinsi_tujuan },
        }).then((data) => {
          let dataReturn = [];
          let lama_perjalanan = petugas[i].lama_perjalanan;
          if (data != null) {
            if (req.body.kode_skema_perjadin == 2) {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Uang Harian",
                biaya_satuan: data.dalamkota,
                jumlah_satuan: lama_perjalanan,
                biaya: data.dalamkota * lama_perjalanan,
                ucr: req.body.ucr,
              };
            } else if (req.body.kode_skema_perjadin == 3) {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Uang Harian",
                biaya_satuan: data.diklat,
                jumlah_satuan: lama_perjalanan,
                biaya: data.diklat * lama_perjalanan,
                ucr: req.body.ucr,
              };
            } else {
              dataReturn = {
                kode_rpsp: petugas[i].kode_rpsp,
                kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
                tahun: tahun,
                keterangan: "Uang Harian",
                biaya_satuan: data.luarkota,
                jumlah_satuan: lama_perjalanan,
                biaya: data.luarkota * lama_perjalanan,
                ucr: req.body.ucr,
              };
            }
          } else {
            dataReturn = {
              kode_rpsp: petugas[i].kode_rpsp,
              kode_komponen_perjadin: komponen[j].kode_komponen_perjadin,
              tahun: tahun,
              keterangan: "Data SBM Tidak Ditemukan",
              biaya_satuan: 0,
              jumlah_satuan: lama_perjalanan,
              biaya: 0,
              ucr: req.body.ucr,
            };
          }
          return dataReturn;
        });
        arrkomponen.push(dataKomponen);
      }
    }
  }

  if (komponen.length != 0 && petugas.length != 0 && arrkomponen.length != 0) {
    console.log(rpsp);
    await db.transaction().then((t) => {
      return trxKomponenSuper
        .destroy(
          { where: { kode_rpsp: { [Op.in]: rpsp } } },
          { transaction: t }
        )
        .then(() => {
          trxKomponenSuper
            .bulkCreate(arrkomponen, { transaction: t })
            .then((create) => {})
            .then(() => {
              SuratTugasPerjadin.update(
                {
                  kode_skema_perjadin: req.body.kode_skema_perjadin,
                  kode_status: "01",
                },
                { where: { kode_surat: req.body.kode_surat }, transaction: t }
              )
                .then((newupdate) => {
                  t.commit();
                  jsonFormat(res, "success", "Berhasil memuat data", newupdate);
                })
                .catch((err) => {
                  t.rollback();
                  jsonFormat(res, "failed", err.message, "satu");
                });
            })
            .catch((err) => {
              t.rollback();
              jsonFormat(res, "failed", err.message, "satu");
            });
        })
        .catch((err) => {
          t.rollback();
          jsonFormat(res, "failed", err.message, "dua");
        });
    });
  }
};

exports.updateSkemaDetailPerjalanan = async (req, res, next) => {
  try {
  const skemaPerjalanan = req.body.skemaPerjalanan;
  const id_surat_tugas = req.body.id_surat_tugas;
  const nip = req.body.nip;
  const kode_kota_asal = req.body.kode_kota_asal;
  const kode_kota_tujuan = req.body.kode_kota_tujuan;
  const kode_provinsi_tujuan = req.body.kode_provinsi_tujuan;
      db.transaction()
        .then((t) => {
          return KomponenPerjadin_1.destroy({
            where: {
              id_surat_tugas: id_surat_tugas,
              nip: nip,
              kode_kota_asal: kode_kota_asal,
              kode_kota_tujuan: kode_kota_tujuan,
              kode_komponen_honor: 4,
            },
            transaction: t,
          })
            .then(() => {
              SbmUangHarian.findOne({
                where: { kode_provinsi: kode_provinsi_tujuan },
              })
                .then((SBM) => {
                  let createKomponen = [];
                  skemaPerjalanan.map((sp) => {
                    let uang_saku = 0;
                    let keterangan;
                    if (sp.kode_skema == 3) {
                      uang_saku = SBM.diklat;
                      keterangan = "Uang Saku Diklat";
                    } else if (sp.kode_skema == 2) {
                      uang_saku = SBM.dalamkota;
                      keterangan = "Uang Saku Dalam Kota";
                    } else if (sp.kode_skema == 6) {
                      uang_saku = 0;
                      keterangan = "Tanpa Uang Harian";
                    } else {
                      uang_saku = SBM.luarkota;
                      keterangan = "Uang Saku Penuh";
                    }
                    let total = sp.jumlah_hari * uang_saku;

                    createKomponen.push({
                      id_surat_tugas: id_surat_tugas,
                      urut_tugas: 5,
                      nip: nip,
                      kode_komponen_honor: 4,
                      kode_kota_asal: kode_kota_asal,
                      kode_kota_tujuan: kode_kota_tujuan,
                      keterangan_komponen: keterangan,
                      kode_satuan: "OH",
                      biaya_satuan: uang_saku,
                      pajak_persen: 0,
                      jumlah_pajak: 0,
                      jumlah: sp.jumlah_hari,
                      total: total,
                    });
                  });
                  KomponenPerjadin_1.bulkCreate(createKomponen, {
                    transaction: t,
                  })
                    .then((create) => {
                      KomponenPerjadin_1.sum('total',{where:{id_surat_tugas: id_surat_tugas,
                         nip: nip,
                        kode_kota_asal: kode_kota_asal},transaction:t}).then((biayaTotal)=>{
                          PetugasPerjadinBiaya.update({biaya:biayaTotal},{where:{id_surat_tugas: id_surat_tugas,
                            nip: nip,
                           kode_kota_asal: kode_kota_asal},transaction:t}).then(()=>{
                            t.commit();
                            jsonFormat(res, "success", "skema diupdate dipilih", []);
                           }).catch((err) => {t.rollback();next(err);});
                        }).catch((err) => {t.rollback();next(err);});
                    })
                    .catch((err) => {
                      t.rollback();
                      next(err);
                    });
                })
                .catch((err) => {
                  t.rollback();
                  next(err);
                });
            })
            .catch((err) => {
              t.rollback();
              next(err);
            });
        })
        .catch((err) => {
          return next(err);
        });
    
  } catch (error) {
    next(error);
  }
};


exports.pilihSkemanew = async(req,res,next) =>{
  try{
    const tahun = req.body.tahun;
    const kode_surat = req.body.kode_surat;
    const kode_skema_perjadin = req.body.kode_skema_perjadin

    //STEP 1.1 generate surat
    const surat = await SuratTugasPerjadin.findOne({where:{id_surat_tugas:kode_surat}}).then((s)=>{
      if(s == null) {
        let err = new Error("data surat tidak ditemukan");
        throw err
      }
      return s
    }).catch((err)=>{throw err});    

    //STEP 1.2 generate petugas
    const petugas = await PetugasPerjadinBiaya.findAll({
      where: { id_surat_tugas: req.body.kode_surat },
    }).then((p)=>{
      if(p.length == 0) {
        let err = new Error("data petugas tidak ditemukan");
        throw err
      }
      return p
    }).catch((err)=>{throw err});

    //STEP 2 generate komponen
    const komponen = await trxKomponenPerjadin.findAll({
      where: { kode_skema_perjadin: req.body.kode_skema_perjadin },include:['komponen1']
    }).then((k)=>{
      if(k.length == 0) {
        let err = new Error("data skema tidak memiliki komponen");
        throw err
      }
      return k
    }).catch((err)=>{throw err});

    //STEP 3 looping 1
    let arrKomponen = []
    let arruptPetugas = []
    for(p=0;p<petugas.length;p++){
      let taksi = 0
      let transportPetugas = ""
      let biayaPetugas = 0

    //STEP 4 looping 2
    for(k=0;k<komponen.length;k++){
      let komponenInsert
      
      //STEP 5.1 jika komponen transport muncul
      if(komponen[k].kode_komponen_perjadin ==='1'){
        komponenInsert = await SbmTransport.findOne({
          where: {
            kode_unit: surat.kode_unit,
            asal: petugas[p].kode_kota_asal,
            tujuan: petugas[p].kode_kota_tujuan,
            keterangan: "terverifikasi admin",
          },
        })
          .then((kt) => {
            if (kt === null) {
              return {
                id_surat_tugas: kode_surat,
                urut_tugas: 1,
                nip: petugas[p].nip,
                kode_komponen_honor: komponen[k].kode_komponen_perjadin,
                kode_kota_asal: petugas[p].kode_kota_asal,
                kode_kota_tujuan: petugas[p].kode_kota_tujuan,
                keterangan_komponen:
                  "Biaya dari pokjar asal menuju pokjar tujuan belum ada di dalam sbm",
                kode_satuan: "-",
                biaya_satuan: 0,
                pajak_persen: 0,
                jumlah_pajak: 0,
                jumlah: 0,
                total: 0,
                tahun: petugas[p].tahun,
              };
            } else {
              let biayat, keterangant, kode_satuan, kalijumlah;
              if (kt.udara > 0) {
                biayat = kt.udara;
                keterangant = "Transpor (Udara)";
              } else if (kt.darat > 0) {
                biayat = kt.darat;
                keterangant = "Transpor (Darat)";
              } else if (kt.laut > 0) {
                biayat = kt.laut;
                keterangant = "Transpor (Laut)";
              } else {
                biayat = 0;
                keterangant = "Transport (Belum Terdapat Biaya)";
              }
              if (petugas[p].keterangan_dinas === "PP") {
                kode_satuan = "PP";
                kalijumlah = 1;
              } else {
                kode_satuan = "P";
                kalijumlah = 0.5;
              }
              return {
                id_surat_tugas: kode_surat,
                urut_tugas: 1,
                nip: petugas[p].nip,
                kode_komponen_honor: komponen[k].kode_komponen_perjadin,
                kode_kota_asal: petugas[p].kode_kota_asal,
                kode_kota_tujuan: petugas[p].kode_kota_tujuan,
                keterangan_komponen: keterangant,
                kode_satuan: kode_satuan,
                biaya_satuan: biayat * kalijumlah,
                satuan_sbm: biayat * kalijumlah,
                pajak_persen: 0,
                jumlah_pajak: 0,
                jumlah: 1,
                total: biayat * kalijumlah * 1,
                tahun: petugas[p].tahun,
              };
            }
          })
          .catch((err) => {
            return {
              id_surat_tugas: kode_surat,
              urut_tugas: 1,
              nip: petugas[p].nip,
              kode_komponen_honor: komponen[k].kode_komponen_perjadin,
              kode_kota_asal: petugas[p].kode_kota_asal,
              kode_kota_tujuan: petugas[p].kode_kota_tujuan,
              keterangan_komponen: "data SBM Transport tidak bisa diakses",
              kode_satuan: "-",
              biaya_satuan: 0,
              pajak_persen: 0,
              jumlah_pajak: 0,
              jumlah: 0,
              total: 0,
              tahun: petugas[p].tahun,
            };
          });

        // Step 5.1.1 kondisi untuk menentukan ada taksi atau tidak
        
        if(komponenInsert.keterangan_komponen == 'Transpor (Udara)' ){taksi = 1;transportPetugas = "Udara" 
         }else if(komponenInsert.keterangan_komponen == 'Transpor (Darat)'){transportPetugas = "Darat" }
        else if(komponenInsert.keterangan_komponen == 'Transpor (Laut)'){transportPetugas = "Laut" }

         biayaPetugas += komponenInsert.total
      }

      //STEP 5.2 jika komponen taksi muncul jika transport adalah udara
      else if((komponen[k].kode_komponen_perjadin ==='2.1' && taksi == 1) || (komponen[k].kode_komponen_perjadin ==='2.2' && taksi == 1)){
        let kodeprovinsi,urut_tugas_taksi, ketTaksi
        if(petugas[p].keterangan_dinas === "PP"){ketTaksi = 2}else{ketTaksi = 1}
        if(komponen[k].kode_komponen_perjadin ==='2.1'){kodeprovinsi = petugas[p].kode_provinsi_asal;urut_tugas_taksi = 2}else{kodeprovinsi = petugas[p].kode_provinsi_tujuan;urut_tugas_taksi=3}
        
        komponenInsert = await SbmTaksi.findOne({where:{kode_provinsi:kodeprovinsi}}).then((kt)=>{
          if(kt==null){
            return{
              "id_surat_tugas":kode_surat,
              "urut_tugas":urut_tugas_taksi,
              "nip":petugas[p].nip,
              "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
              "kode_kota_asal":petugas[p].kode_kota_asal,
              "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
              "keterangan_komponen":"Biaya Taksi pada provinsi ini tidak ada segera hubungi bagian SBM",
              "kode_satuan":komponen[k].komponen1.kode_satuan,
              "biaya_satuan":0,
              "satuan_sbm":0,
              "pajak_persen":0,
              "jumlah_pajak":0,
              "jumlah":ketTaksi,
              "total":0,
              "tahun":petugas[p].tahun
            }
          }else{
            return{
              "id_surat_tugas":kode_surat,
              "urut_tugas":urut_tugas_taksi,
              "nip":petugas[p].nip,
              "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
              "kode_kota_asal":petugas[p].kode_kota_asal,
              "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
              "keterangan_komponen":komponen[k].komponen1.nama_komponen_perjadin,
              "kode_satuan":komponen[k].komponen1.kode_satuan,
              "biaya_satuan":kt.biaya,
              "satuan_sbm":kt.biaya,
              "pajak_persen":0,
              "jumlah_pajak":0,
              "jumlah":ketTaksi,
              "total":kt.biaya*ketTaksi,
              "tahun":petugas[p].tahun
            }
          }
        }).catch((err)=>{
          return{
            "id_surat_tugas":kode_surat,
            "urut_tugas":urut_tugas_taksi,
            "nip":petugas[p].nip,
            "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
            "kode_kota_asal":petugas[p].kode_kota_asal,
            "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
            "keterangan_komponen":"data SBM Taksi tidak bisa diakses",
            "kode_satuan":komponen[k].komponen1.kode_satuan,
            "biaya_satuan":0,
            "pajak_persen":0,
            "jumlah_pajak":0,
            "jumlah":ketTaksi,
            "total":0,
            "tahun":petugas[p].tahun
          }
        })
         biayaPetugas += komponenInsert.total
      }

      //STEP 5.3 jika komponen penginapan
      else if(komponen[k].kode_komponen_perjadin ==='3'){
        komponenInsert = await SbmPenginapan.findOne({where:{kode_provinsi:petugas[p].kode_provinsi_tujuan}}).then((kt)=>{
          if(kt==null){
            return{
              "id_surat_tugas":kode_surat,
              "urut_tugas":4,
              "nip":petugas[p].nip,
              "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
              "kode_kota_asal":petugas[p].kode_kota_asal,
              "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
              "keterangan_komponen":"Biaya Penginapan pada provinsi ini tidak ada segera hubungi bagian SBM",
              "kode_satuan":komponen[k].komponen1.kode_satuan,
              "biaya_satuan":0,
              "pajak_persen":0,
              "jumlah_pajak":0,
              "jumlah":petugas[p].lama_perjalanan,
              "total":0,
              "tahun":petugas[p].tahun
            }
          }else{
            let biayap = 0
            if(petugas[p].eselon === "eselonI"){biayap = kt.eselonI}
            else if(petugas[p].eselon === "eselonII"){biayap = kt.eselonII}
            else if(petugas[p].eselon === "eselonIII"){biayap = kt.eselonIII}
            else if(petugas[p].eselon === "eselonIV"){biayap = kt.eselonIV}
            else {biayap = kt.non_eselon}
            return{
              "id_surat_tugas":kode_surat,
              "urut_tugas":4,
              "nip":petugas[p].nip,
              "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
              "kode_kota_asal":petugas[p].kode_kota_asal,
              "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
              "keterangan_komponen":komponen[k].komponen1.nama_komponen_perjadin,
              "kode_satuan":komponen[k].komponen1.kode_satuan,
              "biaya_satuan":biayap,
              "satuan_sbm":biayap,
              "pajak_persen":0,
              "jumlah_pajak":0,
              "jumlah":petugas[p].lama_perjalanan-1,
              "total":biayap*(petugas[p].lama_perjalanan-1),
              "tahun":petugas[p].tahun
            }
          }
        }).catch((err)=>{
          return{
            "id_surat_tugas":kode_surat,
            "urut_tugas":4,
            "nip":petugas[p].nip,
            "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
            "kode_kota_asal":petugas[p].kode_kota_asal,
            "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
            "keterangan_komponen":"data SBM Penginapan tidak bisa diakses",
            "kode_satuan":komponen[k].komponen1.kode_satuan,
            "biaya_satuan":0,
            "satuan_sbm":0,
            "pajak_persen":0,
            "jumlah_pajak":0,
            "jumlah":petugas[p].lama_perjalanan,
            "total":0,
            "tahun":petugas[p].tahun
          }
        })
         biayaPetugas += komponenInsert.total
      }

      //STEP 5.4 jika komponen uang harian
      else if(komponen[k].kode_komponen_perjadin ==='4'){
        komponenInsert = await SbmUangHarian.findOne({where:{kode_provinsi:petugas[p].kode_provinsi_tujuan}}).then((kt)=>{
          if(kt==null){
            return{
              "id_surat_tugas":kode_surat,
              "urut_tugas":5,
              "nip":petugas[p].nip,
              "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
              "kode_kota_asal":petugas[p].kode_kota_asal,
              "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
              "keterangan_komponen":"Biaya Penginapan pada provinsi ini tidak ada segera hubungi bagian SBM",
              "kode_satuan":komponen[k].komponen1.kode_satuan,
              "biaya_satuan":0,
              "satuan_sbm":0,
              "pajak_persen":0,
              "jumlah_pajak":0,
              "jumlah":petugas[p].lama_perjalanan,
              "total":0,
              "tahun":petugas[p].tahun
            }
          }else{
            let biayau = 0
            if(kode_skema_perjadin === 2 ){biayau = kt.dalamkota}else if(kode_skema_perjadin === 3 ){biayau = kt.diklat}else{biayau = kt.luarkota}
            return{
              "id_surat_tugas":kode_surat,
              "urut_tugas":5,
              "nip":petugas[p].nip,
              "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
              "kode_kota_asal":petugas[p].kode_kota_asal,
              "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
              "keterangan_komponen":komponen[k].komponen1.nama_komponen_perjadin,
              "kode_satuan":komponen[k].komponen1.kode_satuan,
              "biaya_satuan":biayau,
              "satuan_sbm":biayau,
              "pajak_persen":0,
              "jumlah_pajak":0,
              "jumlah":petugas[p].lama_perjalanan,
              "total":biayau*(petugas[p].lama_perjalanan),
              "tahun":petugas[p].tahun
            }
          }
        }).catch((err)=>{
          return{
            "id_surat_tugas":kode_surat,
            "urut_tugas":5,
            "nip":petugas[p].nip,
            "kode_komponen_honor":komponen[k].kode_komponen_perjadin,
            "kode_kota_asal":petugas[p].kode_kota_asal,
            "kode_kota_tujuan":petugas[p].kode_kota_tujuan,
            "keterangan_komponen":"data SBM Penginapan tidak bisa diakses",
            "kode_satuan":komponen[k].komponen1.kode_satuan,
            "biaya_satuan":0,
            "satuan_sbm":0,
            "pajak_persen":0,
            "jumlah_pajak":0,
            "jumlah":petugas[p].lama_perjalanan,
            "total":0,
            "tahun":petugas[p].tahun
          }
        })
         biayaPetugas += komponenInsert.total
      }

      

      // biayaPetugas += komponenInsert.total
      //STEP 6 push to array
      if(komponenInsert != null){
      arrKomponen.push(komponenInsert)
    }
    }

    arruptPetugas.push({
      "nip":petugas[p].nip,
      "kode_kota_asal":petugas[p].kode_kota_asal,
      "tahun":petugas[p].tahun,
      "transport":transportPetugas,
      "biaya":biayaPetugas
    })

    }

    // STEP 7 Database Transaction
    db.transaction().then((t)=>{
      return PetugasPerjadinBiaya.update({transport:"",biaya:0},{where:{id_surat_tugas: kode_surat },transaction:t})
      .then((p)=>{
        for(let i = 0; i<arruptPetugas.length;i++){
          PetugasPerjadinBiaya.update({transport:arruptPetugas[i].transport,biaya:arruptPetugas[i].biaya}
            ,{where:{id_surat_tugas: kode_surat,
              nip:arruptPetugas[i].nip
              ,kode_kota_asal:arruptPetugas[i].kode_kota_asal },transaction:t})
        }
        return KomponenPerjadin_1.destroy({where:{id_surat_tugas:kode_surat},transaction:t}).then(()=>{
          return KomponenPerjadin_1.bulkCreate(arrKomponen,{transaction:t}).then((komponencreate)=>{
            return SuratTugasPerjadin.update({kode_skema:kode_skema_perjadin},{where:{id_surat_tugas:kode_surat},transaction:t}).then(()=>{
              t.commit()
              return jsonFormat(res, "success", "Berhasil Mengganti Skema", komponencreate);
            }).catch((err)=>{t.rollback();throw err})
          }).catch((err)=>{t.rollback();throw err})
        }).catch((err)=>{t.rollback();throw err})
      }).catch((err)=>{t.rollback();throw err})
    }).catch((err)=>{throw err})


    
  }catch(err){
    return next(err)
  }
}

exports.pilihSkemabarulagi = async(req,res,next) =>{

let petugas = req.body.petugas
for(let i = 0; i < petugas.length ; i++){
  
}

}

exports.updatetransportnew = async(req,res,next)=>{

  // STEP 1 Variable declair
  let id_surat_tugas = req.body.id_surat_tugas;
  let nip = req.body.nip;
  let kode_unit = req.body.kode_unit
  let kode_kota_asal = req.body.kode_kota_asal;
  let kode_kota_tujuan = req.body.kode_kota_tujuan;
  let kode_transport = req.body.kode_transport;
  let id_provinsi_asal = req.body.id_provinsi_asal;
  let id_provinsi_tujuan = req.body.id_provinsi_tujuan;
  let kode_satuan = req.body.kode_satuan;
  let tahun = req.body.tahun;

  try{
  let arrkomponen = []
  // STEP 2 SBM transport
  let transportInsert = await SbmTransport.findOne({where:{kode_unit:kode_unit,asal:kode_kota_asal,tujuan:kode_kota_tujuan}}).then((t)=>{
    if(t==null){
      let err = new Error('Data sbm transport tidak ada di database')
      throw err
    }
    let biayat,kalijumlah

    if(kode_transport === 'udara'){
      biayat = t.udara 
    }else if(kode_transport === 'darat'){
      biayat = t.darat 
    }else if(kode_transport === 'laut'){
      biayat = t.laut 
    }
    if(kode_satuan === 'PP'){
      kalijumlah = 1
      ketTaksi = 2
    }else if(kode_satuan === 'P'){
      kalijumlah = 0.5
      ketTaksi = 1
    }else{
      let err = new Error('kode_satuan salah')
      throw err
    }
    
    return{
      "id_surat_tugas":id_surat_tugas,
      "urut_tugas":1,
      "nip":nip,
      "kode_komponen_honor":1,
      "kode_kota_asal":kode_kota_asal,
      "kode_kota_tujuan":kode_kota_tujuan,
      "keterangan_komponen":`Transport (${kode_transport})`,
      "kode_satuan":kode_satuan,
      "biaya_satuan":biayat*kalijumlah,
      "satuan_sbm":biayat*kalijumlah,
      "pajak_persen":0,
      "jumlah_pajak":0,
      "jumlah":1,
      "total":biayat*kalijumlah*1,
      "tahun":tahun
    }
  }).catch((err)=>{throw err})

  arrkomponen.push(transportInsert)

  if(kode_transport === 'udara'){
    // STEP 3 SBM taksi asal
    komponenInsertAsal = await SbmTaksi.findOne({where:{kode_provinsi:id_provinsi_asal}}).then((t)=>{
      if(t == null){
        let err = new Error("Taksi asal tidak ada di database")
        throw err
      }
      let ketTaksi
      if(kode_satuan === 'PP'){
        ketTaksi = 2
      }else if(kode_satuan === 'P'){
        ketTaksi = 1
      }
      return{
        "id_surat_tugas":id_surat_tugas,
        "urut_tugas":1,
        "nip":nip,
        "kode_komponen_honor":'2.1',
        "kode_kota_asal":kode_kota_asal,
        "kode_kota_tujuan":kode_kota_tujuan,
        "keterangan_komponen":'Transport Lokal (Taksi) asal',
        "kode_satuan":'OK',
        "biaya_satuan":t.biaya,
        "satuan_sbm":t.biaya,
        "pajak_persen":0,
        "jumlah_pajak":0,
        "jumlah":ketTaksi,
        "total":t.biaya*ketTaksi,
        "tahun":tahun
      }
    }).catch((err)=>{throw err})
    arrkomponen.push(komponenInsertAsal)
// STEP 4 SBM taksi tujuan
    komponenInsertTujuan = await SbmTaksi.findOne({where:{kode_provinsi:id_provinsi_tujuan}}).then((t)=>{
      if(t == null){
        let err = new Error("Taksi tujuan tidak ada di database")
        throw err
      }
      return{
        "id_surat_tugas":id_surat_tugas,
        "urut_tugas":1,
        "nip":nip,
        "kode_komponen_honor":'2.2',
        "kode_kota_asal":kode_kota_asal,
        "kode_kota_tujuan":kode_kota_tujuan,
        "keterangan_komponen":'Transpor Lokal (Taksi) tujuan',
        "kode_satuan":'OK',
        "biaya_satuan":t.biaya,
        "satuan_sbm":t.biaya,
        "pajak_persen":0,
        "jumlah_pajak":0,
        "jumlah":ketTaksi,
        "total":t.biaya*ketTaksi,
        "tahun":tahun
      }
    }).catch((err)=>{throw err})
    arrkomponen.push(komponenInsertTujuan)
  }

  // STEP 5 transaksi database
  db.transaction().then((t)=>{
    return KomponenPerjadin_1.destroy({
      where: {
        id_surat_tugas: id_surat_tugas,
        nip: nip,
        kode_kota_asal: kode_kota_asal,
        kode_kota_tujuan: kode_kota_tujuan,
        kode_komponen_honor: [1, 2.1, 2.2],
      },transaction:t
    }).then(()=>{
      return KomponenPerjadin_1.bulkCreate(arrkomponen,{transaction:t}).then((komponenbc)=>{
        return KomponenPerjadin_1.sum('total',{where:{id_surat_tugas: id_surat_tugas,
          nip: nip,
         kode_kota_asal: kode_kota_asal},transaction:t}).then((biayaTotal)=>{
          return PetugasPerjadinBiaya.update({biaya:biayaTotal,transport:kode_transport},{where:{id_surat_tugas: id_surat_tugas,
             nip: nip,
            kode_kota_asal: kode_kota_asal},transaction:t}).then(()=>{
             t.commit();
             return jsonFormat(res, "success", "Transport telah diupdate", []);
            }).catch((err) => {t.rollback();next(err);});
         }).catch((err) => {t.rollback();next(err);});
      }).catch((err)=>{t.rollback();throw err;})
    }).catch((err)=>{t.rollback();throw err;})
  }).catch((err)=>{throw err})

}catch(err){
  return next(err)
}
}

exports.editKomponen = (req,res,next) =>{
  KomponenPerjadin_1.update(req.body,{where:{kode_trx:req.params.kode_trx}}).then((a)=>{
    jsonFormat(res,"success","berhasil",a)
  }).catch((err)=>{next(err)})
}

exports.listKomponen = (req,res,next) =>{
  KomponenPerjadin.findAll({where:{kode_komponen_perjadin:{[Op.in]:["1","2.1","2.2"]}}}).then((reskom)=>{
    jsonFormat(res,"success","berhasil menampilkan data",reskom)
  }).catch((err)=>{
    jsonFormat(res,"failed",err.message,err)
  })
}


exports.tambahKomponen = (req,res,next) =>{
  KomponenPerjadin_1.create(req.body).then((a)=>{
    jsonFormat(res,"success","Berhasil Membuat data",a)
  }).catch((err)=>{
    jsonFormat(res,"failed",err.message,err)
  })
}

exports.hapusKomponen = (req,res,next) =>{
  KomponenPerjadin_1.destroy({where:{kode_trx:req.params.kode_trx}}).then((hapus)=>{
    jsonFormat(res,"success","berhasil menghapus",hapus)
  })
}