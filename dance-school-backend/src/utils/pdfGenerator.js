const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificatePDF = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const filename = `certificate-${data.certificateNumber}.pdf`;
    const filepath = path.join('uploads', 'certificates', filename);
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Background
    doc.rect(0, 0, 841, 595).fill('#1a0533');
    doc.rect(20, 20, 801, 555).stroke('#c084fc').lineWidth(3);
    doc.rect(30, 30, 781, 535).stroke('#a855f7').lineWidth(1);

    // Title
    doc.fillColor('#c084fc').fontSize(42).font('Helvetica-Bold')
      .text('DRIZZLE DANCE ACADEMY', 0, 80, { align: 'center' });

    doc.fillColor('#e9d5ff').fontSize(22).font('Helvetica')
      .text('Certificate of Completion', 0, 140, { align: 'center' });

    doc.fillColor('#ffffff').fontSize(16).font('Helvetica')
      .text('This is to certify that', 0, 200, { align: 'center' });

    doc.fillColor('#f0abfc').fontSize(32).font('Helvetica-Bold')
      .text(data.studentName, 0, 230, { align: 'center' });

    doc.fillColor('#ffffff').fontSize(16).font('Helvetica')
      .text(`has successfully completed the course`, 0, 285, { align: 'center' });

    doc.fillColor('#c084fc').fontSize(24).font('Helvetica-Bold')
      .text(data.courseName, 0, 315, { align: 'center' });

    doc.fillColor('#d8b4fe').fontSize(14).font('Helvetica')
      .text(`Trainer: ${data.trainerName}`, 0, 365, { align: 'center' });

    doc.fillColor('#d8b4fe').fontSize(12)
      .text(`Issue Date: ${new Date(data.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 0, 390, { align: 'center' })
      .text(`Certificate No: ${data.certificateNumber}`, 0, 410, { align: 'center' });

    // Signature line
    doc.moveTo(300, 490).lineTo(541, 490).stroke('#c084fc');
    doc.fillColor('#c084fc').fontSize(12).text('Authorized Signature', 300, 498, { width: 241, align: 'center' });

    doc.end();

    stream.on('finish', () => resolve({ filepath, filename }));
    stream.on('error', reject);
  });
};

const generateReceiptPDF = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4' });
    const filename = `receipt-${data.receiptNumber}.pdf`;
    const filepath = path.join('uploads', 'certificates', filename);
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    doc.rect(0, 0, 612, 792).fill('#faf5ff');
    doc.rect(20, 20, 572, 752).stroke('#a855f7').lineWidth(2);

    doc.fillColor('#7e22ce').fontSize(28).font('Helvetica-Bold')
      .text('DRIZZLE DANCE ACADEMY', 40, 60, { align: 'center' });
    doc.fillColor('#6b21a8').fontSize(16).font('Helvetica')
      .text('Fee Payment Receipt', 40, 100, { align: 'center' });

    doc.moveTo(40, 130).lineTo(572, 130).stroke('#a855f7');

    const addRow = (label, value, y) => {
      doc.fillColor('#374151').fontSize(12).font('Helvetica-Bold').text(label, 60, y);
      doc.fillColor('#111827').fontSize(12).font('Helvetica').text(value, 300, y);
    };

    addRow('Receipt Number:', data.receiptNumber, 160);
    addRow('Student Name:', data.studentName, 190);
    addRow('Course:', data.courseName, 220);
    addRow('Amount Paid:', `₹${data.amount}`, 250);
    addRow('Payment Method:', data.paymentMethod, 280);
    addRow('Payment Date:', new Date(data.paymentDate).toLocaleDateString(), 310);
    addRow('Status:', data.status.toUpperCase(), 340);

    doc.moveTo(40, 380).lineTo(572, 380).stroke('#a855f7');
    doc.fillColor('#7e22ce').fontSize(10).font('Helvetica')
      .text('Thank you for your payment! - Drizzle Dance Academy', 40, 400, { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve({ filepath, filename }));
    stream.on('error', reject);
  });
};

const generateSalarySlipPDF = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4' });
    const filename = `salary-${data.month}-${data.year}-${data.trainerId}.pdf`;
    const filepath = path.join('uploads', 'certificates', filename);
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    doc.rect(0, 0, 612, 792).fill('#faf5ff');
    doc.rect(20, 20, 572, 752).stroke('#a855f7').lineWidth(2);

    doc.fillColor('#7e22ce').fontSize(28).font('Helvetica-Bold')
      .text('DRIZZLE DANCE ACADEMY', 40, 60, { align: 'center' });
    doc.fillColor('#6b21a8').fontSize(16).font('Helvetica')
      .text('Salary Slip', 40, 100, { align: 'center' });

    doc.moveTo(40, 130).lineTo(572, 130).stroke('#a855f7');

    const addRow = (label, value, y) => {
      doc.fillColor('#374151').fontSize(12).font('Helvetica-Bold').text(label, 60, y);
      doc.fillColor('#111827').fontSize(12).font('Helvetica').text(value, 300, y);
    };

    addRow('Trainer Name:', data.trainerName, 160);
    addRow('Trainer ID:', data.trainerId, 190);
    addRow('Course:', data.courseName || 'N/A', 220);
    addRow('Month:', `${data.month} ${data.year}`, 250);
    addRow('Basic Salary:', `₹${data.amount}`, 280);
    addRow('Net Salary:', `₹${data.amount}`, 310);
    addRow('Payment Status:', data.status.toUpperCase(), 340);
    if (data.paymentDate) addRow('Payment Date:', new Date(data.paymentDate).toLocaleDateString(), 370);

    doc.moveTo(40, 410).lineTo(572, 410).stroke('#a855f7');
    doc.fillColor('#7e22ce').fontSize(10).font('Helvetica')
      .text('Drizzle Dance Academy - Salary Slip', 40, 430, { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve({ filepath, filename }));
    stream.on('error', reject);
  });
};

module.exports = { generateCertificatePDF, generateReceiptPDF, generateSalarySlipPDF };
