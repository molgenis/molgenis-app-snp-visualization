export default {

  readSomeLines (file, maxLines, forEachLine, onComplete) {
    const CHUNK_SIZE = 50000 // 50kb, arbitrarily chosen.
    // const decoder = new TextDecoder()
    let offset = 0
    let lineCount = 0
    let results = ''
    let fileSuccess = true
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
        if (!fileSuccess) {
          break
        }
        fileSuccess = forEachLine(lines[i] + '\n', fileSuccess)
      }
      offset += CHUNK_SIZE
      seek()
    }
    fileReader.onerror = function () {
      onComplete(fileReader.error)
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
        if (fileSuccess) {
          forEachLine(results) // This is from lines.pop(), before.
          onComplete() // Done
        } else {
          console.error('Definition file does not match data columns')
        }
        return
      }
      let slice = file.slice(offset, offset + CHUNK_SIZE)
      fileReader.readAsText(slice)
    }
  }

}
