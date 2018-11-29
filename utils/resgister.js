const phonereg = /^[1][3,4,5,7,8][0-9]{9}$/, codereg = /\d{4}/, pwdreg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
let time = 0, timer;
const  regfun={
  input: function (e) {
    let name = e.currentTarget.dataset.name;
    switch (name) {
      case 'phone':
        this.setData({
          phone: e.detail.value
        })
        if (this.data.phone.length == 11 && this.data.cachephone.indexOf(this.data.phone) < 0) {
          this.data.cachephone.unshift(this.data.phone)
          wx.setStorage({
            key: 'phone',
            data: this.data.cachephone.slice(0, 2)
          })
        }
        break;
      case 'code':
        this.setData({
          code: e.detail.value
        })
        break;
      case 'pwd':
        this.data.pwd[e.currentTarget.dataset.pwd] = e.detail.value;
        this.setData({
          pwd: this.data.pwd
        })
        break;
    }
  },
  blur: function (e) {
    let name = e.currentTarget.dataset.name;
    switch (name) {
      case 'phone':
        this.setData({
          phoneblur: false,
          codestate: false
        })
        if (!this.data.phone || !regfun.regphone.call(this)) {
          return;
        }
        this.setData({
          codestate: true
        })
        break;
      case 'code':
        if (!this.data.code || !regfun.hasphone.call(this) || !regfun.regphone.call(this) || !regfun.regcode.call(this)) { return }
        break;
      case 'pwd':
        if (!this.data.pwd[e.currentTarget.dataset.pwd] || !regfun.regpwd.call(this,e.currentTarget.dataset.pwd)) { return; }
        break;
    }
  },
  focus: function (e) {
    let _this = this;
    let name = e.currentTarget.dataset.name;
    switch (name) {
      case 'phone':
        wx.getStorage({
          key: 'phone',
          success: function (res) {
            _this.setData({
              cachephone: res.data
            })
            console.log('chche', res.data)
          }
        })
        this.setData({
          phoneblur: true
        })
        break;
    }
  },
  changephone: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      phone: this.data.cachephone[index]
    })
    if (!regfun.regphone.call(this)) { return; }
    this.setData({
      codestate: true
    })
  },
  clearphone: function () {
    this.setData({
      phone: '',
      codestate: false
    })
  },
  delphocache: function (e) {
    let index = e.currentTarget.dataset.index;
    this.data.cachephone.splice(index, 1)
    wx.setStorage({
      key: 'phone',
      data: this.data.cachephone
    })
    this.setData({
      cachephone: this.data.cachephone
    })
  },
  regphone: function () {
    if (!phonereg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //获取接口返回逻辑
    let res = '0';
    if (res == 1) {
      wx.showToast({
        title: '该手机号已被注册',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  hasphone: function () {
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  hascode: function () {
    if (!this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  regcode: function () {
    let _this=this;
    if (!codereg.test(this.data.code)) {
      wx.showToast({
        title: '请输入正确验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //接口
    if (this.data.code != '1111') {
      this.data.codefail++;
      this.setData({
        codefail: this.data.codefail
      })
      if (this.data.codefail >= 5) {
        wx.getStorage({
          key: 'codetime',
          complete: function (res) {
            if (!res.data) {
              let date = new Date(), timestamp = date.getTime() + 10 * 60 * 1000;
              wx.setStorage({
                key: 'codetime',
                data: timestamp
              })
              wx.showToast({
                title: '验证码错误5次，请9分59秒后重试',
                icon: 'none',
                duration: 2000
              })
            } else {
              let date = new Date(), timestamp = date.getTime(), codetime = res.data,
                timespace = (codetime - timestamp) / 1000,
                minute = timespace > 0 ? parseInt(timespace / 60) : '',
                second = timespace > 0 ? parseInt(timespace - 60 * minute) : '';
              if (timespace <= 0) {
                _this.setData({
                  codefail: 0
                })
              } else {
                wx.showToast({
                  title: '验证码错误5次，请' + minute + '分' + second + '秒后重试',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          }
        })
      } else {
        wx.showToast({
          title: '验证码错误' + _this.data.codefail + '次',
          icon: 'none',
          duration: 2000
        })
      }
      return false;
    }
    return true;
  },
  getcode: function () {
    if (!this.hasphone()) { return; }
    if (time > 0) { return; }
    time = 60;
    clearInterval(timer);
    timer = setInterval(function () {
      if (time <= 0) {
        clearInterval(timer);
      } else {
        time--;
        _this.setData({
          time: time
        })
      }
    }, 1000)
  },
  regpwd: function (name) {
    if (!pwdreg.test(this.data.pwd[name])) {
      wx.showToast({
        title: '密码格式为6-16位字母+数字',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  togglepwd: function () {
    this.setData({
      showpwd: !this.data.showpwd
    })
  },
}
module.exports = { regfun: regfun };