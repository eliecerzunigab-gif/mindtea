const fs = require('fs');
const path = require('path');

// Lista de archivos HTML a corregir (excluyendo index.html)
const htmlFiles = [
    'recursos-articulos.html',
    'recursos-descargas.html',
    'recursos-enlaces.html',
    'recursos-herramientas.html',
    'cuestionario-desarrollo.html',
    'cuestionario-observacion.html',
    'cuestionario-seguimiento.html',
    'cuestionario-sensorial.html',
    'cuestionario-habilidades.html',
    'cuestionario-academicas.html'
];

// Patrón a buscar y reemplazar
const searchPattern = /href="index\.html#inicio"/g;
const replacePattern = 'href="index.html"';

htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        const originalContent = content;
        
        // Reemplazar el patrón
        content = content.replace(searchPattern, replacePattern);
        
        // Solo escribir si hubo cambios
        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Corregido: ${file}`);
        } else {
            console.log(`ℹ️  Sin cambios: ${file}`);
        }
    } else {
        console.log(`❌ No encontrado: ${file}`);
    }
});

console.log('🎉 Corrección de navegación completada!');
