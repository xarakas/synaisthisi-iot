import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { TopicsModule } from './topics/topics.module';
import { WildcardRoutingModule } from './app-routing/wild-card-routing.module';
import { reducers } from './store/app.reducers';
import { AuthEffects } from './auth/store/auth.effects';
import { TopicEffects } from './topics/store/topic.efects';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    TopicsModule,
    AuthModule.forRoot(),
    SharedModule.forRoot(),
    WildcardRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects, TopicEffects]),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
