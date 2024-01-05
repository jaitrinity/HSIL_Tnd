import { Injectable } from '@angular/core';
import { Http , RequestOptions , Response , Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Constant } from '../constant/Contant';

@Injectable()
export class GroupIncidentTrainingService{
    private serviceEndPoint;
    constructor(private http:Http){
        this.serviceEndPoint = Constant.tndBaseURL;
    }

    public getIncidentTrainingName(sendJson : any){
        let headers = new Headers({'Content-Type':'application/json'});
        headers.append("Access-Control-Allow-Origin", "*");
        let options = new RequestOptions({ headers:headers });
        return this.http.post(this.serviceEndPoint+'getGroupIncidentTrainingName',sendJson,options)
                .map((response:Response) => response.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getIncidentSubTrainingName(sendjson: any) {
        let headers = new Headers({'Content-Type':'application/json'});
        headers.append("Access-Control-Allow-Origin", "*");
        let options = new RequestOptions({ headers:headers });
        return this.http.post(this.serviceEndPoint+'getGroupIncidentSubTrainingName',sendjson,options)
                .map((response:Response) => response.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
      }

      public getIncidentQuestions(sendjson: any) {
        let headers = new Headers({'Content-Type':'application/json'});
        headers.append("Access-Control-Allow-Origin", "*");
        let options = new RequestOptions({ headers:headers });
        return this.http.post(this.serviceEndPoint+'getGroupIncidentQuestions',sendjson,options)
                .map((response:Response) => response.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
      }
      
}