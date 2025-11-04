const fs = require('fs');

// Lista de archivos de recursos a actualizar
const resourceFiles = [
    'recursos-descargas.html',
    'recursos-enlaces.html'
];

// Navegación completa a insertar
const fullNavigation = `
                <ul class="nav-menu" id="nav-menu">
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
                </ul>
                <div class="hamburger" id="hamburger">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>`;

// Patrón a buscar y reemplazar
const searchPattern = /<div class="logo">[\s\S]*?<\/div>\s*<a href="index\.html#recursos" class="btn btn-secondary">[\s\S]*?<\/a>/;

resourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        const originalContent = content;
        
        // Reemplazar la navegación simple por la completa
        content = content.replace(searchPattern, `<div class="logo">
                    <img src="logo.png" alt="MindTea Logo" class="logo-img">
                    <span class="logo-text">MindTea</span>
                </div>${fullNavigation}`);
        
        // Solo escribir si hubo cambios
        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Actualizado: ${file}`);
        } else {
            console.log(`ℹ️  Sin cambios: ${file}`);
        }
    } else {
        console.log(`❌ No encontrado: ${file}`);
    }
});

console.log('🎉 Actualización de navegación en recursos completada!');
