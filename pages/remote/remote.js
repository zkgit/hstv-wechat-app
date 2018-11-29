// pages/remote/remote.js
const app = getApp();
const zan = require('../../style/dist/index');
let dir=''
console.log(zan)
const { Dialog, extend } = require('../../style/dist/index');
Page(extend({}, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    is_staticvol: false,
    keynum: 'default',
    svgbg: '/image/remote/remote_default.png',
    keyvolbg:'/image/remote/remote_vol_default.png',
    touchmove: false,
    deviceval:'',
    showdevice:false,
    fx:0,
    fy:0,
    isshowok:'none',
    isshowdir: 'none',
    touchflag:false,
    direction:'',
    touchjson:{
      'up':'38',
      'bottom':'40',
      'right':'39',
      'left':'37'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  hidedevice:function(){
    this.setData({
      showdevice:false
    })
  },
  deviceblur:function(e){
    this.setData({
      deviceval: e.detail.value
    })
console.log(e.detail.value)
  },
  deviceconfrim:function(){

  },
  noidtip: function () {
    this.showZanDialog({
      title: '绑定提示',
      content: '您需要绑定才能使用该功能',
      buttons: [{
        text: '取消',
        type: 'cancel'
      }, {
        text: '去绑定',
        color: '#f45335',
        type: 'scan'
      }]
    }).then(({ type }) => {
      if (type == 'scan') {
         this.setData({
           showdevice:true
         })
        // wx.scanCode({
        //   success: (res) => {
        //     console.log(app.util.getUrlParam('scene', res.path))
        //     console.log(wx.getStorageSync('boxId'))
        //     //设备用户关系绑定
        //     app.api.newData.result(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
        //       console.info(res)
        //     })
        //     // 缓存设备号
        //     app.wechat.setStorage('boxId', app.util.getUrlParam('scene', res.path))
        //   }
        // })
      }

    });
  },
  changeVol: function () {
    var that = this;
    that.setData({
      is_staticvol: !that.data.is_staticvol
    })
  },
  shownum: function (e) {
    this.setData({
      keynum: e.currentTarget.dataset.key
    })
  },
  touchpress: function (e) {
     console.log('touch',e)
     dir ='';
      this.setData({
        fx: e.touches[0].pageX-38,
        fy: e.touches[0].pageY-135,
        isshowok:'block',
        touchflag:true
      })
  },
  touchmove:function(e){
    let j = Math.atan2((e.touches[0].pageY - this.data.fy - 135), (e.touches[0].pageX-this.data.fx -38));
    j = j * 180 / Math.PI;
    //console.log((e.touches[0].pageX - this.data.fx - 38), (e.touches[0].pageY - this.data.fy - 135))
    this.setData({
      fx: e.touches[0].pageX - 38,
      fy: e.touches[0].pageY - 135,
      isshowok: 'block'
    })
    if(j>-135&&j<-45){
      dir='up'
    }else if(j>=-45&&j<=45){
      dir = 'right'
    }else if (j > 45 && j <135){
      dir = 'bottom'
    }else if ((j >= 135 &&j<=180)||(j < -135&&j>-180)){
      dir='left'
    }
  },
  touchend:function(e){
    this.setData({
      fx:0,
      fy:0,
      isshowok:'none',
      touchflag:false
    })
  
    if(dir){
      this.setData({
        direction: dir,
        isshowdir:'block'
      })
      console.log(dir,this.data.touchjson[dir])
      this.sent(this.data.touchjson[dir])
      setTimeout(()=>{
        this.setData({
          isshowdir:'none'
        })
      },400)
    }else{
      this.sent('13')
    }
  },
  svgpress: function (e) {
    console.info(e)
    wx.vibrateShort()
    var that = this;
    that.setData({
      touchmove: true
    })
    var keyCode = e.target.dataset.keycode;
    if (keyCode == '38') {//up
      that.setData({
        svgbg: '/image/remote/svg_top.png'
      })
    } else if (keyCode == '39') {//right
      that.setData({
        svgbg: '/image/remote/svg_right.png'
      })
    } else if (keyCode == '40') {//bottom
      that.setData({
        svgbg: '/image/remote/svg_bottom.png'
      })
    } else if (keyCode == '37') {//left
      that.setData({
        svgbg: '/image/remote/svg_left.png'
      })
    }else if(keyCode=='448'){//vol -
      that.setData({
        keyvolbg: '/image/remote/remote_jian.png'
      })
    } else if (keyCode == '447') {//vol +
      that.setData({
        keyvolbg: '/image/remote/remote_jia.png'
      })
    } else if (keyCode == '449') {//静音
      that.setData({
        keyvolbg: '/image/remote/remote_mute.png'
      })
    }
    that.sent(e.target.dataset.keycode)
  },
  svgmove: function (e) {
    var that = this;
    if (that.data.touchmove) {
      that.setData({
        touchmove: false
      })
    }
  },
  sent: function (e) {
    var that = this;
    console.log(wx.getStorageSync('boxId'))
    if (!wx.getStorageSync('boxId')) {
      //that.noidtip()
      return false
    }
    var control = {
      API_URL: app.globalData.user + 'message/controlMessage',
      data: {
        'keyCode': e,
        'boxId': wx.getStorageSync('boxId')
      }
    }
    app.fetch.newData.result(control).then(res => {

    })

  },
  svgend: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        svgbg: '/image/remote/remote_default.png',
        keyvolbg: '/image/remote/remote_vol_default.png'
      })
    }, 200);
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
}));