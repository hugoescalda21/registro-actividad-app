export const exportMonthlyReport = (stats, publisherType, activities) => {
  const now = new Date();
  const monthName = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  let report = `INFORME DE ACTIVIDAD - ${monthName.toUpperCase()}\n`;
  report += `Tipo de Publicador: ${publisherType}\n`;
  report += `${'='.repeat(50)}\n\n`;
  
  report += `📊 RESUMEN:\n`;
  report += `- Total de horas: ${stats.totalHoursDecimal}\n`;
  if (stats.goal > 0) {
    report += `- Meta del mes: ${stats.goal} horas\n`;
    report += `- Progreso: ${stats.progress}%\n`;
  }
  report += `- Cursos bíblicos: ${stats.studies}\n`;
  
  if (parseFloat(stats.totalApprovedHours) > 0) {
    report += `- Horas aprobadas: ${stats.totalApprovedHours}\n`;
  }
  
  report += `- Días de actividad: ${stats.activities}\n\n`;
  
  report += `${'='.repeat(50)}\n`;
  report += `Generado: ${new Date().toLocaleDateString('es-ES')}\n`;
  
  return report;
};

export const downloadReport = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportBackup = (activities, publisherType) => {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    publisherType,
    activities
  };
  return JSON.stringify(backup, null, 2);
};

export const importBackup = (jsonString) => {
  try {
    const backup = JSON.parse(jsonString);
    if (!backup.activities || !Array.isArray(backup.activities)) {
      throw new Error('Formato de respaldo inválido');
    }
    return backup;
  } catch (error) {
    throw new Error('Error al importar: ' + error.message);
  }
};