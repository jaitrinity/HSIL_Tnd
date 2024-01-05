import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupIncidentTrainingModel } from './model/GroupIncidentTrainingModel';
import { Constant } from 'src/app/shared/constant/Contant';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GroupIncidentTrainingService } from 'src/app/shared/service/GroupIncidentTrainingService';
import { DatePipe } from '@angular/common';
import { IncidentTrainingService } from 'src/app/shared/service/IncidentTrainingService';
declare var jQuery;

@Component({
  selector: 'app-group-incident-training',
  templateUrl: './group-incident-training.component.html',
  styleUrls: ['./group-incident-training.component.css'],
  providers : [GroupIncidentTrainingModel]
})
export class GroupIncidentTrainingComponent implements OnInit {
  
  public organizationLogo : string = "";
  public organizationName : string = "";
  public submenuName : string = "";
  public mediaButtonText : string = "";
  public groupTrainingQuestionArr : any = [];
  public feedbackQuestionResponse : any = [];
  public groupTrainingQuestionSize : any = 0;
  preQuestionJson = [];
  postQuestionJson = [];
  postResult : any = "PASS";
  prePercentage : any;
  preNoOfQuestions : any;
  preCorrectQuestions : any;
  startPreQuestionTime : any;
  stopPreQuestionTime : any;
  submitPreQuestionTime : any;

  loginEmpId : any = "";
  loginEmpRole : any = "";
  constructor(public gitModel : GroupIncidentTrainingModel, 
    private incidentService : IncidentTrainingService,
    private groupIncidentService : GroupIncidentTrainingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private datePipe : DatePipe,
    private router: Router) { 
    this.loginEmpId = sessionStorage.getItem("username");
    this.loginEmpRole = localStorage.getItem("empRole");
    this.organizationLogo = localStorage.getItem("organizationLogo");
    this.organizationName = localStorage.getItem("organizationName");
    this.mediaButtonText = localStorage.getItem("mediaButtonText");
    this.submenuName = localStorage.getItem("groupIncidentTraining");
    localStorage.setItem("currentPage","groupIncidentTraining");
  }

  video : any; 
  ngOnInit() {
    // this.gitModel.groupName = "Hello";
    // console.log(this.gitModel.groupName);
    // setTimeout(() => {
    //   this.gitModel = new GroupIncidentTrainingModel;  
    //   console.log(this.gitModel.groupName);
    // }, 5000);
    this.getIncidentTrainingName();
    this.video = document.getElementById('myvideo');
  }

  currentpos = 0;
  videoSeeking() {
    if(this.video.currentTime > this.currentpos) {
      this.video.currentTime = this.currentpos;
    }
    else{
      this.currentpos = this.video.currentTime;
    }
  }

  reloadPage(){
    let isReloadPage = confirm("Do you want reload this page??");
    if(isReloadPage){
      this.router.navigate(['/layout/dashboard']);
    }
  }

