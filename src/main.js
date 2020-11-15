import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式标
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
// 配置请求的后端根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置axios拦截器添加token验证,保证拥有获取数据的权限(在请求头中添加token属性)
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 将富文本选择器注册为全局可用的组件
Vue.use(VueQuillEditor)

// 将时间处理函数挂在到vue的上全局可以使用(vue过滤器) 传入毫秒数转换成时间格式
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear() // 年
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月
  const d = (dt.getDate() + '').padStart(2, '0') // 日

  const hh = (dt.getHours() + '').padStart(2, '0') // 小时
  const mm = (dt.getMinutes() + '').padStart(2, '0') // 分
  const ss = (dt.getSeconds() + '').padStart(2, '0') // 秒
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
