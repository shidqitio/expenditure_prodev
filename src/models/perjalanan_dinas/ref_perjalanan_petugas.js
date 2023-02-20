const { Sequelize } = require("sequelize");
const db = require("../../config/database");
const PetugasPerjadin = require("../trx_petugas_perjadin");
const trxSbmTranspor = require("./trx_sbm_transpor");
const trxSbmPenginapan = require("./trx_sbm_penginapan");
const trxSbmUangharian = require("./trx_sbm_uangharian");
const refKabko = require("../ref_geo_kabko")
const refPerjalanan = ("./ref_perjalanan")

const { DataTypes } = Sequelize;

const refPerjalananPetugas = db.define(
  "refPerjalananPetugas",
  {
    kode_perjalanan: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_surat_tugas: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_tempat_asal: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    kode_tempat_tujuan: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tanggal_pergi: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    tanggal_pulang: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    unit_tujuan: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    transpor: {
      type: DataTypes.ENUM('UDARA', 'DARAT', 'LAUT'),
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.ENUM('SATU_ARAH', 'PULANG_PERGI'),
      allowNull: false,
    },
    ucr: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    uch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    udcr: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    udch: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "ref_perjalanan_petugas",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

refPerjalananPetugas.hasMany(PetugasPerjadin, {
  foreignKey: "kode_perjalanan",
  as: "petugasPerjadin",
});

PetugasPerjadin.belongsTo(refPerjalananPetugas, {
  foreignKey: "kode_perjalanan",
  as: "perjalananPetugas",
});

refPerjalananPetugas.hasMany(trxSbmTranspor, {
  foreignKey: "kode_perjalanan",
  as:"sbmTranspor"
});

refPerjalananPetugas.hasMany(trxSbmPenginapan, {
  foreignKey: "kode_perjalanan",
  as: "sbmPenginapan",
});

refPerjalananPetugas.hasMany(trxSbmUangharian, {
  foreignKey: "kode_perjalanan",
  as: "sbmUangHarian",
});
refPerjalananPetugas.belongsTo(refKabko, {
  foreignKey: "kode_tempat_asal",
  targetKey: "kode_kabko",
  as:"kabkoAsal"
});
refPerjalananPetugas.belongsTo(refKabko, {
  foreignKey: "kode_tempat_tujuan",
  targetKey: "kode_kabko",
  as: "kabkoTujuan",
});

// refPerjalananPetugas.belongsTo(refPerjalanan)
// refPerjalananPetugas.belongsTo(refPerjalanan, { foregnKey:"kode_tempat_tujuan",as: "Perjalanan" });


module.exports = refPerjalananPetugas;