  getIncidentTrainingName(){
    this.gitModel.imgloader = true;
    let reqJson = {
      "empId" : this.loginEmpId,
      "role": this.loginEmpRole,
      "short_code": "EN"
    }

  
    this.groupIncidentService.getIncidentTrainingName(reqJson)
      .subscribe((response) => {
        if (response.responseCode == Constant.SUCCESSFUL_STATUS_CODE) {
          this.gitModel.trainingNameResponse = response.wrappedList;
          this.gitModel.imgloader = false;
          this.gitModel.trainingNameDisplayViewer = true;
          //this.spinner.hide();
        }
       else if (response.responseCode == Constant.NO_RECORDS_FOUND_CODE) {
          this.toastr.info('No Training found', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.gitModel.imgloader = false;
          this.gitModel.noDataViewer = true;
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getIncidentTrainingName"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        })
      }
      videoQuestionDisplayArr = [];

      startTrainingObj : any;
      startGroupIncidentTraining(trObj : any){
        this.startTrainingObj = trObj;
        this.gitModel.trainingNameDisplayViewer = false;
        this.gitModel.imgloader = true;
        this.gitModel.groupName = trObj.groupName;
        this.gitModel.tId = trObj.tId;
        let sendJson = {
          trainingType : trObj.trainingType,
          groupName : trObj.groupName,
          groupTrainingId : trObj.groupTrainingId
        }
        //console.log(JSON.stringify(sendJson))
        this.groupIncidentService.getIncidentQuestions(sendJson)
        .subscribe((response) => {
          //console.log(JSON.stringify(response));
          
          for(let i=0;i<response.wrappedList.length;i++){
            let wrappedList = response.wrappedList[i];
            this.groupTrainingQuestionArr = wrappedList.groupTrainingQuestion;
            this.feedbackQuestionResponse = wrappedList.feedbackQuestion;
            this.groupTrainingQuestionSize = wrappedList.groupTrainingQuestionSize;
          }

          //console.log(JSON.stringify(this.groupTrainingQuestionArr));
          //console.log(JSON.stringify(this.groupTrainingQuestionSize));
          for(let i=0;i<this.groupTrainingQuestionArr.length;i++){
            if(this.groupTrainingQuestionArr[i].optionType === '11111'){
              this.videoQuestionDisplayArr.push(this.groupTrainingQuestionArr[i]);
            }
          }


          this.gitModel.imgloader = false;
          this.gitModel.groupTrainingDisplayDiv = true;
          setTimeout(() => {
            this.startPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
            this.showGroupTraining(1);
            // this.showPreDivs(1);
            // this.showVideoDivs(1);
            // this.showPostDivs(1);
          }, 10);
        })
      }

      groupTrainingIndex = 1;
      plusGroupTraining(n) {
        this.showGroupTraining(this.groupTrainingIndex += n);
      }

      showGroupTraining(n) {
        var i;
        var x = document.getElementsByClassName("groupTrainingSlides");
        if (n > x.length) {this.groupTrainingIndex = 1}    
        if (n < 1) {this.groupTrainingIndex = x.length}
        for (i = 0; i < x.length; i++) {
           (<HTMLInputElement>x[i]).style.display = "none";
        }
        (<HTMLInputElement>x[this.groupTrainingIndex-1]).style.display = "block";  
      }

      shownMediaIdArr : any = [];
      showMedia(i){
        this.shownMediaIdArr.push(i);
      }

      public playedVideoURL : string = "";
      currentInterval :any;
      playTrainingVideo(videoUrl,mediaIndex){
        this.showMedia(mediaIndex)
        this.playedVideoURL = videoUrl;
        setTimeout(() => {
          jQuery("#videoPlayModal").modal({
            backdrop : 'static',
            keyboard : false
          });
          
          clearInterval(this.currentInterval);
          this.currentpos = 0;
          this.currentInterval = setInterval(() => {
            if(this.currentpos < this.video.duration){
              this.currentpos ++;
            }
          }, 1000);
          
        }, 100);
      }

      closeVideoPlayModal(){
        if(this.video.currentTime != this.video.duration){
          alert("please show full video first");
        }
        else{
          let isClose = confirm("Are you sure close this window ??")
          if(isClose){
            jQuery("#videoPlayModal").modal("hide");
            this.playedVideoURL = "";
          }
        }
        
      }

      submitPreQuestion (){
        var today = new Date();
        this.stopPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        this.submitPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        
        this.preQuestionJson = [];
        let applyQuestionCount = 0;
        let notAttemptQuesIndex = -1;
        this.preNoOfQuestions = 0;
        this.preCorrectQuestions = 0;
        
        for(var i=0;i<this.groupTrainingQuestionArr.length;i++){
          var answer = [];
          var prAnswer = this.groupTrainingQuestionArr[i].pranswer;
          var preQuesId = this.groupTrainingQuestionArr[i].prqId;
          var quesType = this.groupTrainingQuestionArr[i].optionType;
          var videoId = this.groupTrainingQuestionArr[i].videoId;
          if(quesType==1){
            var textObj = document.getElementById("op-pre-"+preQuesId);
            if((<HTMLInputElement>textObj).value.trim()!=""){
              answer.push((<HTMLInputElement>textObj).value.trim());
              applyQuestionCount++;
            }
            else{
              if(notAttemptQuesIndex == -1){
                notAttemptQuesIndex = i+1;
              }
            }
          }
          if(quesType==3 || quesType==4 || quesType==6){
            var optionCount = document.getElementsByClassName("op-pre-"+preQuesId);
            var opLength = optionCount.length;
            var isChecked = false;
            for(var j=0;j<opLength;j++){
              if((<HTMLInputElement>optionCount[j]).checked){
                var optionNum = (<HTMLInputElement>optionCount[j]).value;
                answer.push(optionNum);
                isChecked = true;
              }
            }
            if(isChecked){
              applyQuestionCount++;
            }
            else{
              if(notAttemptQuesIndex == -1){
                notAttemptQuesIndex = i+1;
              }
            }
            
            this.preNoOfQuestions++;
            
          }
          if(quesType==5){
            var selObj = document.getElementById("op-pre-"+preQuesId);
            answer.push((<HTMLInputElement>selObj).value.trim());
            if((<HTMLInputElement>selObj).value.trim()!=""){
              applyQuestionCount++;
            }
            else{
              if(notAttemptQuesIndex == -1){
                notAttemptQuesIndex = i+1;
              }
            }
            
            this.preNoOfQuestions++;
          }

          if(quesType == 11111){
            var isChecked = false; 
            for(let i=1;i<=this.shownMediaIdArr.length;i++){
              if(i == videoId){
                isChecked = true;
              }
            }


            if(isChecked){
              applyQuestionCount++;
            }
            else{
              if(notAttemptQuesIndex == -1){
                notAttemptQuesIndex = i+1;
              }
            }
            
            this.preNoOfQuestions++;
          }
          
          if(quesType == 3 || quesType == 4 || quesType == 5 || quesType == 6 ){
            
            if(this.findCorrectAnswer(prAnswer,answer)){
              this.preCorrectQuestions++;
            }
          }
          
          var preObj = {"PRANSWER": answer.toString(),"PRQID": preQuesId };
          this.preQuestionJson.push(preObj);
        }
        
        if(this.groupTrainingQuestionArr.length!=applyQuestionCount){
          var notAttemptQuesCount = parseInt(this.groupTrainingQuestionArr.length) - applyQuestionCount;
          var goToQuestion = this.groupTrainingQuestionArr.length - notAttemptQuesIndex;
          alert("you not attempt "+notAttemptQuesCount+" question..");
          this.plusGroupTraining(-goToQuestion);
        }
        else{
          
          var saveResultConfirm = confirm("Do you want to submit ??");
          if(saveResultConfirm){
            
            jQuery("#feedbackModal").modal({
              backdrop : 'static',
              keyboard : false
            });
          }
        }
      
      }

      findCorrectAnswer = function(splitString, ansArr){
        var answer = this.splitAnswerString(splitString);
        var returnBol = false;
        for(var i=0;i<ansArr.length;i++){
          for(var j=0;j<answer.length;j++){
            if(ansArr[i] == answer[j]){
              returnBol =  true;
            }
          }
        }
        return returnBol;
      }

      splitAnswerString = function(splitString){
        return splitString.split(",");
      }

      validateFeedbackQuestionData() : any {
        this.feedbackAnswerArr = [];
        
        for(var i=0;i<this.feedbackQuestionResponse.length;i++){
          var srNo = i+1;
          var preQuesId = this.feedbackQuestionResponse[i].prqId;
          var quesType = this.feedbackQuestionResponse[i].optionType;
          //console.log(preQuesId+" "+quesType);
          if(quesType==1){
            var textObj = jQuery("#op-fd-"+preQuesId);
            if(textObj.val().trim()!=""){
              let feedbackAnsJson = {
                FID : preQuesId,
                FANSWER : textObj.val().trim()
              }
              this.feedbackAnswerArr.push(feedbackAnsJson);
              //console.log(quesType+" : "+JSON.stringify(feedbackAnsJson));
            }
            else{
              alert("please enter "+srNo+" value ");
              return false;
            }
          }
          else if(quesType==3){
            let answer = "";
            let optionCount = document.getElementsByClassName("op-fd-"+preQuesId)
            let isChecked = false;
            
            for(var j=0;j<optionCount.length;j++){
              if((<HTMLInputElement>optionCount[j]).checked){
                var optionNum = (<HTMLInputElement>optionCount[j]).value;
                answer += optionNum;
                isChecked = true;
              }
            }

            if(isChecked){
              let feedbackAnsJson = {
                FID : preQuesId,
                FANSWER : answer
              }
              this.feedbackAnswerArr.push(feedbackAnsJson);
              //console.log(quesType+" : "+JSON.stringify(feedbackAnsJson));
            }
            else{
              alert("select atleast one option of "+srNo)
              return false;
            }
          }
        }
        return true;
      }

      submitFeedbackQuestionTime = "";
      submitFeedback(){
        
        if(!this.validateFeedbackQuestionData()){
          return false;
        }
        jQuery("#feedbackModal").modal("hide");
        this.saveTrainingResult();
      }

      feedbackAnswerArr = [];
      saveTrainingResult = function(){
        this.gitModel.groupTrainingDisplayDiv = false;
        this.gitModel.inciResultWaitingDivViewer = true;

        let currentTimeStamp = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        let saveResultDataJson = {
          "empide": this.loginEmpId,
          "PRE_DATA": this.preQuestionJson,
          "PO_DATA": this.postQuestionJson,
          "Ticket_Num": "",
          "refTicketNum" : "T_123",
          "task_id": "",
          "PRE_START": this.startPreQuestionTime,
          "PRE_STOP": this.stopPreQuestionTime,
          "POST_STATUS" : this.postResult,
          "tid" : this.gitModel.tId,
          "submitDate" : currentTimeStamp,
          "FEEDBACK" : this.feedbackAnswerArr,
          "trainingType" : Constant.GROUP_TRAINING
      }

      //console.log(JSON.stringify(saveResultDataJson));
      this.incidentService.saveResult(saveResultDataJson)
      .subscribe((response) => {
        //console.log(JSON.stringify(response));
        if (response.responseCode == Constant.SUCCESSFUL_STATUS_CODE) {
          this.gitModel.inciResultWaitingDivViewer = false;
          this.gitModel.inciResultDivViewer = true;
          
          setTimeout(() => {
            if(this.postResult === 'FAIL'  ){
              
              jQuery("#traininReassignModal").modal({
                  backdrop : 'static',
                  keyboard : false
                });
            }
          }, 100);
          this.toastr.success('incident group training result saving is successfully completed', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.showTrainingAnswer();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("openIncidentSubTrainingName"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        })

    }

    restartIncidentTraining = function(actionValue){
									
      if(actionValue === 'yes'){
        jQuery("#traininReassignModal").modal("hide");
        setTimeout(() => {
          this.gitModel = new GroupIncidentTrainingModel; 
          this.startGroupIncidentTraining(this.startTrainingObj);
          
        }, 500);
      }
      else{
        var isRestart = confirm("You will lose all data.. Do you want to restart training??");
        
        if(isRestart){
          /*---for doing array empty-----*/
          this.gitModel = new GroupIncidentTrainingModel; 
          this.getIncidentTrainingName();
          
        }
      } 
    }
        

}
