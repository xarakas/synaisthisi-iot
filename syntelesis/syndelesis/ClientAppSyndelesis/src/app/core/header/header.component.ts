import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../../auth/store/auth.reducers';
import * as fromAuthActions from '../../auth/store/auth.actions';

import * as fromUserSpaceActions from '../../user-space/store/user-space.actions';
import { UserSpaceService } from '../../user-space/user-space.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    public authState$: Observable<fromAuth.State>;

    constructor(private store: Store<fromApp.AppState>,
                private router: Router,
                private us_service: UserSpaceService) {}

    ngOnInit() {
        this.authState$ = this.store.select('auth');
    }

    onSaveData() {
        // this.store.dispatch(new fromRecipeActions.StoreRecipes());
    }

    onExportServices() {
        this.store.dispatch(new fromUserSpaceActions.ExportUserServices());
        // Implemented as Action for consistency (access all backend from store)
        // this.us_service.exportUserServices(1)
        //     .subscribe(data => (this.onDownloadServicesFile(data)),
        //     error => console.log(error),
        //     () => console.log('File downloaded OK')
        // );
    }

    // onDownloadServicesFile(res: Response) {
    //     const blob = new Blob([res]);
    //     const url = window.URL.createObjectURL(blob);

    //     const a = document.createElement('a');
    //     document.body.appendChild(a);
    //     a.setAttribute('style', 'display: none');
    //     a.href = url;
    //     a.download = 'saved_services.txt';
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove();

    // }

    onProfile() {
        this.router.navigate(['/user/profile']);
    }

    onLogout() {
        this.store.dispatch(new fromAuthActions.DoLogout());
    }
}
