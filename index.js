const { Server } = require("socket.io");
const express = require("express");
const app = express();
const db = require("./src/config/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const https = require("https");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require ("./swagger.json")
const notFound =require("./src/validation/notFound");
const errorHandler = require("./src/validation/errorHandler");
const  log4js = require("log4js");



// Logger configuration
const { loggerConfig } = require('./src/config/logger');

// Logger configuration
log4js.configure(loggerConfig);

// Create the logger
const logger = log4js.getLogger();

const PORT = process.env.PORT


// CERTIFICATE KEYS
var key = fs.readFileSync(__dirname + "/src/cert/ut2022-upd.key");
var cert = fs.readFileSync(__dirname + "/src/cert/ut2022-upd.crt");
var options = {
  key: key,
  cert: cert,
};

// EXT
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin:"*"
}));

// // SHARED ROUTE
// app.use("/expen/public", express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.send("Now using https..");
// });

// ROUTE PARENT
//app.use(require("./src/routes"));

//REF
const refPajakHonorarium = require("./src/routes/ref/ref_pajak_honorarium");
const refSbmLembur = require("./src/routes/ref/ref_sbm_lembur");
const refSbmUangMakanLembur = require("./src/routes/ref/ref_sbm_uang_makan_lembur");
const refSbmHonorTutor = require("./src/routes/ref/ref_sbm_honor_tutor");
const refSBMKonsumsiTutor = require("./src/routes/ref/ref_sbm_konsumsi_tutor");
const refSBMKonsumsiKegiatan = require("./src/routes/ref/ref_sbm_konsumsi_kegiatan");
const refSbmHonorTapm = require("./src/routes/ref/ref_sbm_honor_tapm");
const refSbmHonorTtm = require("./src/routes/ref/ref_sbm_honor_ttm");
const refSbmKegiatanBidangAkademik = require("./src/routes/ref/ref_sbm_kegiatan_bidang_akademik");
const refSbmHonorariumPanitiaKegiatan = require("./src/routes/ref/ref_sbm_honorarium_panitia_kegiatan");
const refSbmHonorariumPengisiKegiatan = require("./src/routes/ref/ref_sbm_honorarium_pengisi_kegiatan");
const refSbmHonorariumAll = require("./src/routes/ref/ref_sbm_honorarium_all");
const menuUnitTujuanRoute = require("./src/routes/perjadin/menu_unit_tujuan");
const komentar_revisi = require("./src/routes/komentar_revisi");




