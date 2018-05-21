//app.js
var Utils = require('/utils/util.js');
import __cache from '/etc/cache'
App({
  onLaunch: function (options) {
    console.log(options)
    if (options.scene == 1037 || options.scene == 1038) {
      this.saveSourcMiniData(options);
    }
    this.globalData.scene = options.scene;
    wx.getSystemInfo({
      success: (res) => {
        let platform = res.platform;
        if (!platform) {
          let temp = res.system.toLowerCase();
          if (temp.indexOf('ios') != -1) {
            platform = 'ios'
          } else if (temp.indexOf('android') != -1) {
            platform = 'android'
          }
        } else {
          platform = platform.toLowerCase();
        }
        this.globalData.platform = platform;
      }
    });
  },
  onShow: function (options) {
    if (options.scene == 1037 || options.scene == 1038) {
      this.saveSourcMiniData(options);
    }
    console.log("======App onShow=======")
    // options.query.fr="结婚就好和"
    console.log(options)
    this.globalData.scene = options.scene;
    if (options.query.hasOwnProperty('fr')) {
      let fromUser = options.query.fr;
      // saveRecommendRecord
      this.HttpService.saveRecommendRecord(fromUser)
        .then(res => {
          let data = res.data;
          console.log("saveRecommendRecord 成功")
          console.log(data)
        }
        , error => {
          console.log("saveRecommendRecord 失败")
        }
        )

    }
  },
  /**
   * 保存来源小程序的数据信息
   * @param options
   */
  saveSourcMiniData(options) {
    if (options.referrerInfo && options.referrerInfo.extraData) {
      this.globalData.sourceMiniData = options.referrerInfo.extraData;
    }
  },
  /**
   * 是否可以点击
   */
  canClick() {
    let result = this.globalData.canClick;
    if (result) {
      this.globalData.canClick = false;
    }
    return result;
  },
  /**
   * 延迟允许点击
   */
  delayEnableClick() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.enableClick();
    }, 800);
  },
  /**
   * 允许点击
   */
  enableClick() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.globalData.canClick = true;
    this.timer = null;
  },
  /**
   * 允许点击
   */
  notifyEnableClick() {
    let type = this.__config.eventType.enableClick;
    this.NotifyService.dispatchEvent({
      type,
      data: null
    });
  },
  /**
   * 处理显示事件(用于从别的页面返回时打开新页面)
   */
  handleOnShow() {
    let url = this.globalData.navigateUrl;
    if (url) {
      wx.navigateTo({
        url
      });
      this.globalData.navigateUrl = '';
    }
  },
  setSaveToken(id) {
    this.HttpService.setSaveToken({
      openId: this.globalData.openId,
      token: id
    })
  },
  timer: null,
  globalData: {
    sourceMiniData: null,//保存来源小程序的数据
    scene: '',
    loginLock: false,//登陆锁
    platform: '',//当前系统
    canClick: true,//是否可以点击
    navigateUrl: '',//从别的页面跳转回来要转到的页面
    versionHidden: null,//版本是否需要隐藏
    homeSelectPage: 0,//首页选择的页面  0:乘客  1:司机
    userType: 0,// 0 乘客     1 乘客 + 车主（未认证\审核中）    2 乘客 + 车主（已认证）    3 乘客 + 车主（认证失败）
    openId: Utils.CacheService.getOpenId(),
    userId: Utils.CacheService.getUserId(),
    userName: Utils.CacheService.getUserName(),
  },
  CryptoService: Utils.CryptoService,
  NotifyService: Utils.NotifyService,
  WxValidate: Utils.WxValidate,
  HttpService: Utils.HttpService,
  WxService: Utils.WxService,
  CacheService: Utils.CacheService,
  __config: Utils.__config,
  socket: {
    data: {
      msgList: {
        0: [],
        1: []
      }
    },
    SocketTask: null,
    retryCount: 0,
    sendQueue: [],
    onMessageType: {
      0: {},
      1: {}
    },
    connectSocket() {
      if (this.SocketTask) {
        return;
      }
      let _this = this
      _this.SocketTask = wx.connectSocket({
        url: Utils.__config.socket,
        header: {
          'access-token': wx.getStorageSync('token'),
          'appId': Utils.__config.appId
        },
        fail() {
          _this.SocketTask = null
          if (_this.retryCount <= 3) {
            _this.retryCount++
            console.log(`WebSocket 连接失败！正常重新连接（第${_this.retryCount}次重试）`)
            _this.connectSocket()
          } else {
            _this.retryCount++
            console.log(`WebSocket 连接失败！正常重新连接（第${_this.retryCount}次重试）`)
            setTimeout(() => {
              _this.connectSocket()
            }, 60000)
          }
        }
      })
      wx.onSocketOpen(function (res) {
        _this.retryCount = 0
        console.log('WebSocket连接已打开！')
        for (var i = 0; i < _this.sendQueue.length; i++) {
          _this.send(_this.sendQueue[i])
        }
        _this.sendQueue = []
        var setPing = () => {
          setTimeout(() => {
            if (_this.SocketTask) {
              console.log('发送Ping包（伪）')
              _this.SocketTask.send(0)
              setPing()
            }
          }, 30000)
        }
        setPing()
      })
      wx.onSocketError(function (res) {
        _this.SocketTask = null
        _this.retryCount++
        console.log(`WebSocket 连接失败！正常重新连接（第${_this.retryCount}次重试）`)
      })
      wx.onSocketClose(function (res) {
        if (_this.retryCount > 0) {
          if (_this.retryCount <= 1) {
            _this.connectSocket()
          } else if (_this.retryCount <= 3) {
            setTimeout(() => {
              _this.connectSocket()
            }, 10000)
          } else {
            setTimeout(() => {
              _this.connectSocket()
            }, 60000)
          }
          return;
        }
        console.log('WebSocket连接已关闭！')
        console.log(new Date())
        _this.SocketTask = null
        _this.data = {
          msgList: {
            0: [],
            1: []
          }
        }
        _this.connectSocket()
      })
      wx.onSocketMessage(function (res) {
        console.log('返回消息')
        console.log(res.data)
        res.data = JSON.parse(res.data)
        if (res.data.type == 1) {
          if (res.data.data.type == 1) {
            res.data.data.content.forEach((record, i) => {
              _this.data.msgList[record.type].push(record)
            })
          }
          if (_this.onMessageType[res.data.data.type]) {
            for (let i in _this.onMessageType[res.data.data.type]) {
              _this.onMessageType[res.data.data.type][i].f(res.data.data.content)
            }
          }
        }
      })
    },
    send(data) {
      if (this.SocketTask) {
        this.SocketTask.send(data)
      } else {
        this.sendQueue.push(data)
      }
    },
    onMessage(type, page, success) {
      this.onMessageType[type][page] = success
    },
    delMessage(type, page) {
      this.onMessageType[type][page] = null
    }
  }
})