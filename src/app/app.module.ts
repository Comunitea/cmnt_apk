import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LogHistoryPage } from '../pages/log-history/log-history';
import { NativeAudio } from '@ionic-native/native-audio';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { OdooProvider } from '../providers/odoo-connector/odoo-connector';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { CardLogComponent} from '../components/card-log/card-log';
import { NetworkInterface } from '@ionic-native/network-interface';
import { SafePipe } from './safe.pipe';
import { AudioPlayer } from '../providers/audio/audio';
import { File } from '@ionic-native/file';
import { Push } from '@ionic-native/push';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LogHistoryPage,
    CardLogComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp), 
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LogHistoryPage,
    CardLogComponent,
    ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BackgroundGeolocation,
    OdooProvider,
    NetworkInterface,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AudioPlayer,
    NativeAudio,
    Push,
    InAppBrowser,
  ]
})
export class AppModule {
}

