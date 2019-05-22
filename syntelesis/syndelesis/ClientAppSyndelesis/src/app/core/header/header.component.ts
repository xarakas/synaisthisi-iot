import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../../auth/store/auth.reducers';
import * as fromAuthActions from '../../auth/store/auth.actions';

import * as fromIoTServicesActions from '../../iot-services/store/iot-service.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    @ViewChild('servicesFile') file;
    public authState$: Observable<fromAuth.State>;

    constructor(private store: Store<fromApp.AppState>,
                private router: Router) {}

    ngOnInit() {
        this.authState$ = this.store.select('auth');
    }

    onSaveData() {
    }

    onExportServices() {
        this.store.dispatch(new fromIoTServicesActions.ExportUserServices());
    }

    onProfile() {
        this.router.navigate(['/user/profile']);
    }

    onLogout() {
        this.store.dispatch(new fromAuthActions.DoLogout());
    }

    onImportServices() {
      this.file.nativeElement.click();
    }

    onFileChanged(event) {
      const selectedFile = <File>event.target.files[0];
      const uploadData = new FormData();
      uploadData.append('services_import_file', selectedFile, selectedFile.name);
      // const service_id = 5;
      this.store.dispatch(
        new fromIoTServicesActions.ImportUserServices({  uploadData })
      );
    }
}
