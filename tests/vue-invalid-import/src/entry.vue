<template>
  <div>
    <h1>Example template</h1>
    <p>Script tag should be parsed correctly</p>
  </div>
</template>

<script>
  import testFn from './lib';

  export default {
    data() {
      return {
        test: true,
      }
    },
    methods: {
      test() {
        testFn();
      }
    }
  }
</script>

<style scoped>
  h1 {
    color: blue;
  }
</style>
