// pages/order/order.js
const app = getApp()
const myRequest = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"Xware预约",
    formData:{},
    rules:[
      {
        name:"phoneNO",
        rules: [
          {required: true, message: '手机号码必填'}, 
          {mobile: true, message: '手机号码格式不对'}
        ]
      },
      {
        name:"NO",
        rules:[{required:true, message: "学号/工号必填"}]
      },
      {
        name:"name",
        rules:[{required:true, message: "姓名必填"}]
      },
    ],
    haslogin:false,
    NO:"",
    phone:"",
    realName:"",
    error:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.is_login){
      this.setData({
        haslogin:true,
        NO:app.globalData.personalInfo.NO,
        phone:app.globalData.personalInfo.phone,
        realName:app.globalData.personalInfo.realName,
        formData:{
          NO:app.globalData.personalInfo.NO,
          phoneNO:app.globalData.personalInfo.phone,
          name:app.globalData.personalInfo.realName,
        }
      })
    }else{
      
    }
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
      this.setData({
        haslogin:true,
        NO:app.globalData.personalInfo.NO,
        phone:app.globalData.personalInfo.phone,
        realName:app.globalData.personalInfo.realName,
        formData:{
          NO:app.globalData.personalInfo.NO,
          phoneNO:app.globalData.personalInfo.phone,
          name:app.globalData.personalInfo.realName,
        }
      })
    }else{
      
    }
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
  onGetUserInfo: function(e) {
    this.getUserInfo()
  },
  getUserInfo(){
    wx.getUserInfo({
      success: res => {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo:res.userInfo,
          logged:true
        })
      }
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
        [`formData.${field}`]: e.detail.value
    })
},
  submitForm(){
    this.selectComponent("#form").validate((valid, errors)=>{
      console.log(valid,errors)
      if(!valid){
        console.log("不通过")
        this.setData({
          error:errors[0].message
        })
      }else{
        console.log(this.data.formData)
        wx.showLoading({
          title: '提交中',
        })
        myRequest.request({
          insideUrl:"/setpersonalInfo",
          method:"POST",
          data:{
            realName:this.data.formData.name,
            NO:this.data.formData.NO,
            phone:this.data.formData.phoneNO,
          },
          success:(res)=>{
            console.log(res)
            if(res.data.code===200){
              app.globalData.personalInfo = res.data.data.userInfo.info
              wx.navigateBack()
            }else{
              wx.showToast({
                title: '后端异常',
                icon:"error"
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
