<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryForm" class="" label-width="75px">
        <el-row justify="end">
          <el-col :span="6">
            <el-form-item label="车型">
              <el-cascader
                v-model="queryForm.vehicleSeries"
                :options="vehicleSeriesOptions"
                @change="handleVehicleSeriesChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="颜色">
              <el-select v-model="queryForm.color" placeholder="车身颜色">
                <el-option v-for="(colorLabel, colorCode) in colorMap" :key="colorCode" :value="colorCode" :label="colorLabel" />
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
              <el-input v-model="queryForm.licence" placeholder="车牌号" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="75px" inline align="right">
        <el-form-item class="form-btns">
          <el-button type="primary" @click="onSubmit">查询</el-button>
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
            {{ colorMap[scope.row.color] }}
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
            {{ scope.row.registerDate }}
          </template>
        </el-table-column>
        <el-table-column label="检检有效期" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.inspectionExpired }}
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
      :title="(formType | titleFilter) + '车辆'"
      :visible.sync="drawerVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div class="drawer-container">
        <span>{{ temp }}</span>
        <el-form :model="temp" label-width="100px" label-position="left">
          <el-form-item label="序号">
            <el-input v-model="temp.id" placeholder="系统内部序号" disabled />
          </el-form-item>
          <el-form-item label="车牌号">
            <el-input v-model.trim="temp.licence" placeholder="输入车牌号" clearable />
          </el-form-item>
          <el-form-item label="颜色">
            <el-select v-model="temp.color" placeholder="选择颜色">
              <el-option v-for="(colorLabel, colorCode) in colorMap" :key="colorCode" :value="colorCode" :label="colorLabel" />
            </el-select>
          </el-form-item>
          <el-form-item label="车架号">
            <el-input v-model.trim="temp.vin" placeholder="输入车架号" clearable />
          </el-form-item>
          <el-form-item label="车型">
            <el-cascader
              v-model="temp.vehicleSeries"
              placeholder="选择车型"
              :options="vehicleSeriesOptions"
              @change="handleVehicleSeriesChange"
            />
            <el-button type="text" style="margin-left: 10px" @click="onCreate2VehicleSeries">新增</el-button>
          </el-form-item>

          <el-form-item label="行驶证日期">
            <el-date-picker
              v-model="temp.registerDate"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
            />
          </el-form-item>
          <el-form-item label="检验有效期">
            <el-date-picker
              v-model="temp.inspectionExpired"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions2"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="drawerVisible = false">取 消</el-button>
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
            <el-form :model="innerTemp" label-position="left" label-width="100px">
              <el-form-item label="品牌">
                <el-input v-model.trim="innerTemp.brand" clearable />
              </el-form-item>
              <el-form-item label="车系">
                <el-input v-model.trim="innerTemp.vehicleSeries" clearable />
              </el-form-item>
              <el-form-item label="基础押金">
                <el-input v-model="innerTemp.baseDeposit" placeholder="输入金额" clearable>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="基础月付租金">
                <el-input v-model="innerTemp.baseMonthlyRent" placeholder="输入金额" clearable>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="基础周付租金">
                <el-input v-model="innerTemp.baseWeeklyRent" placeholder="输入金额" clearable>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="innerDrawerVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleInnerConfirm">确 定</el-button>
            </span>
          </div>

        </el-drawer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getVehicleList, getVehicleSeriesOptions, updateVehicle } from '@/api/hailing/vehicle'
import { colorFilter, colorMap, statusMap, statusTagFilter, titleFilter, vehicleStatusFilter } from '@/filters'
function min(a, b) {
  return a < b ? a : b
}
export default {
  filters: {
    statusFilter: statusTagFilter,
    titleFilter,
    colorFilter,
    vehicleStatusFilter
  },
  data() {
    return {
      total: 0,
      renderList: null,
      list: null,
      listLoading: true,
      queryForm: {
        vehicleSeries: [],
        color: '',
        vin: '',
        licence: '',
        driverName: ''
      },
      formType: '',
      createForm: {
        vehicleSeries: [],
        color: '',
        vin: '',
        licence: '',
        driverName: '',
        inspectionExpired: '',
        registerDate: ''
      },
      updateForm: {
        id: '',
        vehicleSeries: [],
        color: '',
        vin: '',
        licence: '',
        driverName: '',
        inspectionExpired: '',
        registerDate: ''
      },
      temp: {
        id: '',
        vehicleSeries: [],
        color: '',
        vin: '',
        licence: '',
        driverName: '',
        inspectionExpired: '',
        registerDate: ''
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
      innerTemp: {
        brand: '',
        vehicleSeries: '',
        baseDeposit: '',
        baseMonthlyRent: '',
        baseWeeklyRent: ''
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
    colorMap() {
      return colorMap
    },
    statusMap() {
      return statusMap
    }
  },
  created() {
    this.fetchData()
    this.fetchVehicleSeries()
  },
  methods: {
    titleFilter,
    fetchData() {
      this.listLoading = true
      getVehicleList().then(response => {
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
        this.vehicleSeriesOptions = response.data.items
      })
    },
    onSubmit() {
      console.log('submit!')
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
      this.temp = {}
      this.drawerVisible = true
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
      this.innerDrawerVisible = false
    },
    onUpdate(entity) {
      this.temp = entity
      this.drawerVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    handleDrawerConfirm() {
      // TODO: 提交
      switch (this.formType) {
        // eslint-disable-next-line no-empty
        // case 'create': {
        // }
        //   break
        case 'update':
          updateVehicle(this.temp.id, this.temp).then(() => {
            this.$message({
              message: '更新车辆成功',
              type: 'success'
            })
            this.$message.success('更新车辆成功')
          })
          break
        default:
          break
      }
      this.drawerVisible = false
    },
    handle2Close(done) {
      this.$confirm('确认2关闭？')
        .then(_ => {
          this.dialog2Visible = false
        })
        .catch(_ => { })
    },
    handleVehicleSeriesChange(value) {
      console.log(value)
    },
    onDelete(id, event) {
      this.$confirm('此操作将永久删除该车辆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
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
