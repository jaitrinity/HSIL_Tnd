import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TndGroupTrainingService } from 'src/app/shared/service/TndGroupTrainingService';
import { Constant } from 'src/app/shared/constant/Contant';
import { TndSharedService } from 'src/app/shared/service/TndSharedService';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/SharedService';

@Component({
  selector: 'app-group-training',
  templateUrl: './group-training.component.html',
  styleUrls: ['./group-training.component.css']
})
export class GroupTrainingComponent implements OnInit {

  groupName = "";
  trainingList = [];
  selectedTrainingList = [];
  roleList = [];
  selectedRoleList = [];
  trainingIds = "";
  trainingNames = "";
  circleNames = "";
  roleNames = "";
  passingPercentage = "";
  loginEmpId: any = "";
  loginEmpRole: any = "";
  circleNameList = [];
  selectedCircleNameList = [];
  multiSelectropdownSettings = {};
  singleSelectropdownSettings = {};
  public organizationName : string = "";
  public organizationLogo : string = "";
  public submenuName : string = "";
  constructor(private router: Router, private tndSharedService: TndSharedService,
    private groupTrainingService : TndGroupTrainingService, 
    private sharedService : SharedService,
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService) { 
      this.loginEmpId = sessionStorage.getItem("username");
      this.loginEmpRole = localStorage.getItem("empRole");
      this.organizationLogo = localStorage.getItem("organizationLogo");
      this.organizationName = localStorage.getItem("organizationName");
      this.submenuName = localStorage.getItem("groupTraining");
      localStorage.setItem("currentPage","groupTraining");
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

    this.singleSelectropdownSettings = {
      singleSelection: true,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true
    };

    //this.loadRoleList();
    //this.getTrainingForGroupTraining();
    this.getOrganizationData(Constant.ORGANIZATION);
  }

  onSelectTraining(item: any) {
    //console.log(item);
    //console.log(JSON.stringify(this.selectedTrainingList));
    this.trainingNames = this.createCommaSeprateRole(this.selectedTrainingList);
    this.trainingIds = this.createCommaSeprate(this.selectedTrainingList);
  }

  onSelectAllTraining(item: any) {
    //console.log(item);
    this.selectedTrainingList = item;
    this.trainingNames = this.createCommaSeprateRole(this.selectedTrainingList);
    this.trainingIds = this.createCommaSeprate(this.selectedTrainingList);
    //console.log(JSON.stringify(this.selectedTrainingList));
    
  }

  onDeSelectTraining(item: any) {
    //console.log(item);
    this.trainingNames = this.createCommaSeprateRole(this.selectedTrainingList);
    this.trainingIds = this.createCommaSeprate(this.selectedTrainingList);
    //console.log(JSON.stringify(this.selectedTrainingList));
  }

  onDeSelectAllTraining(item: any) {
    //console.log(item);
    this.selectedTrainingList = item;
    this.trainingNames = this.createCommaSeprateRole(this.selectedTrainingList);
    this.trainingIds = this.createCommaSeprate(this.selectedTrainingList);
    //console.log(JSON.stringify(this.selectedTrainingList));
  }

  onSelectCircle(item: any) {
    //console.log(item);
    this.trainingList = [];
    this.selectedTrainingList = [];
    this.circleNames = this.createCommaSeprate(this.selectedCircleNameList);
    this.getTrainingForGroupTraining();
  }

  onSelectAllCircle(item: any) {
    //console.log(item);
    this.trainingList = [];
    this.selectedTrainingList = [];
    this.selectedCircleNameList = item;
    this.circleNames = this.createCommaSeprate(this.selectedCircleNameList);
    this.getTrainingForGroupTraining();
  }

  onDeSelectCircle(item: any) {
    //console.log(item);
    this.trainingList = [];
    this.selectedTrainingList = [];
    this.circleNames = this.createCommaSeprate(this.selectedCircleNameList);
    this.getTrainingForGroupTraining();
  }

