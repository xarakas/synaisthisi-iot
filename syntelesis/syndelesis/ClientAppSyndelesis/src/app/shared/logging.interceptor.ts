
import {tap} from 'rxjs/operators';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';


export class LoggingInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       return next.
            handle(req).pipe(
            tap(
                event => {
                    // console.log(event);
                    if (event instanceof HttpResponse) {
                        console.log('Resopnse Event: ', event); // event.body etc
                    }
                }
            ));
    }
}
