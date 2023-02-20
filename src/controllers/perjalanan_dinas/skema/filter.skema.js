const debug = require("log4js");
const logger = debug.getLogger();
const { Op } = require("sequelize");
const refKabko = require("../../../models/ref_geo_kabko");
const { jsonFormat } = require("../../../utils/jsonFormat");
const PetugasPerjadin = require("../../../models/trx_petugas_perjadin");
const refPerjalanan = require("../../../models/perjalanan_dinas/ref_perjalanan");
const trxPerjalananSbm = require("../../../models/perjalanan_dinas/trx_perjalanan_sbm");
const refSBMPerjadin = require("../../../models/perjalanan_dinas/ref_sbm_perjalanan_dinas");
const refSbmTransporPerjadin = require("../../../models/perjalanan_dinas/ref_sbm_transpor_perjadin");
const refPerjalananPetugas = require("../../../models/perjalanan_dinas/ref_perjalanan_petugas");
const KomponenPerjadin = require("../../../models/trx_komponen_perjadin");

const filterSchema = async (req, res, next) => {
    const params = req.params;

    return await refPerjalananPetugas.findAll({
        attributes: [
          "kode_perjalanan",
          "kode_surat_tugas",
          "kode_tempat_asal",
          "kode_tempat_tujuan",
          "tanggal_pergi",
          "tanggal_pulang",
          "unit_tujuan",
          "transpor",
          "keterangan",
        ],
        include: [
          { 
            attributes: [
              "kode_provinsi",
              "kode_kabko",
              "nama_kabko",
              "pusat_kabko",
            ],
            model: refKabko, as: "kabkoAsal" },
          { 
             attributes: [
              "kode_provinsi",
              "kode_kabko",
              "nama_kabko",
              "pusat_kabko",
            ],
            model: refKabko, as: "kabkoTujuan" },
          {
            model: PetugasPerjadin,
            as: "petugasPerjadin",
            include: [
              {model: KomponenPerjadin, as: "komponenPetugas"}
            ]
          },
        ],
        where: {
          kode_surat_tugas: params.kode_tugas
        }
      }).then(async(result) => {
        let arrayPetugas = [];
    
        await Promise.all(result.map(async(perjalanan) => {
          const petugas = perjalanan.petugasPerjadin;
          
          for (let i = 0; i < petugas.length; i++) {
            let element = petugas[i];
            let transporBiyaPp = 0;
            let transporBiyaSejalan = 0;

            KomponenPerjadin.destroy({
              where: {
                "kode_petugas": element.kode_petugas,
                "kode_perjalanan": element.kode_perjalanan,
              }
            }).catch((err) => {
              logger.debug(`KomponenPerjadin.destroy catch : ${err}`);
              logger.error(`KomponenPerjadin.destroy catch : ${err}`);
              next(err);
            });

              let arrayMerge = [];
              const transpor = await sbmTranspor(perjalanan.kode_tempat_asal, perjalanan.kode_tempat_tujuan, perjalanan.transpor).then((res) => {
                const dataObj = res.map((trans) => {
                    transporBiyaPp += Math.floor(trans.biaya_pp);
                    transporBiyaSejalan += Math.floor(trans.biaya_sejalan);
                    return {
                      "kode_petugas": element.kode_petugas,
                      "kode_perjalanan": element.kode_perjalanan,
                      "kode_kategori": "1_TRANSPOR",
                      "kode_surat_tugas": perjalanan.kode_surat_tugas,
                      "kode_surat_header": perjalanan.kode_surat_header,
                      "kategori_sbm": trans.katagori_sbm,
                      "transpor": trans.transpor,
                      "kode_satuan": trans.satuan,
                      "biaya_satuan": perjalanan.keterangan == 'SATU_ARAH' ? trans.biaya_sejalan : trans.biaya_pp,
                      "jumlah_satuan": 1,
                      "total": perjalanan.keterangan == 'SATU_ARAH' ? trans.biaya_sejalan : trans.biaya_pp,
                      "mekanisme": trans.mekanisme,
                      "mekanisme_atcost": trans.mekanisme_atcost,
                    }
                });
                return dataObj
              }).then((err) => {return err});

              const penginapan = await sbmPenginapan(element.eselon, element.gol, perjalanan.kode_tempat_tujuan).then((penginapan) => {
                  return {
                      "kode_petugas": element.kode_petugas,
                      "kode_perjalanan": element.kode_perjalanan,
                      "kode_kategori": "2_PENGINAPAN",
                      "kode_surat_tugas": perjalanan.kode_surat_tugas,
                      "kode_surat_header": perjalanan.kode_surat_header,
                      "kategori_sbm": penginapan.kategori_sbm,
                      "transpor": "-",
                      "kode_satuan": penginapan.satuan,
                      "biaya_satuan": penginapan.biaya,
                      "jumlah_satuan": 1,
                      "total": penginapan.biaya,
                      "mekanisme": penginapan.mekanisme,
                      "mekanisme_atcost": penginapan.makanisme_atcost,
                  }
              }).then((err) => {return err});

              const uangharian = await sbmUangHarian(perjalanan.kode_tempat_tujuan, params.skema).then((uangharian) => {
                  return {
                      "kode_petugas": element.kode_petugas,
                      "kode_perjalanan": element.kode_perjalanan,
                      "kode_kategori": "3_UANGHARIAN",
                      "kode_surat_tugas": perjalanan.kode_surat_tugas,
                      "kode_surat_header": perjalanan.kode_surat_header,
                      "kategori_sbm": uangharian.kategori_sbm,
                      "transpor": "-",
                      "kode_satuan": uangharian.satuan,
                      "biaya_satuan": uangharian.biaya,
                      "jumlah_satuan": 1,
                      "total": uangharian.biaya,
                      "mekanisme": uangharian.mekanisme,
                      "mekanisme_atcost": uangharian.makanisme_atcost,
                  }
              }).then((err) => {return err});

              let firstTranspor = transpor[0];
              let secondTranspor = transpor[1];
              let thirdTranspor = transpor[2];
              let firstUangharian = uangharian[0];
              let secondUangharian = uangharian[0];
              let thirdUangharian = uangharian[0];
              arrayMerge.push(firstTranspor, secondTranspor, thirdTranspor, penginapan, firstUangharian, secondUangharian, thirdUangharian);

              let uangharianBiaya = Math.floor(uangharian.biaya_satuan);
              let penginapanBiaya = Math.floor(penginapan.biaya_satuan);
              
              let uh = uangharianBiaya + penginapanBiaya;

              let sub_total_pp = transporBiyaPp + uh;
              let sub_total_sejalan = transporBiyaSejalan + uh;

              await KomponenPerjadin.bulkCreate(arrayMerge).catch((err) => {
                logger.debug(`KomponenPerjadin.bulkCreate catch : ${err}`);
                logger.error(`KomponenPerjadin.bulkCreate catch : ${err}`);
                next(err);
              });
              
              arrayPetugas.push({
                "kode_petugas": element.kode_petugas,
                "kode_perjalanan": element.kode_perjalanan,
                "kode_surat_tugas": perjalanan.kode_surat_tugas,
                "nip": element.nip,
                "email": element.email,
                "nama_petugas": element.nama_petugas,
                "eselon": element.eselon,
                "gol": element.gol,
                "total": perjalanan.keterangan == "SATU_ARAH" ? sub_total_sejalan : sub_total_pp,
                "komponenPetugas": arrayMerge,
              });
          }

          const petugasPerjalanan = arrayPetugas.filter((data) => data.kode_perjalanan == perjalanan.kode_perjalanan);

          return petugasPerjalanan;
        })).catch((err)  => {
          logger.debug(`resultPayload catch : ${err}`);
          logger.error(`resultPayload catch : ${err}`);
          next(err);
        })

        return result
    }).then((response) => {
      const responsePayload = response.map((perjalanan) => {
        const responsePetugas = perjalanan.petugasPerjadin.map((petugas) => {
          let total = 0;
          const responseKomponen = petugas.komponenPetugas.map((komponen) => {
          total += Math.floor(komponen.biaya_satuan);
            const payloadKomponen = {
                "kode_komponen": komponen.kode_komponen,
                "kode_petugas": komponen.kode_petugas,
                "kode_perjalanan": komponen.kode_perjalanan,
                "kode_surat_tugas": komponen.kode_surat_tugas,
                "kode_kategori": komponen.kode_kategori,
                "kategori_sbm": komponen.kategori_sbm,
                "transpor": komponen.transpor,
                "kode_satuan": komponen.kode_satuan,
                "biaya_satuan": komponen.biaya_satuan,
                "jumlah_satuan": komponen.jumlah_satuan,
                "total": komponen.total,
                "mekanisme": komponen.mekanisme,
                "mekanisme_atcost": komponen.mekanisme_atcost
            }

            return payloadKomponen;
          })
          const payloadPetugas = {
            "kode_petugas": petugas.kode_petugas,
            "kode_perjalanan": petugas.kode_perjalanan,
            "nip": petugas.nip,
            "email": petugas.email,
            "nama_petugas": petugas.nama_petugas,
            "eselon": petugas.eselon,
            "gol": petugas.gol,
            "transpor": petugas.transpor,
            "total": total,
            "komponenPetugas": responseKomponen
          }

          return payloadPetugas
        });

        const payloadPerjalanan = {
            "kode_perjalanan": perjalanan.kode_perjalanan,
            "kode_surat_tugas": perjalanan.kode_surat_tugas,
            "kode_tempat_asal": perjalanan.kode_tempat_asal,
            "kode_tempat_tujuan": perjalanan.kode_tempat_tujuan,
            "tanggal_pergi": perjalanan.tanggal_pergi,
            "tanggal_pulang": perjalanan.tanggal_pulang,
            "unit_tujuan": perjalanan.unit_tujuan,
            "transpor": perjalanan.transpor,
            "keterangan": perjalanan.keterangan,
            "kota_asal": perjalanan.kabkoAsal.nama_kabko,
            "kota_tujuan": perjalanan.kabkoTujuan.nama_kabko,
            "petugasPerjadin": responsePetugas,
          }
          return payloadPerjalanan
      })
      jsonFormat(res, "success", "Successfully", responsePayload);
    }).catch((err) => {
      logger.debug(`filter skema catch : ${err}`);
      logger.error(`filter skema catch : ${err}`);
      next(err);
    })
}


