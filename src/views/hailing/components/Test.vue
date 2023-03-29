<template>
  <el-button>{{ testProp }}</el-button>
</template>

<script>
export default {
  name: 'Test',
  props: {
    testProp: String
  }
}
</script>

<style scoped>

</style>
