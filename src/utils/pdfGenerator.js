const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf-node');

class PDFGenerator {
  constructor() {
    this.templatePath = path.join(__dirname, '../templates/storeReport.html');
  }

  async loadTemplate() {
    handlebars.registerHelper('add', (a, b) => a + b);
    const templateContent = fs.readFileSync(this.templatePath, 'utf8');
    return handlebars.compile(templateContent);
  }

  async generatePDF(reportData) {
    const template = await this.loadTemplate();
    const html = template(reportData);

    const options = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    };

    const file = { content: html };
    const pdfBuffer = await pdf.generatePdf(file, options);
    
    return pdfBuffer;
  }

  generateFilename(storeName) {
    const dateStr = new Date().toISOString().split('T')[0];
    const sanitizedName = storeName.replace(/[^a-z0-9]/gi, '-');
    return `${sanitizedName}-Report-${dateStr}.pdf`;
  }
}

module.exports = new PDFGenerator();
