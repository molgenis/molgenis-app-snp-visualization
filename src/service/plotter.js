import jquery from 'jquery'
import chromosomePositions from './chromosomePositions'
// const arc = 2 * Math.PI

// Max position per chromosome, used to determine plot domain on x axis, Min position is always 0
const maxPositionMap = {
  '1': 249250621,
  '2': 243199373,
  '3': 198022430,
  '4': 191154276,
  '5': 180915260,
  '6': 171115067,
  '7': 159138663,
  '8': 146364022,
  '9': 141213431,
  '10': 135534747,
  '11': 135006516,
  '12': 133851895,
  '13': 115169878,
  '14': 107349540,
  '15': 102531392,
  '16': 90354753,
  '17': 81195210,
  '18': 78077248,
  '19': 59128983,
  '20': 63025520,
  '21': 48129895,
  '22': 51304566,
  'X': 155270560,
  'Y': 59373566
}

function buildTimeStamp () {
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
}

function drawPoint (context, x, y) {
  context.fillRect(x, y, 2, 2) // point as 2 by 2 cube
}

function drawBackgroud (context, x, y, width, height) {
  context.fillStyle = 'white'
  context.fillRect(x, y, width, height)
}

function canvasPlot (points, counts, yOffset, context, plotSizes, plotTitle, timeStamp) {
  const invertedYCorrection = yOffset + plotSizes.height - plotSizes.marginBottom
  const tickLabelOffset = 5
  const axisWidth = 1
  const twoScoreY = invertedYCorrection - (3 * plotSizes.bandDistance + (plotSizes.bandWidth * 0.5))
  const oneScoreY = invertedYCorrection - (2 * plotSizes.bandDistance + (plotSizes.bandWidth * 0.5))
  const zeroScoreY = invertedYCorrection - (plotSizes.bandDistance + (plotSizes.bandWidth * 0.5))
  const ncScoreY = invertedYCorrection - (plotSizes.bandWidth * 0.5)

  // draw border
  context.fillStyle = 'black'
  context.strokeRect(plotSizes.marginLeft, yOffset, plotSizes.width, plotSizes.height)

  // draw title
  const plotCenter = Math.floor(plotSizes.width / 2)
  const textY = yOffset + plotSizes.titleOffset
  context.textAlign = 'center'
  context.font = '12px sans-serif'
  context.fillText(plotTitle, plotCenter, textY)

  // draw time stamp
  const timeStampX = plotSizes.width - plotSizes.paddingRight
  context.fillStyle = 'grey'
  context.textAlign = 'end'
  context.fillText(timeStamp, timeStampX, textY)

  // draw plot
  context.fillStyle = 'black'
  for (let i = points.length - 1; i >= 0; i--) {
    const position = points[i][0]
    const score = points[i][1] + 1 // plus one to normalize [-1, 2] to [0, 3]
    const jitter = (Math.random() - 0.5) * plotSizes.bandWidth
    const x = plotSizes.plotXStart + Math.floor(position * plotSizes.xScale)
    const y = Math.floor(invertedYCorrection - (0.5 * plotSizes.bandWidth) - ((score) * plotSizes.bandDistance) + jitter)
    drawPoint(context, x, y)
  }

  // draw left snp score axis
  context.fillStyle = 'grey'
  context.textBaseline = 'middle'
  context.textAlign = 'end'
  const axisLength = 3 * plotSizes.bandDistance + plotSizes.bandWidth
  const leftAxisYStart = invertedYCorrection - axisLength
  const leftTickLabelX = plotSizes.plotXStart - tickLabelOffset

  // draw left axis
  context.fillRect(plotSizes.plotXStart, leftAxisYStart, axisWidth, axisLength)

  // draw ticks
  context.fillRect(leftTickLabelX, twoScoreY, tickLabelOffset, axisWidth)
  context.fillRect(leftTickLabelX, oneScoreY, tickLabelOffset, axisWidth)
  context.fillRect(leftTickLabelX, zeroScoreY, tickLabelOffset, axisWidth)
  context.fillRect(leftTickLabelX, ncScoreY, tickLabelOffset, axisWidth)

  // draw tick labels
  context.fillText('2', leftTickLabelX, twoScoreY)
  context.fillText('1', leftTickLabelX, oneScoreY)
  context.fillText('0', leftTickLabelX, zeroScoreY)
  context.fillText('NC', leftTickLabelX, ncScoreY)

  // draw right count score axis
  context.fillStyle = 'grey'
  context.textBaseline = 'middle'
  context.textAlign = 'start'
  const rightTickLabelX = plotSizes.plotXEnd + tickLabelOffset

  // draw right axis
  context.fillRect(plotSizes.plotXEnd, leftAxisYStart, axisWidth, axisLength)

  // draw ticks
  context.fillRect(plotSizes.plotXEnd, twoScoreY, tickLabelOffset, axisWidth)
  context.fillRect(plotSizes.plotXEnd, oneScoreY, tickLabelOffset, axisWidth)
  context.fillRect(plotSizes.plotXEnd, zeroScoreY, tickLabelOffset, axisWidth)
  context.fillRect(plotSizes.plotXEnd, ncScoreY, tickLabelOffset, axisWidth)

  // draw tick labels
  context.fillText(counts['2'], rightTickLabelX, twoScoreY)
  context.fillText(counts['1'], rightTickLabelX, oneScoreY)
  context.fillText(counts['0'], rightTickLabelX, zeroScoreY)
  context.fillText(counts['-1'], rightTickLabelX, ncScoreY)
}

