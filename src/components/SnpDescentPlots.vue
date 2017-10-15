<template>
  <div>
    <div class="row">
      <div class="col">
        <h1>SNP Visualizations</h1>
        <form>
          <div class="form-group">
            <label for="devFileInput">Definition file</label>
            <input class="form-control" id="devFileInput" type="file" @change="parseDefinitionFile">
          </div>
          <div class="form-group">
            <label for="snpFileInput">Data file</label>
            <input class="form-control" id="snpFileInput" type="file" @change="storeData">
          </div>
          <div class="form-group">
            <label for="selectChromosome">Chromosome</label>
            <select class="form-control" id="selectChromosome" v-model="selectedChromosome" @change="hidePlots">
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
          <button type="button" class="btn btn-primary" id="processFiles" @click="onProcessData" :disabled="disableProcess">Process data</button>
          <button type="button" class="btn btn-primary" id="downloadPlot" @click="onDownloadButtonClick" :disabled="!isReadyToDownLoad">
            <i class="fa fa-download" aria-hidden="true"></i>
          </button>
          <span id="statusUpdate"><small><i><span v-model="status">{{status}}</span></i></small><i
            class="fa fa-spinner fa-pulse fa-fw" v-if="isLoading"></i></span>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div id="plot" class="plots-container" v-show="isDisplayPlots">
         <svg>
          <chromosome :figureWidth="plotSizes.width * 0.9" :selected="selectedChromosome"></chromosome>
         </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .plots-container {
    margin: 1rem 0;
  }

  #statusUpdate {
    color: grey;
  }
