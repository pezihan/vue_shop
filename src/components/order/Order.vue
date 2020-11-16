<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <el-row>
            <el-col :span="8">
              <el-input placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <!-- 订单列表数据区域 -->
          <el-table :data="orderlist" border stripe>
            <el-table-column  type="index"></el-table-column>
            <el-table-column label="订单编号" prop="order_number"></el-table-column>
            <el-table-column label="订单价格" prop="order_price"></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                <el-tag type="danger" v-else>未付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send"></el-table-column>
            <el-table-column label="下单时间" prop="create_time">
              <template slot-scope="scope">
                {{ scope.row.create_time | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160px">
              <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页区 -->
          <el-pagination @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="total"></el-pagination>
        </el-card>

        <!-- 修改地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
          <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
              <el-cascader expand-trigger="hover" :options="cityDate" v-model="addressForm.address1"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
              <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addressVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressVisible = false">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 展示物流进度的对话框 -->
        <el-dialog title="物流进度" :visible.sync="progtessVisible" width="50%">
          <!-- 物流时间线 -->
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in progressInfo"
              :key="index"
              :timestamp="activity.time">
              {{activity.context}}
            </el-timeline-item>
          </el-timeline>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="progtessVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
// 省市区数据导入
import cityDate from './citydata.js'
// 导入模拟的物流信息
import Information from './progressInfo.json'
export default {
  data() {
    return {
      // 订单请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单数据总条数
      total: 0,
      // 请求回来的订单数据
      orderlist: [],
      // 控制修改地址对话框的显示隐藏
      addressVisible: false,
      // 修改订单地址表单数据对象
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      // 省市区数据
      cityDate: cityDate,
      // 控制物流信息对话框的显示隐藏
      progtessVisible: false,
      // 获取到的物流信息数据
      progressInfo: []
    }
  },
  created() {
    this.gteOrderList()
  },
  methods: {
    // 获取订单列表数据
    async gteOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      // console.log(res.data)
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    // 分页栏每页侠显示数据条数发生变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.gteOrderList()
    },
    // 分页栏页码值发生变化
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.gteOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // if (res.meta.status !== 200) {
      //   this.$message.error('获取物流信息失败')
      // }
      // this.progressInfo = res.data

      this.progressInfo = Information.data
      if (this.progressInfo === null) {
        return this.$message.error('获取物流信息失败')
      }
      this.progtessVisible = true
      // console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
  //  /deep/ less的样式穿透  scss的样式穿透为：::v-deep
  /deep/.el-table td,/deep/.el-table th{
    text-align: center !important;
  }
  .el-cascader {
    width: 100%;
  }
</style>