function addPlotFooter (context, footer, x, y) {
  context.fillText(footer, x, y)
}

function calculateXScaleCoefficient (width, paddingLeft, paddingRight, maxPosition) {
  return (width - paddingLeft - paddingRight) / maxPosition
}

function plotIdentityByDecent (data, dataIndex, plotSizes, selectedChromosome, timeStamp, context, yOffset) {
  const dataIndexKeys = Object.keys(dataIndex)
  for (let plotId of dataIndexKeys) {
    const geneColumnNr1 = dataIndex[plotId].gPosColumnNr1
    const geneColumnNr2 = dataIndex[plotId].gPosColumnNr2
    const plotTitle = `Chromosome ${selectedChromosome}: ${plotId} (${geneColumnNr1}-${geneColumnNr2})`
    canvasPlot(data[plotId].points, data[plotId].counts, yOffset, context, plotSizes, plotTitle, timeStamp)
    yOffset += plotSizes.height + plotSizes.marginBottom
  }
}

function roundRect (context, x, y, width, height, radius, evenOrOdd) {
  if (typeof radius === 'undefined') {
    radius = 5
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius}
  } else {
    let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0}
    for (let side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
    }
  }
  context.fillStyle = 'black'
  context.beginPath()
  context.moveTo(x + radius.tl, y)
  context.lineTo(x + width - radius.tr, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  context.lineTo(x + width, y + height - radius.br)
  context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  context.lineTo(x + radius.bl, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  context.lineTo(x, y + radius.tl)
  context.quadraticCurveTo(x, y, x + radius.tl, y)
  context.closePath()
  if (evenOrOdd === 'odd') {
    context.fill()
  }
  context.stroke()
}

function addChromosomeBandLabel (context, bandLabel, x, y) {
  context.fillText(bandLabel, x, y)
}

function drawChromosomeBand (context, plotSizes, bandWidth, evenOrOdd, labelYPosition, x, bandLabel) {
  context.fillStyle = 'black'
  context.strokeRect(x, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight)
  if (evenOrOdd === 'odd') {
    context.fillRect(x, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight)
  }
  addChromosomeBandLabel(context, bandLabel, x, labelYPosition)
}

// Position of band-labels based on %2 and %4
// even -> below the chromosome, %4 == 0 low, else high; odd -> above the chromosome , %4 == 1 low, else high
const getLabelPosition = (value, margin) => {
  if (value % 2 === 0) {
    return value % 4 === 0 ? margin * 2.1 - 60 : margin * 2.1 - 50
  } else {
    return value % 4 === 1 ? margin * 2.1 - 10 : margin * 2.1
  }
}

// Color of chromosome bands in the canvas is based on even (white) or odd index (black)
const isEvenOrOdd = (value) => value % 2 === 0 ? 'even' : 'odd'

function plotChromosome (plotSizes, selectedChromosome, context) {
  const chromosomeData = chromosomePositions.getChromosomeData(selectedChromosome)
  const centerPosition = chromosomePositions.chromosomeCentromere(selectedChromosome)
  const leftRadius = {tl: plotSizes.chromosomeBarRadius, bl: plotSizes.chromosomeBarRadius}
  const rightRadius = {tr: plotSizes.chromosomeBarRadius, br: plotSizes.chromosomeBarRadius}

  chromosomeData.map(function (band, i) {
    let startX = plotSizes.plotXStart + band[0] * plotSizes.xScale
    let bandWidth = (band[1] - band[0]) * plotSizes.xScale
    const bandLabel = band[2]
    const evenOrOdd = isEvenOrOdd(i)
    const labelPosition = getLabelPosition(i, plotSizes.marginTop)
    if (i === 0 || band[0] === centerPosition) {
      // Draw left round rect
      roundRect(context, startX, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight, leftRadius, evenOrOdd)
      addChromosomeBandLabel(context, bandLabel, startX, labelPosition)
    } else if (i === chromosomeData.length - 1 || band[1] === centerPosition) {
      // Draw right round rect
      roundRect(context, startX, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight, rightRadius, evenOrOdd)
      addChromosomeBandLabel(context, bandLabel, startX, labelPosition)
    } else {
      drawChromosomeBand(context, plotSizes, bandWidth, evenOrOdd, labelPosition, startX, bandLabel)
    }
  })
}

const calculateCanvasWidth = (plotSizes) => plotSizes.width + plotSizes.marginLeft + plotSizes.marginRight

const calculateCanvasHeight = (plotSizes, yOffset, numberOfCombinations) => yOffset + (plotSizes.height + plotSizes.marginBottom) * numberOfCombinations

function plot (data, dataIndex, plotSizes, selectedChromosome, plotFunction) {
  plotSizes.xScale = calculateXScaleCoefficient(plotSizes.width, plotSizes.paddingLeft, plotSizes.paddingRight, maxPositionMap[selectedChromosome])
  const numberOfCombinations = Object.keys(dataIndex).length
  const timeStamp = buildTimeStamp()
  plotSizes.plotXStart = plotSizes.marginLeft + plotSizes.paddingLeft
  plotSizes.plotXEnd = plotSizes.plotXStart + (plotSizes.width - plotSizes.paddingLeft - plotSizes.paddingRight)
  const canvas = document.getElementById('plot-canvas')
  let yOffset = 120
  const canvasWidth = calculateCanvasWidth(plotSizes)
  const canvasHeight = calculateCanvasHeight(plotSizes, yOffset, numberOfCombinations)
  canvas.height = canvasHeight
  canvas.width = canvasWidth
  const context = canvas.getContext('2d')
  drawBackgroud(context, 0, 0, canvasWidth, canvasHeight)
  plotChromosome(plotSizes, selectedChromosome, context)
  plotFunction(data, dataIndex, plotSizes, selectedChromosome, timeStamp, context, yOffset)
  addPlotFooter(context, 'Powered by MOLGENIS', plotSizes.paddingLeft, canvasHeight - plotSizes.marginBottom + 10)
}

function clear () {
  jquery('#plot-canvas').remove()
  jquery('#canvas-container').append('<canvas id="plot-canvas"></canvas>')
}

export default {
  plot,
  clear,
  plotIdentityByDecent,
  calculateXScaleCoefficient,
  buildTimeStamp,
  isEvenOrOdd,
  getLabelPosition,
  calculateCanvasWidth,
  calculateCanvasHeight
}