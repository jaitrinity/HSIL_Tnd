import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TndTrainingHistoryService } from 'src/app/shared/service/TndTrainingHistoryService';
import { Constant } from 'src/app/shared/constant/Contant';
import { TndSharedService } from 'src/app/shared/service/TndSharedService';
declare var $: any;
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas';
import * as alasql from 'alasql';
import { SharedService } from 'src/app/shared/service/SharedService';

@Component({
  selector: 'app-training-history',
  templateUrl: './training-history.component.html',
  styleUrls: ['./training-history.component.css']
})
export class TrainingHistoryComponent implements OnInit {

  circleNameList = [];
  selectedCircleNameList = [];
  zoneNameList = [];
  selectedZoneNameList = [];
  clusterNameList = [];
  selectedClusterNameList = [];
  roleList = [];
  selectedRoleList = [];
  applyFilterData = [];
  employeeName : any = "";
  loginEmpId: any = "";
  loginEmpRole: any = "";
  otherRole : any = "";
  multiSelectropdownSettings = {};

  settings = {
    
    mode: 'external',
    //hideSubHeader: true,
    actions: {
      position: 'right',
      add: false,
      edit : false
    },
    pager :{
      //display : false,
      perPage : 10
    },
    columns: {
      employeeName: {
        title: 'Employee Name'
      },
      empId : {
        title : "Employee Id"
      },
      role: {
        title: 'Role'
      },
      circle: {
        title: 'Organization'
      },
      zone: {
        title: 'Location'
      },
      cluster: {
        title: 'Department'
      },
      assignedTasks: {
        title: 'Tasks Assigned'
      },
      completedTasks: {
        title: 'Tasks Completed'
      },
      pendingTasks: {
        title: 'Tasks Pending'
      },
      // rankInCluster: {
      //   title: 'Rank in cluster'
      // },
      // rankInZone: {
      //   title: 'Rank in zone'
      // },
      // rankInCircle: {
      //   title: 'Rank in circle'
      // },
      // rankInInfratel: {
      //   title: 'Rank in infratel'
      // },
      prePercentage: {
        title: 'Pre Percentage'
      }
    },
    delete: {
      deleteButtonContent: '<button>View</button>',
      mode: 'external'
    }
  };

  public organizationLogo : string = "";
  public organizationName : string = "";
  public submenuName : string = "";
  constructor(
    private router: Router,
    private sharedService : SharedService,
    private tndSharedService : TndSharedService,
    private trainingHistoryService : TndTrainingHistoryService,
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService) { 
      this.loginEmpId = sessionStorage.getItem("username");
      this.loginEmpRole = localStorage.getItem("empRole");
      this.otherRole = localStorage.getItem("otherRole");
      this.organizationLogo = localStorage.getItem("organizationLogo");
      this.organizationName = localStorage.getItem("organizationName");
      this.submenuName = localStorage.getItem("trainingHistory");
      localStorage.setItem("currentPage","trainingHistory");
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

    //this.getUserCircleZoneCluster("CIRCLE");
    this.getOrganizationData(Constant.ORGANIZATION);
    this.loadRoleList();

  }

  onSelectCircle(item: any) {
    //console.log(item);
    this.getOrganizationData(Constant.LOCATION);
    //this.getUserCircleZoneCluster("ZONE");
  }

  onDeSelectCircle(item: any) {
    this.zoneNameList = [];
    this.selectedZoneNameList = [];
    this.clusterNameList = [];
    this.selectedClusterNameList = [];
    this.getOrganizationData(Constant.LOCATION);
    //this.getUserCircleZoneCluster("ZONE");
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
    this.getOrganizationData(Constant.LOCATION);
    //this.getUserCircleZoneCluster("ZONE");
  }

  onSelectZone(item: any) {
    //console.log(item);
    this.getOrganizationData(Constant.DEPARTMENT);
    //this.getUserCircleZoneCluster("CLUSTER");
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
      empName : this.employeeName,
      circle : this.selectedCircleNameList,
      zone: this.selectedZoneNameList,
      cluster : this.selectedClusterNameList,
      role : this.selectedRoleList
    }

    //console.log(JSON.stringify(sendJson));
    this.spinner.show();
    this.trainingHistoryService.applyFilter(sendJson)
      .subscribe((response) => {
        console.log(JSON.stringify(response));
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
          this.toastr.warning(Constant.returnServerErrorMessage("trainingHistroryFilterSearch"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })
  }

  exportData(){
    alasql('SELECT employeeName as Employee_Name,empId as Employee_ID,role as Role,circle as Organization,zone as Location,cluster as Department,assignedTasks as Assigned_Tasks,completedTasks as Completed_Tasks,pendingTasks as Pending_Tasks INTO XLSXML("TRAINING_HISTORY.xls",{headers:true}) FROM ?',[this.applyFilterData]);
  }

  viewDetailsList = [];
  viewedEmpId : any = "";
  viewedEmpName : any = "";
  view(event : any){
    this.viewedEmpId = event.data.empId;
    this.viewedEmpName = event.data.employeeName;
    this.spinner.show();
    this.trainingHistoryService.getCertiDetails(this.viewedEmpId)
      .subscribe((response) => {
        console.log(JSON.stringify(response));
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.viewDetailsList = response.wrappedList;
          $("#viewDetailsModal").modal({
            backdrop : 'static',
            keyboard : false
          });
        }
        else if (response.responseCode === Constant.NO_RECORDS_FOUND_CODE) {
          this.viewDetailsList = response.wrappedList;
          this.toastr.info('No record found', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        }
        this.spinner.hide();
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("trainingHistroryFilterSearch"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }) 
  }

  viewedTrName : any = "";
  viewedSbDate : any = "";
  viewCertificate(trName,sbDate){
    this.viewedTrName = trName;
    this.viewedSbDate = sbDate;
    $("#viewCertificateModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  downloadCertificate(){
    //alert("ll");
    var data = document.getElementById('covertToPdf');
    html2canvas(data).then(canvas => {
    // Few necessary setting options
    var imgWidth = 300;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('l', 'mm', 'a4'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save('certificate.pdf'); // Generated PDF
    });
    }
  
}
