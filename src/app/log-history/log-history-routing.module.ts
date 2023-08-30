import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogHistoryPage } from './log-history.page';

const routes: Routes = [
  {
    path: '',
    component: LogHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogHistoryPageRoutingModule {}
