var app = getApp();
//首页
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // banners: [],
    newList: [],
    value: app.globalData.r_value,
    pageNo: 1,
    tabType:2,//tab默认精选
    // atButtom:false,//到达底部
    banners: [
      {
        name: '测试数据1',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/fhq.jpg',
        url: '../vip/pay/pay'
      },
      {
        name: '测试数据2',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/fhq.jpg'
      },
      {
        name: '测试数据3',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/lnh.jpg'
      },

      {
        name: '测试数据4',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/qr3.jpg'
      },
      {
        name: '测试数据5',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/ssz.jpg'
      }
    ],
    tabs: [{
        id: '1',
        title: '直播'
      }, {
        id: '2',
        title: '精选'
      }, {
        id: '3',
        title: '点播'
      }],
    // 直播中得8个tab
    acessTabs:[
      {
        name: '全部',
        picUrl: '/image/index_zb_all.png',
        url:'../tvlive/tvlive?acessTvName='
      },
      {
        name: '央视',
        picUrl: '/image/index_zb_cctv.png',
        url: '../tvlive/tvlive?acessTvName='
      },
      {
        name: '北京',
        picUrl: '/image/index_zb_beijing.png',
        url: '../tvlive/tvlive?acessTvName='
      },
      {
        name: '卫视',
        picUrl: '/image/index_zb_tv.png',
        url: '../tvlive/tvlive?acessTvName='
      },
      {
        name: '影视',
        picUrl: '/image/index_zb_film.png',
        url: '../tvlive/tvlive?acessTvName='
      },
      {
        name: '体育',
        picUrl: '/image/index_zb_athlete.png',
        url: '../tvlive/tvlive?acessTvName='
      },
      {
        name: '少儿',
        picUrl: '/image/index_zb_child.png',
        url: '../tvlive/tvlive?acessTvName='
      },
      {
        name: '娱乐',
        picUrl: '/image/index_zb_yule.png',
        url: '../tvlive/tvlive?acessTvName='
      }
      ],
},

  changeTitle:function(e){
    var a = e.detail.current;
    var that = this;
    that.setData({
      itemTitle: that.data.banners[a].name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // handleZanTabChange(e) {
  //   var componentId = e.componentId;
  //   var selectedId = e.selectedId;

  //   this.setData({
  //     [`${componentId}.selectedId`]: selectedId
  //   });
  // },
  getUlike: function getUlike() {
    // 猜你喜欢
    this.setData({
      'pageNo': this.data.pageNo++,
      'pageSize': '6',
      'scope': this.data.pageNo++
    })
    console.info(this.data.pageNo++)
    this.like()
  },
  like: function like() {
    // 猜你喜欢
    var allMyVideo = {
      API_URL: app.globalData.base + 'home/allItU.json',
      data: {
        'pageNo': this.data.pageNo,
        'pageSize': '6',
        'scope': this.data.pageNo
      }
    }
    app.fetch.newData.result(allMyVideo).then(res => {
      this.setData({
        allMyVideo: res.data.response.responseBody.list
      })
    })
  },
  allList: function allList() {
    let that = this;
    //热播排行
    let hotVideo = {
      API_URL: app.globalData.base + 'home/hotVideo.json',
      // method: 'post',
      data: {
        'type': 'film',
        'pageNo': '1',
        'pageSize': '6'
      }
    },
      // 最新上线
      videoReserve = {
        API_URL: app.globalData.base + 'videoReserve.json',
        data: {
          'pageNo': '1',
          'pageSize': '6'
        }
      },
      // 正在热播
      hotLive = {
        API_URL: app.globalData.base + 'home/hotLive.json',
        data: {
          'pageNo': '1',
          'pageSize': '6'
        }
      }

    // 正在热播
    app.fetch.newData.result(hotLive)
      .then(res => {
        this.setData({
          hotLive: res.data.response.responseBody.list
        })
      })
    // 热播排行
    app.fetch.newData.result(hotVideo)
      .then(res => {
        this.setData({
          hotVideo: res.data.response.responseBody.list
        })
      })
      .then(
      // 最新上线
      // app.fetch.newData.result(videoReserve)
      //   .then(res => {
      //     this.setData({
      //       videoReserve: res.data.response.responseBody.list
      //     })
      //   })
      )
    // 加载猜你喜欢
    this.setData({
      'pageNo': 1,
      'pageSize': '6',
      'scope': 1
    })
    this.like()
  },
  onLoad: function (params) {
    let that = this;
    //获取网络状态
    app.wechat.getNetStatus().then(res => {
      if (res.networkType == 'none') {//无网络状态
        that.setData({
          nonet: res.networkType
        })
      }
    });
    // 处理微信扫一扫boxid绑定
  //   if (params.scene) {
  //       let scene = decodeURIComponent(params.scene)
  //       wx.setStorageSync('boxId', scene)
  //       !app.globalData.openId || app.api.newData.result(scene, app.globalData).then(res => {
  //         wx.showToast({
  //           title: '绑定成功',
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       })
  //   };
  //   //
  //   that.setData({
  //     itemTitle: that.data.banners[0].name
  //   })
  },
  //tab切换
  changType: function (event){
    var that = this;
    var id = event.currentTarget.dataset.id;
    if (event) {
      that.setData({
        tabType: id
      })
    }
  },
  // 精选直播跳转
  toLive:function(){
    this.setData({
      tabType:1
    });
    this.goTop()
  },
  //精选点播跳转
  toDB:function(){
    this.setData({
      tabType: 3
    });
    this.goTop()
  },
  //回到顶部
  goTop: function () {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } 
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (params) {
    this.allList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      atButtom: true
    });
  },
})