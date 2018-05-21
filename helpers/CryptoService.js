var WXBizDataCrypt = require('./WXBizDataCrypt')
class CryptoService{
    decrypt(d){
        let pc = new WXBizDataCrypt(d.appId, d.sessionKey);
        let data = pc.decryptData(d.encryptedData , d.iv);
        return data;
    }
}
export default CryptoService