const sbmTranspor = async (kodeAsal, kodeTujuan, transpor) => {
  try {
    let response;
    if (kodeAsal === "ID.36.05") {
      response = await refSbmTransporPerjadin.findAll({
        where: {
          kode_tempat_asal: kodeAsal.substring(0, 5),
          kode_tempat_tujuan: kodeTujuan,
          katagori_sbm: "TRANSPOR KHUSUS UT PUSAT",
        },
      });
      if (response.length > 0) {
        return response
      }
    }

    if (kodeAsal === kodeTujuan) {
      let response = await refSbmTransporPerjadin.findOne({
        where: { katagori_sbm: "TRANSPOR LOKAL" },
      });
      return response
    } else if (
      kodeAsal.substring(0, 5) ===
      kodeTujuan.substring(0, 5)
    ) {
      response = await refSbmTransporPerjadin.findOne({
        where: {
          kode_tempat_asal: kodeAsal.substring(0, 5),
          kode_tempat_tujuan: kodeTujuan,
          katagori_sbm: "DALAM PROVINSI",
        },
      });
      return response
    } else {
      perjalan = await refPerjalanan.findOne({
        where: {
          kode_tempat_asal: {
            [Op.in]: [kodeAsal, kodeTujuan],
          },
          kode_tempat_tujuan: {
            [Op.in]: [kodeAsal, kodeTujuan],
          },
          transpor: transpor,
        },
        include: {
          model: trxPerjalananSbm,
          as: "trxSbm",
          include: {
            model: refSbmTransporPerjadin,
            as: "sbmTranspor",
          },
        },
      });
      let arrSBM = [];

      if (perjalan == null) {
        return jsonFormat(res, "failed", "Tidak ada data transpor!");
      }

      perjalan.trxSbm.map((trx) => {
            arrSBM.push(trx.sbmTranspor);
      });

      return arrSBM
    }
  } catch (err) {
      logger.debug(`database SBMTranspor catch : ${err}`);
      logger.error(`database SBMTranspor catch : ${err}`);
      return err
  }
};

