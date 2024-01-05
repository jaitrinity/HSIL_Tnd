import { Injectable } from '@angular/core';
import { Http , RequestOptions , Response , Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Constant } from '../constant/Contant';
import { AuthenticateModel } from 'src/app/login/model/authenticateModel';

@Injectable()
export class SharedService{

    private serviceEndPoint;
    constructor(private http:Http){
        this.serviceEndPoint = Constant.serverURL;
    }

    public authenticate(authModel:AuthenticateModel){
        let bodyString = JSON.stringify(authModel);
        //console.log(bodyString);
        let headers = new Headers({'Content-Type':'application/json'});
        headers.append("Access-Control-Allow-Origin", "*");
        let options = new RequestOptions({ headers:headers });
        return this.http.post(this.serviceEndPoint+'authenticate',bodyString,options)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMenuListByRoleName(jsonData : any){
        let bodyString = JSON.stringify(jsonData);
        //console.log(bodyString);
        let headers = new Headers({'Content-Type':'application/json'});
        headers.append("Access-Control-Allow-Origin", "*");
        let options = new RequestOptions({ headers:headers });
        return this.http.post(this.serviceEndPoint+'getMenuListByRoleName',bodyString,options)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getAllLogo() {
        let headers = new Headers({'Content-Type':'application/json'});
        headers.append("Access-Control-Allow-Origin", "*");
        let options = new RequestOptions({ headers:headers });
        return this.http.get(this.serviceEndPoint+'getAllLogo',options)
                .map((response:Response) => response.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getRoleList() {
        let headers = new Headers({'Content-Type':'application/json'});
        headers.append("Access-Control-Allow-Origin", "*");
        let options = new RequestOptions({ headers:headers });
        return this.http.get(this.serviceEndPoint+'getRoleList',options)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}