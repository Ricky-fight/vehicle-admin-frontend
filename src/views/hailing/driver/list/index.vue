<template>
  <div class="app-container">
    <el-card class="box-card">
      <!--      <el-row type="flex" justify="end">-->
      <el-form :model="queryForm" class="" label-width="100px">
        <el-row justify="end">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="queryForm.name" placeholder="司机姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="做单手机号">
              <el-input v-model="queryForm.phone1" placeholder="输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址">
              <el-input v-model="queryForm.address" placeholder="输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="车牌号">
              <el-input v-model="queryForm.driverName" placeholder="输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车型">
              <el-cascader
                v-model="queryForm.vehicleSeries"
                placeholder="选择车型"
                :options="vehicleSeriesOptions"
                @change="handleVehicleSeriesChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶证日期">
              <el-date-picker
                v-model="queryForm.registerDate"
                type="daterange"
                format="M 月 dd 日"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="75px" inline align="right">
        <el-form-item class="form-btns">
          <el-button type="primary" @click="onSubmitQuery">查询</el-button>
        </el-form-item>
        <el-form-item class="form-btns">
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
        <el-form-item class="form-btns">
          <el-button type="primary" @click="onCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-table
        v-loading="listLoading"
        :data="renderList"
        element-loading-text="Loading"
        border
        fit
        stripe
        highlight-current-row
      >
        <el-table-column label="司机姓名" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="身份证号" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.idNo }}
          </template>
        </el-table-column>
        <el-table-column label="做单手机号" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.phone1 }}
          </template>
        </el-table-column>
        <el-table-column label="联系手机号" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.phone2 }}
          </template>
        </el-table-column>
        <el-table-column label="紧急联系人手机号" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.phone3 }}
          </template>
        </el-table-column>
        <el-table-column label="联系地址" align="center">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="绑定车辆" align="center" width="150">
          <template slot-scope="scope">
            {{  }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-link type="primary" style="margin-right: 5px" @click="(event) => onUpdate(scope.row, event)">更新</el-link>
            <el-link type="danger" @click="(event) => onDelete(scope.row.id, event)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-bottom: 8px" />
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        align="right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog :title="formType|titleFilter|appendFilter" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form ref="formData" :model="formData" :rules="rules" label-width="125px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model.trim="formData.name" placeholder="输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idNo">
              <el-input v-model.trim="formData.idNo" placeholder="输入身份证号" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="做单手机号" prop="phone1">
              <el-input v-model.trim="formData.phone1" placeholder="输入手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系手机号" prop="phone2">
              <el-input v-model.trim="formData.phone2" placeholder="输入手机号" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="紧急联系人" prop="phone3">
              <el-input v-model.trim="formData.phone3" placeholder="输入手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系地址" prop="address" clearable>
              <el-input v-model="formData.address" placeholder="输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>-->
<!--          <el-col :span="24">-->
<!--            <el-form-item label="驾驶证初登日期" prop="registerDate">-->
<!--              <el-date-picker-->
<!--                v-model="createForm.registerDate"-->
<!--                align="right"-->
<!--                type="date"-->
<!--                placeholder="选择日期"-->
<!--              />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleFormConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createDriver, deleteDriver, getDriverList, updateDriver } from '@/api/hailing/driver'
import { titleFilter } from '@/filters'
import { Message } from 'element-ui'
import { driverTemplate } from '@/utils/template'
function min(a, b) {
  return a < b ? a : b
}
export default {
  filters: {
    titleFilter,
    appendFilter(value) {
      return value + '司机'
    },
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'gray',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      total: 0,
      renderList: null,
      list: null,
      listLoading: true,
      queryForm: {
        name: '',
        phone1: '',
        phone2: '',
        emergencyPhone: '',
        address: '',
        registerDate: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '未来一个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            end.setMonth(end.getMonth() + 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '未来两个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            end.setMonth(end.getMonth() + 2)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '未来三个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            end.setMonth(end.getMonth() + 3)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      formType: '',
      formData: driverTemplate,
      rules: {
        name: {
          required: true, message: '姓名为必填项', trigger: 'blur'
        },
        idNo: {
          required: true, message: '身份证号为必填项', trigger: 'blur'
        }
      },
      vehicleSeriesOptions: [],
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      pickerOptions2: {
        shortcuts: [{
          text: '一年后',
          onClick(picker) {
            const d = new Date()
            d.setFullYear(d.getFullYear() + 1)
            picker.$emit('pick', d)
          }
        }, {
          text: '四年后',
          onClick(picker) {
            const d = new Date()
            d.setFullYear(d.getFullYear() + 4)
            picker.$emit('pick', d)
          }
        }]
      },
      statusMap: {
        0: '已解约',
        1: '已签约'
      },
      pageSize: null,
      currentPage: null,
      dialogVisible: false,
      dialog2Visible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDriverList(this.queryForm).then(response => {
        this.total = response.data.count
        this.list = response.data.results
        this.pageSize = 10 // TODO:可选择的分页条数
        this.renderList = this.list.slice(0, min(this.pageSize, this.list.length))
        console.log(this.renderList)
        this.listLoading = false
      })
    },
    onSubmitQuery() {
      this.fetchData()
    },
    onReset() {
      console.log(this.queryForm)
      this.queryForm = {
        user: '',
        region: ''
      }
      console.log(this.queryForm)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 0
      this.handleCurrentChange(0)
      console.log(`每页 ${val} 条`)
      console.log(`pageSize = ${this.pageSize}`)
    },
    handleCurrentChange(val) {
      const index = val === 0 ? val : val - 1
      this.renderList = this.list.slice(index * this.pageSize, min((index + 1) * this.pageSize, this.list.length))
      console.log(`当前页: ${val}`)
    },
    onCreate() {
      this.formType = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['formData'].resetFields()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible = false
          done()
        })
        .catch(_ => { })
    },
    handleFormConfirm() {
      this.$refs['formData'].validate((valid) => {
        if (!valid) {
          Message.error('请检查表单项！')
        } else {
          switch (this.formType) {
            case 'update':
              updateDriver(this.formData.id, this.formData).then(() => {
                this.$message.success('更新司机成功')
                this.fetchData()
              }).catch(error => {
                Message.error(error.message)
              })
              break
            case 'create':
              createDriver(this.formData).then(() => {
                this.$message.success('创建司机成功')
                this.fetchData()
              })
              break
            default:
              break
          }
          this.drawerVisible = false
        }
      })
    },
    handleVehicleSeriesChange(value) {
      console.log(value)
    },
    status(vehicle) {
      if (vehicle && vehicle.licence) {
        return this.statusMap[1]
      }
      return this.statusMap[0]
    },
    onUpdate(entity) {
      this.formType = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.formData = { ...entity }
      })
    },
    onDelete(id) {
      this.$confirm('此操作将永久删除该司机, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDriver(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style>
.box-card {
    border-radius: 10px;
    margin-bottom: 10px;
}

.form-btns {
    margin-left: 10px;
}

.el-form--inline .el-form-item {
    margin-right: 0;
}
</style>
