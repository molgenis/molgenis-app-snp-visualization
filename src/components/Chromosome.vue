<template>
  <div id="bars"></div>
</template>

<script>
  import * as d3 from 'd3'

  export default {
    name: 'chromosome',
    watch: {
      selected: function () {
        this.chr = this.$store.state.chrBandLocations[this.selected]
        this.renderChart()
      }
    },
    computed: {
      chr_centromere: function () {
        let prevVal = 'p'
        for (var value of this.chr) {
          if (prevVal.startsWith('p') && value[2].startsWith('q')) {
            return value[0]
          } else {
            prevVal = value[2]
          }
        }
      },
      chr_size: function () {
        return this.chr.slice(-1)[0][1]
      }
    },
    data: function () {
      return {
        chr: this.$store.state.chrBandLocations[this.selected]
      }
    },
    props: ['figureWidth', 'selected'],
    mounted () {
      this.renderChart()
    },
    methods: {
      drawChromText (chr, fontsize, band, id, y, x) {
        chr.append('text')
          .attr('font-size', fontsize)
          .attr('font-family', 'sans-serif')
          .attr('fill', 'black')
          .attr('id', id + '_' + band + '_desc')
          .attr('x', x)
          .attr('y', y)
          .text(function () {
            return band
          })
      },
      drawChromRect (chr, size, band, className, id, x, ry, rx, start, stop) {
        chr.append('rect')
          .attr('width', size)
          .attr('height', 25)
          .attr('id', id + '_' + band)
          .attr('class', className)
          .attr('x', x)
          .attr('y', 20)
          .attr('stroke', 'black')
          .attr('rx', rx)
          .attr('ry', ry)
          .attr('start', start)
          .attr('stop', stop)
          .attr('band', band)
      },
      drawChromBand (chr, size, evenOrOdd, id, y, x, fontsize, band, start, stop) {
        this.drawChromRect(chr, size, band, 'chromosome-band-' + evenOrOdd, id, x, 0, 0, start, stop)
        this.drawChromText(chr, fontsize, band, id, y, x)
      },
      makeChromosome (id, transform, center) {
        let centromerePos = this.chr_size / center
        let barstop = this.figureWidth / centromerePos
        let svg = d3.select('svg')
        let chromosomeContainer = svg.attr('class', 'chr_container')
          .attr('width', this.figureWidth + 100)
          .attr('height', 70).append('g')
          .attr('transform', 'translate(32,' + transform + ')')
        const fontsize = 10
        let self = this
        self.drawChromRect(chromosomeContainer, barstop, 'p-arm', 'chromosome', id, 0, 10, 10, 0, center)
        self.drawChromRect(chromosomeContainer, self.figureWidth - barstop, 'q-arm', 'chromosome', id, barstop, 10, 10, center, self.chr_size)
        self.chr.map(function (band, i) {
          let start = self.figureWidth / (self.chr_size / band[0])
          let size = self.figureWidth / (self.chr_size / (band[1] - band[0]))
          if (i === 0) {
            self.drawChromText(chromosomeContainer, fontsize, band[2], id, 10, 0)
          } else if (i === self.chr.length - 1) {
            self.drawChromText(chromosomeContainer, fontsize, band[2], id, 10, self.figureWidth)
          } else if (band[0] === center || band[1] === center) {
          } else if (i % 2 === 0) {
            if (i % 4 === 0) {
              self.drawChromBand(chromosomeContainer, size, 'even', id, 7, start, fontsize, band[2], band[0], band[1])
            } else {
              self.drawChromBand(chromosomeContainer, size, 'even', id, 17, start, fontsize, band[2], band[0], band[1])
            }
          } else {
            if (i % 4 === 1) {
              self.drawChromBand(chromosomeContainer, size, 'odd', id, 55, start, fontsize, band[2], band[0], band[1])
            } else {
              self.drawChromBand(chromosomeContainer, size, 'odd', id, 65, start, fontsize, band[2], band[0], band[1])
            }
          }
        })
        return chromosomeContainer
      },
      clear () {
        d3.selectAll('.chr_container > *').remove()
      },
      renderChart () {
        this.clear()
        const self = this
        self.makeChromosome(self.selected, 1, self.chr_centromere)
      }
    }
  }
</script>

<style>
  svg {
    /*background-color: rgba(255, 111, 152, 0.24);*/
    margin: 25px;
  }

  rect.chromosome {
    fill: grey;
  }

  rect.chromosome-band-even {
    fill: white;
  }

  rect.chromosome-band-odd {
    fill: black;
  }

  .chr_container {
    border-radius: 15px;
  }
</style>
