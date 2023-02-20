module.exports = (req, res, next) => {
    res.json({
        responseCode: 404,
        responseMessage: {
            ID: "Anda memasuki kawasan di luar link yang di tentukan! mohon masukan URL yang benar by developer SIPPP",
            AR: "“Hai orang-orang yang beriman, jadikanlah sabar dan shalat sebagai penolongmu, sesungguhnya Allah bersama orang-orang yang sabar,” (QS Al-Baqarah: 153)"
        }
    })
}