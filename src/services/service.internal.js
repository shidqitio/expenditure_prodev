const { default: axios } = require("axios");
const path = require("../lang/id-api.json");
const URL_PANUTAN = process.env.hostProdevPanutannew;

exports.suratTugasPerjadin = async (params) => {
    try {
        const response = await axios.get(`${URL_PANUTAN}${path.panutan.surtug_perjadin}/${params}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

exports.suratTugasPerjadinFind = async (params) => {
    try {
        const response = await axios.get(`${URL_PANUTAN}${path.panutan.detail_perjadin}/${params}`);
        return response.data;
    } catch (error) {
        return error;
    }
}