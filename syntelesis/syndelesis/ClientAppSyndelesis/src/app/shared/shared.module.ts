import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { SearchComponent } from './search/search.component';

@NgModule({
    declarations: [
        DropdownDirective,
        SearchComponent
    ],
    imports: [CommonModule],
    exports: [
        CommonModule,
        DropdownDirective,
        SearchComponent
    ]
})
export class SharedModule {}
