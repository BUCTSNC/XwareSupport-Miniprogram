// pages/eventExhibition/eventExhibition.js
const myRequest = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eid:0,
    index:0,
    describe:"",
    date:"",
    slot:"",
    problemType:"",
    uuid:"",
    detectInfo:"",
    detectProblemType:"",
    finalStatus:"",
    handleWay:"",
    images:[],
    handler:null,
    handleTime:"",
    handleClasstype:"",
    appointmentClassType:"",
    appointmentStatus:"",
    handleStatus:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      eid:options.eid,
    })
    console.log(options)
    
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
    let that = this
    myRequest.request({
      insideUrl:"/Event",
      data:{
        eid:that.data.eid
      },
      success(res){
        console.log(res)
        let data = res.data.data
        let images = []
        for(let img of res.data.data.attachImage){
          images.push({url:img.url})
        }
        that.setData({
          describe:data.Appointment.describe,
          date:data.Appointment.meta.date,
          slot:data.Appointment.meta.slot,
          problemType:data.Appointment.meta.problemType,
          uuid:data.Appointment.uuid,
          detectInfo:data.detectInfo,
          detectProblemType:data.detectProblemType,
          finalStatus:data.finalStatus,
          handleWay:data.handleWay,
          images:images,
          handler:data.Handler,
          handleTime:data.handleTime,
          handleStatus:data.status,
          handleClasstype:that.textToClass(data.status),
          appointmentClassType:that.numToClassType(data.Appointment.meta.status),
          appointmentStatus:that.numToTextStatus(data.Appointment.meta.status)
        })
      }
    })
  },
  textToClass(text){
    switch(text){
      case "正在维修":return "littleYellow";
      case "处理完成":return "green";
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

})