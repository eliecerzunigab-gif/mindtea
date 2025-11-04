const fs = require('fs');

// Lista de todos los archivos HTML
const htmlFiles = [
    'index.html',
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

// Verificar y corregir cada archivo
htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        const originalContent = content;
        
        let changesMade = false;
        
        // Verificar que todos los enlaces del menú estén correctos
        const menuPattern = /<ul class="nav-menu" id="nav-menu">[\s\S]*?<\/ul>/;
        const menuMatch = content.match(menuPattern);
        
        if (menuMatch) {
            const menuContent = menuMatch[0];
            
            // Verificar que los enlaces sean correctos
            const expectedMenu = `<ul class="nav-menu" id="nav-menu">
                    <li class="nav-item">
                        <a href="index.html" class="nav-link">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a href="index.html#proposito" class="nav-link">Propósito</a>
                    </li>
                    <li class="nav-item">
                        <a href="index.html#recursos" class="nav-link">Recursos</a>
                    </li>
                    <li class="nav-item">
                        <a href="index.html#contacto" class="nav-link">Contacto</a>
                    </li>
                </ul>`;
            
            if (menuContent !== expectedMenu) {
                content = content.replace(menuPattern, expectedMenu);
                changesMade = true;
                console.log(`✅ Menú corregido: ${file}`);
            }
        }
        
        // Verificar y corregir breadcrumbs duplicados
        const breadcrumbPattern = /<div class="breadcrumb">[\s\S]*?<\/div>\s*<div class="breadcrumb">[\s\S]*?<\/div>/;
        if (breadcrumbPattern.test(content)) {
            content = content.replace(breadcrumbPattern, `<div class="breadcrumb">
                <a href="index.html#recursos" class="breadcrumb-link">
                    <i class="fas fa-arrow-left"></i> Volver a Recursos
                </a>
            </div>`);
            changesMade = true;
            console.log(`✅ Breadcrumb duplicado corregido: ${file}`);
        }
        
        // Solo escribir si hubo cambios
        if (changesMade) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Archivo actualizado: ${file}`);
        } else {
            console.log(`ℹ️  Sin cambios necesarios: ${file}`);
        }
    } else {
        console.log(`❌ No encontrado: ${file}`);
    }
});

console.log('🎉 Verificación y corrección de navegación completada!');
