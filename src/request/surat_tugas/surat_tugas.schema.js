const { check } = require("express-validator");

const enumSifatSurat = ["RAHASIA", "TERBATAS", "BIASA"];
const enumJenisPerjalanan = ["PERJALANAN_DINAS", "DALAM_KOTA", "LUAR_NEGERI"];
const enumPengusulan = ["TRANSAKSI_HISTORIS", "TRANSAKSI_BARU"];
const enumStatus = ["DRAF", "PENGAJUAN"];

exports.suratTugasSchema = [
  check("sifat_surat").notEmpty().withMessage("Sifat surat tidak boleh kosong") .custom((value) => {
      if (!enumSifatSurat.includes(value)) {
        throw new Error(`Isi value harus diantara: ${enumSifatSurat}`);
      }
      return true;
    }),
  check("jenis_perjalanan")
    .notEmpty()
    .withMessage("Jenis perjalanan tidak boleh kosong")
     .custom((value) => {
      if (!enumJenisPerjalanan.includes(value)) {
        throw new Error(`Isi value harus diantara: ${enumJenisPerjalanan}`);
      }
      return true;
    }),
  check("klasifikasi_surat")
    .notEmpty()
    .withMessage("Klasifikasi surat tidak boleh kosong"),
  check("kode_unit").notEmpty().withMessage("Kode unit tidak boleh kosong"),
  check("kode_unit_pagu")
    .notEmpty()
    .withMessage("Kode unit pagu tidak boleh kosong"),
  check("kode_unit_pagu")
    .notEmpty()
    .withMessage("Kode unit pagu tidak boleh kosong"),
  check("nip_penandatangan")
    .notEmpty()
    .withMessage("NIP penandatangan tidak boleh kosong"),
  check("email_penandatangan")
    .notEmpty()
    .withMessage("Email penandatangan tidak boleh kosong"),
  check("tanggal_surat")
    .notEmpty()
    .withMessage("Tanggal surat tidak boleh kosong"),
  check("rincian_kegiatan")
    .notEmpty()
    .withMessage("Rincian kegiatan tidak boleh kosong"),
  check("ucr")
    .notEmpty()
    .withMessage("NIP pembuat tidak boleh kosong"),
  check("dokumen")
    .notEmpty()
    .withMessage("Dokumen tidak boleh kosong"),
  check("status")
    .notEmpty()
    .withMessage("Status tidak boleh kosong (DRAF/PENGAJUAN)")
    .custom((value) => {
      if (!enumStatus.includes(value)) {
        throw new Error(`Isi value harus diantara: ${enumStatus}`);
      }
      return true;
    }),
  check("data_pengusulan")
    .notEmpty()
    .withMessage("Pengusulan boleh kosong (TRANSKSI_HISTORIS/TRANSAKSI_BARU)")
    .custom((value) => {
      if (!enumPengusulan.includes(value)) {
        throw new Error(`Isi value harus diantara: ${enumPengusulan}`);
      }
      return true;
    }),
  check("perjalanan")
    .optional()
    .custom((array, { req }) => {
    const perjalanan = JSON.parse(array);
    if (!Array.isArray(perjalanan)) {
      throw new Error("perjalanan harus berupa array");
    }

     for (let i = 0; i < perjalanan.length; i++) {
      const petugas = perjalanan[i].petugas;
      if (!Array.isArray(petugas)) {
        throw new Error("petugas harus berupa array");
      }
       
       for (let j = 0; j < petugas.length; j++) {
         const obj = petugas[j];
          if (!obj.nip || !obj.email || !obj.id_petugas || !obj.nama_petugas || !obj.eselon || !obj.gol || !obj.kode_bank || !obj.nomor_rekening || !obj.atas_nama_rekening) {
            throw new Error(`petugas pada index ${i} harus di isi!`);
          }
       }
     }
     return true;
    }),
  check("pemaraf")
    .optional()
    .custom((value, { req }) => {
       const pemaraf = JSON.parse(value);
       if (!Array.isArray(pemaraf)) {
         throw new Error("pemaraf harus berupa array");
       }
      for (let i = 0; i < pemaraf.length; i++) {
        const obj = pemaraf[i];
        if (!obj.nip || !obj.email || !obj.id_petugas) {
          throw new Error(`pemaraf pada index ${i} harus di isi!`);
        }
        if (!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(obj.email)) {
          throw new Error(`Email pemaraf pada index ${i} tidak valid!`);
        }
      }
      return true;
    }),
  check("tembusan")
    .optional()
    .custom((value, { req }) => {
       const tembusan = JSON.parse(value);
       if (!Array.isArray(tembusan)) {
         throw new Error("tembusan harus berupa array");
       }
      for (let i = 0; i < tembusan.length; i++) {
        const obj = tembusan[i];
        if (!obj.nip || !obj.email || !obj.id_petugas) {
          throw new Error(`tembusan pada index ${i} harus di isi!`);
        }
        if (!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(obj.email)) {
          throw new Error(`Email tembusan pada index ${i} tidak valid!`);
        }
      }
      return true;
    }),
];
