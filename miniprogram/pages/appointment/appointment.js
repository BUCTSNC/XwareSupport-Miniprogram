// pages/appointment/appointment.js
const myRequest = require("../../utils/request")
const qrcode = require("../../utils/qrcode")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    appointmentInfo:null,
    describe:"",
    uuid:"",
    status:{},
    allevents:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    let qrsize = this.setCanvasSize()
    wx.showLoading({
      title: '加载中',
    })
    myRequest.request({
      insideUrl:"/Appointment",
      data:{
        aid:options.aid,
      },
      success(res){
        if(res.data.code===200){
          console.log(res.data)
          that.setData({
            describe:res.data.data.describe,
            appointmentInfo:res.data.data.meta,
            uuid:res.data.data.uuid,
            userInfo:res.data.data.user,
            status:{
              Text:that.numToTextStatus(res.data.data.meta.status),
              classType:that.numToClassType(res.data.data.meta.status)
            },
            allevents:res.data.data.eidWithHandle
          })
          qrcode.api.draw(res.data.data.uuid,"qrcode",qrsize.h,qrsize.w,that)
        }else{
          wx.showToast({
            duration:2000,
            icon:"error",
            title: '后端异常',
          })
        }
      },
      complete(res){
        wx.hideLoading({
          success: (res) => {},
        })
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
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 400; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
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
  },
  toEvent(){
    if(this.data.allevents.length === 1){
      wx.navigateTo({
        url: `../eventExhibition/eventExhibition?eid=${this.data.allevents[0].id}`,
      })
    }else{
      let that = this
      let ActionSheet = []
      for(let e of this.data.allevents){
        ActionSheet.push(`${e.id}:  ${e.handlerName}`)
      }
      wx.showActionSheet({
        itemList: ActionSheet,
        success(res){
          console.log(res)
          wx.navigateTo({
            url: `../eventExhibition/eventExhibition?eid=${that.data.allevents[res.tapIndex].id}`,
          })
        }
      })
    }
  }
})