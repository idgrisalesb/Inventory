#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const rootDir = path.dirname(__dirname);

// Restaurar nombres originales de las carpetas
const folderMappings = [
  { from: 'bmad-core', to: '.bmad-core' },
  { from: 'vscode', to: '.vscode' },
  { from: 'github', to: '.github' }
];

console.log('🔄 Restaurando nombres originales de carpetas...');

for (const mapping of folderMappings) {
  const fromPath = path.join(rootDir, mapping.from);
  const toPath = path.join(rootDir, mapping.to);

  if (fs.existsSync(fromPath)) {
    console.log(`📁 Restaurando ${mapping.from} -> ${mapping.to}`);
    fs.moveSync(fromPath, toPath);
  }
}

console.log('✅ Carpetas restauradas');