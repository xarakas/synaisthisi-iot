import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { SearchComponent } from './search/search.component';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert.service';

@NgModule({
    declarations: [
        DropdownDirective,
        SearchComponent,
        AlertComponent
    ],
    imports: [CommonModule],
    exports: [
        CommonModule,
        DropdownDirective,
        SearchComponent,
        AlertComponent
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                AlertService
            ]
        };
    }
}
