<template>
  <div>
    <div class="row">
      <div class="col">
        <h1>SNP Visualizations</h1>
        <form>
          <div class="form-group">
            <label for="devFileInput">Definition file</label>
            <input class="form-control" id="devFileInput" type="file" @change="onDefinitionFileInputChanged">
          </div>
          <div class="form-group">
            <label for="snpFileInput">Data file</label>
            <input class="form-control" id="snpFileInput" type="file" @change="onDataFileInputChanged">
          </div>
          <div class="form-group">
            <label for="selectChromosome">Chromosome</label>
            <select class="form-control" id="selectChromosome" v-model="selectedChromosome" @change="onChromosomeSelectChanged">
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
          <button type="button" class="btn btn-primary" id="processFiles" @click="onProcessBtnClicked" :disabled="disableProcess">Process data</button>
          <button type="button" class="btn btn-primary" id="downloadPlot" @click="onDownloadBtnClicked" :disabled="!isReadyToDownLoad">
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
  import { SET_PARSED_DEF_OBJ, SET_DATA_INDEX } from '../store/mutations'
  import Chromosome from './Chromosome'
  import { saveSvgAsPng } from 'save-svg-as-png'
  import lineReader from '../service/lineReader'
  import identityByDecent from '../service/identityByDecent'
  import plotter from '../service/plotter'
  import dataDefinition from '../service/dataDefinition'

  export default {
    name: 'snp-descent-plot',
    data: function () {
      return {
        isDisplayPlots: false,
        isReadyToDownLoad: false,
        isLoading: false,
        status: '',
        dataFile: undefined,
        hasDefFile: false,
        t0: undefined,
        t1: undefined,
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
    created: function () {
      this.results = {}
    },
    methods: {
      onDefinitionFileInputChanged (event) {
        this.clear()
        const file = event.target.files[0]
        if (file) {
          this.hasDefFile = true
          const self = this
          const reader = new FileReader()
          reader.onload = function () {
            const defObj = dataDefinition.readDefinitionLines(reader.result)
            self.$store.commit(SET_PARSED_DEF_OBJ, dataDefinition.calculatePlotCombinations(defObj))
          }
          reader.readAsText(file)
        } else {
          this.hasDefFile = false
        }
      },
      onDataFileInputChanged (event) {
        this.clear()
        this.dataFile = event.target.files[0]
      },
      onChromosomeSelectChanged () {
        this.isDisplayPlots = false
        this.isReadyToDownLoad = false
        this.isLoading = false
        this.status = ''
      },
      onProcessBtnClicked () {
        this.clear()
        this.isLoading = true
        this.isDisplayPlots = true
        this.status = 'Processing data'
        this.t0 = performance.now()
        const maxLines = 1000000
        lineReader.readSomeLines(this.dataFile, maxLines, this.forEachLine, this.onComplete)
      },
      onDownloadBtnClicked () {
        const svgElements = document.querySelectorAll('div>.plots-container>svg')
        const timestamp = plotter.buildTimeStamp().replace(/ /g, '_')
        const name = `${timestamp}.png`
        saveSvgAsPng(svgElements[0], name, {backgroundColor: 'white', width: 1050})
      },
      clear () {
        plotter.clear()
        this.isDisplayPlots = false
        this.isReadyToDownLoad = false
        this.isLoading = false
        this.status = ''
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
          const dataIndex = dataDefinition.buildDataIndex(parsedDefData, columns)
          this.$store.commit(SET_DATA_INDEX, dataIndex)
          for (let combination in dataIndex) {
            this.results[combination] = {'counts': {1: 0, 2: 0, 0: 0, '-1': 0}, 'points': []}
          }
        }
      },
      onComplete () {
        this.t1 = performance.now()
        this.status = 'Plotting ' // ${combination}...`
        plotter.plotIdentityByDecent(this.results, this.$store.state.dataIndex, this.plotSizes, this.selectedChromosome)
        this.results = {}
        this.isLoading = false
        this.isReadyToDownLoad = true
        this.status = `Completed in ${Math.round((this.t1 - this.t0) / 1000)} seconds`
      }
    },
    computed: {
      disableProcess: function () {
        return !(this.dataFile && this.hasDefFile)
      }
    }
  }
</script>
