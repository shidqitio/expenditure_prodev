const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const hostutpay = process.env.hostutpay

exports.show = async(req,res,next) =>{
    try{
        const data = await axios.get(`${hostutpay}/v1/bri/payment-detail/${req.params.nomor_va}`).then((response)=>{
        if(response.data.data === null){
            throw new Error('Error dari UT PAYMENT')
        }    
        return response.data.data
        }).catch((err)=>{return err})

        jsonFormat(res, "success", "detail Virtual Account", data);
    }catch(error){
        next(error)
    }
}

const createVA = async(data,subdata,header) =>{
    
        VA = await axios .post(`${hostutpay}/create-payment-generic`,
        {
            "identityNumber": data.identityNumber,
            "bankCode": data.bankCode,
            "accountName": data.accountName,
            "paymentType": "1",
            "amountType": "CREDIT", 
            "amount": data.amount,
            "description": data.description,
            "device": data.device,
            "browser": data.browser,
            "location": data.location,
            "ucr": data.ucr
        },{Headers:header}
    ).then((a)=> {return a.data.data.nomor_va}).catch((err)=>{throw new Error('UT BANK PAY Error')})
        return VA
}

const detailVA = async(data,header) =>{
    let data = await axios.get(`${hostutpay}/payment-detail/${data.nomor_va}`).then((response)=>{
        if(response.data.data === null){
            throw new Error('Error dari UT PAYMENT')
        }    
        return response.data.data
        }).catch((err)=>{return err})
        return data
} 