const sbmPenginapan = async (eselon, gol, kodeTempatTujuan) => {
  let kondisi;
  try {
    if (eselon !== "-") {
      kondisi = {
        eselon: eselon,
        gol: "-",
        kode_provinsi: kodeTempatTujuan.substring(0, 5),
        kategori_sbm: "PENGINAPAN",
      };
    } else if (gol !== "-") {
      kondisi = {
        eselon: "-",
        gol: gol,
        kode_provinsi: kodeTempatTujuan.substring(0, 5),
        kategori_sbm: "PENGINAPAN",
      };
    } else {
      kondisi = {
        eselon: "-",
        gol: "-",
        kode_provinsi: kodeTempatTujuan.substring(0, 5),
        kategori_sbm: "PENGINAPAN",
      };
    }
    let response = await refSBMPerjadin.findOne({ where: kondisi });
    if (!response) {
      return response;
    }
    return response
  } catch (err) {
      logger.debug(`database SBMPenginapan catch : ${err}`);
      logger.error(`database SBMPenginapan catch : ${err}`);
    return err;
  }
};


const sbmUangHarian = async (kodeTempatTujuan, kategoriSkema) => {
  try {
    if (kategoriSkema === "GABUNGAN") {
      kategoriSkema = {
        [Op.in]: ["LUAR KOTA", "DIKLAT", "DALAM KOTA > 8 JAM"],
      };
    }
    let response = await refSBMPerjadin.findAll({
      where: {
        kode_provinsi: kodeTempatTujuan.substring(0, 5),
        kategori_skema: kategoriSkema,
        kategori_sbm: "UANG_HARIAN_DALAM_NEGERI",
      },
    });
    return response;
  } catch (err) {
    logger.debug(`database SBMUangHarian catch : ${err}`);
    logger.error(`database SBMUangHarian catch : ${err}`);
    return err;
  }
};



module.exports = filterSchema;