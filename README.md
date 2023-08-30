# APP control de fichaje versión para Android 33

### Requisitos
- Odoo 8/11 con el módulo hr_attendance_apk
- Ionic framework 7
- npm
- Capacitor
- Android Studio

### Instalación
- Git clone.
- Instalar las dependencias que diga que falten con npm install

### Probar en navegador/generar archivos para navegador
ionic serve

### Npm audit
- Si existe algún problema con las dependencias se mostrará un mensaje para revisarlos con npm audit.
- Puedes instalar las versiones que te proponga de las dependencias pero revisando tras la instalación que no crean un conflicto con otras.
- Si hay conflicto tendrás que hacer npm uninstall de lo que hayas metido.

### Generar apk para Android
- Creamos la plataforma si no lo hemos hecho ya:
```
$ npx cap add android
```
- Actualizamos los archivos de la plataforma:
```
$ npx cap copy && npx cap sync
```
- Generamos apk:
```
En Android Studio: Build -> Generate Signed Bundle / APK.
Seleccionamos bundle si es para subir a Play Store, APK si es para instalar directo en un dispositivo.
Seleccionamos la keystore (está en Drive) y metemos las contraseñas y el key alias (están en Drive también).
```

### Útiles:
- Regenerar assets:
```
$ npx capacitor-assets generate
```
- Abrir el proyecto en Andriod Studio:
```
$ npx cap open android
```
- Regenerar el proyecto
```
$ rm -rf ./android
$ npx cap add android
Si haces esto vas a tener que volver a añadir:
- AndroidManifest.xml: los permisos que uses.
- build.gradle(:app): el versionCode (114) y versionName ("1.1.4") que les toque, así como el namespace del proyecto y el applicationId (comunitea.reg.clock)
- En la carpeta de Java cambiar las carpetas que dan nombre al proyecto (io.ionic.starter) por comunitea.reg.clock (refactorizando cada una por la parte que le correcponde).
```

### Errores:
- Unsupported class file major version 64:
```
Puede ocurrir que al cambiar el versionCode y el versionName nos de este error al hacer build.
Hay que ir en Android Studio a Settings -> Build, Execution, Deployment -> Build Tools -> Gradle
En Gradle JDK Selecionamos la versión 17.
```