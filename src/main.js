import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式标
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
