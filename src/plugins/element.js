import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// 导入弹框提示组件
// import { Message } from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input)
Vue.prototype.$message = Message
