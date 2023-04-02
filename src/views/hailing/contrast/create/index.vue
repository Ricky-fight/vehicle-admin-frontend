<template>
  <div>
    <el-card>
      <h2>录入合同</h2>
      <el-form ref="form" :model="form" label-width="90px" label-position="left">
        <el-divider content-position="center">司机信息</el-divider>
        <el-form-item label="司机">
          <div>
            <el-select
              v-model="form.driver.id"
              class="driver-select-input"
              popper-class="driver-select"
              placeholder="请输入司机姓名"
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="driverLoading"
              clearable
              @change="handleSelect"
              @clear="handleClear"
            >
              <el-option
                v-for="driver in options"
                :key="driver.value"
                :label="driver.label"
                :value="driver.value"
              >
                <span class="name">{{ driver.label }}</span>
                <span class="id-no">{{ driver.identificationNo }}</span>
              </el-option>
            </el-select>
            <el-link type="primary" style="margin-left: 5px" href="#/hailing/driver" target="_blank" :underline="false">去新增/编辑司机信息</el-link>
          </div>
          <div class="driver-warn">
            <span v-show="form.driver.id">{{ 'WIP: 提示信息(如：该司机已有生效合同)' }}</span>
          </div>
        </el-form-item>
        <el-descriptions>
          <el-descriptions-item label="身份证号">{{ form.driver.identificationNo }}</el-descriptions-item>
          <el-descriptions-item label="做单手机号">{{ form.driver.phone1 }}</el-descriptions-item>
          <el-descriptions-item label="联系手机号">{{ form.driver.phone2 }}</el-descriptions-item>
          <el-descriptions-item label="紧急手机号">{{ form.driver.emergencyPhone }}</el-descriptions-item>
          <el-descriptions-item label="联系地址">{{ form.driver.address }}</el-descriptions-item>
          <el-descriptions-item label="驾驶证注册日期">{{ form.driver.registerDate }}</el-descriptions-item>
        </el-descriptions>
        <el-divider content-position="center">车辆信息</el-divider>
        <el-form-item label="车辆">
          <div>
            <el-select
              v-model="form.vehicle.id"
              class="vehicle-select-input"
              popper-class="vehicle-select"
              placeholder="请输入车牌号"
              filterable
              remote
              :remote-method="remoteMethod2"
              :loading="vehicleLoading"
              clearable
              @change="handleSelect2"
              @clear="handleClear2"
            >
              <el-option
                v-for="vehicle in options2"
                :key="vehicle.id"
                :label="vehicle.licence"
                :value="vehicle.id"
              >
                <div class="licence">{{ vehicle.licence }}</div>
                <span class="vin">{{ vehicle.vin }}</span>
                <span class="series">{{ vehicle.brand + '/' + vehicle.vehicleSeries }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="driver-warn">
            <span v-show="form.vehicle.id">{{ 'WIP: 提示信息(如：该车辆已出车)' }}</span>
          </div>
        </el-form-item>
        <el-descriptions>
          <el-descriptions-item label="颜色">{{ form.vehicle.color | colorFilter }}</el-descriptions-item>
          <el-descriptions-item label="品牌">{{ form.vehicle.brand }}</el-descriptions-item>
          <el-descriptions-item label="车系">{{ form.vehicle.vehicleSeries }}</el-descriptions-item>
          <el-descriptions-item label="车架号">{{ form.vehicle.vin }}</el-descriptions-item>
          <el-descriptions-item label="行驶证注册日期">{{ form.vehicle.registerDate }}</el-descriptions-item>
          <el-descriptions-item label="检验有效期">{{ form.vehicle.inspectionExpired }}</el-descriptions-item>
        </el-descriptions>
        <el-divider content-position="center">合同内容</el-divider>
        <el-form-item label="平台">
          <el-radio-group v-model="form.platform" size="small">
            <el-radio-button :label="0" :value="0">滴滴</el-radio-button> />
            <el-radio-button :label="1" :value="1">美团</el-radio-button> />
            <el-radio-button :label="2" :value="2" disabled>享道</el-radio-button> />
            <el-radio-button :label="3" :value="3" disabled>T3</el-radio-button> />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签订日期">
          <el-date-picker
            v-model="form.signingDate"
            placeholder="选择日期"
            align="right"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="合同期限">
          <el-date-picker
            v-model="form.contrastDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
          />
        </el-form-item>
        <el-form-item label="支付周期">
          <el-radio-group v-model="form.paymentPeriod" size="small">
            <el-radio-button :value="0" :label="0">月付</el-radio-button>/>
            <el-radio-button :value="1" :label="1">周付</el-radio-button>/>
            <el-radio-button :value="2" :label="2" disabled>月付（首月周付）</el-radio-button>/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="押金">
          <el-input v-model="form.deposit" style="width:200px">
            <template #append>
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="租金">
          <el-input v-model="form.rent" style="width:200px">
            <template #append>
              {{ form.paymentPeriod | paymentFilter }}
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getDriverList } from '@/api/hailing/driver'
import { getVehicleList } from '@/api/hailing/vehicle'
import { colorFilter, paymentFilter } from '@/filters'
// 计算合同终止日，若过了每月月中则拉到月底，否则终止日为输入的相应月数再减1天
function computeEndDate(start, months) {
  let end = new Date(start)
  if (end.getDate() >= 15) {
    end.setFullYear(end.getFullYear(), end.getMonth() + months + 1, 0)
  } else {
    end.setMonth(end.getMonth() + months)
    end.setDate(end.getDate() - 1)
  }
  return end
}
export default {
  filters: {
    colorFilter,
    paymentFilter
  },
  data() {
    return {
      form: {
        driver: {
          id: ''
        },
        vehicle: {
          id: ''
        },
        paymentPlan: [],
        platform: 0,
        signingDate: '',
        paymentPeriod: 0,
        deposit: null,
        rent: null,
      },
      driverList: [],
      options: [],
      driverLoading: false,
      vehicleList: [],
      options2: [],
      vehicleLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
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
      contrastDate: [],
      pickerOptions2: {
        shortcuts: [{
          text: '三个月',
          onClick(picker) {
            const months = 3
            const start = new Date()
            const end = computeEndDate(start, months)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '六个月',
          onClick(picker) {
            const months = 6
            const start = new Date()
            const end = computeEndDate(start, months)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一年',
          onClick(picker) {
            const months = 12
            const start = new Date()
            const end = computeEndDate(start, months)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted() {
  },
  methods: {
    colorFilter,
    onSubmit() {
      console.log('submit!')
    },
    remoteMethod(query) {
      if (query !== '') {
        this.driverLoading = true
        getDriverList().then((resp) => {
          this.driverList = resp.data.items
          this.options = resp.data.items
            .map((driver) => { return { value: driver.id, label: driver.name, identificationNo: driver.identificationNo } })
            .filter((item) => { return item.label.includes(query) })
          console.log(this.driverList)
          console.log(this.options)
          this.driverLoading = false
        })
      } else {
        this.options = []
      }
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch(_ => {
        })
    },
    handleSelect() {
      console.log('driver selected!')
      for (const driverListKey in this.driverList) {
        if (this.form.driver.id === this.driverList[driverListKey].id) {
          this.form.driver = this.driverList[driverListKey]
          break
        }
      }
    },
    handleClear() {
      this.form.driver = {}
    },
    remoteMethod2(query) {
      if (query !== '') {
        query = query.toLowerCase()
        this.vehicleLoading = true
        getVehicleList().then((resp) => {
          this.vehicleList = resp.data.items
          this.options2 = resp.data.items
            .filter((item) => {
              if (item.licence.toLowerCase().includes(query)) {
                return true
              }
              if (item.brand.toLowerCase().includes(query)) {
                return true
              }
              if (item.vehicleSeries.toLowerCase().includes(query)) {
                return true
              }
            })
          console.log(this.vehicleList)
          console.log(this.options2)
          this.vehicleLoading = false
        })
      } else {
        this.options2 = []
      }
    },
    handleSelect2() {
      console.log('vehicle selected!')
      for (const vehicleListKey in this.vehicleList) {
        if (this.form.vehicle.id === this.vehicleList[vehicleListKey].id) {
          this.form.vehicle = this.vehicleList[vehicleListKey]
          console.log(this.form.vehicle)
          break
        }
      }
    },
    handleClear2() {
      this.form.vehicle = {}
    }

  }
}
</script>
<style lang="scss">
.el-card {
  border-radius: 10px;
  margin-bottom: 10px;
}
/*.driver-select {*/
/*  li {*/
/*    line-height: 50px;*/
/*    padding: 70px;*/
.name, .licence {
  //float: left;
  /*text-overflow: ellipsis;*/
  /*overflow: hidden;*/
}
.id-no {
  /*font-size: 12px;*/
  float: right;
  color: #b4b4b4;
  font-size: small;
}
.driver-select-input {
  width: 30%;
}
/*  }*/
/*}*/
.driver-warn {
  line-height: normal;
  color: red;
}
.vehicle-select {
  li {
    //height: 50px;
    line-height: 0.75;
    padding: 7px;
    .licence {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .vin {
      font-size: 12px;
      color: #b4b4b4;
    }
    .series {
      font-size: 12px;
      float: right;
      padding-left: 10px;
    }
    .highlighted .vin {
      color: #ddd;
    }
  }
}
</style>
