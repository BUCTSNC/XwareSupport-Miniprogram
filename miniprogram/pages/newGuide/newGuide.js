// pages/newGuide/newGuide.js
let that = this
let app = getApp()
const myRequest = require("../../utils/request")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfoAccess:false,
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
    NO:"",
    phone:"",
    realName:"",
    error:""
  },
  getUserInfo(res){
    console.log(res)
    if( "userInfo" in res.detail){
      this.setData({
        userInfoAccess:true
      })
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      let that = this
      wx.login({
        success(res){
          let code = res.code
          myRequest.request({
            insideUrl:"/login",
            data:{
              jscode:code
            },
            method:"GET",
            success:(res)=>{
              console.log(res)
              if(res.data.code===200){
                let userInfo = res.data.data.userInfo
                app.globalData.is_login = true
                app.globalData.personalInfo = userInfo.info
                console.log(app.globalData.personalInfo)
                that.setData({
                  NO:userInfo.info.NO,
                  phone:userInfo.info.phone,
                  realName:userInfo.info.realName,
                  formData:{
                    NO:userInfo.info.NO,
                    phoneNO:userInfo.info.phone,
                    name:userInfo.info.realName,
                  }
                })
              }else{
                that.setData({
                  error:"后端异常",
                })
              }
            },
            complete(res){
              wx.hideLoading()
            }
          })
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSetting({
      success (res) {
        console.log(res.authSetting)
        if(res.authSetting['scope.userInfo']){
          that.setData({
            userInfoAccess:true
          })
        }
      }
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
        console.log("不通过",errors)
        this.setData({
          error:errors[0].message
        })
      }else{
        if(!this.data.userInfoAccess){
          this.setData({
            error:"未授权信息"
          })
          return;
        }
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
                duration:2000,
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