const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const hostutpay = process.env.hostutpay


const transfer = async(req,res,next) =>{
    let data = await axios .post(`${hostutpay}/transfer`,
    {
        "dataTransfer":[
            {
                "sourceAccountCode":"002",
                "sourceAccount":"888801000157508",
                "beneficiaryAccountCode":"014",
                "beneficiaryAccount":"888809999999918",
                "beneficiaryName":"Roma",
                "beneficiaryEmail": "roma@romania.com",
                "documentCode":"PJD-2022-14-upbj-nip-kotatujuan",
                "amount":"1000",
                "description":"2022-14-ID.12.13.13-20221280391282",
                "device":"IP 172.169.188.102",
                "browser":"Sippp mobile",
                "location":"-009.12399,123.123999",
                "ucr": "Ridho"
            }
            ,
            {
                "sourceAccountCode":"002",
                "sourceAccount":"888801000157508",
                "beneficiaryAccountCode":"014",
                "beneficiaryAccount":"888809999999918",
                "beneficiaryName":"Roma",
                "beneficiaryEmail": "roma@romania.com",
                "documentCode":"PJD-2022-14-upbj-nip-kotatujuan",
                "amount":"1000",
                "description":"2022-14-ID.12.13.13-20221280391282",
                "device":"IP 172.169.188.102",
                "browser":"Sippp mobile",
                "location":"-009.12399,123.123999",
                "ucr": "Ridho"
            }
        ]
    })

    return data
}