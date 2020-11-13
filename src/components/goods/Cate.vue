<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table class="treeTable" :data="catelist" :columns="columns" :show-index="true" index-text='#'
            :expand-type="false" :selection-type="false" border :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showCateRedact(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[5, 10, 15]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisble" width="50%" @close="addCateDialogClose">
            <!-- 添加分类 的表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <!--   options 用来指定数据源 props用来指定配置对象 -->
                <el-cascader expand-trigger="hover" :options="parentCateList" v-model="selectedKeys"
                :props="cascaderProps" @change="parentCateChanged" clearable change-on-select >
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisble = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改f分类对话框 -->
        <el-dialog
          title="编辑分类" :visible.sync="editCateVisible" width="50%" @close="editCateClosed">
          <el-form :model="editCateForm" :rules="addCateFormRule" ref="editCateRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editCateVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCate">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 指定列宽度
          width: '185px',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisble: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的登记默认为一级
        cat_level: 0
      },
      // 添加分类表单的校验规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      // 父级分类的数据列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 编辑分类对话框显示隐藏控制
      editCateVisible: false,
      // 编辑分类表单的校验规则对象
      addCateFormRule: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      // 这是查询到的要被编辑分类的信息对象
      editCateForm: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      //   console.log(res.data)
      // 把数据列表赋值给cateList
      this.catelist = res.data.result
      // 尾总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pagesize 每页显示多少条数据改变的事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      // 调用获取商品信息的函数，获取对应每页显示多少条数据的数据
      this.getCateList()
    },
    // 监听 pagenum 当前页面改变的事件
    handleCurrentChange(newpage) {
      this.querInfo.pagenum = newpage
      // 调用获取商品信息的函数，获取对应页码的数据
      this.getCateList()
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 先调用函数获取父级分类的列表
      this.getParentCateList()
      // 展示出对话框
      this.addCateDialogVisble = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message('获取父级分类数据失败')
      }
      //   console.log(res.data)
      this.parentCateList = res.data
      // console.log(this.parentCateList)
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // console.log(this.selectedKeys)
      // 如果 selectedKeys数组中的length 大于0  证明选中了父级分类
      // 反之没有选中 任何分类
      if (this.selectedKeys.length > 0) {
        // 已选择的父级分类的标签
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 已选择的父级分类的标签
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisble = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 显示编辑分类对话框
    async showCateRedact(Id) {
      // console.log(id)
      const { data: res } = await this.$http.get(`categories/${Id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类信息失败')
      }
      this.editCateForm = res.data
      this.editCateVisible = true
    },
    // 取消编辑后清空编辑对话框的数据
    editCateClosed() {
      this.$refs.editCateRef.resetFields()
    },
    // 确认修改分类名称
    editCate() {
      // 预校验通过发起网络请求修改分类数据
      console.log(this.editCateForm)
      this.$refs.editCateRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 通过发起修改请求
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类名称失败')
        }
        // 关闭对话框
        this.editCateVisible = false
        // 刷新列表
        this.getCateList()
        // 提示修改成功
        this.$message.success('编辑分类名称成功')
      })
    },
    // 删除分类项
    async removeCate(role) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消操作')
      }
      const { data: res } = await this.$http.delete(`categories/${role.cat_id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('已删除')
      // 刷新列表
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
    .treeTable {
        margin-top: 15px;
    }
    .el-cascader {
        width: 100%;
    }
</style>