</style>
<script>
  import { mapState } from 'vuex'
  import { SET_PARSED_DEF_OBJ, SET_DATA_INDEX } from '../store/mutations'
  import Chromosome from './Chromosome'
  import * as d3 from 'd3'
  import { saveSvgAsPng } from 'save-svg-as-png'
  import lineReader from '../service/lineReader'
  import identityByDecent from '../service/identityByDecent'

  export default {
    name: 'snp-descent-plot',
    data: function () {
      return {
        isDisplayPlots: false,
        disableProcess: true,
        isReadyToDownLoad: false,
        isLoading: false,
        status: '',
        dataFile: undefined,
        hasDefFile: false,
        t0: undefined,
        t1: undefined,
        results: {},
        selectedChromosome: '1',
        plotSizes: {
          height: 300,
          width: 1000,
          bottomMargin: 30,
          titleOffset: 25
        }
      }
    },
    components: {Chromosome},
    methods: {
      plot (data, plotId, counts, yOffset, svg) {
        this.status = `Plotting ${plotId}...`

        const timestamp = this.getCurrentDateTime()
        const dnaNumbers = this.$store.state.parsedDefObj[plotId]

        const height = this.plotSizes.height
        const width = this.plotSizes.width
        const titleOffset = this.plotSizes.titleOffset
        const plotWidth = width * 0.9
        const plotHeight = height / 2

        const x = d3.scaleLinear(x).range([plotWidth, 0])
        const y = d3.scaleLinear(y).range([plotHeight, 0])
        x.domain(d3.extent(data, d => d[0]))
        y.domain([0, d3.max(data, d => d[1])])

        const yAxisLeft = d3.axisLeft(y).scale(y)
          .tickFormat(function (d) {
            return d
          }).ticks(2)

        const yAxisRight = d3.axisRight(y).scale(y)
          .tickFormat(function (d) {
            return counts[d]
          })
          .ticks(2)
        let plotContainer = svg.append('svg').attr('class', 'plot-container')
        plotContainer.append('g')
          .attr('transform', `translate(${(parseInt(plotWidth) + 32)},${yOffset + 50})`)
          .attr('height', height)
          .call(yAxisRight)

        plotContainer.append('g')
          .attr('transform', `translate(30,${yOffset + 50})`)
          .attr('height', height)
          .call(yAxisLeft)

        plotContainer.selectAll('dot').data(data).enter().append('circle')
          .attr('r', 1)
          .attr('cx', d => x(d[0]))
          .attr('cy', d => y(d[1]) + ((Math.random() - 0.5) * 20))
          .attr('transform', `translate(32,${yOffset + 50})`)

        plotContainer.append('text')
          .attr('x', width / 2)
          .attr('y', titleOffset + yOffset)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
          .text(`Chromosome ${this.selectedChromosome} : ${plotId} (${dnaNumbers[0]}-${dnaNumbers[1]})`)
        plotContainer.append('text')
          .attr('x', plotWidth - 50)
          .attr('y', titleOffset + yOffset)
          .style('fill', 'grey')
          .style('font-size', '10px')
          .attr('font-family', 'sans-serif')
          .text(timestamp)
        plotContainer.append('rect')
          .attr('x', 0)
          .attr('y', yOffset)
          .attr('height', height)
          .attr('width', width)
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', 1)
      },
      hidePlots () {
        this.isDisplayPlots = false
      },
      setDisableProcess () {
        this.disableProcess = !(this.dataFile && this.hasDefFile)
      },
      getCurrentDateTime () {
        let currentDate = new Date()
        let minutes = currentDate.getMinutes()
        if (minutes < 10) {
          minutes = '0' + minutes.toString()
        }
        return currentDate.getDate() + '/' +
          (currentDate.getMonth() + 1) + '/' +
          currentDate.getFullYear() + ' @ ' +
          currentDate.getHours() + ':' +
          minutes
      },
      onDownloadButtonClick () {
        const svgElements = document.querySelectorAll('div>.plots-container>svg')
        const timestamp = this.getCurrentDateTime().replace(/ /g, '_')
        const name = `${timestamp}.png`
        saveSvgAsPng(svgElements[0], name, {backgroundColor: 'white', width: 1050})
      },
      clear () {
        this.results = {}
        this.isDisplayPlots = false
        d3.selectAll('.plot-container').remove()
        this.isReadyToDownLoad = false
        this.isLoading = false
        this.status = ''
      },
      calculatePlotCombinations (defs) {
        const keys = Object.keys(defs)
        let results = {}
        for (let i = 0; i < keys.length - 1; i++) {
          // This is where you'll capture that last value
          for (let j = i + 1; j < keys.length; j++) {
            results[`${keys[i]}-${keys[j]}`] = [defs[keys[i]], defs[keys[j]]]
          }
        }
        return results
      },
      onProcessData () {
        this.clear()
        this.isLoading = true
        this.isDisplayPlots = true
        this.status = 'Processing data'
        this.t0 = performance.now()
        const maxLines = 1000
        lineReader.readSomeLines(this.dataFile, maxLines, this.forEachLine, this.onComplete)
      },
      storeData (event) {
        this.dataFile = event.target.files[0]
        this.setDisableProcess()
      },
      isSelectedChromosome (columns) {
        return columns[1] === this.selectedChromosome
      },
      forEachLine (line) {
        const columns = line.split('\t')
        if (this.isSelectedChromosome(columns)) {
          const combinationLabels = Object.keys(this.$store.state.dataIndex)
          for (let combination of combinationLabels) {
            const index1 = this.$store.state.dataIndex[combination].gPos1
            const index2 = this.$store.state.dataIndex[combination].gPos2
            const id1 = columns[index1]
            const id2 = columns[index2]
            const alleleScore = identityByDecent.computeScore(id1, id2)
            // The alleleScore is equal to the key in the counts object
            this.results[combination].counts[alleleScore] += 1
            this.results[combination].points.push([parseInt(columns[2]), alleleScore])
          }
        } else if (columns[0] === 'Name') {
          const parsedDefData = this.$store.state.parsedDefObj
          const dataIndex = this.buildDataIndex(parsedDefData, columns)
          this.$store.commit(SET_DATA_INDEX, dataIndex)
          for (let combination in dataIndex) {
            this.results[combination] = {'counts': {1: 0, 2: 0, 0: 0, '-1': 0}, 'points': []}
          }
        }
      },
      onComplete () {
        this.t1 = performance.now()
        const numberOfCombinations = Object.keys(this.$store.state.dataIndex).length
        const height = this.plotSizes.height
        const bottomMargin = this.plotSizes.bottomMargin
        const svg = d3.select('svg')
          .attr('width', 1000)
          .attr('height', ((height + bottomMargin) * numberOfCombinations) + 120)
          .attr('id', 'plots')
        let yOffset = 70
        for (let combination in this.$store.state.dataIndex) {
          this.plot(this.results[combination].points, combination, this.results[combination].counts, yOffset, svg)
          yOffset += height + bottomMargin
        }
        this.isLoading = false
        this.isReadyToDownLoad = true
        this.status = `Completed in ${Math.round((this.t1 - this.t0) / 1000)} seconds`
      },
      readDefinitionLines (lineData) {
        let defObj = {}
        const lines = lineData.split('\n')
        const columns = lines[0].replace(/\r/g, '').split('\t')
        columns.shift()
        const defs = lines[1].replace(/\r/g, '').split('\t')
        for (let i = 0; i < columns.length; i++) {
          defObj[columns[i]] = defs[i + 1]
        }
        return defObj
      },
      parseDefinitionFile (event) {
        const file = event.target.files[0]
        if (file) {
          this.hasDefFile = true
          const self = this
          const reader = new FileReader()
          reader.onload = function () {
            const defObj = self.readDefinitionLines(reader.result)
            self.$store.commit(SET_PARSED_DEF_OBJ, self.calculatePlotCombinations(defObj))
          }
          reader.readAsText(file)
        } else {
          this.hasDefFile = false
          this.setDisableProcess()
        }
      },
      buildDataIndex (parsedDefData, columnHeaders) {
        const combinations = Object.keys(parsedDefData)
        let dataIndex = {}
        for (let combination of combinations) {
          const gPos1 = columnHeaders.indexOf(parsedDefData[combination][0] + '.GType')
          const gPos2 = columnHeaders.indexOf(parsedDefData[combination][1] + '.GType')
          dataIndex[combination] = {gPos1, gPos2}
        }
        return dataIndex
      }
    },
    computed: {
      ...mapState(['message'])
    }
  }
</script>
