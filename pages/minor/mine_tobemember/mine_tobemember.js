const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin:false,
    showBottomPopup: false,
    goodsList: [{
      id: '1',
      time: '1个月',
      price:'30.00',
      oldPrice:'35'
    }, 
    {
      id: '2',
      time: '12个月',
      price: '238.00',
      oldPrice: '360'
    }],
    // selecteId:1,
    dataInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickName: app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl
    })
  },
  //选中事件
  selectedItem: function (e) {
    this.setData({
      selecteId: e.currentTarget.dataset.id,
      dataInfo: e.currentTarget.dataset.info
    })
  },
  // 弹幕弹窗显示设置
  toggleBottomPopup(e) {
    var that = this
    this.setData({
      showPopup: true,
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  //立即订购事件
  toBuy:function(){
    var that = this;
    if (!that.data.selecteId){that.showZanToast({title: '请选择订购产品',icon: ''}, 1500);return};
    this.showZanDialog({
      title: '立即订购',
      content: '请确认是否订购“电视院线'+that.data.dataInfo+'产品”',
      confirmColor: '#f45335',
      showCancel: true
    }).then(() => {

    }).catch(() => {
      console.log('取消');
    });
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