// const refhonorariumKegiatan = require("./src/routes/ref_honorarium_kegiatan");
const rkaUnitRoutes = require("./src/routes/ref_rka_unit");
const suratTugasPerjadinRoutes = require("./src/routes/ref_surat_tugas_perjadin");
const suratTugasHonorRoutes = require("./src/routes/ref_surat_tugas_honor");
const petugasPerjadinRoutes = require("./src/routes/trx_petugas_perjadin");
const panutanRoutes = require("./src/routes/panutan");
const skemaRoutes = require("./src/routes/ref_skema_perjadin");
const komponenRoutes = require("./src/routes/trx_komponen_perjadin");
const RkaDummyRoutes = require("./src/routes/ref_rka_dummy");
const rkaPerjadinRoutes = require("./src/routes/ref_surat_tugas_perjadin_rka");
// const rkaHonorRoutes = require("./src/routes/ref_surat_tugas_rka_honor");
const externalRoutes = require("./src/routes/external");
const externalpanutanRoutes = require("./src/routes/externalpanutan");
const honorRoutes = require("./src/routes/ref_honorarium");
const spjPerjadinRoutes = require("./src/routes/spj_perjadin");
const komponenRealisasiRoutes = require("./src/routes/trx_komponen_perjadin_realisasi");
const refSbmTransportRoutes = require("./src/routes/ref_sbm_transport");
const refNegaraRoutes = require("./src/routes/ref_geo_negara");
const refProvinsiRoutes = require("./src/routes/ref_geo_provinsi");
const refKabkoRoutes = require("./src/routes/ref_geo_kabko");
const refPokjarRoutes = require("./src/routes/ref_geo_pokjar");
const verifikasisuratRoutes = require("./src/routes/trx_verifikasi_surat");
const sbmUangharianRoutes = require("./src/routes/ref_sbm_uang_harian");
const sbmUangpenginapanRoutes = require("./src/routes/ref_sbm_uang_penginapan");
const SbmTaksiDalamNegeri = require("./src/routes/ref_sbm_taksi_dalam_negeri");
const filekompPerjRoutes = require("./src/routes/trx_file_realisasi_perjadin");
const suratTugasBarjasRoutes = require("./src/routes/ref_surat_tugas_barjas");
const verifikasiKeuanganRoutes = require("./src/routes/verifikasi_keuangan");
const transferExpenditureRoutes = require("./src/routes/trx_transfer_expenditure");
const waitingTransferRoutes = require("./src/routes/trx_waiting_list_transfer");
const virtualAccountRoutes = require("./src/routes/virtual_account");
const apiDummyRoutes = require("./src/routes/api_dummy");
const spjPerjadin = require("./src/routes/trx_spj_perorang_perjadin");
const aplikasiDataRoutes = require("./src/routes/aplikasi_get_data");
const forEbudgetingRoutes = require("./src/routes/for_ebudgeting");
const atcostRoutes = require("./src/routes/ref_atcost");
const uangPersediaanRoutes = require("./src/routes/ref_uang_persediaan");
const BRIAPIRoutes = require("./src/routes/BRIAPI");
const AuthRoutes = require("./src/routes/auth");
const TTE = require("./src/routes/panutan/tte_external_panutan");
const klasifikasiHonor = require("./src/routes/panutan/klasifikasi_honor");
const tamabahanRoutes = require("./src/routes/ref_surat_tambahan")
const {authenticate} = require("./src/middleware/auth");

const perjadinRefSpm = require("./src/routes/SPM/ref_spm_perjadin")
const renderDokumenRoutes = require("./src/routes/render_dokumen")

//const path = require("path");
//Studi Lanjut
const studilanjutRoutes = require("./src/routes/studi_lanjut/ref_sbm_studi_lanjut")
const trxstudilanjutRoutes = require("./src/routes/studi_lanjut/trx_pegawai_studi_lanjut")
const trxbeasiswaRoutes = require("./src/routes/studi_lanjut/trx_beasiswa")

//UP 
const danaawalupRoutes = require("./src/routes/UP/ref_dana_awal_up")
const usulangupRoutes = require("./src/routes/UP/usulan_gup")

const monitoringdata = require("./src/routes/monitoringdata/monitoringdata");

const pembuatSPM = require("./src/routes/pembuatSPM/pembuatSPM");
//const path = require("path");

//REFRENSI


// Perjalanan Dinas
const perjalananDinasRoutes = require("./src/routes/perjadin");
const trxkomponenRoutes = require("./src/routes/perjadin/trx_komponen");


// Honorarium
const HONORARIUM = require("./src/routes/HONORARIUM");

// Keuangan
const KEUANGANRoutes = require("./src/routes/KEUANGAN");

//REFRENSI
app.use("/expen/perjadin", perjalananDinasRoutes);
app.use("/expen/KEUANGAN", KEUANGANRoutes);
app.use("/expen/pembuatSPM-noauth", pembuatSPM);
app.use("/expen/pembuatSPM",authenticate, pembuatSPM);
app.use("/expen/monitoring-data", authenticate, monitoringdata);
app.use("/expen/monitoring-data-noauth", monitoringdata);

