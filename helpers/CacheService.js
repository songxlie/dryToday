import __cache from '../etc/cache'

class CacheService {

    setOpenId(openId) {
        this.setValue(__cache.openId, openId);
    }

    getOpenId() {
        return this.getValue(__cache.openId);
    }

    setUserId(userId) {
        this.setValue(__cache.userId, userId);
    }

    getUserId() {
        return this.getValue(__cache.userId);
    }

    getUserInfo() {
        return this.getValue(__cache.user);
    }
    setUserName(userName) {
        this.setValue(__cache.userId, userName);
    }

    getUserName(){
        return this.getValue(__cache.userName);
    }

    /**
     * 设置资讯已读列表
     * @param data
     */
    setMomentsReadList(data) {
        this.setValue(__cache.momentsReadList, data);
    }

    /**
     * 获取资讯已读列表
     * @returns {*}
     */
    getMomentsReadList() {
        return this.getValue(__cache.momentsReadList);
    }

    setConfirmOrder(obj) {
        this.setValue(__cache.confirmOrder, obj);
    }

    getConfirmOrder() {
        return this.getValue(__cache.confirmOrder);
    }

    setIsChangeCart(obj) {
        this.setValue(__cache.isChangeCart, obj);
    }

    getIsChangeCart() {
        return this.getValue(__cache.isChangeCart);
    }

    removeGoodsList(classId) {
        this.removeValue('class' + classId);
    }

    setGoodsList(classId, obj) {
        this.setValue('class' + classId, obj);
    }

    getGoodsList(classId) {
        return this.getValue('class' + classId);
    }

    setToken(obj) {
        this.setValue(__cache.token, obj);
    }

    getToken() {
        return this.getValue(__cache.token);
    }

    setAddress(obj) {
        this.setValue(__cache.address, obj);
    }

    getAddress() {
        return this.getValue(__cache.address);
    }

    setAddressList(obj) {
        this.setValue(__cache.addressList, obj);
    }

    getAddressList() {
        return this.getValue(__cache.addressList);
    }

    setCarts(obj) {
        this.setValue(__cache.carts, obj);
    }

    getPreSaleList() {
        return this.getValue(__cache.preSaleList);
    }

    setPreSaleList(obj) {
        this.setValue(__cache.preSaleList, obj);
    }

    removePreSaleList() {
        this.removeValue(__cache.preSaleList);
    }

    setGoodsActivity(obj) {
        this.setValue(__cache.goodsActivity, obj);
    }

    getGoodsActivity() {
        return this.getValue(__cache.goodsActivity);
    }

    removeGoodsActivity() {
        this.removeValue(__cache.goodsActivity);
    }

    setGoodsTime(classId) {
        this.setValue(__cache.goodsTime + classId, new Date().getTime());
    }

    getGoodsTime(classId) {
        return this.getValue(__cache.goodsTime + classId);
    }

    removeGoodsTime(classId) {
        this.removeValue(__cache.goodsTime + classId);
    }

    setPickupAddress(obj) {
        this.setValue(__cache.pickupAddress, obj);
    }

    getPickupAddress() {
        return this.getValue(__cache.pickupAddress);
    }

    setAddressUpdateTime(obj) {
        this.setValue(__cache.addressUpdateTime, obj);
    }

    getAddressUpdateTime(obj) {
        return this.getValue(__cache.addressUpdateTime);
    }

    removeConfirmOrder() {
        this.removeValue(__cache.confirmOrder);
    }

    setOrder(obj) {
        this.setValue(__cache.carts, obj);
    }

    getOrder() {
        return this.getValue(__cache.carts);
    }

    setActivityTime(time) {
        this.setValue(__cache.activityExplainTime, time);
    }

    getActivityTime() {
        return this.getValue(__cache.activityExplainTime);
    }

    setValue(key, value) {
        wx.setStorageSync(key, value);
    }

    getValue(key) {
        return wx.getStorageSync(key);
    }

    removeValue(key) {
        wx.removeStorageSync(key);
    }

}
export default CacheService