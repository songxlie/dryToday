import WxRequest from '../assets/plugins/wx-request/lib/index'
import __cache from '../etc/cache'
import __config from '../etc/config'
import CryptoService from 'CryptoService'

class HttpService extends WxRequest {
  __cache;

  constructor(options) {
    super(options);
    this.$$prefix = ''
    this.$$path = {
      classify: '/classify',
      user: {
        login: "/user/wechat/login",
        getSessionKey: "/user/wechat/getSessionKey",
        checkMobile: "/user/mobile/checkMobile",
        bindMobile: "/user/mobile/bindMobile",
        updateUser: "/user/updateUser",
        getOthersUserInfo: "/client/user/userInfo",
        saveRecommendRecord: "/client/recommend/record/save",

      },
      data: {
        getHistoryList: "/data/all",
        getGirlyList: "/data/福利"
      }
    };
    this.interceptors.use({//请求的总入口
      request(request) {
        request.header = request.header || {}
        request.header['content-type'] = 'application/json';
        console.log(wx.getStorageSync(__cache.token));
        request.header['access-token'] = wx.getStorageSync(__cache.token);
        request.header['regionId'] = 1024
        request.header['appId'] = __config.appId

        if (__cache.showLoading) {
          // wx.showLoading({
          //   title: '加载中',
          // })
        }
        __cache.showLoading = true
        return request
      },
      requestError(requestError) {
        wx.hideLoading()
        return Promise.reject(requestError)
      },
      response(response) {
        wx.hideLoading()
        return response
      },
      responseError(responseError) {
        wx.hideLoading()
        return Promise.reject(responseError)
      },
    })
  }

  /**
   * 获取历史列表
   */
  getHistoryList(pageSize, pageNum) {
    
      return this.getRequest(`${this.$$path.data.getHistoryList}/${pageSize}/${pageNum}`);
  }
  getGirlyList(pageSize, pageNum){
    return this.getRequest(`${this.$$path.data.getGirlyList}/${pageSize}/${pageNum}`);
  }

