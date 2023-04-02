<template>
  <el-button>{{ testProp }}</el-button>
</template>

<script>
export default {
  name: 'Test',
  props: {
    testProp: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
