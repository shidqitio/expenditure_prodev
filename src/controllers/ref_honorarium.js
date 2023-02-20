const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes,Op } = require("sequelize");
const db = require("../config/database");



exports.honorariumnested = async (req,res,next) => {
let arrhonorarium = [];
const ref_honor = await db.query(`SELECT a.kode_honorarium as kode_honorarium, keterangan, besaran 
 FROM ref_honorarium a LEFT JOIN ref_sbm_honorarium b
ON a.kode_honorarium = b.kode_honorarium
ORDER BY no_urut`,{type:QueryTypes.SELECT});
const sub_1 = await db.query(`SELECT a.kode_honorarium as kode_honorarium,
kode_honorarium_sub_1, keterangan,besaran FROM ref_honorarium_sub_1 a LEFT JOIN ref_sbm_honorarium b
ON a.kode_honorarium_sub_1 = b.kode_honorarium ORDER BY no_urut`,{type:QueryTypes.SELECT});
const sub_2 = await db.query(`SELECT * FROM ref_honorarium_sub_2 a LEFT JOIN ref_sbm_honorarium b
ON a.kode_honorarium_sub_2 = b.kode_honorarium ORDER BY no_urut`,{type:QueryTypes.SELECT});
const sub_3 = await db.query(`SELECT * FROM ref_honorarium_sub_3 a LEFT JOIN ref_sbm_honorarium b
ON a.kode_honorarium_sub_3 = b.kode_honorarium ORDER BY no_urut`,{type:QueryTypes.SELECT});
const sub_4 = await db.query(`SELECT * FROM ref_honorarium_sub_4 a LEFT JOIN ref_sbm_honorarium b
ON a.kode_honorarium_sub_4 = b.kode_honorarium ORDER BY no_urut`,{type:QueryTypes.SELECT});
const sub_5 = await db.query(`SELECT * FROM ref_honorarium_sub_5 a LEFT JOIN ref_sbm_honorarium b
ON a.kode_honorarium_sub_5 = b.kode_honorarium ORDER BY no_urut`,{type:QueryTypes.SELECT});
// function sbm(kodehonor){
//     let sbm_honor = await db.query(`SELECT FROM ref_sbm_honorarium WHERE `+params.kodehonor+``,{type:QueryTypes.SELECT});
//     let besaran = sbm_honor[0];
//     return besaran;
// }
// ref_honor.map((rh) => {
//     let arrsub1 = [];
//     sub_1.map((s1)=>{
//         if(s1.kode_honorarium === rh.kode_honorarium){
//             let arrsub2 = [];
//             sub_2.map((s2)=>{
                


//                 if(s2.kode_honorarium_sub_1 === s1.kode_honorarium_sub_1){
//                     let arrsub3 = [];
//                 sub_3.map((s3)=>{
//                     let arrsub4 = [];
//                     sub_4.map((s4)=>{
//                         let arrsub5 = [];
//                         sub_5.map((s5)=>{
//                             if(s5.kode_honorarium_sub_4 === s4.kode_honorarium_sub_4){
//                                 arrsub5.push({
//                                     kode_honorarium_sub_5:s5.kode_honorarium_sub_5,
//                                     keterangan:s5.keterangan
//                                 })
//                             }
//                         })
//                         if(s4.kode_honorarium_sub_3 === s3.kode_honorarium_sub_3){
//                             arrsub4.push({
//                                 kode_honorarium_sub_4:s4.kode_honorarium_sub_4,
//                                 keterangan:s4.keterangan,
//                               //  sub_5:arrsub5
//                             })
//                         }
//                     })
//                     if(s3.kode_honorarium_sub_2 === s2.kode_honorarium_sub_2){
//                         arrsub3.push({
//                             kode_honorarium_sub_3 : s3.kode_honorarium_sub_3,
//                             keterangan:s3.keterangan,
//                             sub_4:arrsub4
//                         })
//                     }
//                 })
//                     arrsub2.push({
//                         kode_honorarium_sub_2:s2.kode_honorarium_sub_2,
//                         keterangan:s2.keterangan,
//                        sub_3:arrsub3
//                     })
//                 }
//             })
//             arrsub1.push({
//                 kode_honorarium_sub_1: s1.kode_honorarium_sub_1,
//                 keterangan:s1.keterangan,
//                 sub_2:arrsub2
//             })
//         }
//     })
//     arrhonorarium.push({
//         kode_honorarium: rh.kode_honorarium,
//         keterangan: rh.keterangan,
//         sub_1:arrsub1
//     })
// });
ref_honor.map((rh) => {
    let arrsub1 = [];
    let sub_1filter = sub_1.filter((p) => p.kode_honorarium == rh.kode_honorarium)
         sub_1filter.map((s1)=>{
        if(s1.kode_honorarium === rh.kode_honorarium){
            let arrsub2 = [];
            let sub_2filter = sub_2.filter((p) => p.kode_honorarium_sub_1 == s1.kode_honorarium_sub_1)
            sub_2filter.map((s2)=>{
                if(s2.kode_honorarium_sub_1 === s1.kode_honorarium_sub_1){
                    let arrsub3 = [];
                    let sub_3filter = sub_3.filter((p) => p.kode_honorarium_sub_2 == s2.kode_honorarium_sub_2)
                    sub_3filter.map((s3)=>{
                        if(s3.kode_honorarium_sub_2 === s2.kode_honorarium_sub_2){
                            let arrsub4 = [];
                            let sub_4filter = sub_4.filter((p) => p.kode_honorarium_sub_3 == s3.kode_honorarium_sub_3)
                            sub_4filter.map((s4)=>{
                                if(s4.kode_honorarium_sub_3===s3.kode_honorarium_sub_3){
                                    let arrsub5 = [];
                                    let sub_5filter = sub_5.filter((p) => p.kode_honorarium_sub_4 == s4.kode_honorarium_sub_4)
                                    sub_5filter.map((s5) =>{
                                        if(s5.kode_honorarium_sub_4 === s4.kode_honorarium_sub_4){
                                            arrsub5.push({
                                                kode_honorarium_sub_5:s5.kode_honorarium_sub_5,
                                                kode_honorarium_sub_4:s4.kode_honorarium_sub_4,
                                                keterangan:s5.keterangan,
                                                kode_satuan:s5.kode_satuan,
                                                besaran:s5.besaran
                                            })
                                        }
                                    })
                                    arrsub4.push({
                                        kode_honorarium_sub_4:s4.kode_honorarium_sub_4,
                                        kode_honorarium_sub_3:s3.kode_honorarium_sub_3,
                                        keterangan:s4.keterangan,
                                        honorarium_sub_5:arrsub5,
                                        kode_satuan:s4.kode_satuan,
                                        besaran:s4.besaran
                                    })
                                }
                            })
                            arrsub3.push({
                                kode_honorarium_sub_3:s3.kode_honorarium_sub_3,
                                kode_honorarium_sub_2:s2.kode_honorarium_sub_2,
                                keterangan:s3.keterangan,
                                honorarium_sub_4:arrsub4,
                                kode_satuan:s3.kode_satuan,
                                besaran:s3.besaran
                            })
                        }
                    })
                    arrsub2.push({
                        kode_honorarium_sub_2:s2.kode_honorarium_sub_2,
                        kode_honorarium_sub_1: s1.kode_honorarium_sub_1,
                        keterangan:s2.keterangan,
                        honorarium_sub_3:arrsub3,
                        kode_satuan:s2.kode_satuan,
                        besaran:s2.besaran
                    })
                }
            })
            arrsub1.push({
            kode_honorarium_sub_1: s1.kode_honorarium_sub_1,
            kode_honorarium: rh.kode_honorarium,
            keterangan:s1.keterangan,
            honorarium_sub_2:arrsub2,
            kode_satuan:s1.kode_satuan,
            besaran:s1.besaran
        })
        }
    })
    arrhonorarium.push({
        kode_honorarium: rh.kode_honorarium,
        keterangan: rh.keterangan,
        besaran:rh.besaran,
      //  biaya:sbm(rh.kode_honorarium),
        honorarium_sub_1:arrsub1
    })
});
console.log("cek Honorarium",ref_honor);
try { 
    jsonFormat(res, "success", "nested SBM", arrhonorarium);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }

}

