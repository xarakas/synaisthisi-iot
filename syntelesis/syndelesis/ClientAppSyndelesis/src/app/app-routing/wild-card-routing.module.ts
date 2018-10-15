import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
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
