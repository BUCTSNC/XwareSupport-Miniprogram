const request = require("../../utils/request")

// pages/HandleInfo/HandleInfo.js
const myRequest = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eid:0,
    formats: {},
    readOnly: false,
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    thisEditor:"",
    color: '#000',
    background: '#f8f8f8',
    show: true,
    windowHeight:1500,
    thisTitle:"事件处理",
    pickerRange:['正在维修', '处理完成'],
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      eid:options.eid,
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
    console.log(options)
    myRequest.request({
      insideUrl:"/Event",
      data:{
        eid:options.eid
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
          images:images
        })
        wx.createSelectorQuery().select('#detectInfo').context(function (res) {
          res.context.setContents({
            html:data.detectInfo
          })
        }).exec()
        wx.createSelectorQuery().select('#finalStatus').context(function (res) {
          res.context.setContents({
            html:data.finalStatus
          })
        }).exec()
        wx.createSelectorQuery().select('#handleWay').context(function (res) {
          res.context.setContents({
            html:data.handleWay
          })
        }).exec()
      }
    })
    let windowHeight = wx.getSystemInfoSync().windowHeight
    this.setData({
      windowHeight:windowHeight
    })
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
  },
  onShow: function () {

  },
  onEditorFocus(event) {
    const that = this
    console.log(event)
    wx.createSelectorQuery().select('#'+event.currentTarget.id).context(function (res) {
      that.editorCtx = res.context
      res.context.scrollIntoView()
      that.setData({
        thisEditor:event.currentTarget.id
      })
      if(event.currentTarget.id === "handleWay"){
        that.setData({
          thisTitle:"处理方法"
        })
      }else if(event.currentTarget.id === "detectInfo"){
        that.setData({
          thisTitle:"检测与推断"
        })
      }else if(event.currentTarget.id === "finalStatus"){
        that.setData({
          thisTitle:"最终结果"
        })
      }
    }).exec()
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  blur(event) {
    console.log(event)
    this.setData({
      thisEditor:"",
      thisTitle:"事件处理"
    })
    this.editorCtx.blur()
    return false;
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage(event) {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.showLoading({
          title: '插入中',
        })
        myRequest.uploadFile({
          insideUrl:"/image",
          data:{
            eid:that.data.eid,
            type:that.data.thisEditor,
          },
          filePath:res.tempFilePaths[0],
          name:"img",
          success(result){
            console.log(result)
            let resdata = JSON.parse(result.data)
            if(resdata.code === 200){
              that.editorCtx.insertImage({
                src: resdata.data,
                data: {
                },
                width: '50%',
                height:"50%",
                success: function () {
                  console.log('insert image success')
                }
              })
            }else{
              wx.showToast({
                icon:"error",
                title: '上传失败',
              })
            }
          },
          fail(err){
            wx.showToast({
              icon:"error",
              title: '上传失败',
            })
          },
          complete(){
            wx.hideLoading({
              success: (res) => {
                
              },
            })
          }
        })
        
      }
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  selectChange(event){
    this.setData({
      index:event.detail.value
    })
  },
  richTextChange(event){
    console.log(event)
    let toUpdate = {}
    toUpdate[event.currentTarget.id] = event.detail.html
    this.setData(toUpdate)
  },
  submit(){
    let data = {
      eid : this.data.eid,
      detectProblemType : this.data.detectProblemType,
      detectInfo : this.data.detectInfo,
      handleWay : this.data.handleWay,
      finalStatus : this.data.finalStatus,
      status:this.data.pickerRange[this.data.index]
    }
    wx.showLoading({
      title: '正在上传后端',
    })
    myRequest.request({
      insideUrl:"/Event",
      method:"POST",
      data:data,
      success(res){
        if(res.data.code === 200){
          wx.showToast({
            duration:2000,
            title: '提交成功',
          })
          if(data.status === "处理完成"){
            
            wx.reLaunch({
              url: '../myHandleList/myHandleList',
            })
          }else{
            wx.showToast({
              duration:2000,
              icon:"error",
              title: res.data.msg,
            })
          }
        }
      },
      complete(res){
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            that.setData({
                files: that.data.files.concat(res.tempFilePaths)
            });
        }
    })
},
previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
    })
},
selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
},
uplaodFile(files) {
  let that = this
    let promistList = []
    for(let url of files.tempFilePaths){
      promistList.push(new Promise((resolve, reject)=>{
        myRequest.uploadFile({
          insideUrl:"/image",
          data:{
            eid:that.data.eid,
            type:"attach"
          },
          filePath:url,
          name:"img",
          success(result){
            console.log(result)
            let resultdata = JSON.parse(result.data)
            if(resultdata.code === 200)
            resolve(resultdata.data)
            else
            resolve(undefined)
          },
          fail(err){
            console.log(err)
          }
        })
      }))
    }
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      Promise.all(promistList).then((res,rej)=>{
        resolve({urls:res})
      })
    })
},
uploadError(e) {
    console.log('upload error', e.detail)
},
uploadSuccess(e) {
    let attachList = this.data.images
    for(let url of e.detail.urls){
      attachList.push({url:url})
    }
    this.setData({images:attachList})
}
  
})