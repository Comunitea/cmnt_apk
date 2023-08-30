import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageListPage } from './page-list.page';

const routes: Routes = [
  {
    path: '',
    component: PageListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageListPageRoutingModule {}
