import { Component, OnInit } from '@angular/core';
import { TndTicketStatusService } from 'src/app/shared/service/TndTicketStatusService';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/shared/constant/Contant';
import { TndSharedService } from 'src/app/shared/service/TndSharedService';
import * as alasql from 'alasql';
import { SharedService } from 'src/app/shared/service/SharedService';

@Component({
  selector: 'app-ticket-status',
  templateUrl: './ticket-status.component.html',
  styleUrls: ['./ticket-status.component.css']
})
export class TicketStatusComponent implements OnInit {

  startDate :any = "";
  endDate : any = "";
  circleNameList = [];
  selectedCircleNameList = [];
  zoneNameList = [];
  selectedZoneNameList = [];
  clusterNameList = [];
  selectedClusterNameList = [];
  roleList = [];
  selectedRoleList = [];
  trainingNameList = [];
  selectedTrainingNameList = [];
  subTrainingNameList = [];
  selectedSubTrainingNameList = [];
  ticketStatusList = [];
  selectedTicketStatusList = [];
  ticketNumber : any = "";
  employeeId : any = "";
  applyFilterData = [];
  loginEmpId: any = "";
  loginEmpRole: any = "";
  otherRole : any = "";
  multiSelectropdownSettings = {};
  public organizationLogo : string = "";
  public organizationName : string = "";
  public submenuName : string = "";
  constructor(
    private router: Router,
    private sharedService : SharedService,
    private tndSharedService : TndSharedService,
    private ticketStatusService: TndTicketStatusService, 
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService) { 
    this.loginEmpId = sessionStorage.getItem("username");
    this.loginEmpRole = localStorage.getItem("empRole");
    this.otherRole = localStorage.getItem("otherRole");
    this.organizationLogo = localStorage.getItem("organizationLogo");
    this.organizationName = localStorage.getItem("organizationName");
    this.submenuName = localStorage.getItem("ticketStatus");
    localStorage.setItem("currentPage","ticketStatus");
  }

  settings = {
    
    //hideSubHeader: true,
    actions : false,
    pager :{
      //display : false,
      perPage : 10
    },
    columns: {
      ticketNumber: {
        title: 'Ticket Number'
      },
      newTicketumber: {
        title: 'New Ticket Num'
      },
      trainingName: {
        title: 'Training Name'
      },
      subtrainingName: {
        title: 'Sub Training Name'
      },
      empId: {
        title: 'Employee ID'
      },
      userRole: {
        title: 'Role'
      },
      circleName: {
        title: 'Organization'
      },
      zoneName: {
        title: 'Location'
      },
      clusterName: {
        title: 'Department'
      },
      startDate: {
        title: 'Start Date'
      },
      endDate: {
        title: 'End Date'
      },
      submittedDate: {
        title: 'Submitted Date'
      },
      prePercentage: {
        title: 'Pre Percentage'
      },
      postPercentage: {
        title: 'Post Percentage'
      },
      postStatus: {
        title: 'Post Status'
      }
    }
  };

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

    this.ticketStatusList = [
      {"paramCode":"TKTSTAT01","paramDesc":"Created"},
      {"paramCode":"TKTSTAT16","paramDesc":"Pass"},
      {"paramCode":"TKTSTAT15","paramDesc":"Fail"}
    ]

