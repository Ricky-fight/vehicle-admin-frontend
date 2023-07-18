<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryForm" class="" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="司机">
              <el-input v-model="queryForm.driver" placeholder="输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号">
              <el-input v-model="queryForm.vehicle" placeholder="输入车牌号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车型">
              <el-cascader
                v-model="queryForm.series"
                placeholder="选择车型"
                :options="vehicleSeriesOptions"
                clearable
                @change="handleVehicleSeriesChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台">
              <el-select
                v-model="queryForm.platform"
                placeholder="选择网约车平台"
                clearable
                @change="handlePlatformChange"
              >
                <el-option v-for="item in platformOption" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="签订日期">
              <el-date-picker
                v-model="signingDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                clearable
                @change="handlePickSigningDateRange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同起期">
              <el-date-picker
                v-model="startDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                clearable
                @change="handlePickStartDateRange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同止期">
              <el-date-picker
                v-model="endDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                clearable
                @change="handlePickEndDateRange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="支付周期">
              <el-select v-model="queryForm.paymentPeriod" placeholder="选择支付周期" clearable>
                <el-option v-for="item in paymentPeriodOptions" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="6">-->
<!--            <el-form-item label="押金">-->
<!--              <el-input v-model="depositQuery.value" placeholder="输入金额" class="input_with_condition" clearable>-->
<!--                <i slot="prefix">-->
<!--                  <el-select v-model="depositQueryCondition" placeholder="条件" class="inner_select" clearable>-->
<!--                    <el-option v-for="item in depositQueryOptions" :key="item.value" :value="item.value" :label="item.label" />-->
<!--                  </el-select>-->
<!--                </i>-->
<!--              </el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
      </el-form>
      <el-form label-width="75px" inline align="right">
        <el-form-item class="form-btns">
          <el-button type="primary" @click="onSubmitQuery">查询</el-button>
        </el-form-item>
        <el-form-item class="form-btns">
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
<!--      {{ renderList }}-->
      <el-table
        v-loading="listLoading"
        :data="renderList"
        element-loading-text="Loading"
        border
        fit
        stripe
        highlight-current-row
      >
        <el-table-column label="司机" align="center" width="100">
          <template slot-scope="scope">
            <el-link type="primary">{{ scope.row.driver_name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="车辆" align="center" width="150">
          <template slot-scope="scope">
            <el-link type="primary">{{ scope.row.vehicle_licenceNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="车型" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.vehicle_series }}
          </template>
        </el-table-column>
        <el-table-column label="平台" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.platform | platformFilter }}
          </template>
        </el-table-column>
        <el-table-column label="签订日期" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.signingDate }}
          </template>
        </el-table-column>
        <el-table-column label="合同期限" align="center" >
          <template slot-scope="scope">
            {{ scope.row.startDate + ' - ' + scope.row.endDate }}
          </template>
        </el-table-column>
        <el-table-column label="支付周期" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.paymentPeriod | paymentPeriodFilter }}
          </template>
        </el-table-column>
        <el-table-column label="押金" align="center" width="125">
          <template slot-scope="scope">
            {{ scope.row.deposit }}
          </template>
        </el-table-column>
        <el-table-column label="租金" align="center" width="125">
          <template slot-scope="scope">
            {{ scope.row.rent }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | contrastStatusTagType">{{ scope.row.status | contrastStatusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
<!--            <el-link type="primary" style="margin-right: 5px" @click="(event) => onUpdate(scope.row, event)">更新</el-link>-->
            <el-link v-show="scope.row.status === 'ACTIVE'" type="danger" @click="(event) => onTerminateContrast(scope.row.id, event)">终止</el-link>
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
  </div>
</template>

<script>
// import { deleteDriver } from '@/api/hailing/driver'
import {
  contrastStatusFilter,
  contrastStatusTagType,
  convertMap2Options,
  paymentPeriodFilter, paymentPeriodOptions,
  platformFilter,
  platformMap
} from '@/filters'
import { getContrastList } from '@/api/hailing/contrast'
function min(a, b) {
  return a < b ? a : b
}
export default {
  computed: {
    platformMap() {
      return platformMap
    },
    platformOption() {
      return convertMap2Options(platformMap)
    }
  },
  filters: {
    platformFilter,
    contrastStatusFilter,
    convertMap2Options,
    paymentPeriodFilter,
    contrastStatusTagType
  },
  data() {
    return {
      total: 0,
      renderList: null,
      list: null,
      listLoading: true,
      queryForm: {
        driver: '',
        vehicle: '',
        platform: '',
        series: '',
        status: '',
        signingDate_before: '',
        signingDate_after: '',
        startDate_before: '',
        startDate_after: '',
        endDate_before: '',
        endDate_after: '',
        paymentPeriod: '',
        deposit_min: '',
        deposit_max: '',
        rent_min: '',
        rent_max: ''
      },
      signingDate: [],
      startDate: [],
      endDate: [],
      depositQuery: {
        condition: '',
        value: ''
      },
      depositQueryOptions: [
        { value: 'ge', label: '大于'},
        { value: 'le', label: '小于'},
        { value: 'eq', label: '等于'}
      ],
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
      pageSize: null,
      currentPage: null,
      dialogVisible: false,
      dialog2Visible: false,
      paymentPeriodOptions
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getContrastList(this.queryForm).then(response => {
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
    handleVehicleSeriesChange(value) {
      console.log(value)
    },
    handlePlatformChange(value) {

    },
    handlePickSigningDateRange(value) {
      if (value.length === 2) {
        this.queryForm.signingDate_after = value[0]
        this.queryForm.signingDate_before = value[1]
      }
    },
    handlePickStartDateRange(value) {
      if (value.length === 2) {
        this.queryForm.startDate_after = value[0]
        this.queryForm.endDate_before = value[1]
      }
    },
    handlePickEndDateRange(value) {
      if (value.length === 2) {
        this.queryForm.endDate_after = value[0]
        this.queryForm.endDate_before = value[1]
      }
    }
    // onDelete(id) {
    //   this.$confirm('此操作将永久删除该司机, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     deleteDriver(id).then(() => {
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       })
    //       this.fetchData()
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //   })
    // }
  }
}
</script>
<style lang="scss">
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
.el-input__prefix{
  left: 0;
  width: 75px;
  .el-input__inner{
    padding: 0 20px 0 0;
    text-align: center;
  }
}
.input_with_condition {
  //padding-left: 75px;
}
</style>
