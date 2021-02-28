const baseUrl = getApp().globalData.requestBaseURL
const request = function (obj) {
  let url = ""
  if(obj.insideUrl){
    url = baseUrl+obj.insideUrl
  }
  if(obj.outsideUrl){
    url = obj.outsideUrl
  }
  let key = 'cookie'
  let cookie = wx.getStorageSync(key);
  if (!('success' in obj)){
    obj.success = function(res){
    }
  }
  if (!('fail' in obj)) {
      obj.fail = function (err) {
      }
  }
  if (!('complete' in obj)) {
      obj.complete = function (res) {
      }
  }


  wx.request({
      url: url,
      data: obj.data,
      method: obj.method,
      header: {
          "Cookie": cookie,
          ...obj.ContentType,
      },
      success: res => {
          if (res.header) {
              if ('Set-Cookie' in res.header) {
                  wx.setStorageSync(key, res.header['Set-Cookie']);
              }
              else if ('set-cookie' in res.header) {
                  wx.setStorageSync(key, res.header['set-cookie'])
              }
          }
          obj.success(res);
      },
      fail: err => {
          obj.fail(err);
      },
      complete: res => {
          obj.complete(res);
      }
  });
}
const upLoadFile = function(obj){
  let url = ""
  if(obj.insideUrl){
    url = baseUrl+obj.insideUrl
  }
  if(obj.outsideUrl){
    url = obj.outsideUrl
  }
  let key = 'cookie'
  let cookie = wx.getStorageSync(key);
  if (!('success' in obj)){
    obj.success = function(res){
    }
  }
  if (!('fail' in obj)) {
      obj.fail = function (err) {
      }
  }
  if (!('complete' in obj)) {
      obj.complete = function (res) {
      }
  }
  wx.uploadFile({
    filePath: obj.filePath,
    name: obj.name,
    url: url,
    formData: obj.data,
    header: {
      "Cookie": cookie,
      ...obj.ContentType,
  },
  success: res => {
      if (res.header) {
          if ('Set-Cookie' in res.header) {
              wx.setStorageSync(key, res.header['Set-Cookie']);
          }
          else if ('set-cookie' in res.header) {
              wx.setStorageSync(key, res.header['set-cookie'])
          }
      }
      obj.success(res);
  },
  fail: err => {
      obj.fail(err);
  },
  complete: res => {
      obj.complete(res);
  }
  })
}
module.exports = {
  request: request,
  uploadFile:upLoadFile
}