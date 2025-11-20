import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF con el informe mensual de actividades
 */
export const generateMonthlyReportPDF = (data) => {
  const { activities, stats, config, publisherTypeName, month, year } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const primaryColor = [102, 126, 234];
  const textColor = [51, 51, 51];
  const lightGray = [240, 240, 240];

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const monthName = monthNames[month - 1];

  let yPos = 20;

  // HEADER
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Informe de Actividad', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${monthName} ${year}`, pageWidth / 2, 30, { align: 'center' });

  yPos = 50;

  // INFORMACIÓN DEL PUBLICADOR
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tipo de Publicador:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(publisherTypeName, 70, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha de generación:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('es-ES'), 70, yPos);
  yPos += 15;

  // RESUMEN DE ESTADÍSTICAS
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('RESUMEN DEL MES', 20, yPos);
  yPos += 12;
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  const summaryData = [
    ['Horas Totales', `${stats.totalHours.toFixed(1)} h`, config.hours > 0 ? `Meta: ${config.hours} h` : 'Sin meta'],
    ['Horas de Predicacion', `${stats.preachingHours.toFixed(1)} h`, ''],
    ['Horas Aprobadas', `${stats.approvedHours.toFixed(1)} h`, ''],
    ['Publicaciones', stats.totalPlacements, config.placements > 0 ? `Meta: ${config.placements}` : ''],
    ['Videos', stats.totalVideos, config.videos > 0 ? `Meta: ${config.videos}` : ''],
    ['Revisitas', stats.totalReturnVisits, config.returnVisits > 0 ? `Meta: ${config.returnVisits}` : ''],
    ['Estudios Biblicos', stats.totalStudies, config.studies > 0 ? `Meta: ${config.studies}` : ''],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Concepto', 'Total', 'Observaciones']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { halign: 'center', cellWidth: 40 },
      2: { halign: 'left', cellWidth: 'auto' },
    },
    margin: { left: 20, right: 20 },
  });

  yPos = doc.lastAutoTable.finalY + 15;

  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  // CUMPLIMIENTO DE METAS
  if (config.hours > 0) {
    const percentage = ((stats.totalHours / config.hours) * 100).toFixed(0);
    const metGoal = stats.totalHours >= config.hours;

    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('CUMPLIMIENTO DE META', 20, yPos);
    yPos += 12;

    const barWidth = pageWidth - 40;
    const barHeight = 12;
    const filledWidth = (barWidth * Math.min(percentage, 100)) / 100;

    doc.setFillColor(220, 220, 220);
    doc.roundedRect(20, yPos - 5, barWidth, barHeight, 3, 3, 'F');

    const progressColor = metGoal ? [16, 185, 129] : [249, 115, 22];
    doc.setFillColor(progressColor[0], progressColor[1], progressColor[2]);
    doc.roundedRect(20, yPos - 5, filledWidth, barHeight, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${percentage}%`, 20 + filledWidth / 2, yPos + 2, { align: 'center' });
    yPos += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    if (metGoal) {
      doc.setTextColor(16, 185, 129);
      doc.text(`Felicidades! Has cumplido tu meta mensual de ${config.hours} horas.`, 20, yPos);
    } else {
      doc.setTextColor(249, 115, 22);
      const remaining = (config.hours - stats.totalHours).toFixed(1);
      doc.text(`Faltan ${remaining} horas para cumplir tu meta de ${config.hours} horas.`, 20, yPos);
    }
    yPos += 15;
  }

  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  // DETALLE DE ACTIVIDADES
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DETALLE DE ACTIVIDADES', 20, yPos);
  yPos += 12;

  const activityRows = activities
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(activity => {
      const date = new Date(activity.date);
      const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      const hours = activity.hours || 0;
      const approvedHours = activity.approvedHours || 0;
      const totalHours = hours + approvedHours;

      return [
        formattedDate,
        totalHours > 0 ? `${totalHours.toFixed(1)}h` : '-',
        activity.placements || '-',
        activity.videos || '-',
        activity.returnVisits || '-',
        activity.studies || '-',
        activity.notes ? activity.notes.substring(0, 30) + (activity.notes.length > 30 ? '...' : '') : '-'
      ];
    });

  if (activityRows.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Fecha', 'Horas', 'Pub.', 'Videos', 'Rev.', 'Est.', 'Notas']],
      body: activityRows,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 18, halign: 'center' },
        4: { cellWidth: 15, halign: 'center' },
        5: { cellWidth: 15, halign: 'center' },
        6: { cellWidth: 'auto', halign: 'left', fontSize: 7 },
      },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        addFooter(doc, data.pageNumber, pageWidth, pageHeight);
      }
    });
  } else {
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No hay actividades registradas para este mes.', 20, yPos);
    addFooter(doc, 1, pageWidth, pageHeight);
  }

  const fileName = `informe-actividad-${monthName.toLowerCase()}-${year}.pdf`;

  // Devolver el documento y nombre para manejo personalizado
  return {
    doc,
    fileName,
    // Método de compatibilidad para navegador
    save: () => doc.save(fileName),
    // Método para obtener blob (para Capacitor)
    getBlob: () => doc.output('blob'),
    // Método para obtener base64 (para Capacitor)
    getBase64: () => doc.output('datauristring').split(',')[1]
  };
};

function addFooter(doc, pageNumber, pageWidth, pageHeight) {
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  const footerText = `Generado por Registro de Actividad v2.7 - Página ${pageNumber}`;
  const footerDate = new Date().toLocaleString('es-ES');
  doc.text(footerText, 20, pageHeight - 10);
  doc.text(footerDate, pageWidth - 20, pageHeight - 10, { align: 'right' });
}

export const generateAnnualReportPDF = (data) => {
  console.log('Informe anual - Próximamente', data);
};
