import { Component, OnInit } from '@angular/core';
import { TndOffineTrainingService } from 'src/app/shared/service/TndOfflineTrainingService';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/shared/constant/Contant';
import { Router } from '@angular/router';
import * as alasql from 'alasql';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-offline-training',
  templateUrl: './offline-training.component.html',
  styleUrls: ['./offline-training.component.css']
})
export class OfflineTrainingComponent implements OnInit {

  trainingName: any = "";
  startDate: any = "";
  endDate: any = "";
  totalTimeInHours: any = "";
  trainers: any = "";
  venue: any = "";
  competency: any = "";
  facilitator: any = "";
  level: any = "";
  bu: any = "";
  numberOfParticipatePresent: any = "";
  ducumationUrl : any = "";
  employeeId : any = "";
  wrappedList : any = [];
  noRecordFound : boolean = true;
  loginEmpId: any = "";
  loginEmpRole: any = "";
  organizationName : string = "";
  organizationLogo : string = "";
  submenuName : string = "";
  constructor(private router: Router,private datePipe : DatePipe,
    private offlineTrainingService : TndOffineTrainingService,
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService) { 
    this.loginEmpId = sessionStorage.getItem("username");
    this.loginEmpRole = localStorage.getItem("empRole");
    this.organizationLogo = localStorage.getItem("organizationLogo");
    this.organizationName = localStorage.getItem("organizationName");
    this.submenuName = localStorage.getItem("offlineTraining");
    localStorage.setItem("currentPage","offlineTraining");
  }

  ngOnInit() {
    this.getOfflineTrainingReport()
  }

  reloadPage(){
    let isReloadPage = confirm("Do you want reload this page??");
    if(isReloadPage){
      this.router.navigate(['/layout/dashboard']);
    }
  }

  getOfflineTrainingReport(){
    this.noRecordFound = true;
    this.wrappedList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole
    }
    this.offlineTrainingService.getOfflineTrainingReport(jsonData)
    .subscribe((response) =>{
      //console.log(response);
      this.wrappedList = response.wrappedList;
      if(this.wrappedList.length != 0){
        this.noRecordFound = false;
      }
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getOfflineTrainingReport"),"Alert !");
      this.spinner.hide();
    });
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      let image = myReader.result;
      this.ducumationUrl = image;
      //console.log(this.ducumationUrl)
    }
    myReader.readAsDataURL(file);
  }

  submitOfflineTraining(){
    if(this.trainingName == ""){
      alert("Enter training name")
      return ;
    }
    else if(this.startDate == ""){
      alert("Enter start date")
      return ;
    }
    else if(this.endDate == ""){
      alert("Enter end date")
      return ;
    }
    else if(this.totalTimeInHours == ""){
      alert("Enter total time in hours")
      return ;
    }
    else if(this.trainers == ""){
      alert("Enter trainer")
      return ;
    }
    else if(this.employeeId == ""){
      alert("Enter employee id")
      return ;
    }
    
    let jsonData = {
      trainingName : this.trainingName,
      startDate : this.startDate,
      endDate : this.endDate,
      totalTimeInHours : this.totalTimeInHours,
      trainers : this.trainers,
      venue : this.venue,
      competency : this.competency,
      facilitator : this.facilitator,
      level : this.level,
      bu : this.bu,
      numberOfParticipatePresent : this.numberOfParticipatePresent,
      ducumationUrl : this.ducumationUrl,
      employeeId : this.employeeId
    }
    this.spinner.show();
    this.offlineTrainingService.submitOfflineTraining(jsonData)
    .subscribe((response) =>{
      if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
        this.toastr.success('Successfully insert', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.setBlankAllFields();
      }
      else{
        this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
      }
      this.spinner.hide();
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submitOfflineTraining"),"Alert !");
      this.spinner.hide();
    });
  }

  setBlankAllFields(){
    this.trainingName = "";
    this.startDate = "";
    this.endDate = "";
    this.totalTimeInHours = "";
    this.trainers = "";
    this.venue = "";
    this.competency = "";
    this.facilitator = "";
    this.level = "";
    this.bu = "";
    this.numberOfParticipatePresent = "";
    this.ducumationUrl = "";
    this.employeeId = "";
  }

  exportToExcel(){
    let localJsonList = [];
    for(let i=0;i<this.wrappedList.length;i++){
      let startDate = this.wrappedList[i].startDate;
      let endDate = this.wrappedList[i].endDate;
      startDate = this.datePipe.transform(startDate,'dd-MM-yyyy')
      endDate = this.datePipe.transform(endDate,'dd-MM-yyyy')

      let json = {
        employeeId : this.wrappedList[i].employeeId,
        employeeName : this.wrappedList[i].employeeName,
        trainingName : this.wrappedList[i].trainingName,
        startDate : startDate,
        endDate : endDate,
        totalTimeInHours : this.wrappedList[i].totalTimeInHours,
        trainers : this.wrappedList[i].trainers,
        venue : this.wrappedList[i].venue,
        competency : this.wrappedList[i].competency,
        facilitator : this.wrappedList[i].facilitator,
        level : this.wrappedList[i].level,
        bu : this.wrappedList[i].bu,
        numberOfParticipatePresent : this.wrappedList[i].numberOfParticipatePresent
      }
      localJsonList.push(json);
    }

    alasql('SELECT employeeId as EMPLOYEE_ID, employeeName as EMPLOYEE_NAME, trainingName as TRAINING_NAME, '+
    'startDate as START_DATE, endDate as END_DATE, totalTimeInHours as TOTAL_TIME_IN_HRS, trainers as TRAINERS, '+
    'venue as VENUE, competency as COMPETENCY, facilitator as FACILITATOR, level as LEVEL, bu as BUSINESS_UNIT, '+
    'numberOfParticipatePresent as NUMBER_OF_PARTICIPATE_PERSENT INTO XLSXML("Offline_Training_Report.xls",{headers:true}) FROM ?',[localJsonList]);
  }

}
