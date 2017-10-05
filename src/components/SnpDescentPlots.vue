<template>
  <div class="row">
    <div class="col">
      <h1>SNP descent plots</h1>
      <form>
        <div class="form-group">
          <label for="devFileInput">Definition file</label>
          <input class="form-control" id="devFileInput" type="file" @change="storeDefinition">
        </div>
        <div class="form-group">
          <label for="snpFileInput">Data file</label>
          <input class="form-control" id="snpFileInput" type="file" @change="storeData">
        </div>
        <button type="button" class="btn btn-primary" id="processFiles" @click="onProcessData">Process data</button>
      </form>
      <div id="plot"></div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import * as d3 from 'd3'

  export default {
    name: 'snp-descent-plot',
    data: function () {
      return {
        definitionFile: undefined,
        dataFile: undefined,
        t0: undefined,
        t1: undefined,
        results: []
      }
    },
    methods: {
      plot (data) {
        const height = 200
        const width = 800
        const x = d3.scaleLinear(x).range([width, 0])
        const y = d3.scaleLinear(y).range([height, 0])
        x.domain(d3.extent(data, (d, i) => i))
        y.domain([0, d3.max(data, d => d)])
        const svg = d3.select('#plot')
          .append('svg')
          .attr('width', width + 60)
          .attr('height', height + 60).append('g')
        svg.selectAll('dot').data(data).enter().append('circle').attr('r', 3.5).attr('cx', (d, i) => x(i))
          .attr('cy', d => y(d)).attr('transform', 'translate(50, 10)').attr('xIndex', (d, i) => i).attr('yVal', (d, i) => d).attr('class', 'dot')
      },
      onProcessData () {
        this.t0 = performance.now()
        const maxLines = 800000
        this.readSomeLines(this.dataFile, maxLines, this.forEachLine, this.onComplete)
      },
      storeData (event) {
        this.dataFile = event.target.files[0]
      },
      storeDefinition (event) {
        this.definitionFile = event.target.files[0]
      },
      compareAlleles (p1, p2) {
        if (p1 === p2) return 2
        if (p1 !== 'NA' && p2 !== 'NA') {
          const p1Allele1 = p1.charAt(0)
          const p1Allele2 = p1.charAt(1)
          const p2Allele1 = p1.charAt(0)
          const p2Allele2 = p1.charAt(1)
          if (p1Allele1 === p2Allele1 || p1Allele1 === p2Allele2 || p1Allele2 === p2Allele1 || p1Allele2 === p2Allele2) {
            return 1
          } else {
            return 0
          }
        } else {
          return -1
        }
      },
      forEachLine (line) {
        const lineContent = line.split('\t')
        const p1 = lineContent[3]
        const p2 = lineContent[6]
        this.results.push(this.compareAlleles(p1, p2))
      },
      onComplete () {
        this.t1 = performance.now()
        console.log(' in ' + Math.round((this.t1 - this.t0) / 1000) + ' seconden')
        this.plot(this.results)
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
      },
      readDefFile () {

      }
    },
    computed: {
      ...mapState(['message'])
    }
  }
</script>
