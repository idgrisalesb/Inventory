#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { sourceMapsEnabled } = require('process');
const readline = require('readline');

class SiesaBmadInstaller {
  constructor() {
    // Definir las carpetas primero (nombres en el paquete vs nombres finales)
    this.folderMappings = [
      { source: 'bmad', target: '_bmad' },
      { source: 'vscode', target: '.vscode' },
      { source: 'github', target: '.github' },
      { source: 'claude', target: '.claude' },
      { source: 'gemini', target: '.gemini' },
      { source: 'resources', target: '.resources' },
      { source: 'mcp.json', target: '.mcp.json' }
    ];
    
    // Lista de archivos que se preservan automáticamente (no se crean backups)
    this.ignoredFiles = [
      'data/technical-preferences.md'
    ];
    
    this.targetDir = process.cwd();
    // Intentar múltiples ubicaciones posibles para el paquete
    this.packageDir = this.findPackageDir();
    
    // Almacenamiento temporal para contenido de archivos ignorados
    this.preservedContent = new Map();
  }
  

  showBanner() {
    console.log('\n');
    console.log('███████╗██╗███████╗███████╗ █████╗      █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗');
    console.log('██╔════╝██║██╔════╝██╔════╝██╔══██╗    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝');
    console.log('███████╗██║█████╗  ███████╗███████║    ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗');
    console.log('╚════██║██║██╔══╝  ╚════██║██╔══██║    ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║');
    console.log('███████║██║███████╗███████║██║  ██║    ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║');
    console.log('╚══════╝╚═╝╚══════╝╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝');
    console.log('');
  }

  findPackageDir() {
    // Opción 1: directorio padre del bin (instalación normal)
    let packageDir = path.dirname(__dirname);

    // Debug: mostrar información de diagnóstico
    const debug = process.env.SIESA_DEBUG === '1';
    if (debug) {
      console.log('\n🔍 DEBUG - Buscando directorio del paquete:');
      console.log(`   __dirname: ${__dirname}`);
      console.log(`   packageDir inicial: ${packageDir}`);
    }

    // Verificar si _bmad existe en el directorio inicial
    const bmadPath = path.join(packageDir, '_bmad');
    if (debug) {
      console.log(`   Verificando _bmad en: ${bmadPath}`);
      console.log(`   ¿Existe _bmad?: ${fs.existsSync(bmadPath)}`);

      // Listar contenido del directorio
      try {
        const contents = fs.readdirSync(packageDir);
        console.log(`   Contenido de packageDir: ${contents.join(', ')}`);
      } catch (e) {
        console.log(`   Error listando directorio: ${e.message}`);
      }
    }

    // Opción 2: si estamos en npx, buscar en node_modules
    if (!this.hasRequiredFolders(packageDir)) {
      // Para npm 6.14+ y npx, intentar ubicaciones alternativas
      const possiblePaths = [
        path.join(__dirname, '..'), // bin -> paquete
        path.resolve(__dirname, '..'), // alternativa con resolve
        path.resolve(__dirname, '..', '..', 'siesa-agents'), // desde node_modules
        // Intentar buscar basado en __dirname específicamente para npx
        path.resolve(__dirname.replace(/\\bin$|\/bin$/, '')),
        process.cwd(), // directorio actual como último recurso
      ];

      for (const possiblePath of possiblePaths) {
        if (this.hasRequiredFolders(possiblePath)) {
          packageDir = possiblePath;
          if (debug) {
            console.log(`   Encontrado en: ${possiblePath}`);
          }
          break;
        }
      }
    }

    return packageDir;
  }

  hasRequiredFolders(dir) {
    return this.folderMappings.some(mapping => {
      const folderPath = path.join(dir, mapping.source);
      return fs.existsSync(folderPath);
    });
  }

