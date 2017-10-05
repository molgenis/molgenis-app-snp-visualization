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
    name: 'snp-descent-plot',
    methods: {
      process (event) {
        const file = event.target.files[0]
        if (!file) return
        const maxLines = 100
        this.readSomeLines(file, maxLines, this.forEachLine, this.onComplete)
      },
      forEachLine (line) {
        const lineContent = line.split('\t')
        console.log(lineContent)
      },
      onComplete () {
        console.log('done!')
      },
      readSomeLines (file, maxlines, forEachLine, onComplete) {
        const CHUNK_SIZE = 50000 // 50kb, arbitrarily chosen.
        const decoder = new TextDecoder()
        let offset = 0
        let linecount = 0
        let results = ''
        const fr = new FileReader()
        fr.onload = function () {
          // Use stream:true in case we cut the file
          // in the middle of a multi-byte character
          results += decoder.decode(fr.result, {
            stream: true
          })
          let lines = results.split('\n')
          results = lines.pop() // In case the line did not end yet.
          linecount += lines.length

          if (linecount > maxlines) {
            // Read too many lines? Truncate the results.
            lines.length -= linecount - maxlines
            linecount = maxlines
          }

          for (let i = 0; i < lines.length; ++i) {
            forEachLine(lines[i] + '\n')
          }
          offset += CHUNK_SIZE
          seek()
        }
        fr.onerror = function () {
          onComplete(fr.error)
        }
        seek()

        function seek () {
          if (linecount === maxlines) {
            // We found enough lines.
            onComplete() // Done.
            return
          }
          if (offset !== 0 && offset >= file.size) {
            // We did not find all lines, but there are no more lines.
            forEachLine(results) // This is from lines.pop(), before.
            onComplete() // Done
            return
          }
          var slice = file.slice(offset, offset + CHUNK_SIZE)
          fr.readAsArrayBuffer(slice)
        }
      }
    },
    computed: {
      ...mapState(['message'])
    }
  }
</script>
