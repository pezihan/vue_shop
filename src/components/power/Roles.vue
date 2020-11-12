<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
        <!-- 添加角色按钮区 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="addRightVisible = true">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表区 -->
        <el-table :data="rolelist" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级权限 -->
                        <el-col :span="19">
                            <!-- 通过fo循环嵌套渲染二级权限 -->
                            <el-row :class="[ i2 === 0 ? '' : 'bdtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id"
                                    closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="285px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRight(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRigthDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
    <!-- 树形控件 -->
    <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all
    :default-checked-keys="defkeys" ref="treeRef"></el-tree>
    <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRightVisible" width="50%" @close="addRightClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addRightForm" :rules="addRightFormRules" ref="addRightFormRef" label-width="70px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addRightForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addRightForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addRightVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRight">确 定</el-button>
          </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
        <el-dialog
          title="修改角色" :visible.sync="editRightVisible" width="50%" @close="editRightClosed">
          <el-form :model="editRightForm" :rules="addRightFormRules" ref="editRightRef" label-width="70px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editRightForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editRightForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editRightVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRightInfo">确 定</el-button>
          </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制分配权限对话框显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defkeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 添加角色对话框隐藏显示
      addRightVisible: false,
      // 添加角色的表单数据
      addRightForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加表单验证
      addRightFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '名称的长度应在1~6个字符之间', trigger: 'blur' }
        ]
      },
      // 编辑角色对话框隐藏显示
      editRightVisible: false,
      // 这是查询到的角色信息对象
      editRightForm: {}
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消操作')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('已删除')
      // 直接将此节点上面的对象重新渲染 避免页面的完整渲染
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRigthDialog(role) {
      this.roleId = role.id
      // 获取所有权限饿数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色权限数据失败')
      }
      this.rightslist = res.data
      //   console.log(this.rightslist)
      // 调用递归函数获取三级接节点的id
      this.getLeafKeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式获取角色下所有三级权限的id，并保存到数组defkeys中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defkeys = []
    },
    // 点击尾角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',') // 将数组使用英文逗号拼接成字符串
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('更改权限失败')
      }
      this.$message.success('更改权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 点击确认按钮 添加角色
    addRight() {
      this.$refs.addRightFormRef.validate(async valid => {
        if (!valid) return
        // 预校验通过可以发起添加角色的网络请求
        const { data: res } = await this.$http.post('roles', this.addRightForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        // 隐藏添加角色对话框
        this.addRightVisible = false
        // 重新获取角色列表数据
        this.getRolesList()
      })
    },
    // 监听添加角色对话框的关闭事件 重置表单状态
    addRightClosed() {
      this.$refs.addRightFormRef.resetFields()
    },
    // 展示编辑角色信息的对话框
    async showEditDialog(Id) {
    //   console.log(roleId)
      const { data: res } = await this.$http.get(`roles/${Id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editRightForm = res.data
      this.editRightVisible = true
      console.log(this.editRightForm)
    },
    // 修改角色信息并提交
    editRightInfo() {
      // 预校验通过发起网络请求修改角色数据
      this.$refs.editRightRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 通过发起修改请求
        const { data: res } = await this.$http.put('roles/' + this.editRightForm.roleId, { roleName: this.editRightForm.roleName, roleDesc: this.editRightForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        // 关闭对话框
        this.editRightVisible = false
        // 刷新列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },
    // 监听编辑角色对话框的关闭事件 重置表单状态
    editRightClosed() {
      this.$refs.editRightRef.resetFields()
    },
    // 根据id删除对应的角色
    async removeRight(id) {
      // 弹框询问角色是否删除
      const confirmResult = await this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果确认删除，则返回值为字符串 confirm
      // 如果取消了删除，则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      // 删除成功刷新用户列表
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
