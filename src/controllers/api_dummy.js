const db = require("../config/database");
const axios = require("axios");
const { jsonFormat } = require("../utils/jsonFormat");
const {QueryTypes} = require("sequelize") 


exports.getByAkun = async (req, res, next) => {
    try {
        const rka = await RkaDummy.findAll({
          where: {
            akun: req.params.akun,
          },
        });
    
        if (rka.length === 0)
          return jsonFormat(res, "failed", "kode RKA tidak ada", []);
    
        jsonFormat(res, "success", "Berhasil memuat data", rka);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    };

    exports.getSuratHonorarium = async (req,res,next) => {
      await axios
    .get(
      `http://172.16.100.69:5800/json/surathonoridsub75.json`
    )
    .then((r) => {
      const dataMap = r.data.data;
     
      console.log("req.params.id_sub_unit:",req.params.id_sub_unit);
      const dataFilter = dataMap.filter((dm)=>""+dm.id_sub_unit === req.params.id_sub_unit)
     
      jsonFormat(res, "success", "Berhasil menampilkan data", dataFilter);
    })
    .catch((err) => {
      jsonFormat(res,"failed",err,[]);
    });
    }

    exports.getDetailSuratHonorarium = async (req,res,next) => {
      await axios
    .get(
      `http://172.16.100.69:5800/json/surathonoridsub75.json`
    )
    .then((r) => {
      const dataMap = r.data.data;
      const dataFilter = dataMap.filter((dm)=>""+dm.id_surat === req.params.id_surat)
      jsonFormat(res, "success", "Berhasil menampilkan data", dataFilter);
    })
    .catch((err) => {
      jsonFormat(res,"failed",err,[]);
    });
    }

    exports.getDetailPetugasHonorarium = async (req,res,next) => {
      await axios
    .get(
      `http://172.16.100.69:5800/json/petugashonor.json`
    )
    .then((r) => {
       const dataMap = r.data.values;
       const dataFilter = dataMap.filter((dm)=>""+dm.id_surat === req.params.id_surat)
      jsonFormat(res, "success", "Berhasil menampilkan data", dataFilter);
    })
    .catch((err) => {
      jsonFormat(res,"failed",err,[]);
    });
    }

    exports.SuratTugasPerjadinDummy =  async(req,res,next) =>{
      try{
      const SuratTugasPerjadin = await db.query(
        `SELECT * FROM t_surat_dummy WHERE id_sub_unit = ${req.params.id_sub_unit}`,
        {
          type: QueryTypes.SELECT,
        }
      )

      let data2 = await SuratTugasPerjadin.map((s)=>{
        return {
            "nama_unit": s.nama_unit,
            "total_petugas": s.total_petugas,
            "id_surat": s.id_surat,
            "nomor_surat": s.nomor_surat,
            "perihal": s.perihal,
            "tempat_surat": s.tempat_surat,
            "tanggal_surat": s.tanggal_surat,
            "created_at": s.created_at,
            "petugas":[]
          }
        

      })
      return res.json(data2)
    }catch(err){
      return next(err)
    }
    }

    exports.SuratTugasPerjadinShowDummy =  async(req,res,next) =>{
      try{
      const SuratTugasPerjadin = await db.query(
        `SELECT * FROM t_surat_dummy WHERE id_surat = ${req.params.id_surat}`,
        {
          type: QueryTypes.SELECT,
        }
      )

      let data2 = await SuratTugasPerjadin.map((s)=>{
        return {
            "nama_unit": s.nama_unit,
            "total_petugas": s.total_petugas,
            "id_surat": s.id_surat,
            "nomor_surat": s.nomor_surat,
            "perihal": s.perihal,
            "tempat_surat": s.tempat_surat,
            "tanggal_surat": s.tanggal_surat,
            "created_at": s.created_at,
          }
        

      })
      return res.json({
        status:"success",
        data:data2})
    }catch(err){
      return next(err)
    }
    }

