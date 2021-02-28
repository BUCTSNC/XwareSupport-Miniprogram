// pages/bindFunctionary/bindFunctionary.js
const myRequest = require("../../utils/request")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    password:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  submitForm(){
    let password = this.data.password
    let username = this.data.username
    console.log(username,password)
    wx.showLoading({
      title: '请求中',
    })
    myRequest.request({
      insideUrl:"/bindFunctionary",
      method:"POST",
      data:{
        password,
        username,
      },
      success(res){
        if(res.data.code===200){
          console.log("绑定成功",res)
          let userInfo = res.data.data.userInfo
          app.globalData.is_login = true
          app.globalData.personalInfo = userInfo.info
          wx.navigateBack({})
        }else if(res.data.code===401){
          wx.showToast({
            duration:2000,
            icon:"error",
            title: '权限异常',
          })
        }else{
          wx.showToast({
            duration:2000,
            icon:"error",
            title: '后端异常',
          })
        }
      },
      fail(res){
        wx.showToast({
          duration:2000,
          icon:"error",
          title: '后端异常',
        })
      },
      complete(res){
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  usernameHandle(event){
    console.log(event)
    this.setData({
      username:event.detail.value
    })
  },
  passwordHandle(event){
    console.log(event)
    this.setData({
      password:event.detail.value
    })

  }
})