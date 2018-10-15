import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing/app-routing.module';
import { AlertComponent } from '../core/alert/alert.component';
// import { AuthGuardService } from '../auth/auth-guard.service';
import { AlertService } from '../core/alert.service';
import { AuthInterceptor } from '../shared/auth.interceptor';
import { LoggingInterceptor } from '../shared/logging.interceptor';


@NgModule({
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    AlertComponent
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent,
    AlertComponent
  ],
  providers: [
    AlertService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true}
  ]
})
export class CoreModule { }
