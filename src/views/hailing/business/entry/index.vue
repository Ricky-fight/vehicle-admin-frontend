<!--业务录入-->
<template>
  <div>
    <el-card>
      <h2>业务录入</h2>
      <el-form ref="formData" :model="formData" label-width="120px" label-position="right">
        <el-divider content-position="center">用车单位</el-divider>
        <el-form-item label="用车单位">
          <div>
            <el-select
              ref="clientSelectInput"
              v-model="formData.client_id"
              placeholder="请选择用车单位"
              filterable
              remote
              clearable
            >
              <el-option
                v-for="client in clientOptions"
                :key="client.id"
                :label="client.name"
                :value="client.id"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="纳税人识别号">
          <el-input v-model="formData.client_tax_id"></el-input>
        </el-form-item>
        <el-form-item label="开票地址">
          <el-input v-model="formData.client_tax_address"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="formData.client_contact_name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.client_contact_number"></el-input>
        </el-form-item>
        <el-divider content-position="center">业务信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="宾馆">
              <el-input v-model="formData.hotel_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="介绍人">
              <el-input v-model="formData.referrer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经办人">
              <el-input v-model="formData.agent"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用车时间">
              <el-date-picker
                v-model="tempTimeRange"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="离沪航班">
              <el-input v-model="formData.departure_flight"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到达航班">
              <el-input v-model="formData.arrival_flight"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="预估车费">
              <el-input v-model="formData.charge_money"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用车天数">
              <el-input v-model="formData.days_num"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结算类型">
              <el-input v-model="formData.settlement_type"></el-input>
            </el-form-item>
          </el-col>
        </el-row>




      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Entry',
  data() {
    return {
      tempTimeRange: '',
      formData: {
        client: ''
      },
      clientOptions: []
    }
  }
}
</script>

<style scoped>

</style>
