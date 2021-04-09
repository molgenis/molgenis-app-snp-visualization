/* eslint-disable @typescript-eslint/ban-ts-comment */
import lineReader from '@/service/lineReader'

const createFile = function (fileData: BlobPart) {
    const create = [fileData]
    // @ts-ignore
    const blob = new Blob([create], { 'type': 'text/plain' })
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
            const linesRead: any[] = []
            let onCompleteCalled = false

            const forEachLine = function (line: any) {
                linesRead.push(line)
                return true
            }

            const onError = function (error: any) {
                return error
            }

            const onComplete = function () {
                onCompleteCalled = true
                expect(linesRead.length).toEqual(3)
                expect(linesRead[0]).toEqual('Authentic bitters blue bottle hella swag.\n')
                expect(linesRead[1]).toEqual('Shaman subway tile meditation, church-key small batch prism sunt paleo.\n')
                expect(linesRead[2]).toEqual('Pitchfork banh mi leggings try-hard voluptate 3 wolf moon artisan keytar.\n')
                expect(onCompleteCalled).toEqual(true)
                done()
            }
            lineReader.readSomeLines(file, maxLines, forEachLine, onComplete, onError)
        })

        it('should return error message when file is not correct', (done) => {
            const multiLineFileData = `Authentic bitters blue bottle hella swag.
Shaman subway tile meditation, church-key small batch prism sunt paleo.
Pitchfork banh mi leggings try-hard voluptate 3 wolf moon artisan keytar.
Eiusmod adipisicing ethical pug single-origin coffee organic semiotics master
cleanse kinfolk crucifix marfa gochujang elit chicharrones food truck.`
            const file = createFile(multiLineFileData)
            const maxLines = 3
            const linesRead = []

            const forEachLine = function (line: string) {
                linesRead.push(line)
                return false
            }

            const onError = function (error: any) {
                expect(error).toEqual('[Invalid data] the data of the file is not valid')
                done()
            }

            const onComplete = function () {
                expect(true).toEqual(false)
            }
            lineReader.readSomeLines(file, maxLines, forEachLine, onComplete, onError)
        })
    })
})