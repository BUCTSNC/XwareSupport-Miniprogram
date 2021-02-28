// pages/info/info.js
let app = getApp()
const myRequest = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:"../../images/akari.jpg",
    name:"未命名",
    NO:"unknown",
    functionaryInfo:null,
  },
  toSetUserInfo:()=>{
    wx.navigateTo({
      url: '../setUserInfo/setUserInfo',
    })
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
    if(app.globalData.is_login){
      console.log(app.globalData.personalInfo)
      this.setData({
        NO:app.globalData.personalInfo.NO,
        functionaryInfo:app.globalData.personalInfo.functionaryInfo
      })
    }
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatar:res.userInfo.avatarUrl,
                name:res.userInfo.nickName,
              })
            }
      })
    }else{
      wx.navigateTo({
        url: '../newGuide/newGuide',
      })
    }
  }
  })
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
  jumpTobind(){
    wx.navigateTo({
      url: '../bindFunctionary/bindFunctionary',
    })
  },
  myEvent(){
    wx.navigateTo({
      url: '../myHandleList/myHandleList',
    })
  },
  scanCode(){
    wx.scanCode({
      scanType:"qrCode",
      success(res){
        console.log(res)
        wx.showLoading({
          title: '正在上传后端',
        })
        myRequest.request({
          insideUrl:"/startEvent",
          data:{
            uuid:res.result
          },
          success(res){
            if(res.data.code === 401){
              wx.showToast({
                duration:2000,
                icon:"error",
                title: res.data.msg,
              })
            }else if(res.data.code === 200){
              console.log(res.data.data.eid)
              wx.navigateTo({
                url: `../HandleInfo/HandleInfo?eid=${res.data.data.eid}`,
              })
            }else{
              wx.showToast({
                duration:2000,
                icon:"error",
                title: "后端异常",
              })
            }
          },
          complete(res){
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
        
      }
    })
  }
})