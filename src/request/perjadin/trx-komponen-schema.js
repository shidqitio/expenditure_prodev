const { check } = require("express-validator");

exports.store = [
    check('Komponen.*.kode_petugas').notEmpty().withMessage('Kode Petugas Tidak Boleh Kosong'),
    check('Komponen.*.keterangan_komponen').notEmpty().withMessage('Keterangan Komponen Tidak Boleh Kosong'),
    check('Komponen.*.kode_satuan').notEmpty().withMessage('Kode Satuan Tidak Boleh Kosong'),
    check('Komponen.*.biaya_satuan').notEmpty().withMessage('Biaya Satuan Tidak Boleh Kosong'),
    check('Komponen.*.jumlah').notEmpty().withMessage('Jumlah Tidak Boleh Kosong'),
    check('Komponen.*.biaya_satuan').isNumeric().withMessage('Biaya Satuan Harus Angka'),
    check('Komponen.*.jumlah').isNumeric().withMessage('Jumlah Harus Angka'),
];
