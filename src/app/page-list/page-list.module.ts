import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageListPageRoutingModule } from './page-list-routing.module';

import { PageListPage } from './page-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageListPageRoutingModule
  ],
  declarations: [PageListPage]
})
export class PageListPageModule {}
