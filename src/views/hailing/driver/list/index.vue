<template>
  <div class="app-container">
    <el-card class="box-card">
      <!--      <el-row type="flex" justify="end">-->
      <el-form :model="queryForm" class="" label-width="100px">
        <el-row justify="end">
          <el-col span="6">
            <el-form-item label="姓名">
              <el-input v-model="queryForm.name" placeholder="司机姓名" />
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="做单手机号">
              <el-input v-model="queryForm.phone1" placeholder="输入手机号" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="地址">
              <el-input v-model="queryForm.address" placeholder="输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="6">
            <el-form-item label="车牌号">
              <el-input v-model="queryForm.driverName" placeholder="输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="车型">
              <el-cascader
                v-model="queryForm.vehicleSeries"
                placeholder="选择车型"
                :options="vehicleSeriesOptions"
                @change="handleVehicleSeriesChange"
              />
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
        height="700"
        stripe
        highlight-current-row
      >
        <el-table-column label="司机姓名" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.name }}
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
            {{ scope.row.emergencyPhone }}
          </template>
        </el-table-column>
        <el-table-column label="联系地址" align="center">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="驾驶证注册日期" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.registerDate }}
          </template>
        </el-table-column>
        <el-table-column label="车牌号" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.vehicle.licence }}
          </template>
        </el-table-column>
        <el-table-column label="车型" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.vehicle.vehicleSeries }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ status(scope.row.vehicle) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" align="center">
          <template>
            <el-link type="primary" style="margin-right: 5px">更新</el-link>
            <el-link type="danger">删除</el-link>
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
        :total="list.length"
        align="right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog title="新建司机" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="createForm" label-width="125px">
        <el-row>
          <el-col span="12">
            <el-form-item label="姓名">
              <el-input v-model.trim="createForm.name" placeholder="输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="做单手机号">
              <el-input v-model.trim="createForm.phone1" placeholder="输入手机号" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <el-form-item label="联系手机号">
              <el-input v-model.trim="createForm.phone2" placeholder="输入手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="紧急联系人">
              <el-input v-model.trim="createForm.emergencyPhone" placeholder="输入手机号" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="24">
            <el-form-item label="联系地址" clearable>
              <el-input v-model="createForm.address" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="24">
            <el-form-item label="行驶证注册日期">
              <el-date-picker
                v-model="createForm.registerDate"
                align="right"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getVehicleList, getVehicleSeriesOptions } from '@/api/hailing/vehicle'
import { getDriverList } from '@/api/hailing/driver'
function min(a, b) {
  return a < b ? a : b
}
export default {
  filters: {
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
      renderList: null,
      list: null,
      listLoading: true,
      queryForm: {
        name: '',
        phone1: '',
        phone2: '',
        emergencyPhone: '',
        address: ''
      },
      createForm: {
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
      statusMap: {
        0: '已解约',
        1: '已签约'
      },
      pageSize: null,
      currentPage: null,
      dialogVisible: false
    }
  },
  created() {
    this.fetchData()
    this.fetchVehicleSeries()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDriverList().then(response => {
        this.list = response.data.items
        this.pageSize = 10 // TODO:可选择的分页条数
        this.renderList = this.list.slice(0, min(this.pageSize, this.list.length))
        this.listLoading = false
        // console.log(this.renderList)
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
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    handleVehicleSeriesChange(value) {
      console.log(value)
    },
    status(vehicle) {
      if (vehicle && vehicle.licence) {
        return this.statusMap[1]
      }
      return this.statusMap[0]
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
