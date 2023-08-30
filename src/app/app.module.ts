import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers, Storage } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AudioPlayer } from '../providers/audio/audio';
import { OdooProvider } from '../providers/odoo-connector/odoo-connector';
import { StorageService } from '../providers/storage/storage'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot({
    name: '__control_asistencia',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
  })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AudioPlayer, OdooProvider, StorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
