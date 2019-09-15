import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Utils } from '../utils';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from 'environments/environment';

/// import { AccountService } from './account.service';

@Injectable()
export class DataService {

    public baseurl = '';

    // Define the internal Subject we'll use to push the command count
    public pendingCommandsSubject = new Subject<number>();
    public pendingCommandCount = 0;

    // Provide the *public* Observable that clients can subscribe to
    public pendingCommands$: Observable<number>;

    constructor(public http: HttpClient,
        @Inject(DOCUMENT) private document: Document) {
        if (environment.production) {
            this.baseurl = `${this.document.location.protocol}//${this.document.location.host}`;
        } else {
            /// this.baseurl = 'http://localhost:23354';
            this.baseurl = `${this.document.location.protocol}//${this.document.location.host}`;
        }
        this.pendingCommands$ = this.pendingCommandsSubject.asObservable();
    }

    public getImage(url: string): Observable<any> {
        return Observable.create((observer: any) => {
            const req = new XMLHttpRequest();
            req.open('get', url);
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    observer.next(req.response);
                    observer.complete();
                }
            };

            //// req.setRequestHeader('Authorization', `Bearer ${this.inj.get(AccountService).accessToken}`);
            req.send();
        });
    }

    public get<T>(url: string, params?: any): Observable<T> {
        return this.http.get<T>(this.baseurl + url, { params: this.buildUrlSearchParams(params) });
    }

    public getFull<T>(url: string): Observable<HttpResponse<T>> {
        return this.http.get<T>(url, { observe: 'response' });
    }

    public post<T>(url: string, data?: any, params?: any): Observable<T> {
        return this.http.post<T>(this.baseurl + url, data);
    }

    public put<T>(url: string, data?: any, params?: any): Observable<T> {
        return this.http.put<T>(this.baseurl + url, data);
    }

    public delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(this.baseurl + url);
    }

    private buildUrlSearchParams(params: any): HttpParams {
        let searchParams = new HttpParams();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                let val = params[key];
                if (val instanceof Date) {
                    val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss');
                  }

                searchParams = searchParams.append(key, val);
            }
        }
        return searchParams;
    }
}
