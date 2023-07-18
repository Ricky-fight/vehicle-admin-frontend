<template>
  <div>
    <el-card class="box-card">
      <el-steps :active="step" class="step" align-center>
        <el-step title="录入" icon="el-icon-edit"></el-step>
        <el-step title="提交" icon="el-icon-upload"></el-step>
        <el-step title="打印" icon="el-icon-picture"></el-step>
      </el-steps>
    </el-card>
    <el-card v-if="step === 1">
      <h2>录入合同</h2>
      <el-form ref="formData" :model="formData" label-width="90px" label-position="left">
        <el-divider content-position="center">司机信息</el-divider>
        <el-form-item label="司机">
          <div>
            <el-select
              ref="driverInput"
              v-model="formData.driver"
              class="driver-select-input"
              popper-class="driver-select"
              placeholder="请输入司机姓名"
              filterable
              remote
              :remote-method="fetchDriverOptions"
              :loading="driverLoading"
              clearable
              @change="handleSelectDriver"
              @clear="handleDriverClear"
            >
              <el-option
                v-for="driver in driverOptions"
                :key="driver.id"
                :label="driver.name"
                :value="driver.id"
              >
                <span class="name">{{ driver.name }}</span>
                <span class="id-no">{{ driver.idNo }}</span>
              </el-option>
            </el-select>
            <el-link type="primary" style="margin-left: 5px" href="#/hailing/driver" target="_blank" :underline="false">去新增/编辑司机信息</el-link>
          </div>
          <div class="driver-warn">
            <span v-show="formData.driver">{{ 'WIP: 提示信息(如：该司机已有生效合同)' }}</span>
          </div>
        </el-form-item>
        <el-descriptions>
          <el-descriptions-item label="身份证号">{{ selectedDriver.idNo }}</el-descriptions-item>
          <el-descriptions-item label="做单手机号">{{ selectedDriver.phone1 }}</el-descriptions-item>
          <el-descriptions-item label="联系手机号">{{ selectedDriver.phone2 }}</el-descriptions-item>
          <el-descriptions-item label="紧急手机号">{{ selectedDriver.phone3 }}</el-descriptions-item>
          <el-descriptions-item label="联系地址">{{ selectedDriver.address }}</el-descriptions-item>
<!--          <el-descriptions-item label="驾驶证注册日期">{{ formData.driver.registerDate }}</el-descriptions-item>-->
        </el-descriptions>
        <el-divider content-position="center">车辆信息</el-divider>
        <el-form-item label="车辆">
          <div>
            <el-select
              ref="vehicleInput"
              v-model="formData.vehicle"
              class="vehicle-select-input"
              popper-class="vehicle-select"
              placeholder="请输入车牌号"
              filterable
              remote
              :remote-method="fetchVehicleOptions"
              :loading="vehicleLoading"
              clearable
              @change="handleSelectVehicle"
              @clear="handleVehicleClear"
            >
              <el-option
                v-for="vehicle in vehicleOptions"
                :key="vehicle.id"
                :label="vehicle.licenceNo"
                :value="vehicle.id"
              >
                <div class="licence">{{ vehicle.licenceNo }}</div>
                <span class="vin">{{ vehicle.vin }}</span>
                <span class="series">{{vehicle.color | colorFilter }}色</span>
                <span class="series">{{ vehicle.type.brand + '/' + vehicle.type.series }} </span>
              </el-option>
            </el-select>
          </div>
          <div class="driver-warn">
            <span v-show="selectedVehicle.id">{{ 'WIP: 提示信息(如：该车辆已出车)' }}</span>
          </div>
        </el-form-item>
        <el-descriptions>
          <el-descriptions-item label="颜色">{{ selectedVehicle.color | colorFilter }}</el-descriptions-item>
          <el-descriptions-item label="品牌">{{ selectedVehicle.type.brand }}</el-descriptions-item>
          <el-descriptions-item label="车系">{{ selectedVehicle.type.series }}</el-descriptions-item>
          <el-descriptions-item label="车架号">{{ selectedVehicle.vin }}</el-descriptions-item>
          <el-descriptions-item label="行驶证注册日期">{{ selectedVehicle.certificate.registerDate }}</el-descriptions-item>
          <el-descriptions-item label="检验有效期">{{ selectedVehicle.certificate.inspectionDate }}</el-descriptions-item>
        </el-descriptions>
        <el-divider content-position="center">合同内容</el-divider>
        <el-form-item label="平台">
          <el-radio-group v-model="formData.platform" size="small">
            <el-radio-button label="ALL">不限</el-radio-button>
            <el-radio-button label="DIDI">滴滴</el-radio-button>
            <el-radio-button label="MEITUAN">美团</el-radio-button>
            <el-radio-button label="XIANGDAO" disabled>享道</el-radio-button>
            <el-radio-button label="T3" disabled>T3</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签订日期">
          <el-date-picker
            v-model="formData.signingDate"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            align="right"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="合同期限">
          <el-date-picker
            v-model="contrastDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            @change="handlePickContrastDateRange"
          />
        </el-form-item>
        <el-form-item label="支付周期">
          <el-radio-group v-model="formData.paymentPeriod" size="small" @change="handlePeriodChange">
            <el-radio-button label="MONTHLY">月付</el-radio-button>/>
            <el-radio-button label="WEEKLY">周付</el-radio-button>/>
