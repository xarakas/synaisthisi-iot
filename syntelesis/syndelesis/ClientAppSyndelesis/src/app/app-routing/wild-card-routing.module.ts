import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '../core/home/home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '**',
                component: HomeComponent
            }
        ])
    ],
    declarations: [
    ],
    exports: [
        RouterModule
    ]
})
export class WildcardRoutingModule { }
