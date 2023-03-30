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
            <span v-show="form.driver.id">{{  'WIP: 提示信息(如：该司机已有生效合同)'  }}</span>
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
        <el-form-item>
          <el-radio-group v-model="radio3" size="small">
            <el-radio-button label="上海"></el-radio-button>
            <el-radio-button label="北京" disabled ></el-radio-button>
            <el-radio-button label="广州"></el-radio-button>
            <el-radio-button label="深圳"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getDriverList } from '@/api/hailing/driver'
import { getVehicleList } from '@/api/hailing/vehicle'
import { colorFilter } from '@/filters'

export default {
  filters: {
    colorFilter
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
        paymentPlan: []
      },
      driverList: [],
      options: [],
      driverLoading: false,
      vehicleList: [],
      options2: [],
      vehicleLoading: false
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
<style scoped lang="scss">
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
