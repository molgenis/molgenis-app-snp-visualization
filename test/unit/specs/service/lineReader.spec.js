import lineReader from 'service/lineReader.js'

const createFile = function (fileData) {
  let create = [fileData]
  let blob = new Blob([create], {'type': 'text/plain'})
  return (blob.size > 0 ? blob : 'file creation error')
}

describe('LineReader', () => {
  describe('readSomeLines', () => {
    it('should use read lines until maxLines is read and the call onComplete', (done) => {
      const multiLineFileData = `Authentic bitters blue bottle hella swag.
Shaman subway tile meditation, church-key small batch prism sunt paleo.
Pitchfork banh mi leggings try-hard voluptate 3 wolf moon artisan keytar.
Eiusmod adipisicing ethical pug single-origin coffee organic semiotics master
cleanse kinfolk crucifix marfa gochujang elit chicharrones food truck.`
      const file = createFile(multiLineFileData)
      const maxLines = 3
      let linesRead = []
      let onCompleteCalled = false
      const forEachLine = function (line, fileOk) {
        linesRead.push(line)
        return fileOk
      }
      const onError = function (error) {
        return error
      }
      const onComplete = function () {
        onCompleteCalled = true
        expect(linesRead.length).to.equal(3)
        expect(linesRead[0]).to.equal('Authentic bitters blue bottle hella swag.\n')
        expect(linesRead[1]).to.equal('Shaman subway tile meditation, church-key small batch prism sunt paleo.\n')
        expect(linesRead[2]).to.equal('Pitchfork banh mi leggings try-hard voluptate 3 wolf moon artisan keytar.\n')
        expect(onCompleteCalled).to.equal(true)
        done()
      }
      lineReader.readSomeLines(file, maxLines, forEachLine, onComplete, onError())
    })
    it('should return error message when file is not correct', (done) => {
      const multiLineFileData = `test`
      const file = createFile(multiLineFileData)
      const maxLines = 3
      let linesRead = []
      const forEachLine = function (line, fileOk) {
        linesRead.push(line)
        return !fileOk
      }
      const onError = function (error) {
        expect(error.to.equal('[Invalid data] the data of the file is not valid'))
        done()
      }
      const onComplete = function () {
        done()
      }
      lineReader.readSomeLines(file, maxLines, forEachLine, onComplete, onError)
    })
  })
})
