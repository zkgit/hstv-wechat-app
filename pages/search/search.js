// pages/search/search.js
const app = getApp();
const { Dialog, extend } = require('../../style/dist/index');
Page(extend({}, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    type: 'vod',
    inputval: '',
    textList: [],
    isresult: false,//是否在搜索
    vodtype: 0,
    videoType: '',
    pageNo: 1,
    pageSize: 10,
    searchList: [],
    loadtext: '正在加载...',
    flag: false,
    typelist: [{ name: '全部' }, { name: '电视频道' }, { name: '电视节目' }, { name: '片库' }],
    textList: ['奔跑吧兄弟', '热血街舞团', '小猪佩奇', '泡沫之夏', '向往的生活', '妈妈是超人', '温暖的弦']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethot();
    var str = wx.getStorageSync('hissearch');
    this.setData({
      keyhistory: str ? str.split(',').slice(0, 6) : []
    })

  },
  clearhis: function () {
    this.showZanDialog({
      title: '清空',
      content: '确定清空该账号的全部搜索历史\n吗',
      buttons: [{
        text: '取消',
        type: 'cancel'
      }, {
        text: '清空',
        color: '#f45335',
        type: 'clear'
      }]
    }).then(({ type }) => {
      if (type == 'clear') {
        this.setData({
          keyhistory: []
        })
        wx.setStorageSync('hissearch', '');
        wx.showToast({
          title: '已清空',
          icon: 'none'
        })
      }
    })
  },
  gethot: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'search/getHotVideo.json',
    }).then(res => {
      var data = res.data;
      if (data && data.response.responseHeader.code == 200) {
        that.setData({
          hotList: data.response.responseBody
        })
      }
    })
  },
  search_clear: function () {
    this.setData({
      isresult: false,
      inputval: '',
      searchList: []
    })
  },
  searchsub: function (e) {//点击点播或直播
    console.log(e)
    var that = this;
    that.setData({
      inputval: e.detail.value.replace(/\s/ig, ''),
      isresult: false
    })
    that.keylen()
  },
  changevodType: function (e) {
    this.setData({
      vodtype: e.currentTarget.dataset.vodtype,
      isresult: true,
    })
    this.sccol();
  },
  clicksearch: function () {//点击搜索按钮
    this.setData({
      isresult: true,
      list: [],
      textList: [],
      searchList: []
    })
    this.setLocal();
    this.getAjax();
  },
  setLocal: function () {
    var str = wx.getStorageSync('hissearch'),
      isin = false,
      strarr = [];
    if (str) {
      strarr = str.split(',');
      for (var i = 0; i < 6; i++) {
        if (this.data.inputval == strarr[i]) {
          isin = true;
        }
      }
      if (!isin) {
        if (strarr.length) {
          str = this.data.inputval + ',' + strarr.join(',').substr(0, 200);
        }
      }
    } else {
      str = this.data.inputval;
    }
    wx.setStorageSync('hissearch', str);
    this.setData({
      keyhistory: str.split(',').slice(0, 6)
    })
  },
  getAjax: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'search/searchLiveAndDemand.json',
      data: {
        key: that.data.inputval,
        type: that.data.type,
        way: that.data.type == 'vod' ? that.data.vodtype : '',
        videoType: that.data.videoType,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize
      }
    }).then(res => {
      var data = res.data;
      if (data && data.response.responseHeader.code == 200 && data.response.responseBody.totalrecords) {
        var _shlist = data.response.responseBody.list
        for (var i = 0; i < _shlist.length; i++) {
          _shlist[i].tags = _shlist[i].tags.split(';').slice(0, 3)
        }
        that.setData({
          searchList: that.data.searchList.concat(_shlist),
          flag: false
        })
        if (that.data.searchList.length == data.response.responseBody.totalrecords) {
          that.setData({
            loadtext: '已加载全部数据'
          })
        }

      } else {
        that.setData({
          loadtext: '暂无数据'
        })
      }
    })
  },
  scrollLower: function () {
    var that = this;
    if (!that.data.flag) {
      that.setData({
        pageNo: ++that.data.pageNo
      })
      that.getAjax();
    }
    that.setData({
      flag: true
    })

  },
  sccol: function (e) {//搜索初始化 点击点播的分类
    this.setData({
      loadtext: '正在加载...',
      searchList: [],
      pageNo: 1,
      videoType: e ? e.currentTarget.dataset.videotype : ''
    })
    this.getAjax();
  },
  keysearch: function (e) {//点击关键字搜索
    this.setData({
      inputval: e.currentTarget.dataset.key,
      textList: [],
      isresult: true,
      searchList: []
    })
    this.getAjax();
  },
  keylen: function () {//联想
    var that = this;
    if (that.data.inputval) {
      app.fetch.newData.result({
        API_URL: app.globalData.base + 'search/searchWordAssociate.json',
        data: {
          key: that.data.inputval,
          type: that.data.type,
          pageNo: 1,
          pageSize: 25
        }
      }).then(res => {
        var data = res.data;
        if (data && data.response.responseHeader.code == 200) {
          that.setData({
            textList: data.response.responseBody
          })
        }
      })
    } else {

    }
  },

  // changeType: function (e) {
  //   if (e.currentTarget.dataset.type!=this.data.type){
  //     this.setData({
  //       type: e.currentTarget.dataset.type,
  //       pageNo: 1,
  //       searchList: [],
  //       textList:[]       
  //     })
  //     if (this.data.inputval) {
  //       // this.keylen();
  //       this.setData({
  //         isresult: true,
  //         loadtext: '正在加载...'
  //       })
  //       this.getAjax();
  //     }
  //   }

  // },
  goback: function () {
    wx.navigateBack({
      delta: 1
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))