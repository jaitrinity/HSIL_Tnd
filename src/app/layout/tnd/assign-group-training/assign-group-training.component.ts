import { Component, OnInit } from '@angular/core';
import { TndSharedService } from 'src/app/shared/service/TndSharedService';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/shared/constant/Contant';
import { Router } from '@angular/router';
import { TndGroupTrainingService } from 'src/app/shared/service/TndGroupTrainingService';

@Component({
  selector: 'app-assign-group-training',
  templateUrl: './assign-group-training.component.html',
  styleUrls: ['./assign-group-training.component.css']
})
export class AssignGroupTrainingComponent implements OnInit {

  loginEmpId: any = "";
  loginEmpRole: any = "";
  circleNameList = [];
  selectedCircleNameList = [];
  zoneNameList = [];
  selectedZoneNameList = [];
  clusterNameList = [];
  selectedClusterNameList = [];

  employeeId: any = "";
  isOR: boolean = false;
  startDate: any = "";
  endDate: any = "";
  groupTrainingId = "";
  groupNameList = [];
  circleNames = "";
  multiSelectropdownSettings = {};
  singleSelectropdownSettings = {};
  public organizationLogo : string = "";
  public organizationName : string = "";
  public submenuName : string = "";
  constructor(private router: Router, 
    private groupTrainingService : TndGroupTrainingService,
    private tndSharedService: TndSharedService, 
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService) {
      this.loginEmpId = sessionStorage.getItem("username");
      this.loginEmpRole = localStorage.getItem("empRole");
      this.organizationLogo = localStorage.getItem("organizationLogo");
      this.organizationName = localStorage.getItem("organizationName");
      this.submenuName = localStorage.getItem("assignGroupTraining");
      localStorage.setItem("currentPage","assignGroupTraining");
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

    this.getOrganizationData(Constant.ORGANIZATION);
  }

  onSelectCircle(item: any) {
    //console.log(item);
    this.groupTrainingId = "";
    this.groupNameList = [];
    this.circleNames = this.createCommaSeprate(this.selectedCircleNameList);
    this.getGroupNameForAssignGroupTraining();
  }

  onDeSelectCircle(item: any) {
    //console.log(item);
    this.groupTrainingId = "";
    this.groupNameList = [];
    this.circleNames = this.createCommaSeprate(this.selectedCircleNameList);
    this.getGroupNameForAssignGroupTraining();
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

  reloadPage(){
    let isReloadPage = confirm("Do you want reload this page??");
    if(isReloadPage){
      this.router.navigate(['/layout/dashboard']);
    }
  }

  getGroupNameForAssignGroupTraining(){
    
    if(this.selectedCircleNameList.length == 0){
      this.groupNameList = [];
      return false;
    }
    let sendJson = {
      circleNames : this.circleNames,
      searchType : "ASSIGN_GROUP_TRAINING"
    }
    this.groupTrainingService.getTrainingForGroupTraining(sendJson)
      .subscribe((response) => {
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.groupNameList = response.wrappedList;
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
        console.log(response);
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

  validateAssignData(): any {
    let start = new Date(this.startDate);
    let end = new Date(this.endDate);
    
    if(this.selectedCircleNameList.length === 0){
      alert("please select organization");
      return false;
    }
    else if (this.groupTrainingId === "") {
      alert("please select group name")
      return false;
    }
    else if (this.startDate === "") {
      alert("please select start date")
      return false;
    }
    else if (this.endDate === "") {
      alert("please select end date")
      return false;
    }
    else if (start >= end) {
      alert("End Date should be greater than or equal to start date");
      return false
    }
    else if (this.isOR && this.employeeId === "") {
      alert("please enter emp id")
      return false;
    }
    else {
      return true;
    }
  }

  assignTraining() {
    if (!this.validateAssignData()) {
      return false;
    }

    var circleAbbr = this.selectedCircleNameList[0].paramCode;
    let groupMasterId = "";
    for(let i=0;i<this.groupNameList.length;i++){
      if(this.groupNameList[i].paramCode == this.groupTrainingId){
        groupMasterId = this.groupNameList[i].groupMasterId;
      }
    }

    let jsonString = {
      groupTrainingId: this.groupTrainingId,
      circleAbbr: circleAbbr,
      startDate: this.startDate,
      endDate: this.endDate,
      empId: this.employeeId,
      isSelectedFlag: this.isOR,
      groupMasterId : groupMasterId
    }

    //console.log(JSON.stringify(jsonString));
    this.spinner.show();
    this.tndSharedService.assignTraining(jsonString)
      .subscribe((response) => {
        console.log(response);
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.toastr.success('Successfully assign', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          alert("ticket created : "+response.wrappedList[0].NO_OF_TKT_CREATED)
          this.spinner.hide();
          location.reload();
        }

        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("assignTraining"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })
  }

}
