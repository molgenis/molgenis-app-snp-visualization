import jquery from 'jquery-slim'
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

// function drawCircle (context, x, y) {
//   // context.beginPath()
//   context.arc(x, y, 2, 0, arc, false)
//   // context.stroke()
//   // context.closePath()
// }

function drawPoint (context, x, y) {
  context.fillRect(x, y, 2, 2) // point as 2 by 2 cube
}

function canvasPlot (plotId, points, counts, yOffset, context, plotSizes, plotTitle, timeStamp) {
  console.log(`plotId: ${plotId}, data, yOffset: ${yOffset}, plotSizes: ${plotSizes}, plotTitle:  ${plotTitle}`)
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
    // console.log(`position: ${position}, score: ${score}`)
    const jitter = (Math.random() - 0.5) * plotSizes.bandWidth
    const x = plotSizes.plotXStart + Math.floor(position * plotSizes.xScale)
    const y = Math.floor(invertedYCorrection - (0.5 * plotSizes.bandWidth) - ((score) * plotSizes.bandDistance) + jitter)
    // console.log(`x: ${x}, y: ${y}`)
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

function calculateXScaleCoefficient (width, paddingLeft, paddingRight, maxPosition) {
  return (width - paddingLeft - paddingRight) / maxPosition
}

function plotIdentityByDecent (data, dataIndex, plotSizes, selectedChromosome, timeStamp, context, yOffset) {
  for (let plotId in dataIndex) {
    const geneColumnNr1 = dataIndex[plotId].gPosColumnNr1
    const geneColumnNr2 = dataIndex[plotId].gPosColumnNr2
    const plotTitle = `Chromosome ${selectedChromosome}: ${plotId} (${geneColumnNr1}-${geneColumnNr2})`
    canvasPlot(plotId, data[plotId].points, data[plotId].counts, yOffset, context, plotSizes, plotTitle, timeStamp)
    yOffset += plotSizes.height + plotSizes.marginBottom
  }
}

function roundRect (context, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true
  }
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
  if (fill) {
    context.fill()
  }
  if (stroke) {
    context.stroke()
  }
}

function drawChromosomeBand (context, plotSizes, bandWidth, evenOrOdd, y, x, bandLabel) {
  console.log(`y: ${y}, x: ${x}, bandLabel: ${bandLabel}`)
  if (evenOrOdd === 'even') {
    context.strokeRect(x, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight)
  } else {
    context.fillRect(x, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight)
  }
}

function plotChromosome (plotSizes, selectedChromosome, context, yOffset) {
  const chromosomeData = chromosomePositions.getChromosomeData(selectedChromosome)
  const centerPosition = chromosomePositions.chromosomeCentromere(selectedChromosome)
  const pArmWidth = centerPosition * plotSizes.xScale
  console.log(`bar x: ${plotSizes.plotXStart}, y: ${plotSizes.marginTop}, width: ${pArmWidth}, height: ${plotSizes.chromosomeBarHeight}`)
  // context.strokeRect(plotSizes.plotXStart, plotSizes.marginTop, pArmWidth, plotSizes.chromosomeBarHeight)
  const leftRadius = {tl: plotSizes.chromosomeBarRadius, bl: plotSizes.chromosomeBarRadius}
  const rightRadius = {tr: plotSizes.chromosomeBarRadius, br: plotSizes.chromosomeBarRadius}

  chromosomeData.map(function (band, i) {
    let startX = plotSizes.plotXStart + band[0] * plotSizes.xScale
    let bandWidth = (band[1] - band[0]) * plotSizes.xScale
    const bandLabel = band[2]
    if (i === 0) {
      // first bar bar draw left round rect
      // drawChromText(chromosomeContainer, fontsize, band[2], id, 10, 0)
      roundRect(context, startX, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight, leftRadius)
    } else if (i === chromosomeData.length - 1) {
      // last bar draw right round rect
      roundRect(context, startX, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight, rightRadius)
    } else if (band[0] === centerPosition) {
      // draw left round rect
      roundRect(context, startX, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight, leftRadius)
    } else if (band[1] === centerPosition) {
      // draw right round rect
      roundRect(context, startX, plotSizes.marginTop, bandWidth, plotSizes.chromosomeBarHeight, rightRadius)
    } else if (i % 2 === 0) {
      if (i % 4 === 0) {
        drawChromosomeBand(context, plotSizes, bandWidth, 'even', 7, startX, bandLabel)
      } else {
        drawChromosomeBand(context, plotSizes, bandWidth, 'even', 17, startX, bandLabel)
      }
    } else {
      if (i % 4 === 1) {
        drawChromosomeBand(context, plotSizes, bandWidth, 'odd', 55, startX, bandLabel)
      } else {
        drawChromosomeBand(context, plotSizes, bandWidth, 'odd', 65, startX, bandLabel)
      }
    }
  })
}

function plot (data, dataIndex, plotSizes, selectedChromosome, plotFunction) {
  plotSizes.xScale = calculateXScaleCoefficient(plotSizes.width, plotSizes.paddingLeft, plotSizes.paddingRight, maxPositionMap[selectedChromosome])
  const numberOfCombinations = Object.keys(dataIndex).length
  const timeStamp = buildTimeStamp()
  plotSizes.plotXStart = plotSizes.marginLeft + plotSizes.paddingLeft
  plotSizes.plotXEnd = plotSizes.plotXStart + (plotSizes.width - plotSizes.paddingLeft - plotSizes.paddingRight)
  const canvas = document.getElementById('plot-canvas')
  canvas.width = plotSizes.width + plotSizes.marginLeft + plotSizes.marginRight
  canvas.height = ((plotSizes.height + plotSizes.marginBottom) * numberOfCombinations) + 120
  const context = canvas.getContext('2d')
  let yOffset = 70

  plotChromosome(plotSizes, selectedChromosome, context, yOffset)
  plotFunction(data, dataIndex, plotSizes, selectedChromosome, timeStamp, context, yOffset)
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
  buildTimeStamp
}
