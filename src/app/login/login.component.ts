import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthenticateModel } from './model/authenticateModel';
import { SharedService } from '../shared/service/SharedService';
import { Constant } from '../shared/constant/Contant';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //providers:[ SharedService ]
})
export class LoginComponent implements OnInit {
  public loginModel : AuthenticateModel;
  public loginLogUrl : string;
  public loginTagline : string;
  constructor(private sharedService : SharedService,
    vcr:ViewContainerRef,private router:Router,
    private spinner: NgxSpinnerService,private toastr: ToastrService) { 
    this.loginModel = new AuthenticateModel();
  }

  ngOnInit() {
    //this.toastr.info('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 4000);
    this.getAllLogo();
  }

  getAllLogo(){
    this.sharedService.getAllLogo()
    .subscribe( (response) =>{
      //console.log(JSON.stringify(response));
      let logoList = response.wrappedList;
      for(let i=0;i<logoList.length;i++){
        let logoType = logoList[i].logoType;
        let logoUrl = logoList[i].logoUrl;
        if(logoType == Constant.LOGIN_LOGO){
          localStorage.setItem("loginLogUrl",logoUrl);
          this.loginLogUrl = logoUrl;
        }
        else if(logoType == Constant.NAVBAR_LOGO){
          localStorage.setItem("navbarLogUrl",logoUrl);
        }
        else if(logoType == Constant.TITLE_LOGO){
          localStorage.setItem("titleLogUrl",logoUrl);
        }
        else if(logoType == Constant.TAG_LOGO){
          localStorage.setItem("tagLogUrl",logoUrl);
        }
        else if(logoType == Constant.LOGIN_TAGLINE){
          localStorage.setItem("loginTagline",logoUrl);
          this.loginTagline = logoUrl;
        }
        else if(logoType == Constant.NAVBAR_TAGLINE){
          localStorage.setItem("navbarTagline",logoUrl);
        }
        else if(logoType == Constant.BRILLOCA_LOGO){
          localStorage.setItem("brillocaLogo",logoUrl);
        }
        else if(logoType == Constant.HSIL_LOGO){
          localStorage.setItem("hsilLogo",logoUrl);
        }
        else if(logoType == Constant.SHIL_LOGO){
          localStorage.setItem("shilLogo",logoUrl);
        }
        else if(logoType == Constant.MEDIA_BUTTON_TEXT){
          localStorage.setItem("mediaButtonText",logoUrl);
        }
        //console.log(JSON.stringify(logoList[i]))
      }
      //localStorage.setItem("logoList",logoList);

      // if(response.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
      //   response.wrappedList
      // }
      // else if(response.responseCode === Constant.NO_RECORDS_FOUND_CODE){
      //   this.toastr.info('No Logo Found', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
      // }
      // else{
      //   this.toastr.error('Something wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
      // }
      
  },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllLogo"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.spinner.hide();
    })
  }

  checkAuthenticate(){
    this.loginModel.deviceId = "1";
    this.spinner.show();
    this.sharedService.authenticate(this.loginModel)
    .subscribe( (response) =>{
      this.spinner.hide(); 
       //console.log(response);
         if(response.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          sessionStorage.setItem("username",this.loginModel.username);
          sessionStorage.setItem("password", this.loginModel.password)
          
          localStorage.setItem("empName",response.wrappedList[0].empName);
          localStorage.setItem("empRole",response.wrappedList[0].empRole);
          localStorage.setItem("otherRole",response.wrappedList[0].otherRole); // Admin and Other
          localStorage.setItem("organizationLogo",response.wrappedList[0].organizationLogo);
          localStorage.setItem("organizationName",response.wrappedList[0].organizationName);
          localStorage.setItem("deviceId",this.loginModel.deviceId);
          localStorage.setItem(btoa("isValidToken"),btoa(Constant.TRINITY_PRIVATE_KEY));
          this.router.navigate(['/layout']);
          this.spinner.hide();
        }
        else{
          this.toastr.error('Invalid Login Credentials...', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
  },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("authenticate"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.spinner.hide();
    })

  }

}
