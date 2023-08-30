import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogHistoryPageRoutingModule } from './log-history-routing.module';

import { LogHistoryPage } from './log-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogHistoryPageRoutingModule
  ],
  declarations: [LogHistoryPage]
})
export class LogHistoryPageModule {}
