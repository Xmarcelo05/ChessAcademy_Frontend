# 🚀 Guía de Despliegue Online

Aquí encontrarás instrucciones para publicar tu landing page en línea de forma gratuita o de pago.

## Opciones Gratuitas

### 1. **Netlify** (Recomendado - Muy fácil)
1. Ve a https://www.netlify.com
2. Crea una cuenta gratuita
3. Haz clic en "Add new site" → "Deploy manually"
4. Arrastra la carpeta con `index.html` al área indicada
5. ¡Tu sitio estará en línea en segundos!

**Ventajas**: Dominio gratuito, HTTPS automático, muy rápido

### 2. **Vercel**
1. Ve a https://vercel.com
2. Crea una cuenta
3. Haz clic en "New Project"
4. Sube tu carpeta con `index.html`
5. ¡Listo!

### 3. **GitHub Pages** (Para usuarios de GitHub)
1. Crea un repositorio en GitHub
2. Sube los archivos
3. Ve a Settings → Pages
4. Selecciona "Deploy from a branch"
5. Tu sitio estará en `tuusername.github.io`

## Opciones de Pago (Más Control)

### 1. **Hosting Compartido**
- Dreamhost
- Bluehost
- SiteGround
- GoDaddy

Costo: Desde $2.99/mes
Ventaja: Dominio propio

### 2. **VPS/Dedicado**
- DigitalOcean
- Linode
- AWS

Costo: Desde $5/mes
Ventaja: Control total

## Con Dominio Personalizado

Si quieres usar tu propio dominio (ejemplo: chessacademy.com):

1. **Compra un dominio**
   - Namecheap
   - Google Domains
   - Registro.com
   - Costo: $10-15/año

2. **Apunta al hosting**
   - Netlify: Agrega los nameservers de tu dominio
   - O apunta vía DNS records (más avanzado)

3. **Obtén SSL gratis**
   - Netlify: Automático
   - Otros hosts: Let's Encrypt (automático)

## Pasos Rápidos para Netlify (Recomendado)

```
1. index.html (tu archivo)
2. README.md (documentación)
3. Crear carpeta en tu computadora
4. Entrar a netlify.com
5. Drag & drop la carpeta
6. ¡Listo en 10 segundos!
```

## Consejos SEO Básicos

Para mejorar en Google:
1. Agrega meta descripción en el `<head>`
2. Usa palabras clave en títulos
3. Crea contenido original
4. Comparte en redes sociales
5. Obtén backlinks

## Ejemplo de Meta Tags

Puedes agregar al `<head>` del HTML:

```html
<meta name="description" content="Aprende ajedrez con ChessAcademy. Cursos online desde principiante hasta maestría con maestros certificados.">
<meta name="keywords" content="ajedrez, cursos online, educación, juego, estrategia">
<meta name="author" content="ChessAcademy">
<meta property="og:title" content="ChessAcademy - Domina el Juego del Rey">
<meta property="og:description" content="Aprende ajedrez desde cero">
<meta property="og:image" content="URL_A_IMAGEN">
```

---

¡Buena suerte con tu landing page! 🎯♛
