import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TndSharedService } from 'src/app/shared/service/TndSharedService';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/shared/constant/Contant';
import * as alasql from 'alasql';
import * as xlsx from 'xlsx';
import { SharedService } from 'src/app/shared/service/SharedService';

@Component({
  selector: 'app-assign-training',
  templateUrl: './assign-training.component.html',
  styleUrls: ['./assign-training.component.css']
})
export class AssignTrainingComponent implements OnInit {

  roleList = [];
  selectedRoleList = [];
  circleNameList = [];
  selectedCircleNameList = [];
  zoneNameList = [];
  selectedZoneNameList = [];
  clusterNameList = [];
  selectedClusterNameList = [];
  trainingNameList = [];
  subTrainingNameList = [];
  startDate: any = "";
  endDate: any = "";
  employeeId: any = "";

  trainingName: any = "";
  subTrainingName: any = "";

  multiSelectropdownSettings = {};
  singleSelectropdownSettings = {};

  loginEmpId: any = "";
  loginEmpRole: any = "";
  public organizationLogo : string = "";
  public organizationName : string = "";
  public submenuName : string = "";
  constructor(private router: Router, 
    private sharedService : SharedService,
    private tndSharedService: TndSharedService, 
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService) {
    this.loginEmpId = sessionStorage.getItem("username");
    this.loginEmpRole = localStorage.getItem("empRole");
    this.organizationLogo = localStorage.getItem("organizationLogo");
    this.organizationName = localStorage.getItem("organizationName");
    this.submenuName = localStorage.getItem("assignTraining");
    localStorage.setItem("currentPage","assignTraining");
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
    
    //this.roleList = [{ "paramCode": "TECHNICIAN", "paramDesc": "Technician " }, { "paramCode": "CI", "paramDesc": "CI " }]
    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    //   this.toastr.success('Welcome to assign training', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
    // }, 2000);
    //this.loadRoleList();
    //this.getUserCircleZoneCluster("CIRCLE");
    this.getOrganizationData(Constant.ORGANIZATION);
  }

  onSelectCircle(item: any) {
    //this.getUserCircleZoneCluster("ZONE");
    this.getOrganizationData(Constant.LOCATION);
    this.trainingNameByCircleAbbr();
    this.subTrainingNameList = [];
    this.roleList = [];
    this.selectedRoleList = [];
  }
  onDeSelectCircle(item: any) {
    this.trainingName = "";
    this.trainingNameList = [];
    this.subTrainingName = "";
    this.subTrainingNameList = [];
    this.roleList = [];
    this.selectedRoleList = [];
    this.zoneNameList = [];
    this.selectedZoneNameList = [];
    this.clusterNameList = [];
    this.selectedClusterNameList = [];
  }

