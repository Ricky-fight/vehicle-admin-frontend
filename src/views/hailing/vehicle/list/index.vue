<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryForm" class="" label-width="75px">
        <el-row justify="end">
          <el-col :span="6">
            <el-form-item label="车型">
              <el-select
                v-model="queryForm.type"
                placeholder="选择车型"
                @change="handleVehicleSeriesChange"
              >
                <el-option
                  v-for="item in vehicleSeriesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="颜色">
              <el-select v-model="queryForm.color" placeholder="车身颜色">
                <el-option v-for="item in colorOptions" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="queryForm.status" placeholder="车辆状态">
                <el-option v-for="(statusCode, statusLabel) in statusMap" :key="statusCode" :label="statusCode" :value="statusLabel" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机">
              <el-input v-model="queryForm.driverName" placeholder="司机姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车架号">
              <el-input v-model="queryForm.vin" placeholder="车架号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号">
              <el-input v-model="queryForm.licenceNo" placeholder="车牌号" />
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
        <el-table-column prop="id" label="序号" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.licenceNo }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" align="center" width="50">
          <template slot-scope="scope">
            {{ scope.row.color | colorFilter }}
          </template>
        </el-table-column>
        <el-table-column label="车架号" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.vin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.type.brand }}
          </template>
        </el-table-column>
        <el-table-column label="车系" align="center">
          <template slot-scope="scope">
            {{ scope.row.type.series }}
          </template>
        </el-table-column>
        <el-table-column label="行驶证注册日期" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.certificate.registerDate }}
          </template>
        </el-table-column>
        <el-table-column label="检检有效期" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.certificate.inspectionDate }}
          </template>
        </el-table-column>
        <el-table-column label="司机" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.driverName }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ statusMap[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-link type="primary" style="margin-right: 5px" @click="(event) => onUpdate(scope.row, event)">更新</el-link>
            <el-link type="danger" @click="(event) => onDelete(scope.row.id, event)">删除</el-link>
          </template>
        </el-table-column>
        <!--        <el-table-column align="center" prop="created_at" label="Display_time" width="200">-->
        <!--          <template slot-scope="scope">-->
        <!--            <i class="el-icon-time" />-->
        <!--            <span>{{ scope.row.display_time }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
    <el-drawer
      :title="formType|titleFilter|addVehicleFilter"
      :visible.sync="drawerVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div class="drawer-container">
        <el-form :model="formData" ref="formData" :rules="rules" label-width="100px" label-position="left">
          <el-form-item label="序号" prop="id">
            <el-input v-model="formData.id" placeholder="系统内部序号" disabled />
          </el-form-item>
          <el-form-item label="车牌号" prop="licenceNo">
            <el-input v-model.trim="formData.licenceNo" placeholder="输入车牌号" clearable />
          </el-form-item>
          <el-form-item label="颜色" prop="color">
            <el-select v-model="formData.color" placeholder="选择颜色">
              <el-option v-for="item in colorOptions" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="车架号" prop="vin">
            <el-input v-model.trim="formData.vin" placeholder="输入车架号" clearable />
          </el-form-item>
          <el-form-item label="发动机号" prop="ein">
            <el-input v-model.trim="formData.ein" placeholder="输入发动机号" clearable />
          </el-form-item>
          <el-form-item label="车型" prop="type">
            <el-select
              v-model="formData.type"
              placeholder="选择车型"
              @change="handleVehicleSeriesChange"
            >
              <el-option
                v-for="item in vehicleSeriesOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button type="text" style="margin-left: 10px" @click="onCreate2VehicleSeries">新增</el-button>
          </el-form-item>
          <el-form-item label="行驶证日期" prop="certificate.registerDate">
            <el-date-picker
              v-model="formData.certificate.registerDate"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1"
            />
          </el-form-item>
          <el-form-item label="检验有效期" prop="certificate.inspectionDate">
            <el-date-picker
              v-model="formData.certificate.inspectionDate"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions2"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleDrawerConfirm">确 定</el-button>
        </div>
        <el-drawer
          title="新建车型"
          :visible.sync="innerDrawerVisible"
          width="50%"
          :before-close="handleClose"
          append-to-body
        >
          <div class="drawer-container">
            <el-form :model="innerFormData" label-position="left" label-width="100px">
              <el-form-item label="品牌">
                <el-input v-model.trim="innerFormData.brand" clearable />
              </el-form-item>
              <el-form-item label="车系">
                <el-input v-model.trim="innerFormData.series" clearable />
              </el-form-item>
              <el-form-item label="厂牌规格">
                <el-input v-model.trim="innerFormData.model" clearable />
              </el-form-item>
              <el-form-item label="核定载人数">
                <el-input v-model="innerFormData.seatCount" placeholder="输入数字" clearable>
                </el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handle2Close">取 消</el-button>
              <el-button type="primary" @click="handleInnerConfirm">确 定</el-button>
            </span>
          </div>

        </el-drawer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  createVehicle, createVehicleType,
  deleteVehicle,
  getVehicleList,
  getVehicleSeriesOptions,
  updateVehicle
} from '@/api/hailing/vehicle'
import { colorFilter, statusMap, statusTagFilter, titleFilter, vehicleStatusFilter } from '@/filters'
import { Message } from 'element-ui'
import { vehicleTemplate } from '@/utils/template'
function min(a, b) {
  return a < b ? a : b
}
export default {
  filters: {
    statusFilter: statusTagFilter,
    titleFilter,
    colorFilter,
    vehicleStatusFilter,
    addVehicleFilter(value) {
      return value + '车辆'
    }
  },
  data() {
    return {
      total: 0,
      renderList: null,
      list: null,
      listLoading: true,
      queryForm: {
        type: '',
        color: '',
        vin: '',
        licenceNo: '',
        driverName: ''
      },
      formType: '',
      formData: vehicleTemplate,
      rules: {
        type: {
          required: true, message: '请选择车型', trigger: 'change'
        },
        'certificate.registerDate': {
          required: true, message: '请选择行驶证注册日期', trigger: 'change'
        },
        'certificate.inspectionDate': {
          required: true, message: '请选择行驶证检验有效期日期', trigger: 'change'
        },
        licenceNo: {
          required: true, message: '请输入车牌号', trigger: 'change'
        },
        color: {
          required: true, message: '请输入车身颜色', trigger: 'change'
        },
        vin: {
          required: true, message: '请输入车架号', trigger: 'change'
        },
        ein: {
          required: true, message: '请输入发动机号', trigger: 'change'
        }
      },
      vehicleSeriesOptions: [],
      colorOptions: {},
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
      innerFormData: {
        brand: '',
        series: '',
        seatCount: '',
      },
      pageSize: null,
      currentPage: null,
      currentIndex: null,
      dialogVisible: false,
      dialog2Visible: false,
      drawerVisible: false,
      innerDrawerVisible: false
    }
  },
  computed: {
    statusMap() {
      return statusMap
    }
  },
  created() {
    this.fetchData()
    this.fetchVehicleSeries()
    this.colorOptions = [
      {
        value: 1,
        label: '黑'
      },
      {
        value: 2,
        label: '白'
      },
      {
        value: 3,
        label: '灰'
      }
    ]
    // this.formData = {
    //   id: '',
    //   type: null,
    //   certificate: {
    //     registerDate: '',
    //     inspectionDate: ''
    //   },
    //   licenceNo: '',
    //   color: '',
    //   vin: '',
    //   ein: '',
    //   driverName: ''
    // }
  },
  mounted() {
    console.log('mounted')
    console.log(this.formData)
    // console.log(this.formData.certificate)
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getVehicleList(this.queryForm).then(response => {
        this.total = response.data.count
        this.list = response.data.results
        this.pageSize = 10 // TODO:可选择的分页条数
        let length = 0
        if (this.list) {
          length = this.list.length
        }
        this.renderList = this.list.slice(0, min(this.pageSize, length))
        this.listLoading = false
        console.log(this.renderList)
      })
    },
    fetchVehicleSeries() {
      getVehicleSeriesOptions().then(response => {
        this.vehicleSeriesOptions = response.data || []
        console.log('车型选项')
        console.log(response.data)
      })
    },
    refresh() {
      this.fetchData()
      this.fetchVehicleSeries()
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
      this.drawerVisible = true
      this.$refs['formData'].resetFields()
    },
    onCreateVehicleSeries() {
      this.dialog2Visible = true
    },
    onCreate2VehicleSeries() {
      this.innerDrawerVisible = true
    },
    onSubmitCreateVehicleSeries() {
      this.dialog2Visible = false
    },
    handleInnerConfirm() {
      createVehicleType(this.innerFormData).then(response => {
        Message.success('新增车型成功')
      })
      this.innerDrawerVisible = false
    },
    onUpdate(entity) {
      this.formType = 'update'
      this.drawerVisible = true
      this.$nextTick(() => {
        this.formData.id = entity.id
        this.formData.vin = entity.vin
        this.formData.ein = entity.ein
        this.formData.type = entity.type.id
        this.formData.licenceNo = entity.licenceNo
        this.formData.color = entity.color
        this.formData.certificate.registerDate = entity.certificate.registerDate
        this.formData.certificate.inspectionDate = entity.certificate.inspectionDate
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.formData.resetFields()
          this.drawerVisible = false
          done()
        })
        .catch(_ => { })
    },
    handleDrawerConfirm() {
      this.$refs['formData'].validate((valid) => {
        if (!valid) {
          Message.error('请检查表单项！')
        } else {
          switch (this.formType) {
            // eslint-disable-next-line no-empty
            // case 'create': {
            // }
            //   break
            case 'update':
              updateVehicle(this.formData.id, this.formData).then(() => {
                this.$message.success('更新车辆成功')
                this.fetchVehicleSeries()
                this.fetchData()
              }).catch(error => {
                Message.error(error.message)
              })
              break
            case 'create':
              createVehicle(this.formData).then(() => {
                this.$message.success('创建车辆成功')
                this.fetchVehicleSeries()
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
    handle2Close(done) {
      this.$confirm('确认2关闭？')
        .then(_ => {
          this.dialog2Visible = false
        })
        .catch(_ => { })
    },
    handleVehicleSeriesChange(value) {
      console.log('选中车型id：' + value)
    },
    onDelete(id, event) {
      this.$confirm('此操作将永久删除该车辆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVehicle(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.refresh()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onSortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortById(order)
      }
    },
    sortById(order) {
      if (order === 'ascending') {
        this.list.sort(function(a, b) { return a.id - b.id })
      } else {
        this.list.sort(function(a, b) { return b.id - a.id })
      }
      // console.log(this.list)
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
.el-form--inline .el-form-item{
  margin-right: 0;
}
.drawer-container {
  margin: 20px;
}
</style>
