<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="queryForm" class="form-inline">
        <el-form-item label="车型">
          <el-input v-model="queryForm.vehicleSeries" placeholder="车型" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-select v-model="queryForm.color" placeholder="车身颜色">
            <el-option label="黑" value="black" />
            <el-option label="白" value="white" />
            <el-option label="灰" value="gray" />
          </el-select>
        </el-form-item>
        <el-form-item label="车架号" >
          <el-input v-model="queryForm.vin" placeholder="车架号" />
        </el-form-item>
        <el-form-item label="车牌号" >
          <el-input v-model="queryForm.licence" placeholder="车牌号" />
        </el-form-item>
        <el-form-item label="司机" >
          <el-input v-model="queryForm.driverName" placeholder="司机姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onReset">重置</el-button>
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
        <el-table-column align="center" label="车牌号" width="200">
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
        <el-table-column label="品牌型号" width="250" align="center">
          <template slot-scope="scope">
            {{ scope.row.vehicleSeries }}
          </template>
        </el-table-column>
        <el-table-column label="行驶证注册日期" width="250" align="center">
          <template slot-scope="scope">
            {{ scope.row.vehicleSeries }}
          </template>
        </el-table-column>
        <el-table-column label="检检有效期" width="250" align="center">
          <template slot-scope="scope">
            {{ scope.row.vehicleSeries }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="Display_time" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.display_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-bottom: 8px"/>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
        align="right">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import col from "element-ui/packages/col";
function min(a, b) {
  return a<b?a:b;
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
        vehicleSeries: '',
        color: '',
        vin: '',
        licence: '',
        driverName: ''
      },
      pageSize: null,
      currentPage: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.pageSize = 10 // TODO:可选择的分页条数


        this.renderList = this.list.slice(0,min(this.pageSize,this.list.length))
        this.listLoading = false
        console.log(this.renderList)
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
      console.log(`每页 ${val} 条`);
      console.log(`pageSize = ${this.pageSize}`);
    },
    handleCurrentChange(val) {
      let index = val===0?val:val - 1
      this.renderList = this.list.slice(index*this.pageSize,min((index+1)*this.pageSize,this.list.length))
      console.log(`当前页: ${val}`);
    }

  }
}
</script>
<style>
el-row{
  border-radius: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #1f2d3d;
}
.box-card {
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