app.use("/expen/ref-pajak-honorarium",authenticate, refPajakHonorarium);
app.use("/expen/ref-sbm-lembur",authenticate, refSbmLembur);
app.use("/expen/ref-sbm-uang-makan-lembur",authenticate, refSbmUangMakanLembur);
app.use("/expen/ref-sbm-honor-tutor",authenticate, refSbmHonorTutor);
app.use("/expen/ref-sbm-konsumsi-tutor",authenticate, refSBMKonsumsiTutor);
app.use("/expen/ref-sbm-konsumsi-kegiatan",authenticate, refSBMKonsumsiKegiatan);
app.use("/expen/ref-sbm-honorarium-pengisi-kegiatan",authenticate, refSbmHonorariumPengisiKegiatan);
app.use("/expen/ref-sbm-honorarium-panitia-kegiatan",authenticate, refSbmHonorariumPanitiaKegiatan);
app.use("/expen/ref-sbm-honor-tapm",authenticate, refSbmHonorTapm);
app.use("/expen/ref-sbm-honor-ttm",authenticate, refSbmHonorTtm);
app.use("/expen/ref-sbm-kegiatan-bidang-akademik",authenticate, refSbmKegiatanBidangAkademik);
app.use("/expen/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));
app.use("/expen/rka",authenticate, rkaUnitRoutes);
app.use("/expen/rka-noauth", rkaUnitRoutes);
app.use("/expen/surat-tugas-perjadin",authenticate, suratTugasPerjadinRoutes);
app.use("/expen/surat-tugas-perjadin-noauth", suratTugasPerjadinRoutes);
app.use("/expen/surat-tugas-honor",authenticate,suratTugasHonorRoutes);
app.use("/expen/petugas-perjadin",authenticate, petugasPerjadinRoutes);
app.use("/expen/panutan", panutanRoutes);
app.use("/expen/skema",authenticate, skemaRoutes);
app.use("/expen/skema-noauth", skemaRoutes);
app.use("/expen/komponen-perjadin",authenticate,komponenRoutes);
app.use("/expen/rkadummy",authenticate,RkaDummyRoutes);
app.use("/expen/rka-perjadin",authenticate,rkaPerjadinRoutes);
app.use("/expen/rka-perjadin-na",rkaPerjadinRoutes);
//app.use("/expen/rka-honor",rkaHonorRoutes);
app.use("/expen/externalpanutan", externalpanutanRoutes);
app.use("/expen/external",authenticate, externalRoutes);
app.use("/expen/honorarium",authenticate,honorRoutes);
app.use("/expen/HONORARIUM-BARU", HONORARIUM);
app.use("/expen/spj",authenticate,spjPerjadinRoutes);
app.use("/expen/spj-noauth",  spjPerjadinRoutes);
app.use("/expen/komponen-perjadin-realisasi",authenticate,komponenRealisasiRoutes);
app.use("/expen/sbm-transport",authenticate,refSbmTransportRoutes);
app.use("/expen/sbm-transport-wqwqsasa", refSbmTransportRoutes);
app.use("/expen/negara",authenticate, refNegaraRoutes);
app.use("/expen/provinsi",authenticate,refProvinsiRoutes);
app.use("/expen/kabko",authenticate,refKabkoRoutes);
app.use("/expen/pokjar",authenticate,refPokjarRoutes);
app.use("/expen/verifikasi-surat",authenticate,verifikasisuratRoutes);
app.use("/expen/verifikasi-surat-noauth", verifikasisuratRoutes);
app.use("/expen/sbm-uang-harian",authenticate,sbmUangharianRoutes);
app.use("/expen/sbm-uang-penginapan",authenticate,sbmUangpenginapanRoutes);
app.use("/expen/sbm-taksi-dalam-negeri",authenticate,SbmTaksiDalamNegeri);
app.use("/expen/pdf", express.static(path.join(__dirname,"/src/pdf/")));
app.use("/expen/image", express.static(path.join(__dirname,"/src/image/")));
app.use("/expen/view-file-komponen-realisasi-perjadin", express.static(path.join(__dirname,"/src/public/perjadin/")));
app.use("/expen/view-file-komponen-realisasi-sptd", express.static(path.join(__dirname,"/src/public/sptd/")));
app.use("/expen/view-file-komponen-realisasi-honor", express.static(path.join(__dirname,"/src/public/honorarium/")));
app.use(
  "/expen/archive/storeone",
  express.static(path.join(__dirname, "/src/public/storeone"))
);
app.use("/expen/view-file-barjas", express.static(path.join(__dirname,"/src/public/barjas/")));
app.use("/expen/file-realisasi-perjadin",filekompPerjRoutes);
app.use("/expen/json", express.static(path.join(__dirname,"/src/public/datajsondummy")));
app.use("/expen/json-dummy", express.static(path.join(__dirname,"/src/public/rka.json")));
app.use("/expen/surat-tugas-barjas",suratTugasBarjasRoutes);
app.use("/expen/verifikasi-keuangan",authenticate,verifikasiKeuanganRoutes);
app.use("/expen/verifikasi-keuangan-noauth",verifikasiKeuanganRoutes);
app.use("/expen/transfer-expenditure",authenticate,transferExpenditureRoutes);
app.use("/expen/transfer-expenditure-noauth",transferExpenditureRoutes);
app.use("/expen/waiting-transfer",authenticate,waitingTransferRoutes);
app.use("/expen/waiting-transfer-noauth",waitingTransferRoutes);
app.use("/expen/api-dummy",apiDummyRoutes);
app.use("/expen/virtual-account",authenticate,virtualAccountRoutes);
app.use("/expen/spj-perorang-perjadin",authenticate,spjPerjadin)
app.use("/expen/aplikasi-get-data",authenticate,aplikasiDataRoutes)
app.use("/expen/expenditure/ebudgeting",authenticate,forEbudgetingRoutes)
app.use("/expen/atcost",authenticate,atcostRoutes)
app.use("/expen/uang-persediaan",authenticate,uangPersediaanRoutes)
app.use("/expen/BRI-API",authenticate,BRIAPIRoutes)
app.use("/expen/auth",AuthRoutes)
// app.use("/expen/ref-honorarium-kegiatan",refhonorariumKegiatan)
app.use("/expen/tte",TTE)
app.use("/expen/ref-sbm-honorarium-all",authenticate,refSbmHonorariumAll)
app.use("/expen/panutan/get-klasifikasi-honor/",authenticate,klasifikasiHonor)
app.use("/expen/perjadin-menu-unit-tujuan",authenticate,menuUnitTujuanRoute)
app.use("/expen/spm",perjadinRefSpm)
app.use("/expen/remunerasi",authenticate, tamabahanRoutes);
app.use("/expen/remunerasi-noauth", tamabahanRoutes);
app.use("/expen/render", authenticate, renderDokumenRoutes);
app.use("/expen/render-noauth",renderDokumenRoutes);
app.use("/expen/studi-lanjut",studilanjutRoutes)
app.use("/expen/trx-studi-lanjut",trxstudilanjutRoutes)
app.use("/expen/komentar-revisi", authenticate, komentar_revisi);
app.use("/expen/komentar-revisi-noauth", komentar_revisi);
app.use("/expen/up", danaawalupRoutes);
app.use("/expen/trx-beasiswa", trxbeasiswaRoutes);
app.use("/expen/usulan-gup", usulangupRoutes);
app.use("/expen/trx-komponen", trxkomponenRoutes)
// ERROR HANDLER
app.use(errorHandler);

// NOT FOUND PAGE
app.use(notFound);

var server = https.createServer(options, app);
const io = new Server(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  global.unitss = socket.handshake.auth.kode_unit
  socket.username = username;
  next();
})
global.socketIO = io

db.sync()
  .then(() => {
      io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);
      
        socket.on("join_room", (data) => {
          socket.join(data);
          console.log(`User with ID: ${socket.id} joined room: ${data}`);
        });
      
        socket.on("send_data", (data) => {
          socket.to(data.room).emit("receive_data", data);
        });

        socket.on("data_negara", (data) => {
          socket.to(data.room).emit("receive_data", data);
        });
        
      
        socket.on("disconnect", () => {
          console.log("User Disconnected", socket.id);
        });
      });
    

    server.listen(PORT, console.log(`server running...huy di port ${PORT}`));
  })
  .catch((err) => {
    console.log("error database", err);
  });


