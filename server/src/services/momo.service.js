import crypto from 'crypto'
import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"

const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';

class MomoService{
    static generateSignature = async(params) => {
        const rawSignature = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
    }

    static generatePaymentData = async(amount) => {
        const orderId = partnerCode + new Date().getTime()
        const requestId = orderId
        const requestType = 'payWithMethod';
        const orderInfo = 'pay with MoMo';
        const extraData = '';
        const autoCapture = true;
        const lang = 'vi';
        const partnerName = 'Test';
        const storeId = 'MomoTestStore';
        const orderGroupId = '';

        const params = {
            accessKey,
            amount,
            extraData,
            ipnUrl,
            orderId,
            orderInfo,
            partnerCode,
            redirectUrl,
            requestId,
            requestType,
        };
        
        const signature = await this.generateSignature(params);
        return {
            partnerCode,
            partnerName,
            storeId,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang,
            requestType,
            autoCapture,
            extraData,
            orderGroupId,
            signature,
        };
    }
}

export default MomoService