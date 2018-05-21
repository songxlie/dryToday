import __cache from "../etc/cache";

class UtilService {
    /**
     * 复制内容
     * @param data 内容
     * @param msg 提示
     * @param context 上下文
     */
    static copy(data, msg, context) {
        wx.setClipboardData({
            data,
            success: res => {
                context && context.showToast && context.showToast({
                    title: msg,
                    duration: 1000
                });
            },
            fail: res => {
                context && context.showToast && context.showToast({
                    title: '复制失败',
                    duration: 1000
                });
            }
        });
    }

    /**
     * 根据签的状态进行跳转
     * @param rockInfo
     */
    static gotoRockByState(rockInfo,navigateTo=wx.navigateTo){
        let url;
        if (rockInfo.activityStatus == 0) {//判断是否结束，跳转活动结束页
            url=`/pages/rock-end/rock-end?id=${rockInfo.activityId}`;

        } else if (!rockInfo.myRecordId) {
            //未抽签
            url=`/pages/rock/rock?id=${rockInfo.activityId}`;
        }
        else {
            //参加活动状态：0:集福中1：待升级2:待开启（升级为福袋，尚未打开福袋）3：已开启 4：已匹配 5：已揭开口面纱
            switch (rockInfo.status) {
                case 5:
                    url=`/pages/rock-match/rock-match?id=${rockInfo.activityId}&lotId=${rockInfo.myRecordId}`;
                    break;
                default:
                    url=`/pages/rock-result/rock-result?id=${rockInfo.myRecordId}`;
                    break;
            }
        }
        navigateTo({url});
    }

    /**
     * 获取图片信息
     * @param path 图片路径(数组)
     */
    static getImageInfo(path){
        return new Promise((resolve, reject) => {
            let result=[];
            path.forEach(p=>{
                wx.getImageInfo({
                    src: p,
                    success: res=>{
                        result.push(res);
                        if(result.length>=path.length){
                            resolve(result);
                        }
                    },
                    fail: res=>{
                        reject(false);
                    }
                });
            });
        });
    }

    /**
     * 更新尺寸配置
     * @param dimension 尺寸名称
     * @param size 参考尺寸
     * @param context 上下文
     */
    static updateDimension(dimension, size, context){
        let ratioWidth=size.width/size.originWidth;
        let ratioHeight=size.height/size.originHeight;
        let d=context.data[dimension];
        for(let i in d){
            let item=d[i];
            item.left=Math.ceil(ratioWidth*item.originLeft);
            item.top=Math.ceil(ratioHeight*item.originTop);
            item.width=Math.ceil(ratioWidth*item.originWidth);
            item.height=Math.ceil(ratioHeight*item.originHeight);
        }
        let obj={};
        obj[dimension]=d;
        context.setData(obj);
    }

    /**
     * 获取缩略图
     * @param width 宽度
     * @param height 高度
     * @param times 倍数
     */
    static getThumbnail(width,height,times=1){
        width=Math.ceil(width*times);
        height=Math.ceil(height*times);
        let result=`?imageView2/5/w/${width}/h/${height}/q/100`;
        return result;
    }

    /**
     * 获取缩略图(指定宽度,高度自适应)
     * @param width 宽度
     * @param times 倍数
     */
    static getThumbnailOrientByWidth(width,times=1){
        width=Math.ceil(width*times);
        let result=`?imageMogr2/auto-orient/thumbnail/${width}x/blur/1x0/quality/100`;
        return result;
    }

    /**
     * 获取缩略图(指定高度,宽度自适应)
     * @param height 高度
     * @param times 倍数
     */
    static getThumbnailOrientByHeight(height,times=1){
        height=Math.ceil(height*times);
        let result=`?imageMogr2/auto-orient/thumbnail/x${height}/blur/1x0/quality/100`;
        return result;
    }

    /**
     * 获取地址中对应的参数值
     * @param url 地址
     * @param key 键
     * @returns {*}
     */
    static getParamValue(url,key){
        let result=null;
        url&&url.split('&').some(item=>{
            let d=item.split('=');
            if(d.length>1&&d[0]==key){
                result=d[1];
            }
            return d.length>1&&d[0]==key;
        });
        return result;
    }

    /**
     * 将颜色转换成16进制颜色
     * @param num
     */
    static toHexColor(num){
        let hex = Number(num).toString(16);
        while (hex.length < 6) {
            hex = '0' + hex;
        }
        return '#' + hex;
    }

    /**
     * 获取关联活动
     * @param type 关联类型：0资讯 1生活圈 2活动
     * @param relationId 关联的ID:资讯/生活圈/活动的ID
     * @param context 上下文
     * @returns {PromiseLike<T> | Promise<T>}
     */
    static getActivityRelation(type, relationId, context) {
        return getApp().HttpService.getActivityRelation(type, relationId).then(response => {
            let result = response.data;
            if (result.code === 200) {
                let content = result.data;
                if (content) {
                    let relation = context.data.relation;
                    relation.show = true;
                    relation.src = content.image;
                    if (content.activityId) {
                        if(content.hasOwnProperty('activityType')){
                            if (content.activityType==1){
                                //投票
                                relation.url = `/pages/vote/vote?id=${content.activityId}`;
                            }
                            else if (content.activityType==0){
                                //报名
                                relation.url = `/pages/activity-detail/activity-detail?id=${content.activityId}`;
                            }
                        }else{
                            //投票(兼容上一版本)
                            relation.url = `/pages/activity-detail/activity-detail?id=${content.activityId}`;
                        }
                    } else {
                        relation.type = 'service';
                        relation.url = `type=0&id=${content.id}`;
                    }
                    context.setData({relation});
                }
            }
        }, error => {
            context.showError&&context.showError('获取关联活动失败');
        });
    }
}

export default UtilService