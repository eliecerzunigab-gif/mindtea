const fs = require('fs');

// Configuración para cada página de recursos
const pagesConfig = [
    {
        file: 'recursos-articulos.html',
        title: 'Artículos y Guías',
        subtitle: 'Información especializada sobre diagnóstico, terapias y estrategias de apoyo para el día a día.',
        breadcrumbText: 'Volver a Recursos'
    },
    {
        file: 'recursos-descargas.html',
        title: 'Material Descargable',
        subtitle: 'Pictogramas, agendas visuales y materiales prácticos para usar en casa.',
        breadcrumbText: 'Volver a Recursos'
    },
    {
        file: 'recursos-enlaces.html',
        title: 'Enlaces de Interés',
        subtitle: 'Fundaciones, agrupaciones y recursos que te acompañarán en este camino.',
        breadcrumbText: 'Volver a Recursos'
    },
    {
        file: 'recursos-herramientas.html',
        title: 'Herramientas de Detección',
        subtitle: 'Cuestionarios amigables para la detección temprana y seguimiento del desarrollo.',
        breadcrumbText: 'Volver a Recursos'
    }
];

pagesConfig.forEach(config => {
    if (fs.existsSync(config.file)) {
        let content = fs.readFileSync(config.file, 'utf8');
        
        // Buscar y reemplazar el breadcrumb
        const breadcrumbPattern = /<h1 class="section-title">[\s\S]*?<\/p>/;
        const newBreadcrumb = `<div class="breadcrumb">
                <a href="index.html#recursos" class="breadcrumb-link">
                    <i class="fas fa-arrow-left"></i> ${config.breadcrumbText}
                </a>
            </div>
            <h1 class="section-title">${config.title}</h1>
            <p class="section-subtitle">${config.subtitle}</p>`;
        
        content = content.replace(breadcrumbPattern, newBreadcrumb);
        
        fs.writeFileSync(config.file, content, 'utf8');
        console.log(`✅ Breadcrumb agregado: ${config.file}`);
    } else {
        console.log(`❌ No encontrado: ${config.file}`);
    }
});

console.log('🎉 Breadcrumbs agregados en todas las páginas de recursos!');
