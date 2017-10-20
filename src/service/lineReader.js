export default {
  readSomeLines (file, maxLines, forEachLine, onComplete, onError) {
    const CHUNK_SIZE = 50000 // 50kb, arbitrarily chosen.
    let offset = 0
    let lineCount = 0
    let results = ''

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

      let isSuccess = true
      for (let i = 0; i < lines.length; ++i) {
        isSuccess = forEachLine(lines[i] + '\n')
        if (!isSuccess) {
          onError('[Invalid data] the data of the file is not valid')
          break
        }
      }
      if (!isSuccess) {
        return
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
        forEachLine(results) // This is from lines.pop(), before.
        onComplete() // Done
        return
      }
      let slice = file.slice(offset, offset + CHUNK_SIZE)
      fileReader.readAsText(slice)
    }
  }
}
