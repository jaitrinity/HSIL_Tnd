import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/shared/constant/Contant';
import { TndSharedService } from 'src/app/shared/service/TndSharedService';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TndNotificationService } from 'src/app/shared/service/TndNotificationService';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/SharedService';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  isOR: boolean = false;
  employeeId: any = "";
  title: any = "";
  description: any = "";
  roleList = [];
  selectedRoleList = [];
  circleNameList = [];
  selectedCircleNameList = [];
  zoneNameList = [];
  selectedZoneNameList = [];
  clusterNameList = [];
  selectedClusterNameList = [];
  loginEmpId: any = "";
  loginEmpRole: any = "";

  multiSelectropdownSettings = {};
  public organizationName : string = "";
  public organizationLogo : string = "";
  public submenuName : string = "";
  constructor(private router: Router,private tndSharedService: TndSharedService, 
    private sharedService : SharedService,
    private notificationService : TndNotificationService,
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService) { 
    this.loginEmpId = sessionStorage.getItem("username");
    this.loginEmpRole = localStorage.getItem("empRole");
    this.organizationLogo = localStorage.getItem("organizationLogo");
    this.organizationName = localStorage.getItem("organizationName");
    this.submenuName = localStorage.getItem("tndNotification");
    localStorage.setItem("currentPage","tndNofication");
  }

  ngOnInit() {
    this.multiSelectropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true
    };

    this.loadRoleList();
    this.getOrganizationData(Constant.ORGANIZATION);
  }

  onSelectCircle(item: any) {
    this.getOrganizationData(Constant.LOCATION);
  }
  onDeSelectCircle(item: any) {
    this.zoneNameList = [];
    this.selectedZoneNameList = [];
    this.clusterNameList = [];
    this.selectedClusterNameList = [];
  }

  onSelectAllCircle(item: any) {
    this.selectedCircleNameList = item;
    this.getOrganizationData(Constant.LOCATION);
  }
  onDeSelectAllCircle(item: any) {
    this.selectedCircleNameList = item;
    this.zoneNameList = [];
    this.selectedZoneNameList = [];
    this.clusterNameList = [];
    this.selectedClusterNameList = [];
  }

  onSelectZone(item: any) {
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onSelectAllZone(item: any) {
    this.selectedZoneNameList = item;
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onDeSelectZone(item: any) {
    this.selectedZoneNameList = item;
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onDeSelectAllZone(item: any) {
    this.selectedZoneNameList = item;
    this.clusterNameList = [];
    this.selectedClusterNameList = [];
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  reloadPage(){
    let isReloadPage = confirm("Do you want reload this page??");
    if(isReloadPage){
      this.router.navigate(['/layout/dashboard']);
    }
  }

  changeVideoListener($event): void {
    this.readVideoThis($event.target);
  }

  imageBase64String: any = "";
  readVideoThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imageBase64String = myReader.result;
      //console.log(this.imageBase64String)
    }
    myReader.readAsDataURL(file);
  }

  getOrganizationData(searchType : any){
    let orgLocJson = {
      loginEmpId: this.loginEmpId,
      loginEmpRole: this.loginEmpRole,
      orgName: this.selectedCircleNameList,
      locName: this.selectedZoneNameList,
      searchType: searchType
    };
    this.tndSharedService.getOrganizationData(orgLocJson)
      .subscribe((response) => {
        //console.log(response);
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          if(searchType == 'ORG'){
            this.circleNameList = response.wrappedList;
          }
          else if(searchType == 'LOC'){
            this.zoneNameList = response.wrappedList;
          }
          else if(searchType == 'DEPT'){
            this.clusterNameList = response.wrappedList;
          }
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getOrganizationData"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        })
  }

  loadRoleList(){
    this.sharedService.getRoleList()
    .subscribe( (response) =>{
      this.spinner.hide(); 
         if(response.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          this.roleList = response.wrappedList;
          
          this.spinner.hide();
        }
        else{
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
  },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("loadRoleList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.spinner.hide();
    })
  }

  validateNotificationData(): any {
    if(this.isOR){
      if(this.employeeId.trim() == ''){
        alert("enter emp id");
        return false;
      }else if(this.title.trim() == ''){
        alert("please enter heading");
        return false;
      }else if(this.description.trim() == ''){
        alert("please enter description");
        return false;
      }
      // else if(this.imageBase64String.trim() == '' ){
      //   alert("select image");
      //   return false;
      // }
      else{
        return true;
      }
    }else{
      if(this.selectedCircleNameList.length == 0){
        alert("please select organization");
        return false;
      }
      else if(this.selectedRoleList.length == 0){
        alert("please select location");
        return false;
      }
      else if(this.selectedClusterNameList.length == 0){
        alert("please select department");
        return false;
      }else if(this.title.trim() == ''){
        alert("please enter heading");
        return false;
      }else if(this.description.trim() == ''){
        alert("please enter description");
        return false;
      }
      // else if(this.imageBase64String.trim() == '' ){
      //   alert("select image");
      //   return false;
      // }
      else{
        return true;
      }

    }
  }

  submitNotification(){
    if (!this.validateNotificationData()) {
      return false;
    }

    let jsonData = {
      empId : this.employeeId,
      title : this.title,
      description : this.description,
      image : this.imageBase64String,
      role : this.selectedRoleList,
      circle : this.selectedCircleNameList,
      zone : this.selectedZoneNameList,
      cluster : this.selectedClusterNameList
    }
    this.spinner.show();
    this.notificationService.submitNotification(jsonData)
    .subscribe((response) =>{
      console.log(response);
      if(response.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success('Notification successfully save', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.spinner.hide();
        location.reload();
      }
      else{
        this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.spinner.hide();
      }
    },
    (error) => {
      this.toastr.warning(Constant.returnServerErrorMessage("submitNotification"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.spinner.hide();
    });
  }

}
