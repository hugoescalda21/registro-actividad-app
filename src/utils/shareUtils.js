export const shareViaWhatsApp = (stats, config, selectedMonth, selectedYear) => {
  const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });

  let message = `📊 *INFORME DE ACTIVIDAD*\n`;
  message += `${monthName.toUpperCase()}\n\n`;
  message += `👤 Tipo: ${config.label}\n`;
  message += `⏰ Horas: ${stats.totalHoursDecimal}\n`;
  
  if (stats.goal > 0) {
    message += `🎯 Meta: ${stats.goal} hrs (${stats.progress}%)\n`;
  }
  
  message += `📖 Cursos bíblicos: ${stats.studies}\n`;
  
  if (parseFloat(stats.totalApprovedHours) > 0) {
    message += `✅ Horas aprobadas: ${stats.totalApprovedHours}\n`;
  }
  
  message += `📅 Días de actividad: ${stats.activities}\n`;
  message += `\n_Generado con Registro de Actividad_`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

export const copyToClipboard = (stats, config, selectedMonth, selectedYear) => {
  const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });

  let text = `INFORME DE ACTIVIDAD - ${monthName.toUpperCase()}\n\n`;
  text += `Tipo: ${config.label}\n`;
  text += `Horas: ${stats.totalHoursDecimal}\n`;
  
  if (stats.goal > 0) {
    text += `Meta: ${stats.goal} hrs (${stats.progress}%)\n`;
  }
  
  text += `Cursos bíblicos: ${stats.studies}\n`;
  
  if (parseFloat(stats.totalApprovedHours) > 0) {
    text += `Horas aprobadas: ${stats.totalApprovedHours}\n`;
  }
  
  text += `Días de actividad: ${stats.activities}`;

  navigator.clipboard.writeText(text).then(() => {
    alert('✓ Informe copiado al portapapeles');
  }).catch(() => {
    alert('Error al copiar');
  });
};