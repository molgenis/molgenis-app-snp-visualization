<template>
  <div>
    <div class="row">
      <div class="col">
        <h1>SNP descent plots</h1>
        <form>
          <div class="form-group">
            <label for="devFileInput">Definition file</label>
            <input class="form-control" id="devFileInput" type="file" @change="storeDef">
          </div>
          <div class="form-group">
            <label for="snpFileInput">Data file</label>
            <input class="form-control" id="snpFileInput" type="file" @change="storeData">
          </div>
          <div class="form-group">
            <label for="selectChromosome">Chromosome</label>
            <select class="form-control" id="selectChromosome" v-model="selectedChromosome">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
              <option>13</option>
              <option>14</option>
              <option>15</option>
              <option>16</option>
              <option>17</option>
              <option>18</option>
              <option>19</option>
              <option>20</option>
              <option>21</option>
              <option>22</option>
              <option>X</option>
              <option>Y</option>
            </select>
          </div>
          <button type="button" class="btn btn-primary" id="processFiles" @click="onProcessData">Process data</button>
          <button type="button" class="btn btn-primary" id="downloadPlot" @click="onDownloadButtonClick">
            <i class="fa fa-download" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div id="plot" class="plot-container"></div>
      </div>
    </div>
  </div>
</template>
<style>
  .plot-container {
    margin: 1rem 0;
    border: 1px solid #dddddd;
    width: 100%;
    height: 300px;
  }
</style>
<script>
  import {mapState} from 'vuex'
  import * as d3 from 'd3'

  export default {
    name: 'snp-descent-plot',
    data: function () {
      return {
        defFile: undefined,
        dataFile: undefined,
        t0: undefined,
        t1: undefined,
        results: [],
        selectedChromosome: '1'
      }
    },
    methods: {
      plot (data) {
        const height = 300
        const width = 1000
        const x = d3.scaleLinear(x).range([width * 0.9, 0])
        const y = d3.scaleLinear(y).range([height / 2, 0])
        x.domain(d3.extent(data, d => d[0]))
        y.domain([0, d3.max(data, d => d[1])])
        const svg = d3.select('#plot')
          .append('svg')
          .attr('width', width)
          .attr('height', height).append('g')
          .attr('id', 'svg-plot')
        const yAxis = d3.axisLeft(y).scale(y)
          .tickFormat(function (d) {
            return d
          }).ticks(2)
        svg.append('g').attr('transform', 'translate(30,50)').attr('height', height).call(yAxis)
        svg.selectAll('dot').data(data).enter().append('circle').attr('r', 1).attr('cx', d => x(d[0]))
          .attr('cy', d => y(d[1]) + ((Math.random() - 0.5) * 20)).attr('transform', 'translate(32, 50)')
      },
      onDownloadButtonClick () {
//        const canvas = document.getElementById('plot-svg')
//        const img = canvas.toDataURL('image/jpeg', 0.5)
//        document.write('<img src="' + img + '"/>')
        // https://gist.github.com/vicapow/758fce6aa4c5195d24be
        console.log('this should trigger download')
      },
      clear () {
        this.results = []
        d3.select('svg').remove()
      },
      onProcessData () {
        this.clear()
        this.t0 = performance.now()
        const maxLines = 1000000
        this.parseDefinitionFile(this.defFile)
        this.readSomeLines(this.dataFile, maxLines, this.forEachLine, this.onComplete)
      },
      storeData (event) {
        this.dataFile = event.target.files[0]
      },
      storeDef (event) {
        this.defFile = event.target.files[0]
      },
      compareAlleles (p1, p2) {
        if (p1 === p2 || (p1 === 'AB' && p2 === 'BA') || (p1 === 'BA' && p2 === 'AB')) {
          return 2
        }
        if ((p1 === 'AA' && p2 === 'BB') || (p1 === 'BB' && p2 === 'AA')) {
          return 0
        }
        if (p1 !== 'NC' && p2 !== 'NC') {
          const p1Allele1 = p1.charAt(0)
          const p1Allele2 = p1.charAt(1)
          const p2Allele1 = p1.charAt(0)
          const p2Allele2 = p1.charAt(1)
          if (p1Allele1 === p2Allele1 || p1Allele1 === p2Allele2 || p1Allele2 === p2Allele1 || p1Allele2 === p2Allele2) {
            return 1
          }
        } else {
          return -1
        }
      },
      isSelectedChromosome (columns) {
        return columns[1] === this.selectedChromosome
      },
      forEachLine (line) {
        const columns = line.split('\t')
        if (this.isSelectedChromosome(columns)) {
          const p1 = columns[3]
          const p2 = columns[6]
          this.results.push([parseInt(columns[2]), this.compareAlleles(p1, p2)])
        }
      },
      onComplete () {
        this.t1 = performance.now()
        console.log('Processing data in ' + Math.round((this.t1 - this.t0) / 1000) + ' seconds')
        this.plot(this.results)
        console.log('Plotting in ' + Math.round((this.t1 - this.t0) / 1000) + ' seconds')
      },
      parseDefinitionFile (file) {
        let defObj = {}
        const reader = new FileReader()
        reader.onload = function () {
          const lines = reader.result.split('\n')
          const columns = lines[0].split('\t')
          columns.shift()
          const defs = lines[1].split('\t')
          for (var i = 0; i < columns.length; i++) {
            defObj[columns[i]] = defs[i + 1]
          }
          console.log(defObj)
        }
        reader.readAsText(file)
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