    //this.getUserCircleZoneCluster("CIRCLE");
    this.getOrganizationData(Constant.ORGANIZATION);
    this.getTrainingName();
    this.loadRoleList();
  }

  onSelectCircle(item: any) {
    //console.log(item);
    //this.getUserCircleZoneCluster("ZONE");
    this.getOrganizationData(Constant.LOCATION);
  }

  onDeSelectCircle(item: any) {
    this.zoneNameList = [];
    this.selectedZoneNameList = [];
    this.clusterNameList = [];
    this.selectedClusterNameList = [];
    //this.getUserCircleZoneCluster("ZONE");
    this.getOrganizationData(Constant.LOCATION);
  }

  onDeSelectAllCircle(item: any) {
    //console.log(item);
    this.selectedCircleNameList = item;
    this.zoneNameList = [];
    this.selectedZoneNameList = [];
    this.clusterNameList = [];
    this.selectedClusterNameList = [];
  }

  onSelectAllCircle(item: any) {
    //console.log(item);
    this.selectedCircleNameList = item;
    //this.getUserCircleZoneCluster("ZONE");
    this.getOrganizationData(Constant.LOCATION);
  }

  onSelectZone(item: any) {
    //console.log(item);
    //this.getUserCircleZoneCluster("CLUSTER");
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onSelectAllZone(item: any) {
    //console.log(item);
    this.selectedZoneNameList = item;
    //this.getUserCircleZoneCluster("CLUSTER");
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onDeSelectZone(item: any) {
    //console.log(item);
    //this.getUserCircleZoneCluster("CLUSTER");
    this.getOrganizationData(Constant.DEPARTMENT);
  }

  onDeSelectAllZone(item: any) {
    //console.log(item);
    this.selectedZoneNameList = item;
    this.clusterNameList = [];
    this.selectedClusterNameList = [];
  }

  onSelectCluster(item: any) {
    //console.log(item);
  }

  onSelectAllCluster(item: any) {
    //console.log(item);
  }

  onDeSelectCluster(item: any) {
    //console.log(item);
  }

  onDeSelectAllCluster(item: any) {
    //console.log(item);
  }

  onSelectTrainingName(item: any) {
    //console.log(item);
    this.getSubTrNameByMultiTrName();
  }

  onSelectAllTrainingName(item: any) {
    //console.log(item);
    this.selectedTrainingNameList = item;
    this.getSubTrNameByMultiTrName();
  }

  onDeSelectTrainingName(item: any) {
    //console.log(item);
    this.getSubTrNameByMultiTrName();
  }

  onDeSelectAllTrainingName(item: any) {
    //console.log(item);
    this.subTrainingNameList = [];
    this.selectedSubTrainingNameList = [];
  }

  onSelectSubTrainingName(item: any) {
    //console.log(item);
  }

  onSelectAllSubTrainingName(item: any) {
    //console.log(item);
  }

  onDeSelectSubTrainingName(item: any) {
    //console.log(item);
  }

  onDeSelectAllSubTrainingName(item: any) {
    //console.log(item);
  }

  reloadPage(){
    let isReloadPage = confirm("Do you want reload this page??");
    if(isReloadPage){
      this.router.navigate(['/layout/dashboard']);
    }
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

  loadRoleList(){
    this.sharedService.getRoleList()
    .subscribe( (response) =>{
      //this.spinner.hide(); 
         if(response.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          this.roleList = response.wrappedList;
          
          //this.spinner.hide();
        }
        else{
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
  },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("loadRoleList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      //this.spinner.hide();
    })
  }

  getTrainingName(){
    //this.spinner.show();
    this.ticketStatusService.getTrainingName()
      .subscribe((response) => {
        //console.log(JSON.stringify(response));
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.trainingNameList = response.wrappedList;
          //this.spinner.hide();
        }
        else if (response.responseCode === Constant.NO_RECORDS_FOUND_CODE) {
          this.toastr.info('No record found', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getTrainingName"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        })
  }

  getSubTrNameByMultiTrName(){
    let jsonData = {
      trainingList : this.selectedTrainingNameList
    }
    //console.log(JSON.stringify(jsonData));
    //this.spinner.show();
    this.ticketStatusService.getSubTrNameByMultiTrName(jsonData)
      .subscribe((response) => {
        //console.log(JSON.stringify(response));
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.subTrainingNameList = response.wrappedList;
          //this.spinner.hide();
        }
        else if (response.responseCode === Constant.NO_RECORDS_FOUND_CODE) {
          this.toastr.info('No record found', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getSubTrNameByMultiTrName"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
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

    //this.spinner.show();
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
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
      }, 
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getUserCircleZoneCluster"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        })
  }

  applyFilter(){
    let sendJson = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      startDate : this.startDate,
      endDate : this.endDate,
      employeeId : this.employeeId,
      ticketNum : this.ticketNumber,
      circle : this.selectedCircleNameList,
      zone: this.selectedZoneNameList,
      cluster : this.selectedClusterNameList,
      role : this.selectedRoleList,
      ticketStatus : this.selectedTicketStatusList,
      trainingName : this.selectedTrainingNameList,
      subTrainingName : this.selectedSubTrainingNameList
    }

    //console.log(JSON.stringify(sendJson));
    this.spinner.show();
    this.ticketStatusService.applyFilter(sendJson)
      .subscribe((response) => {
        //console.log(JSON.stringify(response));
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.applyFilterData = response.wrappedList;
        }
        else if (response.responseCode === Constant.NO_RECORDS_FOUND_CODE) {
          this.applyFilterData = response.wrappedList;
          this.toastr.info('No record found', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        }
        this.spinner.hide();
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("applyFilter"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })
  }

  exportData(){
    alasql('SELECT * INTO XLSXML("TRAINING_HISTORY.xls",{headers:true}) FROM ?',[this.applyFilterData]);
  }

}
