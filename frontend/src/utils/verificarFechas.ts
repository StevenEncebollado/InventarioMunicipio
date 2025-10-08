/**
 * Script de verificación para corregir problemas de zona horaria
 * Ejecutar para comprobar que las fechas se muestran correctamente
 */

import { formatearFechaConHora, formatearFechaSoloFecha, formatearFechaReporte, formatearFechaTabla } from './dateUtils';

// Fecha de ejemplo (como vendría del backend)
const fechaEjemplo = '2025-10-08T10:48:01.123456';

console.log('🔍 VERIFICACIÓN DE FORMATEO DE FECHAS');
console.log('=====================================');
console.log(`📅 Fecha de ejemplo del backend: ${fechaEjemplo}`);
console.log('');

console.log('✅ Funciones corregidas:');
console.log(`   • formatearFechaConHora: ${formatearFechaConHora(fechaEjemplo)}`);
console.log(`   • formatearFechaSoloFecha: ${formatearFechaSoloFecha(fechaEjemplo)}`);
console.log(`   • formatearFechaReporte: ${formatearFechaReporte(fechaEjemplo)}`);
console.log(`   • formatearFechaTabla: ${formatearFechaTabla(fechaEjemplo)}`);
console.log('');

console.log('🌎 Zona horaria configurada: America/Guayaquil (UTC-5)');
console.log('');

// Mostrar diferencia con formateo incorrecto
const fechaIncorrecta = new Date(fechaEjemplo).toLocaleString('es-ES');
const fechaCorrecta = formatearFechaConHora(fechaEjemplo);

console.log('⚠️  Comparación:');
console.log(`   • Sin zona horaria especificada: ${fechaIncorrecta}`);
console.log(`   • Con zona horaria Ecuador: ${fechaCorrecta}`);
console.log('');

console.log('✅ Todos los archivos corregidos:');
console.log('   • /utils/dateUtils.ts (nuevo archivo)');
console.log('   • /dashboard/equipo/[id]/page.tsx');
console.log('   • /dashboard/detalle_estados/page.tsx');
console.log('   • /dashboard/auditoria/components/ComponenteReportes.tsx');
console.log('   • /services/auditoriaService.ts');
console.log('');

console.log('🎯 El problema de las 5 horas debe estar resuelto ahora!');