// pages/myHandleList/myHandleList.js
const myRequest = require("../../utils/request")
Page({

  data: {
    page:1,
    size:8,
    isend:false,
    handleList:[],
    scrollHeight:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    let that = this
    this.dataLoad()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let scrollHeight = windowHeight
    this.setData({
      scrollHeight:scrollHeight
    })
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
  dataLoad(){
    let that = this
    myRequest.request({
      insideUrl:"/myHandleEvent",
      data:{
        page:this.data.page,
        size:this.data.size
      },
      success(res){
        console.log(res)
        if(res.data.code === 200){
          if(res.data.data.length <5){
            that.setData({
              isend:true
            })
          }
          let myList = that.data.handleList
          for(let one of res.data.data){
            one.classType = that.textToClass(one.status)
            myList.push(one)
          }
          that.setData({
            handleList:myList,
            page:that.data.page+1
          })
        }else{
          that.setData({
            isend:true
          })
        }
        

      },
    })
  },
  toEnd(event){
    if(!this.data.isend)
    this.dataLoad()
  },
  textToClass(text){
    switch(text){
      case "正在维修":return "littleYellow";
      case "处理完成":return "green";
    }
  },
  jumpToDetail(event){
    let that = this
    if(this.data.handleList[event.currentTarget.dataset.id].status === "处理完成"){
      wx.navigateTo({
        url: `../eventExhibition/eventExhibition?eid=${that.data.handleList[event.currentTarget.dataset.id].id}`,
      })
    }else if(this.data.handleList[event.currentTarget.dataset.id].status === "正在维修"){
      wx.navigateTo({
        url: `../HandleInfo/HandleInfo?eid=${that.data.handleList[event.currentTarget.dataset.id].id}`,
      })
    }
    
  }
})