import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from '../core/home/home.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'services', loadChildren: '../iot-services/iot-services.module#IotServicesModule'},
  {path: 'user', loadChildren: '../user-space/user-space.module#UserSpaceModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,
      {preloadingStrategy: PreloadAllModules}
      ),
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
