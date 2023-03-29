<template>
  <el-drawer
    ref="drawer"
    :title="title"
    :visible.sync="drawerVisible"
    size="40%"
    direction="rtl"
  >
    <div class="demo-drawer__content">
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
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="$refs.drawer.closeDrawer()">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>

import { bool } from 'mockjs/src/mock/random/basic'

export default {
  name: 'DriverFormDrawer',
  props: [
    'title',
    'drawerVisible',
  ],
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
      loading: false
    }
  },
  methods: {
    cancelForm() {
      this.$emit('cancel')
      this.loading = false;
      this.drawerVisible = false;
      clearTimeout(this.timer);
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
        .catch(_ => {})
    }
  }
}
</script>

<style scoped>

</style>
