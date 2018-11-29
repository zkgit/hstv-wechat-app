// pages/minor/mine_messages/mine_messages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabType:'book',//tab默认为预约
    checkbable: false,//默认隐藏底部删除
    hasList:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  changeType: function (e) {
    if (e.currentTarget.dataset.type != this.data.tabType) {
      if (e.currentTarget.dataset.type == "book") {
        this.setData({
          tabType: e.currentTarget.dataset.type,
        })
      } else {
        this.setData({
          tabType: e.currentTarget.dataset.type,
        })
      }
    }
    this.setData({
      // iszhan: false,
    })
  },
  // 显示底部删除
  deletefcn: function () {
    var that = this
    this.setData({
      checkbable: true
    })
  },
  // 底部全选、取消全选
  allcheck: function () {
    var that = this
    this.setData({
      isallcheck: !that.data.isallcheck
    })
    if (that.data.isallcheck) {
      this.setData({
        // deleteNum: that.data.lists.length
        deleteNum: 10
      })
    } else {
      this.setData({
        deleteNum: 0
      })
    }
    // for (var i in this.data.lists) {
    //   var list_item = "lists[" + i + "].ischeck";
    //   this.setData({
    //     [list_item]: that.data.isallcheck,
    //   })
    // }
  },
  // 底部取消
  cancel: function () {
    var that = this
    this.setData({
      checkbable: false,
      isallcheck: false
    })
    // for (var i in this.data.lists) {
    //   var list_item = "lists[" + i + "].ischeck"
    //   this.setData({
    //     [list_item]: false
    //   })
    // }
  },
  // 选中按钮
  checkboxChange: function (e) {
    var that = this
    // var eq = parseInt(e.currentTarget.dataset.index)
    // var list_item = "lists[" + eq + "].ischeck"
    // console.log(e, eq)
    // this.setData({
    //   [list_item]: !that.data.lists[eq].ischeck
    // })
  },
  // 底部全选、取消全选
  allcheck: function () {
    var that = this
    this.setData({
      isallcheck: !that.data.isallcheck
    })
    // for (var i in this.data.lists) {
    //   var list_item = "lists[" + i + "].ischeck"
    //   this.setData({
    //     [list_item]: that.data.isallcheck
    //   })
    // }
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
})