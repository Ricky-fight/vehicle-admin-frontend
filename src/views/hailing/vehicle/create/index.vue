<template>
  <el-dialog
    title="新建车辆"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form :model="createForm">
      <el-row>
        <el-col span="6">
          <el-form-item label="车牌号" label-width="75px">
            <el-input v-model.trim="createForm.licence" clearable />
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
        <el-col span="2">
          <el-link type="primary" @click="onCreateVehicleSeries">新增</el-link>
        </el-col>
        <el-col span="8">
          <el-form-item label="车架号" label-width="75px">
            <el-input v-model.trim="createForm.vin" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <el-form-item label="颜色" label-width="75px">
            <el-select v-model="queryForm.color" placeholder="选择颜色">
              <el-option v-for="(colorLabel, colorCode) in colorMap" :key="colorCode" :value="colorCode" :label="colorLabel" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="12">
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
        <el-col span="12">
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
    <el-dialog
      title="新建车型"
      :visible.sync="dialog2Visible"
      width="50%"
      :before-close="handle2Close"
      append-to-body
    >
      <el-form :model="createVehicleSeriesForm">
        <el-row>
          <el-col span="12">
            <el-form-item label="品牌" label-width="100px">
              <el-input v-model.trim="createVehicleSeriesForm.brand" clearable />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="车系" label-width="100px">
              <el-input v-model.trim="createVehicleSeriesForm.vehicleSeries" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="基础押金" label-width="100px">
              <el-input v-model="createVehicleSeriesForm.baseDeposit" placeholder="输入金额" clearable>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="基础月付租金" label-width="100px">
              <el-input v-model="createVehicleSeriesForm.baseMonthlyRent" placeholder="输入金额" clearable>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="基础周付租金" label-width="100px">
              <el-input v-model="createVehicleSeriesForm.baseWeeklyRent" placeholder="输入金额" clearable>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2Visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitCreateVehicleSeries">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
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
      createVehicleSeriesForm: {
        brand: '',
        vehicleSeries: '',
        baseDeposit: '',
        baseMonthlyRent: '',
        baseWeeklyRent: ''
      },
      dialog2Visible : false
    }
  }
}
</script>
