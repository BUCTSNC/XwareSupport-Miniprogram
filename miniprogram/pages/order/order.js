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
    rules:{},
    haslogin:false,
    ProblemDetail:"",
    mainProblemList:[],
    mainProblemIndex:0,
    subProblemIndex:0,
    subProblemList:[],
    mainTosubProblem:{},
    tipMessage:{},
    date:[],
    dateIndex:0,
    slot:[],
    slotIndex:0,
    dateToslot:{},
  },
  mainProblemHandle(event){
    this.setData({
      mainProblemIndex:event.detail.value,
      subProblemList:this.data.mainTosubProblem[this.data.mainProblemList[event.detail.value]],
      subProblemIndex:0
    })
    if(this.data.tipMessage[this.data.mainProblemList[event.detail.value]]!=""){
      wx.showModal({
        showCancel:false,
        title:"相关提示",
        content:this.data.tipMessage[this.data.mainProblemList[event.detail.value]]
      })
    }
    
  },
  subProblemHandle(event){
    this.setData({
      subProblemIndex:event.detail.value
    })
  },
  dateHandle(event){
    this.setData({
      dateIndex:event.detail.value,
      slot:this.data.dateToslot[this.data.date[event.detail.value]],
      slotIndex:0,
    })

  },
  slotHandle(event){
    this.setData({
      slotIndex:event.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.is_login){
      this.setData({
        haslogin:true
      })
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
    this.setData({
      title:"Xware预约",
    formData:{},
    rules:{},
    haslogin:false,
    ProblemDetail:"",
    mainProblemList:[],
    mainProblemIndex:0,
    subProblemIndex:0,
    subProblemList:[],
    mainTosubProblem:{},
    tipMessage:{},
    date:[],
    dateIndex:0,
    slot:[],
    slotIndex:0,
    dateToslot:{},
    })
    if(app.globalData.is_login){
      this.setData({
        haslogin:true
      })
    }
    let that = this
    if(app.globalData.personalInfo.NO==""||app.globalData.personalInfo.phone==""||app.globalData.personalInfo.realName==""){
      wx.showModal({
        content:"您的信息不全,请先完善信息",
        showCancel:false,
        complete(){
          wx.navigateTo({
            url: "../setUserInfo/setUserInfo",
          })
        }

      })
      return
    }
    
    myRequest.request({
      insideUrl:"/timeSlotList",
      success(res){
        console.log(res)
        if(res.data.code === 200){
          let todate = []
          let mp = {}
          if(!( "data"  in res.data) || res.data.data.length==0 ){
            wx.showModal({
              content:"暂时无可预约时间段",
              showCancel:false,
              success(){
                wx.reLaunch({
                  url: '../index/index'
                })
              }
            })
            return
            
          }
          for(let i = 0;i < res.data.data.length;i++){
            let tslot = res.data.data[i]
            if(!(tslot.date in mp)){
              mp[tslot.date] = []
              todate.push(tslot.date)
            }
            mp[tslot.date].push(tslot)
          }
          myRequest.request({
            insideUrl:"/problems",
            success(res){
              console.log(res)
              if(res.data.code === 200){
                let main = []
                let mp = {}
                let message = {}
                for(let i = 0;i < res.data.data.length;i++){
                  let mainProblem = res.data.data[i]
                  main.push(mainProblem.type)
                  mp[mainProblem.type] = mainProblem.subs
                  message[mainProblem.type] = mainProblem.message
                }
                that.setData({
                  mainProblemList:main,
                  subProblemList:mp[main[that.data.subProblemIndex]],
                  mainTosubProblem:mp,
                  tipMessage:message
                })
                if(message[main[that.data.subProblemIndex]]!=""){
                  wx.showModal({
                    showCancel:false,
                    title:"相关提示",
                    content:message[main[that.data.subProblemIndex]]
                  })
                }
                
              }
            }
          })
          that.setData({
            date:todate,
            dateToslot:mp,
            slot:mp[todate[that.data.dateIndex]]
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
  submitInfo(){
    let problemInfo = this.data.mainProblemList[this.data.mainProblemIndex] + "-" + this.data.subProblemList[this.data.subProblemIndex]
    let time = this.data.date[this.data.dateIndex] + " - " +this.data.slot[this.data.slotIndex].slot
    let sid = this.data.slot[this.data.slotIndex].id
    let problemDetail = this.data.ProblemDetail
    wx.showModal({
      content:`每人每日只能预约一次,请确认您的预约信息:\r\n预约时间:${time}\r\n故障类型:${problemInfo}\r\n问题描述及留言:${problemDetail}`,
      cancelColor: 'cancelColor',
      success(){
        wx.showLoading({
          title: '提交中',
        })
        myRequest.request({
          method:"POST",
          insideUrl:"/Appointment",
          data:{
            problemType:problemInfo,
            sid:sid,
            ProblemDetail:problemDetail
          },
          success(res){
            console.log(res)
            if(res.data.code === 401){
              wx.hideLoading({
                success: (res) => {
                },
              })
              wx.showToast({
                duration:2000,
                icon:"error",
                title:res.data.msg
              })
            }else if(res.data.code === 200){
              wx.hideLoading({
                success: (res) => {
                },
              })
              wx.showToast({
                duration:2000,
                title:"提交申请成功"
              })
              wx.reLaunch({
                url: '../index/index',
                complete(){
                  wx.showLoading({
                    duration:2000,
                    title: '加载数据中',
                  })
                }
              })
            }else{
              wx.hideLoading({
                success: (res) => {
                },
              })
              wx.showToast({
                duration:2000,
                icon:"error",
                title:"后端异常"
              })
            }
          },
          
          fail(err){
            wx.hideLoading({
              success: (res) => {
              },
            })
            console.log(err)
            wx.showToast({
              icon:"error",
              title:"后端异常"
            })
          }
        })
      },
    })
  }
})