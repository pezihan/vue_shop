import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  Upload
} from 'element-ui'
// 导入弹框提示组件
// import { Message } from 'element-ui'

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message // 弹窗组件必须挂在在vue的原型上
Vue.use(Button).use(Form).use(FormItem).use(Input).use(Container).use(Header).use(Aside).use(Main).use(Menu).use(Submenu).use(MenuItem)
Vue.use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Row).use(Col).use(Table).use(TableColumn).use(Switch).use(Tooltip).use(Pagination).use(Dialog)
Vue.use(Tag).use(Tree).use(Select).use(Option).use(Cascader).use(Alert).use(Tabs).use(TabPane).use(Step).use(Steps)
Vue.use(Checkbox).use(CheckboxGroup).use(Upload)
