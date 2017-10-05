<template>
  <div class="row">
    <div class="col text-center">
      <h1>SNP descent plots</h1>
      <input id="snpFileInput" type="file" @change="process">
      <p>message: {{ message }}</p>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'hello-world',
    methods: {
      process (event) {
        const file = event.target.files[0]
        console.log(file)
        if (!file) return
        console.log('file name: ', file.name)
        console.log('file size: ', file.size)
      }
    },
    computed: {
      ...mapState(['message'])
    }
  }
</script>
