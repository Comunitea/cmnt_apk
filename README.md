### APP control de fichaje para iOS, Android o navegador

# Requisitos
- Odoo 8 con el módulo hr_attendance_apk
- Ionic framework 3+
- npm
- Capacitor (para iOS)

# Instalación
- Git clone.
- ionic cordova platformn add (android/ios/browser)
- Instalar las dependencias que diga que falten con npm install

# Probar en navegador/generar archivos para navegador
Se puede ejecutar con ionic serve pero a veces el navegador no ejecutará cordova y fallará.
- ionic cordova platform add browser
- ionic cordova prepare browser
- ionic cordova run browser

# Generar apk para Android
Creamos la plataforma si no lo hemos hecho ya:
- ionic cordova platform add android
Actualizamos los archivos de la plataforma:
- ionic cordova prepare android
Generamos apk:
- ionic cordova build --release android
Generamos keystore si no tenemos:
- keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
Firmamos la apk:
- jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore apkfileName.apk alias_name
Comprimimos la apk:
- zipalign -v 4 Myapp-release-unsigned.apk MyappName.apk

# Generar app para iOS
Instalamos pods:
- sudo gem install cocoapods
Creamos la plataforma si no lo hemos hecho ya:
- ionic capacitor add ios
Creamos los iconos e imágenes de la app:
- ionic cordova resources ios
- Copiamos los archivos generados en la carpeta ios/App/App/Assets.xcassets
Actualizamos el proyecto si hemos hecho cambios:
- ionic capacitor copy ios
Arrancamos el proyecto en Xcode (se puede usar open o run):
- ionic capacitor open ios