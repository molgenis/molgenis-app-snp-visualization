import * as d3 from 'd3'

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

function plot (plotId, data, yOffset, svgElement, plotSizes, plotTitle) {
  const points = data[plotId].points
  const counts = data[plotId].counts

  const timestamp = buildTimeStamp()
  const x = d3.scaleLinear(x).range([0, plotSizes.plotWidth])
  const y = d3.scaleLinear(y).range([plotSizes.plotHeight, 0])

  x.domain([0, plotSizes.maximunPostion])
  y.domain([0, 2])

  let plotContainer = svgElement.append('svg').attr('class', 'plot-container')

  const yAxisLeft = d3.axisLeft(y).scale(y)
    .tickFormat(function (d) {
      return d
    }).ticks(2)

  const yAxisRight = d3.axisRight(y).scale(y)
    .tickFormat(function (d) {
      return counts[d]
    }).ticks(2)
  // draw ibd score counts axis
  plotContainer.append('g')
    .attr('transform', `translate(${(parseInt(plotSizes.plotWidth) + 32)},${yOffset + 50})`)
    .attr('height', plotSizes.height)
    .call(yAxisRight)
  // draw ibd score axis
  plotContainer.append('g')
    .attr('transform', `translate(30,${yOffset + 50})`)
    .attr('height', plotSizes.height)
    .call(yAxisLeft)
  // draw title
  plotContainer.append('text')
    .attr('x', plotSizes.width / 2)
    .attr('y', plotSizes.titleOffset + yOffset)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'sans-serif')
    .text(plotTitle)
  // draw time stamp
  plotContainer.append('text')
    .attr('x', plotSizes.plotWidth - 50)
    .attr('y', plotSizes.titleOffset + yOffset)
    .style('fill', 'grey')
    .style('font-size', '10px')
    .attr('font-family', 'sans-serif')
    .text(timestamp)
  // draw border
  plotContainer.append('rect')
    .attr('x', 0)
    .attr('y', yOffset)
    .attr('height', plotSizes.height)
    .attr('width', plotSizes.width)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', 1)
  // plot data points
  plotContainer.selectAll('dot').data(points).enter().append('circle')
    .attr('r', 1)
    .attr('cx', d => x(d[0]))
    .attr('cy', d => y(d[1]) + ((Math.random() - 0.5) * 20))
    .attr('transform', `translate(32,${yOffset + 50})`)
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

export default {
  plotIdentityByDecent (data, dataIndex, plotSizes, selectedChromosome) {
    plotSizes.plotWidth = plotSizes.width * 0.9
    plotSizes.plotHeight = plotSizes.height / 2
    plotSizes.minimumPostion = 0
    plotSizes.maximunPostion = maxPositionMap[selectedChromosome]
    const numberOfCombinations = Object.keys(dataIndex).length
    const svgElement = d3.select('svg')
      .attr('width', 1000)
      .attr('height', ((plotSizes.height + plotSizes.bottomMargin) * numberOfCombinations) + 120)
      .attr('id', 'plots')
    let yOffset = 70

    for (let plotId in dataIndex) {
      const geneColumnNr1 = dataIndex[plotId].gPosColumnNr1
      const geneColumnNr2 = dataIndex[plotId].gPosColumnNr2
      const plotTitle = `Chromosome ${selectedChromosome}: ${plotId} (${geneColumnNr1}-${geneColumnNr2})`
      plot(plotId, data, yOffset, svgElement, plotSizes, plotTitle)
      yOffset += plotSizes.height + plotSizes.bottomMargin
    }
  },
  clear () {
    d3.selectAll('.plot-container').remove()
  },
  buildTimeStamp
}
