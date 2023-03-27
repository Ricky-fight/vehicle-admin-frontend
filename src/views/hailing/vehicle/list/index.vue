<template>
  <div class="app-container">
    <el-card class="box-card">
      <!--      <el-row type="flex" justify="end">-->
      <el-form :model="queryForm" class="" label-width="75px" clearable>
        <el-row justify="end">
          <el-col span="6">
            <el-form-item label="车型">
              <el-cascader
                v-model="queryForm.vehicleSeries"
                :options="vehicleSeriesOptions"
                @change="handleVehicleSeriesChange"
              />
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="颜色">
              <el-select v-model="queryForm.color" placeholder="车身颜色">
                <el-option v-for="(colorLabel, colorCode) in colorMap" :key="colorCode" :value="colorCode" :label="colorLabel" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="状态">
              <el-select v-model="queryForm.status" placeholder="车辆状态">
                <el-option v-for="(statusCode, statusLabel) in statusMap" :key="statusCode" :label="statusCode" :value="statusLabel" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="司机">
              <el-input v-model="queryForm.driverName" placeholder="司机姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <el-form-item label="车架号">
              <el-input v-model="queryForm.vin" placeholder="车架号" />
            </el-form-item>
          </el-col>
          <el-col span="12">
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
        height="700"
        stripe
        highlight-current-row
      >
        <el-table-column label="车牌号" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.licence }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" align="center" width="50">
          <template slot-scope="scope">
            {{ scope.row.color }}
          </template>
        </el-table-column>
        <el-table-column label="车架号" width="250" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.vin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="司机" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.driverName }}
          </template>
        </el-table-column>
        <el-table-column label="品牌型号" align="center">
          <template slot-scope="scope">
            {{ scope.row.vehicleSeries }}
          </template>
        </el-table-column>
        <el-table-column label="行驶证注册日期" width="250" align="center">
          <template slot-scope="scope">
            {{ scope.row.registerDate }}
          </template>
        </el-table-column>
        <el-table-column label="检检有效期" width="250" align="center">
          <template slot-scope="scope">
            {{ scope.row.inspectionExpired }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
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
    <el-dialog
      title="新建车辆"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="createForm">
        <el-row>
          <el-col span="8">
            <el-form-item label="车牌号" label-width="75px">
              <el-input v-model.trim="createForm.licence" />
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="车型" label-width="75px">
              <el-cascader
                v-model="createForm.vehicleSeries"
                placeholder="选择车型"
                :options="vehicleSeriesOptions"
                @change="handleVehicleSeriesChange"
              />
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="车架号" label-width="75px">
              <el-input v-model.trim="createForm.vin" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="颜色">
              <el-select v-model="queryForm.color" placeholder="选择颜色">
                <el-option v-for="(colorLabel, colorCode) in colorMap" :key="colorCode" :value="colorCode" :label="colorLabel" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="行驶证注册日期">
              <el-date-picker
                v-model="createForm.registerDate"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
              />
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="检验有效期">
              <el-date-picker
                v-model="queryForm.inspectionExpired"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions2"
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
import { getVehicleList } from '@/api/hailing/vehicle'
function min(a, b) {
  return a < b ? a : b
}
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
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
        vehicleSeries: [],
        color: '',
        vin: '',
        licence: '',
        driverName: ''
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
            let d = new Date()
            d.setFullYear(d.getFullYear()+1)
            picker.$emit('pick', new Date() + 3600 * 1000 * 24 * d)
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
      statusMap: {
        0: '收车',
        1: '出车'
      },
      colorMap: {
        black: '黑',
        white: '白',
        gray: '灰'
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
      getVehicleList().then(response => {
        this.list = response.data.items
        this.pageSize = 10 // TODO:可选择的分页条数

        this.renderList = this.list.slice(0, min(this.pageSize, this.list.length))
        this.listLoading = false
        console.log(this.renderList)
      })
    },
    fetchVehicleSeries() {

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
        .catch(_ => {})
    },
    handleVehicleSeriesChange(value) {
      console.log(value)
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

</style>
