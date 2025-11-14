// Utilidades para compartir informes
export const shareViaWhatsApp = (stats, config, selectedMonth, selectedYear, monthNames) => {
  const monthName = monthNames ? monthNames[selectedMonth - 1] : selectedMonth;
  
  const text = `📊 *Informe de Servicio*
🗓️ ${monthName} ${selectedYear}

⏱️ *Horas:* ${stats.totalHours.toFixed(1)}${config.hours ? ` / ${config.hours}` : ''}
📚 *Publicaciones:* ${stats.totalPlacements}${config.placements ? ` / ${config.placements}` : ''}
🎥 *Videos:* ${stats.totalVideos}${config.videos ? ` / ${config.videos}` : ''}
👥 *Revisitas:* ${stats.totalReturnVisits}${config.returnVisits ? ` / ${config.returnVisits}` : ''}
🎓 *Estudios:* ${stats.totalStudies}${config.studies ? ` / ${config.studies}` : ''}

📅 Días activos: ${stats.daysActive}

_Generado con Registro de Actividad_`;

  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  
  window.open(whatsappUrl, '_blank');
};

export const copyToClipboard = (stats, config, selectedMonth, selectedYear, monthNames) => {
  const monthName = monthNames ? monthNames[selectedMonth - 1] : selectedMonth;
  
  const text = `📊 Informe de Servicio
🗓️ ${monthName} ${selectedYear}

⏱️ Horas: ${stats.totalHours.toFixed(1)}${config.hours ? ` / ${config.hours}` : ''}
📚 Publicaciones: ${stats.totalPlacements}${config.placements ? ` / ${config.placements}` : ''}
🎥 Videos: ${stats.totalVideos}${config.videos ? ` / ${config.videos}` : ''}
👥 Revisitas: ${stats.totalReturnVisits}${config.returnVisits ? ` / ${config.returnVisits}` : ''}
🎓 Estudios: ${stats.totalStudies}${config.studies ? ` / ${config.studies}` : ''}

📅 Días activos: ${stats.daysActive}

Generado con Registro de Actividad`;

  navigator.clipboard.writeText(text).then(() => {
    alert('✓ Informe copiado al portapapeles');
  }).catch(() => {
    alert('Error al copiar');
  });
};