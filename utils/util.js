import WxValidate from '../assets/plugins/wx-validate/WxValidate'
import WxService from '../assets/plugins/wx-service/WxService'
import HttpService from '../helpers/HttpService'
import CacheService from '../helpers/CacheService'
import CryptoService from '../helpers/CryptoService'
import NotifyService from '../helpers/NotifyService'
import __config from '../etc/config'


module.exports = {
    WxValidate: (rules, messages) => new WxValidate(rules, messages),
    HttpService: new HttpService({baseURL: __config.basePath}),
    WxService: new WxService,
    CacheService: new CacheService,
    CryptoService: new CryptoService(),
    NotifyService: new NotifyService(),
    __config
}