  onSelectZone(item: any) {
    //console.log(item);
    //this.getUserCircleZoneCluster("CLUSTER");
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onSelectAllZone(item: any) {
    //console.log(item);
    // this.selectedZoneNameList = item;
    // this.getUserCircleZoneCluster("CLUSTER");

    this.selectedZoneNameList = item;
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onDeSelectZone(item: any) {
    //console.log(item);
    //this.getUserCircleZoneCluster("CLUSTER");
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onDeSelectAllZone(item: any) {
    //console.log(item);
    // this.selectedZoneNameList = item;
    // this.clusterNameList = [];
    // this.selectedClusterNameList = [];
    //this.getUserCircleZoneCluster("CLUSTER");

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

  getUserCircleZoneCluster(searchType: any) {
    let circleZoneClusterJson = {
      loginEmpId: this.loginEmpId,
      loginEmpRole: this.loginEmpRole,
      circleName: this.selectedCircleNameList,
      zoneName: this.selectedZoneNameList,
      clusterName: this.selectedClusterNameList,
      searchType: searchType
    };

    this.spinner.show();
    this.tndSharedService.getUserCircleZoneCluster(circleZoneClusterJson)
      .subscribe((response) => {
        //console.log(JSON.stringify(response));
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          if (searchType == "CIRCLE") {
            this.circleNameList = response.wrappedList;
          }
          else if (searchType == "ZONE") {
            this.zoneNameList = response.wrappedList;
          }
          else if (searchType == "CLUSTER") {
            this.clusterNameList = response.wrappedList;
          }
          this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getUserCircleZoneCluster"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })
  }

  trainingNameByCircleAbbr() {
    this.trainingNameList = [];
    this.subTrainingNameList = [];
    this.spinner.show();
    this.tndSharedService.trainingNameByCircleAbbr(this.selectedCircleNameList[0].paramCode)
      .subscribe((response) => {
        //console.log(response);
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.trainingNameList = response.wrappedList;
          this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("trainingNameByCircleAbbr"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })
  }

  loadRoleForGroupTraining(){
    let circleAbbr = this.selectedCircleNameList[0].paramCode;
    let sendJson = {
      "trainingName": this.trainingName,
      "circleAbbr": circleAbbr,
      "searchType" : "ROLE"
    };

    this.spinner.show();
    this.tndSharedService.getDistinctSubTrainingName(sendJson)
      .subscribe((response) => {
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.roleList = response.wrappedList;
          this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getDistinctSubTrainingName"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })
  }

  isGroup : boolean = false;
  selectTrainingName(searchType) {
    
    if(searchType == "SUB" && this.trainingName.indexOf("G-") >= 0){
      this.isGroup = true;
      this.loadRoleForGroupTraining();
      return false;
    }
    this.isGroup = false;
    
    let circleAbbr = this.selectedCircleNameList[0].paramCode;
    let sendJson = {
      "trainingName": this.trainingName,
      "subTrainingName" : this.subTrainingName,
      "circleAbbr": circleAbbr,
      "searchType" : searchType
    };

    this.spinner.show();
    this.tndSharedService.getDistinctSubTrainingName(sendJson)
      .subscribe((response) => {
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          if(searchType == 'SUB'){
            this.roleList = [];
            this.selectedRoleList = [];
            this.subTrainingNameList = response.wrappedList;
          }
          else{
            this.roleList = response.wrappedList;
          }
          
          this.spinner.hide();
        }


        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getDistinctSubTrainingName"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })
  }

  validateAssignData(): any {
    let start = new Date(this.startDate);
    let end = new Date(this.endDate);
    if (this.isOR) {
      if(this.selectedCircleNameList.length === 0){
        alert("please select organization");
        return false;
      }
      else if (this.trainingName === "") {
        alert("please select training name")
        return false;
      }

      else if (this.subTrainingName === "" && this.trainingName.indexOf("G-") < 0) {
        alert("please select sub training name")
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
      else if (this.employeeId === "") {
        alert("please enter emp id")
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if(this.selectedCircleNameList.length === 0){
        alert("please select organization");
        return false;
      }
      else if (this.trainingName === "") {
        alert("please select training name")
        return false;
      }

      else if (this.subTrainingName === "" && this.trainingName.indexOf("G-") < 0) {
        alert("please select sub training name")
        return false;
      }
      else if (this.selectedRoleList.length === 0) {
        alert("please select role")
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
      else if (this.selectedZoneNameList.length === 0) {
        alert("select zone");
        return false;
      }
      else if (this.selectedClusterNameList.length === 0) {
        alert("select cluster");
        return false;
      }
      else {
        return true;
      }
    }

  }

  isOR: boolean = false;
  assignTraining() {
    if (!this.validateAssignData()) {
      return false;
    }

    var circleAbbr = this.selectedCircleNameList[0].paramCode;

    let jsonString = {
      trainingName: this.trainingName,
      tndMasterId: this.subTrainingName,
      role: this.selectedRoleList,
      circleAbbr: circleAbbr,
      zone: this.selectedZoneNameList,
      cluster: this.selectedClusterNameList,
      startDate: this.startDate,
      endDate: this.endDate,
      empId: this.employeeId,
      isSelectedFlag: this.isOR
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

  // exportSubmittedFeedbackData(){
  //   this.spinner.show();
  //   this.tndSharedService.exportSubmittedFeedbackData()
  //   .subscribe((response) => {
  //     if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
  //       let exportedList = response.wrappedList;
  //       alasql('SELECT empId as EMP_ID, empName as EMP_NAME, ticketNumber as TICKET_NUMBER, organization as ORGANIZATION, date as SUBMITTED_DATE, trainingName as TRAINING_NAME, '+
  //       'f1 as F_1, f2 as F_2, f3 as F_3, f4 as F_4, f5 as F_5, f6 as F_6, f7 as F_7, f8 as F_8, f9 as F_9, f10 as F_10, '+
  //       'f11 as F_11, f12 as F_12, f13 as F_13, f14 as F_14, f15 as F_15, f16 as F_16, f17 as F_17, f18 as F_18, f19 as F_19, f20 as F_20, '+
  //       'f21 as F_21, f22 as F_22, f23 as F_23, f24 as F_24, f25 as F_25, f26 as F_26, f27 as F_27 '+
  //       'INTO XLSXML("Feedback_Output.xls",{headers:true}) FROM ?',[exportedList]);
  //     }
  //     else {
  //       this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
  //     }
  //     this.spinner.hide();
  //   },
  //     (error) => {
  //       this.toastr.warning(Constant.returnServerErrorMessage("exportSubmittedFeedbackData"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
  //       this.spinner.hide();
  //     })
  //   //
  // }

}