<!--            <el-radio-button :label="" disabled>月付（首月周付）</el-radio-button>/>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="押金">
          <el-input v-model="formData.deposit" style="width:200px">
            <template #append>
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="租金">
          <el-input v-model="formData.rent" style="width:200px">
            <template #append>
              {{ formData.paymentPeriod | paymentFilter }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="handleSubmit" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-if="step === 2">
      <el-result v-bind="result['success']">
        <template #extra>
          <el-button size="medium" @click="step--">返回</el-button>
          <el-button type="primary" size="medium" @click="step--">下载合同</el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>
<script>
import { getDriverList } from '@/api/hailing/driver'
import { getVehicleList } from '@/api/hailing/vehicle'
import { colorFilter, paymentFilter, resultMap } from '@/filters'
import { driverTemplate, vehicleTemplate } from '@/utils/template'
import { Message } from 'element-ui'
import { submitContrast } from '@/api/hailing/contrast'
// 计算合同终止日，若过了每月月中则拉到月底，否则终止日为输入的相应月数再减1天
function computeEndDate(start, months) {
  const end = new Date(start)
  if (end.getDate() >= 15) {
    end.setFullYear(end.getFullYear(), end.getMonth() + months + 1, 0)
  } else {
    end.setMonth(end.getMonth() + months)
    end.setDate(end.getDate() - 1)
  }
  return end
}
export default {
  computed: {
  },
  filters: {
    colorFilter,
    paymentFilter
  },
  data() {
    return {
      oldPaymentPeriod: '',
      step: 1,
      formData: {
        driver: '',
        vehicle: '',
        platform: 'DIDI',
        signingDate: '',
        paymentPeriod: 'MONTHLY',
        deposit: null,
        rent: null
      },
      selectedDriver: driverTemplate,
      selectedVehicle: vehicleTemplate,
      driverList: [],
      driverOptions: [],
      driverLoading: false,
      vehicleList: [],
      vehicleOptions: [],
      vehicleLoading: false,
      contrastDate: [],
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
      },
      result: resultMap
    }
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    fetchDriverOptions(query) {
      if (query !== '') {
        this.driverLoading = true
        getDriverList({ name: query }).then((resp) => {
          this.driverOptions = resp.data.results
          this.driverLoading = false
        })
      } else {
        this.driverOptions = []
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
    handleSelectDriver() {
      console.log('driver selected!')
      for (const driverListKey in this.driverOptions) {
        if (this.formData.driver === this.driverOptions[driverListKey].id) {
          this.selectedDriver = this.driverOptions[driverListKey]
          break
        }
      }
    },
    handleDriverClear() {
      this.formData.driver = ''
      this.selectedDriver = driverTemplate
      this.driverOptions = []
    },
    fetchVehicleOptions(query) {
      if (query !== '') {
        query = query.toUpperCase()
        this.vehicleLoading = true
        getVehicleList({ licenceNo: query }).then((resp) => {
          this.vehicleOptions = resp.data.results
          this.vehicleLoading = false
        })
      } else {
        this.vehicleOptions = []
      }
    },
    handleSelectVehicle() {
      console.log('vehicle selected!')
      for (const vehicleListKey in this.vehicleOptions) {
        if (this.formData.vehicle === this.vehicleOptions[vehicleListKey].id) {
          this.selectedVehicle = this.vehicleOptions[vehicleListKey]
          break
        }
      }
    },
    handleVehicleClear() {
      this.formData.vehicle = ''
      this.selectedVehicle = vehicleTemplate
      this.vehicleOptions = []
    },
    handlePeriodChange() {
      const oldValue = this.oldPaymentPeriod
      const newValue = this.formData.paymentPeriod
      this.oldPaymentPeriod = newValue
      if (this.formData.rent !== '') {
        if (oldValue === 0 && newValue === 1) {
          this.formData.rent /= 4
        } else if (oldValue === 1 && newValue === 0) {
          this.formData.rent *= 4
        }
      }
    },
    handlePickContrastDateRange() {
      if (this.contrastDate.length > 1) {
        this.formData.startDate = this.contrastDate[0]
        this.formData.endDate = this.contrastDate[1]
      } else {
        this.formData.startDate = ''
        this.formData.endDate = ''
      }
    },
    handleSubmit() {
      submitContrast(this.formData).then(() => {
        Message.success('提交合同成功')
      })
      this.step += 1
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
    height: 150%;
    line-height: 1.5;
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
.step {
  margin: auto;
  padding: 10px;
}
</style>
