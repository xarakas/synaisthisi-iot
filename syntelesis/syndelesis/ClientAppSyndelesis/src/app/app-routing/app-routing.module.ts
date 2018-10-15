import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from '../core/home/home.component';
import { AuthGuardService } from '../auth/auth-guard.service';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  // {path: 'recipes', loadChildren: '../recipes/recipes.module#RecipesModule'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class AppRoutingModule { }
