const { check } = require("express-validator");

exports.Transfer_Internal = [
    check("NoReferral").notEmpty().withMessage("NoReferral harus di isi."),
    check("sourceAccount").notEmpty().withMessage("sourceAccount harus di isi."),
    check("beneficiaryAccount").notEmpty().withMessage("beneficiaryAccount harus di isi."),
    check("amount").notEmpty().withMessage("amount harus di isi."),
    check("FeeType").notEmpty().withMessage("FeeType harus di isi."),
    check("transactionDateTime").notEmpty().withMessage("transactionDateTime harus di isi."),
    check("remark").notEmpty().withMessage("remark harus di isi."),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

  exports.Transfer_Other =[
    check("noReferral").notEmpty().withMessage("noReferral harus di isi."),
    check("bankCode").notEmpty().withMessage("bankCode harus di isi."),
    check("sourceAccount").notEmpty().withMessage("sourceAccount harus di isi."),
    check("beneficiaryAccount").notEmpty().withMessage("beneficiaryAccount harus di isi."),
    check("beneficiaryAccountName").notEmpty().withMessage("beneficiaryAccountName harus di isi."),
    check("Amount").notEmpty().withMessage("Amount harus di isi."),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
]

  exports.Briva_Create =[
    check("institutionCode").notEmpty().withMessage("institutionCode harus di isi."),
    check("brivaNo").notEmpty().withMessage("brivaNo harus di isi."),
    check("custCode").notEmpty().withMessage("custCode harus di isi."),
    check("nama").notEmpty().withMessage("nama harus di isi."),
    check("amount").notEmpty().withMessage("amount harus di isi."),
    check("keterangan").notEmpty().withMessage("keterangan harus di isi."),
    check("expiredDate").notEmpty().withMessage("expiredDate harus di isi."),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ]

  exports.Briva_Delete =[
    check("institutionCode").notEmpty().withMessage("institutionCode harus di isi."),
    check("brivaNo").notEmpty().withMessage("brivaNo harus di isi."),
    check("custCode").notEmpty().withMessage("custCode harus di isi."),
  ]

  exports.Briva_Update =[
    check("institutionCode").notEmpty().withMessage("institutionCode harus di isi."),
    check("brivaNo").notEmpty().withMessage("brivaNo harus di isi."),
    check("custCode").notEmpty().withMessage("custCode harus di isi."),
    check("nama").notEmpty().withMessage("nama harus di isi."),
    check("amount").notEmpty().withMessage("amount harus di isi."),
    check("keterangan").notEmpty().withMessage("keterangan harus di isi."),
    check("expiredDate").notEmpty().withMessage("expiredDate harus di isi."),
    check("uch").notEmpty().withMessage("uch harus di isi."),
  ]

  exports.Briva_Update_Status =[
    check("institutionCode").notEmpty().withMessage("institutionCode harus di isi."),
    check("brivaNo").notEmpty().withMessage("brivaNo harus di isi."),
    check("custCode").notEmpty().withMessage("custCode harus di isi."),
    check("statusBayar").notEmpty().withMessage("statusBayar harus di isi."),
    check("uch").notEmpty().withMessage("uch harus di isi."),
  ]

  exports.Info_Mutasi =[
    check("accountNumber").notEmpty().withMessage("accountNumber harus di isi."),
    check("startDate").notEmpty().withMessage("startDate harus di isi."),
    check("endDate").notEmpty().withMessage("endDate harus di isi."),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ]
  


  