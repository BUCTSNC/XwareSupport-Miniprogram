//index.js
const app = getApp()
const myRequest = require("../../utils/request")
Page({
  data: {
    userInfo: {},
    logged: false,
    allAppointment:[],
    completeAppointment:null,
    incompleteAppointment:null
  },
  onLoad: function() {
    let that = this
    wx.login({
      success:(res)=>{
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
              that.setData({
                logged:true
              })
              app.globalData.personalInfo = userInfo.info
              console.log(app.globalData.personalInfo)
              that.onShow()
              if(userInfo.isNew){
                wx.navigateTo({
                  url: '../newGuide/newGuide',
                })
              }
            }else{
              console.log("后端异常")
            }
          },
          complete(res){
          }
        })
      },
      error: (err) => {
        console.log(res)
      },
    })
    wx.getSetting({
      success: res => {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '../newGuide/newGuide',
          })
        }
      }
    })
  },
  onShow:function(){
    let that = this
    myRequest.request({
      insideUrl:"/myAppointment",
      success(res){
        if(res.data.code === 401){
          wx.showToast({
            duration:2000,
            icon:"error",
            title: '未登录',
          })
        }else if(res.data.code === 200){
            let Appointments = res.data.data
            let to = []
            let final = []
            for(let one of Appointments){
              one.textStatus = that.numToTextStatus(one.status)
              one.classType = that.numToClassType(one.status)
              if(one.status<4){
                to.push(one)
              }else{
                final.push(one)
              }
            }
            that.setData({
              allAppointment:Appointments,
              completeAppointment:final,
              incompleteAppointment:to
            })
        }else{
          wx.showToast({
            duration:2000,
            icon:"error",
            title: '后端异常',
          })
        }
      },complete(res){
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  jumpToDetail(event){
    wx.navigateTo({
      url: `../appointment/appointment?aid=${event.currentTarget.dataset.id}`,
    })
  },
  numToTextStatus(num){
    switch(num){
      case 0:return "正在预约";
      case 1:return "预约成功";
      case 2:return "签到成功";
      case 3:return "正在维修";
      case 4:return "维修完成";
      case 5:return "预约失效";
      case 6:return "预约失败";
      default:return "未知状态";
    }
  },
  numToClassType(num){
    switch(num){
      case 0:return "littleYellow";
      case 1:return "green";
      case 2:return "green";
      case 3:return "littleYellow";
      case 4:return "green";
      case 5:return "gray";
      case 6:return "gray";
      default:return "red";
    }
  }
})
