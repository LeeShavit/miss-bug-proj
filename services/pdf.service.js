
import fs from 'fs'
import PDFDocument from 'pdfkit'

export const pdfService = {
    buildBugPDF
}

function buildBugPDF(bugs, fileName = './data/bugs.pdf') {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        })

        const stream = fs.createWriteStream(fileName)
        doc.pipe(stream)

        doc.fontSize(22).font('Helvetica-Bold').text('Animal Report', {
            align: 'center'
        })
        doc.moveDown(1.5)
        bugs.forEach(bug => {
            doc.font('Helvetica-Bold')
                .fontSize(18)
                .text(bug.title, {
                    align: 'center'
                })
            doc.moveDown(0.5)

            doc.font('Helvetica')
                .fontSize(12)
                .text(`Severity: ${bug.severity}`, {
                    align: 'left'
                })
            doc.moveDown(0.5)

            doc.font('Helvetica')
                .fontSize(12)
                .text(`Created: ${new Date(bug.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, {
                    align: 'left'
                })
            doc.moveDown(0.5)

            doc.font('Helvetica')
                .fontSize(12)
                .text(`More info: ${bug.description}`, {
                    width: 410,
                    align: 'justify'
                })
            doc.moveDown(1)
            doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(500, doc.y).stroke()
            doc.moveDown(1.5)
        })
        doc.end()
        stream.on('finish', () => {
            console.log('PDF successfully written to file')
            resolve()
        })
        stream.on('error', (err) => {
            console.error('Error writing PDF to file:', err)
            reject(err)
        })
    })
}