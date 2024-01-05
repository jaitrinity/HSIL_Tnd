import { Injectable } from '@angular/core';
import { Http , RequestOptions , Response , Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Constant } from '../constant/Contant';

@Injectable()
export class TndNotificationService{
    private serviceEndPoint;
    constructor(private http:Http){
        this.serviceEndPoint = Constant.tndBaseURL;
    }

    public submitNotification(sendJson: any) {
        let headers = new Headers({'Content-Type':'application/json'});
        headers.append("Access-Control-Allow-Origin", "*");
        let options = new RequestOptions({ headers:headers });
        return this.http.post(this.serviceEndPoint+"submitNotification",sendJson,options)
                .map((response:Response) => response.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}