// pages/girly/girly.js

import TimeUtils from '../../assets/common/TimeUtils'
import __config from '../../etc/config';
const App = getApp();
let timeUtils = new TimeUtils();

Page({

  /**
   * 页面的初始数据66
   */
  data: {
    list: [],
    query:{
      init: false, //是否已经获取了数据
      pageNum: 1, //页数
      loading: false
    },
    isRefresh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refresh();
    
  },

getGirlyList() {
  let query = this.data.query;
  query.loading = true;
  this.setData({
    query
  });


  App.HttpService.getGirlyList(__config.pageSize, this.data.query.pageNum)
    .then(res => {
      console.log(res);
      let obj = {};

      if (res.statusCode === 200) {
        let results = res.data.results;
        if (results && results.length > 0) {
          if (this.data.isRefresh) {
            //刷新页面
            obj.list = results;
          } else {
            //不刷新页面,在原来的基础上获取数据
            if (query.init) {
              //已经获取过数据
              obj.list = this.data.list.concat(results);
            } else {
              //第一次初始化
              obj.list = results;
            }
          }

        } else {
          //没有数据
          if (!this.data.isRefresh && query.pageNum > 1) {
            query.pageNum--;
          }
        }

      } else {
        //出错
        if (!this.data.isRefresh && query.pageNum > 1) {
          query.pageNum--;
        }

      }
      query.loading = false;
      query.init = true;
      obj.query = query;
      this.setData(obj);



    })
    .catch(err => {
      console.log(err);
    });
},



/**
* 重置数据
*/
resetData() {
  let isRefresh = true;//是否正在刷新
  let query = this.data.query;
  query.init = false;
  query.pageNum = 1;
  query.loading = false;
  this.setData({
    query,
    isRefresh
  });
},

/**
* 刷新页面
*/
refresh() {
  if (this.data.isRefresh) {
    //正在刷新
    return;
  }
  this.resetData();//重置数据
  Promise.all([this.getGirlyList()]).then(() => {
    wx.stopPullDownRefresh();
    let isRefresh = false;//是否正在刷新
    this.setData({
      isRefresh
    });
  });
},


previewImage(e) {
  console.log(e.target);
  wx.previewImage({
    current: "", // 当前显示图片的http链接
    urls: [e.target.dataset.url
    ] // 需要预览的图片http链接列表
  })
},


/**
* 生命周期函数--监听页面初次渲染完成
*/
onReady: function () {

},

/**
* 生命周期函数--监听页面显示
*/
onShow: function () {

},

/**
* 生命周期函数--监听页面隐藏
*/
onHide: function () {

},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isRefresh) {
      //正在刷新
      return;
    }
    let query = this.data.query;
    if (query.loading) {
      //上次加载未完成
      return;
    }
    query.pageNum++;
    query.loading = true;
    this.setData({
      query
    });
    this.getGirlyList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})