  async install() {
    this.showBanner();
    console.log(' Instalando SIESA Agents...');

    try {
      // Verificar si ya existe una instalación
      const hasExistingInstallation = this.checkExistingInstallation();

      if (hasExistingInstallation) {
        console.log('🔄 Instalación existente detectada. Actualizando...');
        await this.update();
      } else {
        console.log('✨ Nueva instalación...');
        await this.performInstallation();
      }

      console.log('✅ SIESA Agents instalado correctamente!');
      this.showPostInstallMessage();

    } catch (error) {
      console.error('❌ Error durante la instalación:', error.message);
      process.exit(1);
    }
  }

  checkExistingInstallation() {
    return this.folderMappings.some(mapping => {
      const targetPath = path.join(this.targetDir, mapping.target);
      return fs.existsSync(targetPath);
    });
  }

  async checkModifiedFiles() {
    const modifiedFiles = [];

    for (const mapping of this.folderMappings) {
      const sourcePath = path.join(this.packageDir, mapping.source);
      const targetPath = path.join(this.targetDir, mapping.target);

      if (!fs.existsSync(sourcePath) || !fs.existsSync(targetPath)) {
        continue;
      }

      // Obtener todos los archivos recursivamente
      const sourceFiles = await this.getAllFiles(sourcePath);

      for (const sourceFile of sourceFiles) {
        const relativePath = path.relative(sourcePath, sourceFile);
        const targetFile = path.join(targetPath, relativePath);

        if (fs.existsSync(targetFile)) {
          try {
            // Comparar contenido de archivos
            const sourceContent = await fs.readFile(sourceFile, 'utf8');
            const targetContent = await fs.readFile(targetFile, 'utf8');

            if (sourceContent !== targetContent) {
              modifiedFiles.push({
                folder: mapping.target,
                file: relativePath,
                fullPath: targetFile,
                is_ignored: this.ignoredFiles.includes(relativePath)
              });
            }
          } catch (error) {
            // Si no se puede leer como texto, comparar como buffer (archivos binarios)
            const sourceBuffer = await fs.readFile(sourceFile);
            const targetBuffer = await fs.readFile(targetFile);

            if (!sourceBuffer.equals(targetBuffer)) {
              modifiedFiles.push({
                folder: mapping.target,
                file: relativePath,
                fullPath: targetFile,
                is_ignored: this.ignoredFiles.includes(relativePath)
              });
            }
          }
        }
      }
    }

    return modifiedFiles;
  }