  onDeSelectAllCircle(item: any) {
    //console.log(item);
    this.trainingList = [];
    this.selectedTrainingList = [];
    this.selectedCircleNameList = item;
    this.circleNames = this.createCommaSeprate(this.selectedCircleNameList);
    this.getTrainingForGroupTraining();
  }

  // onSelectRole(item: any) {
  //   //console.log(item);
  //   this.roleNames = this.createCommaSeprateRole(this.selectedRoleList);
  // }

  // onSelectAllRole(item: any) {
  //   //console.log(item);
  //   this.selectedRoleList = item;
  //   this.roleNames = this.createCommaSeprateRole(this.selectedRoleList);
    
  // }

  // onDeSelectRole(item: any) {
  //   //console.log(item);
  //   this.roleNames = this.createCommaSeprateRole(this.selectedRoleList);
  // }

  // onDeSelectAllRole(item: any) {
  //   //console.log(item);
  //   this.selectedRoleList = item;
  //   this.roleNames = this.createCommaSeprateRole(this.selectedRoleList);
  // }

  createCommaSeprateRole(listData : any){
    let commSeprateValue = "";
    for(let i=0;i<listData.length;i++){
      commSeprateValue += listData[i].paramDesc;
      if(i != listData.length-1){
        commSeprateValue += ",";
      }
    }
    return commSeprateValue;
  }

  reloadPage(){
    let isReloadPage = confirm("Do you want reload this page??");
    if(isReloadPage){
      this.router.navigate(['/layout/dashboard']);
    }
  }

  loadRoleList(){
    this.sharedService.getRoleList()
    .subscribe( (response) =>{
         if(response.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          this.roleList = response.wrappedList;
        }
        else{
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        }
  },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("loadRoleList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.spinner.hide();
    })
  }

  getOrganizationData(searchType : any){
    let orgLocJson = {
      loginEmpId: this.loginEmpId,
      loginEmpRole: this.loginEmpRole,
      searchType: searchType
    };
    this.tndSharedService.getOrganizationData(orgLocJson)
      .subscribe((response) => {
        //console.log(response);
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.circleNameList = response.wrappedList;

          //console.log(this.circleNameList);
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

  createCommaSeprate(listData : any){
    let commSeprateValue = "";
    for(let i=0;i<listData.length;i++){
      commSeprateValue += listData[i].paramCode;
      if(i != listData.length-1){
        commSeprateValue += ",";
      }
    }
    return commSeprateValue;
  }

  getTrainingForGroupTraining(){
    
    if(this.selectedCircleNameList.length == 0){
      this.trainingList = [];
      return false;
    }
    let sendJson = {
      circleNames : this.circleNames,
      searchType : "CREATE_GROUP_TRAINING"
    }
    this.groupTrainingService.getTrainingForGroupTraining(sendJson)
      .subscribe((response) => {
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.trainingList = response.wrappedList;
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getTrainingForGroupTraining"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        })
  }

  submitTraining(){
    if(this.groupName == ""){
      alert("please enter group name");
      return false;
    }
    else if(this.selectedCircleNameList.length == 0){
      alert("please select organization");
      return false;
    }
    else if(this.selectedTrainingList.length == 0){
      alert("please select atleast one training name");
      return false;
    }
    else if(this.passingPercentage == ""){
      alert("please enter passing percentage");
      return false;
    }
    let jsonData = {
      groupName : "G-"+this.groupName,
      trainingIds : this.trainingIds,
      roleNames : this.roleNames,
      circleNames : this.circleNames,
      passingPercentage : this.passingPercentage
    }

    //console.log(JSON.stringify(jsonData));
    this.spinner.show();
    this.groupTrainingService.createGroupTraining(jsonData)
      .subscribe((response) => {
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.groupName = "";
          this.selectedTrainingList = [];
          this.trainingIds = "";
          this.trainingNames = "";
          this.selectedRoleList = [];
          this.roleNames = "";
          this.selectedCircleNameList = [];
          this.circleNames = "";
          this.passingPercentage = "";
          this.toastr.success('Successfully create group training', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("submitTraining"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })


  }

}
