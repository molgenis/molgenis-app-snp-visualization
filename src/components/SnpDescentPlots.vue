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
            <select class="form-control" id="selectChromosome" v-model="selectedChromosome"
                    @change="onChromosomeSelectChanged">
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
        </form>

      </div>
    </div>

    <div class="row">

      <div id="buttons" class="col-md-4">
        <button type="button" class="btn btn-primary" id="processFiles" @click="onProcessBtnClicked"
                :disabled="disableProcess">Process data
        </button>

        <a id="download-btn" class="btn btn-primary" href="#" role="button" :disabled="!isReadyToDownLoad"
           v-bind:class="{ disabled: !isReadyToDownLoad }">
          <i class="fa fa-download" aria-hidden="true"></i>
        </a>
      </div>

      <div id="status" class="col-md-4 text-center">
        <div id="statusUpdate" v-bind:class="alertClass" v-if="status" role="alert">
          <small><i><span v-model="status"> {{status}} </span></i></small>
          <i class="fa fa-spinner fa-pulse fa-fw" v-if="isLoading"></i>
        </div>
      </div>
    </div>

    <div class="row">
      <div id="canvas-container" class="col">
        <canvas id="plot-canvas"></canvas>
      </div>
    </div>

  </div>
</template>

<script>
  import { SET_PARSED_DEF_OBJ, SET_DATA_INDEX } from '../store/mutations'
  import lineReader from '../service/lineReader'
  import identityByDecent from '../service/identityByDecent'
  import plotter from '../service/plotter'
  import dataDefinition from '../service/dataDefinition'
  import browser from 'browser-detect'

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
        t0: 0,
        t1: 0,
        selectedChromosome: '1',
        alertClass: 'alert alert-primary'
      }
    },
    created: function () {
      this.plotSizes = {
        height: 250,
        width: 1075,
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 30,
        marginTop: 40,
        paddingLeft: 50,
        paddingRight: 50,
        bandWidth: 20,
        bandDistance: 50,
        titleOffset: 25,
        chromosomeBarHeight: 25,
        chromosomeBarRadius: 12
      }
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
        plotter.clear()
        this.isDisplayPlots = false
        this.isReadyToDownLoad = false
        this.isLoading = false
        this.status = ''
        this.alertClass = 'alert alert-primary'
      },
      onProcessBtnClicked () {
        this.clear()
        this.isLoading = true
        this.isDisplayPlots = true
        this.status = 'Processing data'
        this.t0 = performance.now()
        const maxLines = 10000000
        lineReader.readSomeLines(this.dataFile, maxLines, this.forEachLine, this.onComplete, this.handleError)
      },
      clear () {
        plotter.clear()
        this.isDisplayPlots = false
        this.isReadyToDownLoad = false
        this.isLoading = false
        this.status = ''
        this.alertClass = 'alert alert-primary'
      },
      isSelectedChromosome (columns) {
        return columns[1] === this.selectedChromosome
      },
      handleError (error) {
        if (error.startsWith('[Invalid data]')) {
          console.error('[Mismatch Error] Definition file does not match data columns')
          this.status = 'Error! Does your data file match the definition file?'
        } else {
          console.error('[File read Error] Something went wrong reading the file')
          this.status = 'Error! Something went wrong while parsing your file.'
        }
        this.isLoading = false
        this.alertClass = 'alert alert-danger'
      },
      forEachLine (line, continueReading) {
        const columns = line.split('\t')
        if (this.isSelectedChromosome(columns) && continueReading) {
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
          const combinations = Object.keys(parsedDefData)
          for (let combination of combinations) {
            if (dataIndex[combination].gPos1 === -1 || dataIndex[combination].gPos2 === -1) {
              continueReading = false
            } else {
              this.results[combination] = {'counts': {1: 0, 2: 0, 0: 0, '-1': 0}, 'points': []}
            }
          }
        }
        return continueReading
      },
      onComplete () {
        this.t1 = performance.now()
        const plotFunction = plotter.plotIdentityByDecent
        plotter.plot(this.results, this.$store.state.dataIndex, this.plotSizes, this.selectedChromosome, plotFunction)
        this.results = {}
        this.isLoading = false
        this.isReadyToDownLoad = true
        this.status = `Completed in ${Math.round((this.t1 - this.t0) / 1000)} seconds`
        this.alertClass = 'alert alert-success'
      },
      /**
       * A click handler is added to the download button to have the download function execute in the context of the
       * click event. In other works; As a security feature the browser ( chrome ) will not allow the script to store
       * a file on the users computer, but will allow the user ( click event context ) to store the file.
       **/
      setDownLoadClickHandler () {
        const currentBrowser = browser()
        const isInternetExplorer = currentBrowser.name === 'edge' || currentBrowser.name === 'ie'

        /**
         * this function needs the execute in the context of the click event
         * @param link
         */
        function downloadCanvas (link) {
          const timestamp = plotter.buildTimeStamp().replace(/ /g, '_')
          const fileName = `${timestamp}.png`
          const canvas = document.getElementById('plot-canvas')
          if (!isInternetExplorer) {
            // non ie can use simple and fast method
            link.href = canvas.toDataURL()
            link.download = fileName
          } else {
            // ie needs to use blob as intermediate
            let blob = canvas.msToBlob()
            window.navigator.msSaveBlob(blob, fileName)
          }
        }

        document.getElementById('download-btn').addEventListener('click', function () {
          downloadCanvas(this)
        }, false)
      }
    },
    computed: {
      disableProcess: function () {
        return !(this.dataFile && this.hasDefFile)
      }
    },
    mounted: function () {
      this.setDownLoadClickHandler()
    }
  }
</script>