  async getAllFiles(dir) {
    const files = [];
    const stat = await fs.stat(dir);
    if (stat.isFile()) {
      files.push(dir);
      return files;
    }
    const items = await fs.readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        const subFiles = await this.getAllFiles(fullPath);
        files.push(...subFiles);
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  async promptUser(modifiedFiles) {

    const hasNonIgnoredFiles = modifiedFiles.some(file => file.is_ignored == false)
    if (!hasNonIgnoredFiles) return '2'

    console.log('\n⚠️  Se detectaron archivos modificados:');

    // Agrupar por carpeta
    const filesByFolder = {};
    modifiedFiles.forEach(item => {
      if (!filesByFolder[item.folder]) {
        filesByFolder[item.folder] = [];
      }
      filesByFolder[item.folder].push(item.file);
    });

    // Mostrar archivos modificados por carpeta
    Object.keys(filesByFolder).forEach(folder => {
      console.log(`\n📁 ${folder}:`);
      filesByFolder[folder].forEach(file => {
        console.log(`   - ${file}`);
      });
    });

    console.log('\n¿Qué deseas hacer?');
    console.log('1. Reemplazar todos los archivos (se perderán las modificaciones)');
    console.log('2. Hacer backup de archivos modificados (se agregarán con sufijo _bk)');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('\nElige una opción (1 o 2): ', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  async backupModifiedFiles(modifiedFiles) {
    console.log('\n🔄 Creando backup de archivos modificados...');

    for (const item of modifiedFiles) {
      // No crear backup de archivos ignorados
      if (item.is_ignored) {
        console.log(`✓ Preservando: ${item.file} (sin backup)`);
        continue;
      }

      const originalPath = item.fullPath;
      const backupPath = this.getBackupPath(originalPath);

      try {
        await fs.copy(originalPath, backupPath);

        // Determinar tipo de backup para mostrar mensaje apropiado
        const backupName = path.basename(backupPath);
        const isVersionedBackup = backupName.includes('_bk_');

        if (isVersionedBackup) {
          console.log(`✓ Backup versionado: ${path.relative(this.targetDir, backupPath)}`);
        } else {
          console.log(`✓ Backup creado: ${path.relative(this.targetDir, backupPath)}`);
        }
      } catch (error) {
        console.warn(`⚠️  Error creando backup de ${item.file}: ${error.message}`);
      }
    }
  }

  getBackupPath(filePath) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);

    // Primer intento: archivo_bk.ext
    const basicBackupPath = path.join(dir, `${name}_bk${ext}`);

    // Si no existe, usar el nombre básico
    if (!fs.existsSync(basicBackupPath)) {
      return basicBackupPath;
    }

    // Si ya existe _bk, crear versión con timestamp
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') + '_' +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    return path.join(dir, `${name}_bk_${timestamp}${ext}`);
  }

  async performUpdateWithBackups() {
    for (const mapping of this.folderMappings) {
      const sourcePath = path.join(this.packageDir, mapping.source);
      const targetPath = path.join(this.targetDir, mapping.target);

      if (fs.existsSync(sourcePath)) {
        // Copiar archivos selectivamente, preservando los _bk
        await this.copyWithBackupPreservation(sourcePath, targetPath);
      } else {
        console.warn(`⚠️  Carpeta ${mapping.source} no encontrada en el paquete`);
      }
    }
  }

  async copyWithBackupPreservation(sourcePath, targetPath) {
    // Obtener todos los archivos backup existentes
    const backupFiles = await this.findBackupFiles(targetPath);
    
    // Copiar la carpeta preservando technical-preferences.md
    await fs.copy(sourcePath, targetPath, {
      overwrite: true,
      recursive: true,
      filter: (src) => {
        const relativePath = path.relative(sourcePath, src);
        // No sobrescribir archivos ignorados si ya existen
        if (this.ignoredFiles.includes(relativePath)) {
          const targetFile = path.join(targetPath, relativePath);
          return !fs.existsSync(targetFile);
        }
        return true;
      }
    });

    // Restaurar los archivos backup
    for (const backupFile of backupFiles) {
      const backupSourcePath = backupFile.tempPath;
      const backupTargetPath = backupFile.originalPath;

      try {
        await fs.copy(backupSourcePath, backupTargetPath);
        // Limpiar archivo temporal
        await fs.remove(backupSourcePath);
      } catch (error) {
        console.warn(`⚠️  Error restaurando backup ${backupFile.relativePath}: ${error.message}`);
      }
    }
  }

  async findBackupFiles(targetPath) {
    if (!fs.existsSync(targetPath)) {
      return [];
    }

    const backupFiles = [];
    const allFiles = await this.getAllFiles(targetPath);

    for (const filePath of allFiles) {
      const fileName = path.basename(filePath);
      // Detectar archivos _bk y _bk_timestamp
      if (fileName.includes('_bk')) {
        const tempPath = path.join(require('os').tmpdir(), `backup_${Date.now()}_${fileName}`);
        const relativePath = path.relative(targetPath, filePath);

        // Crear copia temporal del backup
        await fs.copy(filePath, tempPath);

        backupFiles.push({
          originalPath: filePath,
          tempPath: tempPath,
          relativePath: relativePath
        });
      }
    }

    return backupFiles;
  }

  async performInstallation() {
    for (const mapping of this.folderMappings) {
      const sourcePath = path.join(this.packageDir, mapping.source);
      const targetPath = path.join(this.targetDir, mapping.target);

      if (fs.existsSync(sourcePath)) {
        await fs.copy(sourcePath, targetPath, {
          overwrite: true,
          recursive: true,
          filter: (src) => {
            const relativePath = path.relative(sourcePath, src);
            // No sobrescribir archivos ignorados si ya existen
            if (this.ignoredFiles.includes(relativePath)) {
              const targetFile = path.join(targetPath, relativePath);
              return !fs.existsSync(targetFile);
            }
            return true;
          }
        });
      } else {
        console.warn(`⚠️  Carpeta ${mapping.source} no encontrada en el paquete`);
      }
    }
  }

  async update() {
    // Verificar archivos modificados
    console.log('🔍 Verificando archivos modificados...');
    const modifiedFiles = await this.checkModifiedFiles();

    let hasBackups = false;
    if (modifiedFiles.length > 0) {
      const userChoice = await this.promptUser(modifiedFiles);

      if (userChoice === '2') {
        // Crear backup de archivos modificados
        await this.backupModifiedFiles(modifiedFiles);
        hasBackups = true;
      } else if (userChoice !== '1') {
        console.log('❌ Opción no válida. Cancelando actualización.');
        return;
      }

      console.log('\n🔄 Procediendo con la actualización...');
    } else {
      console.log('✓ No se detectaron archivos modificados.');
    }

    // Si hay backups, hacer actualización preservando backups
    if (hasBackups) {
      await this.performUpdateWithBackups();
    } else {
      // Si no hay backups, hacer actualización normal (remover y copiar)
      // Pero primero preservar archivos ignorados
      await this.preserveIgnoredFiles();
      
      for (const mapping of this.folderMappings) {
        const targetPath = path.join(this.targetDir, mapping.target);

        if (fs.existsSync(targetPath)) {
          await fs.remove(targetPath);
        }
      }

      // Realizar instalación nueva
      await this.performInstallation();
      
      // Restaurar archivos ignorados
      await this.restoreIgnoredFiles();
    }
  }

  async preserveIgnoredFiles() {
    console.log('🔒 Preservando archivos de configuración...');
    
    for (const mapping of this.folderMappings) {
      const targetFolderPath = path.join(this.targetDir, mapping.target);
      
      if (!fs.existsSync(targetFolderPath)) {
        continue;
      }
      
      for (const ignoredFile of this.ignoredFiles) {
        const filePath = path.join(targetFolderPath, ignoredFile);
        
        if (fs.existsSync(filePath)) {
          try {
            const content = await fs.readFile(filePath, 'utf8');
            const key = `${mapping.target}/${ignoredFile}`;
            this.preservedContent.set(key, content);
            console.log(`✓ Preservando: ${ignoredFile}`);
          } catch (error) {
            console.warn(`⚠️  Error leyendo ${ignoredFile}: ${error.message}`);
          }
        }
      }
    }
  }

  async restoreIgnoredFiles() {
    if (this.preservedContent.size === 0) {
      return;
    }
    
    console.log('🔄 Restaurando archivos de configuración...');
    
    for (const [key, content] of this.preservedContent) {
      const [targetFolder, ...filePathParts] = key.split('/');
      const filePath = path.join(this.targetDir, targetFolder, ...filePathParts);
      
      try {
        // Asegurar que el directorio existe
        await fs.ensureDir(path.dirname(filePath));
        
        // Restaurar el contenido
        await fs.writeFile(filePath, content, 'utf8');
        console.log(`✓ Restaurado: ${filePathParts.join('/')}`);
      } catch (error) {
        console.warn(`⚠️  Error restaurando ${filePathParts.join('/')}: ${error.message}`);
      }
    }
    
    // Limpiar el mapa después de restaurar
    this.preservedContent.clear();
  }

  showPostInstallMessage() {
    console.log('\n📚 Carpetas instaladas:');
    this.folderMappings.forEach(mapping => {
      const targetPath = path.join(this.targetDir, mapping.target);
      if (fs.existsSync(targetPath)) {
        console.log(`  ✓ ${mapping.target}`);
      }
    });

    console.log('\n🎉 ¡Instalación completada!');
    console.log('💡 Las carpetas han sido instaladas en tu directorio actual.');
    console.log('🔧 Puedes ejecutar "npx siesa-agents" nuevamente para actualizar.');
  }
}

// Ejecutar instalación si el script es llamado directamente
if (require.main === module) {
  const installer = new SiesaBmadInstaller();
  installer.install();
}

module.exports = SiesaBmadInstaller;