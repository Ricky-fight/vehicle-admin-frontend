<template>
  <div>
    <el-card>
      <h2>录入合同</h2>
      <el-form ref="form" :model="form" label-width="80px">
        <el-divider content-position="left">司机信息</el-divider>
        <el-form-item label="司机">
          <el-select
            v-model="form.driver"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入司机姓名"
            :remote-method="remoteMethod"
            :loading="driverLoading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="text" style="margin-left: 5px" @click="onCreateDriver">新增</el-button>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <DriverFormDrawer title="新建司机" :drawer-visible="driverFormDrawerVisible" @before-close="handleClose"/>
  </div>
</template>
<script>
import DriverFormDrawer from '@/views/hailing/components/DriverFormDrawer.vue'

export default {
  components: { DriverFormDrawer },
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      drivers: [],
      driverLoading: false,
      driverFormDrawerVisible: false
    }
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: `value:${item}`, label: `label:${item}` }
    })
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    remoteMethod(query) {
      if (query !== '') {
        this.driverLoading = true
        setTimeout(() => {
          this.driverLoading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    onCreateDriver() {
      this.driverFormDrawerVisible = true
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
    }
  }
}
</script>
<style>
.el-card {
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
