// components/navigation/navigation.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  pageLifetimes:{
    show(){

    }
  },
  lifetimes:{
    attached(){
      let pages = getCurrentPages()
      if(pages.length){
        let currentPage = pages[pages.length - 1]
        console.log(currentPage.route)
        for(let l in this.data.list){
          if((this.data.list[l].pagePath)==("/"+currentPage.route)){
            console.log(l)
            this.setData({selected:l})
          }
        }
        console.log(this.data.selected)
      }
      
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    selected:0,
    list:[
      {
        "text":"预约列表",
        "iconPath":"/images/iconfont-list.png",
        "selectedIconPath":"/images/iconfont-list-active.png",
        "pagePath":"/pages/index/index"
      },
      {
        "text":"预约",
        "iconPath":"/images/compose.png",
        "selectedIconPath":"/images/composeHL.png",
        "pagePath":"/pages/order/order"
      },
      {
        "text":"个人中心",
        "iconPath":"/images/iconfont-user.png",
        "selectedIconPath":"/images/iconfont-user-active.png"
      }
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e){
      let that = this
      console.log(e)
      wx.switchTab({
        url: e.detail.item.pagePath,
      })
      
    }
  }
})
