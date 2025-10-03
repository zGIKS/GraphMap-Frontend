# 🔧 Cómo Habilitar WebGL en tu Navegador

## ⚠️ Problema
El error `"WebGL is currently disabled"` significa que tu navegador no tiene WebGL habilitado o disponible. Sigma.js requiere WebGL para renderizar grafos de forma eficiente.

---

## 🦊 Firefox

### Método 1: Habilitar WebGL
1. Escribe `about:config` en la barra de direcciones
2. Acepta el aviso de riesgo
3. Busca: `webgl.disabled`
4. Si está en `true`, haz doble clic para cambiarlo a `false`
5. Busca: `webgl.force-enabled`
6. Cámbialo a `true` si existe
7. Reinicia Firefox

### Método 2: Habilitar Aceleración de Hardware
1. Ve a `☰` → `Configuración` → `General`
2. Baja hasta `Rendimiento`
3. Desmarca "Usar configuración de rendimiento recomendada"
4. Marca "Usar aceleración por hardware cuando esté disponible"
5. Reinicia Firefox

---

## 🌐 Google Chrome / Chromium

### Método 1: Aceleración de Hardware
1. Ve a `chrome://settings/`
2. Busca "hardware" en la barra de búsqueda
3. En "Sistema", activa "Usar aceleración por hardware cuando esté disponible"
4. Reinicia Chrome

### Método 2: Forzar WebGL
1. Ve a `chrome://flags/`
2. Busca: `#ignore-gpu-blocklist`
3. Cámbialo a `Enabled`
4. Reinicia Chrome

### Verificar WebGL
1. Ve a `chrome://gpu/`
2. Verifica que WebGL esté habilitado (debe decir "Hardware accelerated")

---

## 🔷 Microsoft Edge

### Habilitar Aceleración de Hardware
1. Ve a `edge://settings/`
2. Ve a "Sistema"
3. Activa "Usar aceleración de hardware cuando esté disponible"
4. Reinicia Edge

### Verificar WebGL
1. Ve a `edge://gpu/`
2. Verifica el estado de WebGL

---

## 🧪 Verificar WebGL

Visita cualquiera de estos sitios para verificar que WebGL funciona:
- https://get.webgl.org/
- https://webglreport.com/

Deberías ver un cubo giratorio o un mensaje que dice "Your browser supports WebGL"

---

## 🐧 Linux: Problemas con Drivers de GPU

Si estás en Linux y WebGL no funciona, puede ser un problema de drivers:

### NVIDIA
```bash
# Ubuntu/Debian
sudo ubuntu-drivers autoinstall
# o
sudo apt install nvidia-driver-XXX

# Arch Linux
sudo pacman -S nvidia nvidia-utils
```

### AMD
```bash
# Ubuntu/Debian
sudo apt install mesa-utils mesa-vulkan-drivers

# Arch Linux
sudo pacman -S mesa vulkan-radeon
```

### Intel
```bash
# Ubuntu/Debian
sudo apt install mesa-utils intel-media-va-driver

# Arch Linux
sudo pacman -S mesa vulkan-intel
```

Después de instalar drivers, reinicia tu sistema.

---

## 🖥️ Máquinas Virtuales

Si estás en una VM (VirtualBox, VMware, etc.), necesitas:

### VirtualBox
1. Apaga la VM
2. En configuración → Display
3. Activa "Enable 3D Acceleration"
4. Aumenta la memoria de video a 128MB o más

### VMware
1. Asegúrate de tener VMware Tools instalado
2. Activa "Accelerate 3D graphics"

---

## 🔍 Solución Alternativa

Si no puedes habilitar WebGL, considera:

1. **Usar otro navegador** (Chrome suele tener mejor soporte)
2. **Usar otro dispositivo** con soporte WebGL
3. **Actualizar drivers de GPU**
4. **Verificar que tu GPU soporte WebGL** (GPUs muy antiguas pueden no soportarlo)

---

## ✅ Verificar que Funciona

Después de aplicar los cambios:

1. Reinicia completamente el navegador
2. Ve a https://get.webgl.org/
3. Si ves un cubo giratorio, ¡WebGL funciona! ✅
4. Vuelve a cargar la aplicación GraphMap

---

## 📞 Ayuda Adicional

Si después de todo esto WebGL no funciona:
- Verifica la consola del navegador (F12) para más detalles del error
- Revisa `chrome://gpu/` o `about:support` (Firefox) para ver el estado de la GPU
- Es posible que tu hardware no soporte WebGL (GPUs muy antiguas)
