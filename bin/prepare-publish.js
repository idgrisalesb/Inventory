#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const rootDir = path.dirname(__dirname);

// Renombrar carpetas que empiezan con punto para que npm las incluya
const folderMappings = [
  { from: '.bmad-core', to: 'bmad-core' },
  { from: '.vscode', to: 'vscode' },
  { from: '.github', to: 'github' }
];

console.log('📦 Preparando carpetas para publicación (siesa-agents)...');

for (const mapping of folderMappings) {
  const fromPath = path.join(rootDir, mapping.from);
  const toPath = path.join(rootDir, mapping.to);

  if (fs.existsSync(fromPath)) {
    console.log(`📁 Renombrando ${mapping.from} -> ${mapping.to}`);
    fs.moveSync(fromPath, toPath);
  }
}

console.log('✅ Carpetas preparadas para publicación');