#!/usr/bin/env node

/**
 * Script de ayuda para configurar Google Drive
 *
 * Este script verifica si las credenciales de Google Drive están configuradas
 * y proporciona instrucciones útiles si no lo están.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  log('\n🔍 Verificando configuración de Google Drive...\n', 'cyan');

  // Verificar si existe .env
  if (!fs.existsSync(envPath)) {
    log('❌ No se encontró archivo .env', 'red');
    log('\n📝 Para configurar Google Drive:\n', 'yellow');
    log('1. Copia el archivo .env.example:', 'bright');
    log('   cp .env.example .env\n', 'cyan');
    log('2. Sigue la guía completa en:', 'bright');
    log('   GUIA_CONFIGURACION_GOOGLE.md\n', 'cyan');
    log('3. Edita .env con tus credenciales reales\n', 'bright');
    return false;
  }

  // Leer y verificar contenido de .env
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  let hasClientId = false;
  let hasApiKey = false;
  let clientIdValue = '';
  let apiKeyValue = '';

  for (const line of lines) {
    if (line.startsWith('VITE_GOOGLE_CLIENT_ID=')) {
      hasClientId = true;
      clientIdValue = line.split('=')[1]?.trim() || '';
    }
    if (line.startsWith('VITE_GOOGLE_API_KEY=')) {
      hasApiKey = true;
      apiKeyValue = line.split('=')[1]?.trim() || '';
    }
  }

  log('✅ Archivo .env encontrado\n', 'green');

  // Verificar Client ID
  if (!hasClientId || !clientIdValue || clientIdValue.includes('example') || clientIdValue.includes('123456')) {
    log('⚠️  VITE_GOOGLE_CLIENT_ID no está configurado correctamente', 'yellow');
    log('   Valor actual: ' + (clientIdValue || '(vacío)'), 'yellow');
    log('   Debe ser algo como: 123456-abc123.apps.googleusercontent.com\n', 'cyan');
  } else {
    log('✅ VITE_GOOGLE_CLIENT_ID configurado', 'green');
    log('   ' + clientIdValue.substring(0, 20) + '...\n', 'cyan');
  }

  // Verificar API Key
  if (!hasApiKey || !apiKeyValue || apiKeyValue.includes('example') || apiKeyValue.includes('Example')) {
    log('⚠️  VITE_GOOGLE_API_KEY no está configurada correctamente', 'yellow');
    log('   Valor actual: ' + (apiKeyValue || '(vacío)'), 'yellow');
    log('   Debe ser algo como: AIzaSyAbc123...\n', 'cyan');
  } else {
    log('✅ VITE_GOOGLE_API_KEY configurada', 'green');
    log('   ' + apiKeyValue.substring(0, 20) + '...\n', 'cyan');
  }

  // Verificar si ambas están configuradas
  const isFullyConfigured =
    hasClientId && hasApiKey &&
    clientIdValue && !clientIdValue.includes('example') &&
    apiKeyValue && !apiKeyValue.includes('example');

  if (isFullyConfigured) {
    log('🎉 ¡Google Drive está completamente configurado!\n', 'green');
    log('Para probar:', 'bright');
    log('1. Ejecuta: npm run dev', 'cyan');
    log('2. Ve a Configuración → Nube', 'cyan');
    log('3. Click en "Conectar con Google"\n', 'cyan');
    return true;
  } else {
    log('📚 Para obtener las credenciales:', 'yellow');
    log('1. Lee la guía completa: GUIA_CONFIGURACION_GOOGLE.md', 'cyan');
    log('2. Ve a: https://console.cloud.google.com/', 'cyan');
    log('3. Sigue los pasos para crear credenciales OAuth 2.0\n', 'cyan');
    return false;
  }
}

function main() {
  log('╔════════════════════════════════════════════════════════╗', 'blue');
  log('║  Configuración de Google Drive - Registro de Actividad ║', 'blue');
  log('╚════════════════════════════════════════════════════════╝', 'blue');

  checkEnvFile();

  log('💡 Ayuda adicional:', 'bright');
  log('   - Guía paso a paso: GUIA_CONFIGURACION_GOOGLE.md', 'cyan');
  log('   - Documentación técnica: GOOGLE_DRIVE_SETUP.md', 'cyan');
  log('   - README general: README.md\n', 'cyan');
}

main();
