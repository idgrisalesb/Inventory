#!/usr/bin/env node

const SiesaBmadInstaller = require('./bin/install.js');

if (require.main === module) {
  const installer = new SiesaBmadInstaller();
  installer.install();
}

module.exports = SiesaBmadInstaller;