<template>
  <div class="money">
    <p @click="getTorost">我的钱包</p>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {}
    },
    methods: {
      getTorost () {
        Toast('你好')
      }
    }
  }
</script>
