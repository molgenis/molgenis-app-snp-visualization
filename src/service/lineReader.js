export default {

  readSomeLines (file, maxLines, forEachLine, onComplete, onError) {
    const CHUNK_SIZE = 50000 // 50kb, arbitrarily chosen.
    // const decoder = new TextDecoder()
    let offset = 0
    let lineCount = 0
    let results = ''
    let continueReading = true
    const fileReader = new FileReader()
    fileReader.onload = function () {
      results = fileReader.result
      const lines = results.split('\n')
      results = lines.pop() // In case the line did not end yet.
      lineCount += lines.length

      if (lineCount > maxLines) {
        // Read too many lines? Truncate the results.
        lines.length -= lineCount - maxLines
        lineCount = maxLines
      }

      for (let i = 0; i < lines.length; ++i) {
        if (!continueReading) {
          break
        }
        continueReading = forEachLine(lines[i] + '\n', continueReading)
      }
      offset += CHUNK_SIZE
      seek()
    }
    fileReader.onerror = function () {
      onError(fileReader.error)
    }
    seek()

    function seek () {
      if (lineCount === maxLines) {
        // We found enough lines.
        onComplete() // Done.
        return
      }
      if (offset !== 0 && offset >= file.size) {
        // We did not find all lines, but there are no more lines.
        if (continueReading) {
          forEachLine(results) // This is from lines.pop(), before.
          onComplete() // Done
        } else {
          onError('[Invalid data] the data of the file is not valid')
        }
        return
      }
      let slice = file.slice(offset, offset + CHUNK_SIZE)
      fileReader.readAsText(slice)
    }
  }

}