  /**
   * 保存推荐记录
   */
  saveRecommendRecord(recommendCode) {
    let data = { recommendCode: recommendCode}
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.user.saveRecommendRecord}`, {
        data
      });
    });
  }

  //获取banner列表
  getBannerList(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.banners.getBannerList}`, {
        data
      });
    });
  }

  /**
   * 获取资讯列表
   * @param data (pageNum:分页页码 pageSize:分页每页大小 orderType:最新或热门[0最新 1热门])
   * @returns {Promise.<TResult>}
   */
  getArticleList(data) {
    return this.login().then(() => {
      let url = getApp().globalData.versionHidden ? this.$$path.versions.getArticleList : this.$$path.articles.getArticleList;
      return this.postRequest(`${url}`, {
        data
      });
    });
  }

  //获取资讯详情
  getArticleDetail(articleId, shareUserId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.articles.getArticleDetail}/${articleId}?shareUserId=${shareUserId}`);
    });
  }

  //获取推荐文章
  getArticleRecommend(params) {
    return this.login().then(() => {
      let url = getApp().globalData.versionHidden ? this.$$path.versions.getArticleRecommend : this.$$path.articles.getArticleRecommend;
      return this.postRequest(`${url}`, {
        data: params
      });
    });
  }

  /**
   * 获取公众号详情
   * @param authorId 作者ID
   * @returns {Promise.<TResult>}
   */
  getOfficialAccountDetail(authorId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.articles.getOfficialAccountDetail}/${authorId}`);
    });
  }

  //toggle推荐文章
  toggleArticleCollect(params) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.articles.toggleArticleCollect}`, {
        data: params,
      });
    });
  }

  //获取文章评论列表
  getArticleCommentList(params) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.articles.getArticleCommentList}`, {
        data: params
      });
    });
  }

  //提交文章评论
  commitArticleComment(params) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.articles.commitArticleComment}`, {
        data: params
      });
    });
  }

  /**
   * 删除文章评论
   * @param id
   * @returns {Promise.<TResult>}
   */
  deleteArticleComment(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.articles.deleteArticleComment}/${id}`);
    });
  }

  /**
   * 修改个人关注动态为已读状态
   * @param id
   * @returns {Promise.<TResult>}
   */
  updateIsRead(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.updateIsRead}/${id}`);
    });
  }

  //更新评论点赞
  updateCommentLikeStatus(params) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.articles.updateCommentLikeStatus}`, {
        data: params
      });
    });
  }

  getOfflineActivityDetail(params) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.offlineActivity.getDetail}`, {
        data: params,
      });
    });
  }


  //获取收藏的文章列表
  getCollectList(params) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.articles.getCollectList}`, {
        data: params,
      });
    });
  }


  /**
   * 获取我的活动列表
   * @param data (pageNum:分页页码 pageSize:分页每页大小 status:是否进行中[1是0否])
   * @returns {Promise.<TResult>}
   */
  getMyActivityList(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.activitys.getMyActivityList}`, {
        data
      });
    });
  }

  /**
   * 获取活动列表
   * @param data (pageNum:分页页码 pageSize:分页每页大小)
   * @returns {Promise.<TResult>}
   */
  getActivityList(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.activitys.getActivityList}`, {
        data
      });
    });
  }

  //活动详情
  getActivityInfo(id, shareUserId) {
    return this.getRequest(`${this.$$path.activitys.getActivityInfo}/${id}?shareUserId=${shareUserId}`);
  }

  //获取报名列表

  getActivityEnrolls(params) {
    return this.postRequest(`${this.$$path.activitys.getActivityEnrolls}`, {
      data: params,
    });
  }

  //获取评论列表

  getActivityComments(params) {
    return this.postRequest(`${this.$$path.activitys.getActivityComments}`, {
      data: params,
    });
  }

  //发布活动评论
  saveActivityComment(comment) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.activitys.saveActivityComment}`, {
        data: comment
      });
    });
  }

  //是否点赞
  likeActivityComment(id, status, shareUserId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.activitys.likeActivityComment}/${id}/${status}?shareUserId=${shareUserId}`);
    });
  }

  //活动报名
  saveActivityEnroll(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.activitys.saveActivityEnroll}`, {
        data
      });
    });
  }

  // 获取他人用户基本信息
  getOthersUserInfo(userId) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.user.getOthersUserInfo}`, {
        data: { userId: getApp().globalData.userId },
      });
    });
  }

  /**
   * 修改用户数据
   * @param data 用户数据
   * @returns {Promise.<TResult>}
   */
  updateUser(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.user.updateUser}`, {
        data
      });
    });
  }

  /**
   * 绑定手机
   * @param data (mobile:手机号 isXiaochengxu:是否小程序 userId:用户id)
   * @returns {Promise.<TResult>}
   */
  bindMobile(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.user.bindMobile}`, {
        data
      });
    });
  }
  /**
   * 获取乘客转化
   */
  getPassengerSelfConversion(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getPassengerSelfConversion}`, { data });
    });
  }

  getDriverPendingList(data){
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getDriverPendingList}`, { data });
    });
  }

  //获取评车是否开启智能推送
  getUserInfoIntelligentPush(){
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getUserInfoIntelligentPush}`);
    });
  }
  // 设置智能推送状态
  setIntelligentPushStatus() {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.setIntelligentPushStatus}`);
    });
  }

  /**
   * 保存拨打电话记录接口
   * @param data  data.type: 电话身份 0司机1乘客2其他; data.phone: 电话号码; data.source:页面路径

   * @returns {boolean}
   */
  saveCallRecord(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.saveCallRecord}`, { data });
    });
  }

  getPassengerPendingList(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getPassengerPendingList}`, { data });
    });
  }

  /**
   * 绑定手机
   * @param mobile:手机号
   * @returns {Promise.<TResult>}
   */
  checkMobile(mobile) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.user.checkMobile}/${mobile}`);
    });
  }

  /**
   * 获取用户动态
   * @param data 用户数据
   * @returns {Promise.<TResult>}
   */
  getUserDynamic(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.moments.getUserDynamic}`, { data });
    });
  }

  /**
   * 获取消息列表
   * @param data (pageNum:分页页码 pageSize:分页每页大小 status:是否进行中[1是0否])
   * @returns {Promise.<TResult>}
   */
  getMessageList(data) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.messages.getmessageList}/${data.pageNum}/${data.pageSize}`);
    });
  }


  //获取未读消息条数
  getMsgCount() {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.messages.getMsgCount}`);
    });
  }


  //获取未读消息条数
  setSaveToken(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.messages.setSaveToken}`, {
        data: data
      });
    });
  }

  /**
   * 获取我关注的动态
   * @param data (pageNum:分页页码 pageSize:分页每页大小 status:是否进行中[1是0否])
   * @returns {Promise.<TResult>}
   */
  findFollowListBySelf(data) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.findFollowListBySelf}/${data.pageNum}/${data.pageSize}`);
    });
  }

  /**
   * 获取我发布的动态
   * @param data (pageNum:分页页码 pageSize:分页每页大小 status:是否进行中[1是0否])
   * @returns {Promise.<TResult>}
   */
  findMomentsListBySelf(data) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.findMomentsListBySelf}/${data.pageNum}/${data.pageSize}`);
    });
  }

  /**
   * 获取生活圈列表
   * @param data (pageNum:分页页码 pageSize:分页每页大小)
   * @returns {Promise.<TResult>}
   */
  getMomentsList(data) {
    return this.login().then(() => {
      let url = getApp().globalData.versionHidden ? this.$$path.versions.getMomentsList : this.$$path.moments.getMomentsList;
      let shareUserId = data.shareUserId;
      return this.getRequest(`${url}/${data.pageNum}/${data.pageSize}?shareUserId=${shareUserId}`, {});
    });
  }

  /**
   * 获取参与话题的生活圈列表
   * @param data (id:话题id pageNum:分页页码 pageSize:分页每页大小)
   * @returns {Promise.<TResult>}
   */
  getTopicMomentsList(data) {
    return this.login().then(() => {
      let url = this.$$path.moments.getTopicMomentsList;
      let shareUserId = data.shareUserId;
      return this.getRequest(`${url}/${data.id}/${data.pageNum}/${data.pageSize}?shareUserId=${shareUserId}`, {});
    });
  }

  /**
   * 获取话题详情
   * @param id 话题id
   * @param shareUserId 分享用户id
   * @returns {Promise.<TResult>}
   */
  getTopicDetail(id, shareUserId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.getTopicDetail}/${id}?shareUserId=${shareUserId}`);
    });
  }

  getMomentsById(id, shareUserId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.getMomentsById}/${id}?shareUserId=${shareUserId}`);
    });
  }

  //关注或取消关注生活圈
  followPost(postId, shareUserId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.followPost}/${postId}?shareUserId=${shareUserId}`);
    });
  }

  //点赞或取消点赞生活圈
  likePost(postId, shareUserId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.likePost}/${postId}?shareUserId=${shareUserId}`);
    });
  }

  //删除生活圈
  delPost(postId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.delPost}/${postId}`);
    });
  }

  //发布生活圈
  publishPost(moments) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.moments.publishPost}`, {
        data: moments,
      });
    });
  }

  //根据用户id查找动态列表
  findListByUser(params) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.moments.findListByUser}`, {
        data: params,
      });
    });
  }

  //删除评论
  delComment(commentId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.delComment}/${commentId}`);
    });
  }

  //发布评论
  publishComment(comment) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.moments.publishComment}`, {
        data: comment
      });
    });
  }

  likeComment(commentId, shareUserId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.likeComment}/${commentId}?shareUserId=${shareUserId}`);
    });
  }

  /**
   * 获取生活圈动态评论列表
   * @param data (postId:动态id pageNum:分页页码 pageSize:分页每页大小)
   * @returns {Promise.<TResult>}
   */
  getCommentList(data) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.moments.getCommentList}/${data.postId}/${data.pageNum}/${data.pageSize}`);
    });
  }

  getImgToken() {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.upload.getImgToken}`)
    });
  }


  // 拼拼车首页：乘客获取附近、揭西到省内城市
  getNearbyByProvince(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.nearbyByProvince}`, {
        data: data
      })
    })
  }
  /**
   * 司机获取附近城市
   */
  getPassengerNearby(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getPassengerNearby}`, {
        data: data
      })
    })
  }
  /**
   * 获取标签列表
   */
  getCarTag(type) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getCarTag}/${type}`)
    })
  }
  /**
   * 乘客获取自己的预定
   */
  getDriverSelfReserve(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getSelfReserve}`, {
        data: data
      });
    });
  }
  // getCarUserInfo: "/client/carpool/user/info",
  // registerCarUser: "/client/carpool/user/register",
  /**
    *  城市圈用户注册成为拼车用户
    */
  registerCarUser() {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.registerCarUser}`, {
        data: {}
      });
    });
  }
  /**
   * 城市圈获取拼车用户的用户类型
   */
  getCarUserInfo() {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getCarUserInfo}`);
    });
  }
  /**
   * 是否接TA
   */
  acceptGoingOut(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.acceptGoingOut}/${id}`);
    });
  }
  /**
   * 乘客取消出行
   */
  canclePassengeOut(id) {

    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.passengerEnterReserve}/${id}/${5}`);
    });
  }
  /**
   * 司机取消行程
   */
  cancelSelfRoute(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.cancelSelfRoute}/${id}`);
    });
  }

  /**
   * 我要预约
   */
  saveSelfReserve(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.saveSelfReserve}`, {
        data: data
      });
    });
  }
  /**
   * 乘客是否可以预定
   */
  isCanReserve(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.isCanReserve}`, {
        data: data
      });
    });
  }
  /**
   * 司机取消乘客预定
   */
  driverCancelReserve(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.driverCancelReserve}`, {
        data: data
      });
    });
  }
  /**
   * 司机确定乘客预定
   */
  driverEnterReserve(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.driverEnterReserve}`, {
        data: data
      });
    });
  }
  /**
   * 乘客确认司机预定
   */
  passengerEnterReserve(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.passengerEnterReserve}/${id}/3`);
    });
  }
  /**
   * 乘客取消司机预定
   */
  passengerCancelReserve(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.passengerCancelReserve}`, {
        data: data
      });
    });
  }



  /**
   * 获取行程列表
   */
  getSelfRoute(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getSelfRoute}`, {
        data: data
      });
    });
  }
  /**
   * 发布我的出行
   */
  passengerAddSelfRoute(data) {

    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.passengerAddSelfRoute}`, {
        data: data
      });
    });
  }
  /**
   * 发布我的行程
   */
  driverAddSelfRoute(data) {

    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.driverAddSelfRoute}`, {
        data: data
      });
    });
  }
  /**
   * 修改我的行程
   */
  driverUpdateSelfRoute(data) {

    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.driverUpdateSelfRoute}`, {
        data: data
      });
    });
  }
  /**
   * 获取预订详情
   */
  getReserveDetail(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getReserveDetail}`, {
        data: data
      });
    });

  }

  /**
   * 获取行程详情
   */
  getRouteDetail(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getRouteDetail}`, {
        data: data
      });
    });

  }
  /**
   * 乘客获取行程详情
   */
  passengerGetDetail(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.passengerGetDetail}`, {
        data: data
      });
    });

  }

  /**
   * 获取乘客搜索列表
   */
  getPassengerSearchRouteList(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getPassengerSearchRouteList}`, {
        data: data
      });
    });



  }
  /**
    * 获取司机搜索列表
    */
  getDriverSearchRouteList(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getDriverSearchRouteList}`, {
        data: data
      });
    });



  }
  /**
 * 获取乘客的预订列表
 */
  getPassengerReserveInfo(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getPassengerReserveInfo}/${id}`);
    });

  }
  /**
   * 获取司机的预订列表
   */
  getRouteReserveList(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getRouteReserveList}/${id}`);
    });
  }



  getPassengeRgoingOutList(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getPassengeRgoingOutList}`, {
        data: data
      });
    });
  }


  /**
   * 获取接单列表
   */
  getOrderList(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getOrderList}`, {
        data: data
      });
    });
  }

  /**
   * 接单详情,有取消理由
   */
  getDriverOrders(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getDriverOrders}/${id}`);
    });
  }
  /**
   * 邀请加入拼车分享
   */
  shareShareToJoin(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.shareShareToJoin}`, {
        data: data
      });
    });
  }
  /**
   * 邀请一起拼车分享
   */
  shareShareCarToPooling(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.shareShareCarToPooling}`, {
        data: data
      });
    });
  }
  /**
   * 获取行程详情分享
   */
  shareDriverRoue(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.shareDriverRoue}`, {
        data: data
      });
    });
  }

  /**
   * 获取出行详情
   */
  getOrdersDetails(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getOrdersDetails}/${id}`);
    });
  }
  /**
   * 司机获取出行详情
   */
  getDriverAcceptDetails(id) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getDriverAcceptDetails}/${id}`);
    });
  }
  /**
   * 投诉行程
   */
  setComplaint(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.setComplaint}`, {
        data: data
      });
    });
  }
  /**
   *
   */
  feedbackList(data) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.feedbackList}/${data.pageNum}/${data.pageSize}/`);
    });
  }
  /**
   * 是否有新投诉建议回复
   */
  isReaded() {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.isReaded}`);
    });
  }
  /**
   * 获取汽车品牌信息
   */
  getCarBrand() {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getCarBrand}`);
    })
  }
  /**
   * 获取对应的车型信息
   */
  getCarModel(parentId) {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.getCarModel}${parentId}`)
    })
  }
  /**
   * 获取上传的驾驶证和行驶证中的用户信息
   */
  getLicenseInfo(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.getLicenseInfo}`, {
        data: data
      })
    })
  }
  /**
   * 上传车主审核信息
   */
  uploadDriverVertification(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.driver.uploadDriverVertification}`, {
        data: data
      })
    })
  }
  /**
   * 查询车主审核信息
   */
  detailDriverVertification() {
    return this.login().then(() => {
      return this.getRequest(`${this.$$path.driver.detailDriverVertification}`)
    })
  }
  getVideoToken(param) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.upload.getVideoToken}`, {
        data: param
      })
    });
  }
  /**
   * 判断用户是否登录且获取到了版本信息
   */
  isLogin() {
    return new Promise((resolve, reject) => {
      const expire = wx.getStorageSync(__cache.expire);
      const token = wx.getStorageSync(__cache.token);
      let hasInitHidden = getApp().globalData.versionHidden !== null;
      if (!hasInitHidden || !token || !expire || expire - new Date().getTime() / 1000 < 800) {
        // wx.clearStorageSync();
        return reject(false);
      }
      return resolve(true);
    });
  }

  /**
   * 登录
   * @returns {Promise.<TResult>}
   */
  login() {
    return this.isLogin().then((response) => {
      return true;
    }, (error) => {
      return this.getUserInfo();
    });
  }

  getUserToken(code, encryptedData, iv, resolve, reject) {
    //发起网络请求
    return this.postRequest(`${this.$$path.user.getSessionKey}`, {
      data: code
    }).then(res => {
      if (res.data.code === 200) {
        let d = {
          appId: __config.appId,
          sessionKey: res.data.data.session_key,
          encryptedData: encryptedData,
          iv: iv
        };
        let openId = res.data.data.openid;
        const App = getApp();
        App.globalData.openId = openId;
        wx.setStorageSync(__cache.openId, openId);
        wx.setStorageSync(__cache.sessionKey, res.data.data.session_key);
        let data = new CryptoService().decrypt(d);
        //发起登录
        return this.postRequest(`${this.$$path.user.login}`, {
          data: {
            openId,
            nickname: data.nickName,
            avatarUrl: data.avatarUrl,
            sex: data.gender,
            province: data.province,
            city: data.city,
            unionId: data.unionId
          }
        }).then(res => {
          if (res.data.code === 200) {
            wx.setStorageSync(__cache.userId, res.data.data.userId);
            wx.setStorageSync(__cache.token, res.data.data.token);
            let expire = new Date().getTime() / 1000 + Number(res.data.data.expire);
            expire = Math.floor(expire);
            wx.setStorageSync(__cache.expire, expire);
            App.globalData.userId = res.data.data.userId;
            return res.data.data;
          } else {
            return false;
          }
        }).catch(error => {
          return false;
        });
      } else {
        return false;
      }
    }, error => {
      return false;
    });
  }

  /**
   * 获取版本信息,用于判断该版本是否需要隐藏信息
   * @param version 版本号(如1.0.0)
   * @returns {*}
   */
  getVersionInfo(version) {
    return this.getRequest(`${this.$$path.versions.getVersionInfo}/${version}/info`);
  }

  /**
   * 分享统计
   * @param data 见http://192.168.31.30:8090/pages/viewpage.action?pageId=1966391
   * @returns {Promise.<TResult>}
   */
  shareStatistics(data) {
    return this.login().then(() => {
      return this.postRequest(`${this.$$path.share.shareStatistics}`, {
        data
      });
    });
  }

  /**
   * 获取微信用户信息
   */
  getWeixinUserInfo(code, resolve, reject) {
    wx.getUserInfo({
      success: res => {
        wx.setStorageSync(__cache.user, res.userInfo);
        wx.setStorageSync(__cache.userName, res.userInfo.nickName);
        getApp().globalData.userName = res.userInfo.nickName
        this.getUserToken(code, res.encryptedData, res.iv, resolve, reject).then(isOk => {
          if (isOk) {
            if (getApp().globalData.versionHidden === null) {
              this.getVersionInfo(__config.version).then(versionResponse => {
                if (versionResponse.data.code === 200) {
                  getApp().globalData.versionHidden = versionResponse.data.data.hidden;
                  this.unLock();
                  resolve(versionResponse);
                } else {
                  this.unLock();
                  reject(false);
                }
              }, error => {
                this.unLock();
                reject(false);
              });
            } else {
              this.unLock();
              resolve(isOk);
            }
          } else {
            this.unLock();
            reject(false);
          }
        });
      },
      fail: res => {
        wx.showModal({
          title: '是否要打开设置页面重新授权？',
          content: '平台内容需要授权后可见，请到小程序设置中打开用户信息授权，授权需要获取您的公开信息（昵称、头像等），平台承诺不泄露用户信息。',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#c8c8c8',
          confirmText: '去设置',
          confirmColor: '#2cc9a9',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    this.getWeixinUserInfo(code, resolve, reject);
                  } else {
                    this.unLock();
                    reject(false);
                  }
                },
                fail: res => {
                  this.unLock();
                  reject(false);
                }
              });
            } else if (res.cancel) {
              this.unLock();
              reject(false);
            }
          },
          fail: res => {
            this.unLock();
            reject(false);
          }
        });
      }
    })
  }

  /**
   * 检查是否登录(用于加锁后的检查)
   */
  checkLogin(id, resolve, reject) {
    if (!getApp().globalData.loginLock) {
      clearInterval(id);
      this.isLogin().then((response) => {
        resolve(true);
      }, (error) => {
        reject(false);
      });
    }
  }

  /**
   * 加锁
   */
  lock() {
    getApp().globalData.loginLock = true;
  }

  /**
   * 解锁
   */
  unLock() {
    getApp().globalData.loginLock = false;
  }

  //获取用户信息
  getUserInfo() {
    const App = getApp();
    return new Promise((resolve, reject) => {
      if (App.globalData.loginLock) {
        let id = setInterval(() => {
          this.checkLogin(id, resolve, reject);
        }, 200);
      } else {
        this.lock();
        wx.login({
          success: response => {
            if (response && response.code) {
              var code = response.code;
              wx.setStorageSync(__cache.code, code);
              //获取用户信息
              this.getWeixinUserInfo(code, resolve, reject);
              App.socket.connectSocket()
            } else {
              this.unLock();
              reject(false);
            }
          },
          fail: res => {
            this.unLock();
            reject(false);
          }
        });
      }
    });
  }


}

export default HttpService