import plotter from '@/service/plotter'

describe('plotter', () => {
    describe('calculateXScaleCoefficient', () => {
        it('should calculate the X scale coefficient', () => {
            const width = 1020
            const paddingLeft = 10
            const paddingRight = paddingLeft
            const maxPosition = 5000
            const coefficient = plotter.calculateXScaleCoefficient(width, paddingLeft, paddingRight, maxPosition)
            expect(coefficient).toEqual(0.2)
        })
    })
    describe('isEvenOrOdd', () => {
        it('should return odd for odd value', () => {
            expect(plotter.isEvenOrOdd(1)).toEqual('odd')
        })
        it('should return even for 0', () => {
            expect(plotter.isEvenOrOdd(0)).toEqual('even')
        })
        it('should return even for even value', () => {
            expect(plotter.isEvenOrOdd(2)).toEqual('even')
        })
    })
    describe('getLabelPos', () => {
        it('should return 40 * 2.1 - 60 = 24 for even value with %4 equal to 0', () => {
            expect(plotter.getLabelPosition(0, 40)).toEqual(24)
        })
        it('should return 40 * 2.1 - 50 = 34 for even value with %4 not equal to 0', () => {
            expect(plotter.getLabelPosition(2, 40)).toEqual(34)
        })
        it('should return 40 * 2.1 - 10 = 74 for odd  value with %4 equal to 1', () => {
            expect(plotter.getLabelPosition(1, 40)).toEqual(74)
        })
        it('should return 40 * 2.1      = 84 for odd  value with %4 not equal to 1', () => {
            expect(plotter.getLabelPosition(3, 40)).toEqual(84)
        })
    })
    describe('calculateCanvasWidth', () => {
        const plotSizes = {
            width: 1000,
            marginLeft: 25,
            marginRight: 25,
            height: 250,
            marginBottom: 30,
            marginTop: 40,
            paddingLeft: 50,
            paddingRight: 50,
            bandWidth: 20,
            bandDistance: 50,
            titleOffset: 25,
            chromosomeBarHeight: 25,
            chromosomeBarRadius: 12,
            plotXStart: 0,
            xScale: 0,
            plotXEnd: 0
        }
        it('should return the canvas width', () => {
            expect(plotter.calculateCanvasWidth(plotSizes)).toEqual(1050)
        })
    })
    describe('calculateCanvasHeight', () => {
        const plotSizes = {
            height: 200,
            marginBottom: 50
        }
        it('should return the canvas height', () => {
            const yOffset = 100
            const numberOfCombinations = 4
            expect(plotter.calculateCanvasHeight(plotSizes, yOffset, numberOfCombinations)).toEqual(1100)
        })
    })
})