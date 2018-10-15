import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './auth.service';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    declarations: [
        SigninComponent,
        SignupComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule],
    exports: [],
    providers: [
        AuthService
    ]
})
export class AuthModule {}
