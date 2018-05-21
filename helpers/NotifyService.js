/**
 * 作用:通知服务
 * 作者:蔡俊雄
 * 日期:2017-12-13
 */
class NotifyService {

    /**
     * 事件队列
     * @type {Array}
     */
    queue = [];

    /**
     * 添加事件监听
     * @param type 事件类型
     * @param listener 回调函数
     */
    addEventListener(type, listener) {
        let isFind = this.queue.some(v => {
            if (v.type == type) {
                v.listeners.push(listener);
            }
            return v.type == type;
        });
        if (!isFind) {
            //没找到
            this.queue.push({
                type,
                listeners: [listener]
            });
        }
    }

    /**
     * 删除事件监听
     * @param type 事件类型
     * @param listener 回调函数
     */
    removeEventListener(type, listener) {
        this.queue.some(v => v.type == type && (v.listeners = v.listeners.filter(c => c != listener)));
    }

    /**
     * 是否拥有事件监听
     * @param type 事件类型
     * @param listener 回调函数
     */
    hasEventListener(type, listener) {
        return this.queue.some(v => v.type == type && v.listeners.indexOf(listener) != -1);
    }

    /**
     * 分发事件
     * @param event 事件
     */
    dispatchEvent(event) {
        this.queue.some(v => v.type == event.type && (!v.listeners.forEach(c =>c(event.data))));
    }

}
export default NotifyService;