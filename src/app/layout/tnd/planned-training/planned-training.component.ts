import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlannedTrainingService } from 'src/app/shared/service/PlannedTrainingService';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Constant } from 'src/app/shared/constant/Contant';
declare var jQuery: any;

@Component({
  selector: 'app-planned-training',
  templateUrl: './planned-training.component.html',
  styleUrls: ['./planned-training.component.css']
})
export class PlannedTrainingComponent implements OnInit {

  assignTaskList : [];
  trainingDataResponse = [];
  preQuestionResponse = [];
  postQuestionResponse = [];
  feedbackQuestionResponse = [];
  preAnswerJsonArr = [];
  postAnswerJsonArr = [];
  imgLoader : boolean = false;
  groupTrainingDisplayDiv : boolean = false;
  trainingDisplay  : boolean = false;
  inciPreQuestionDisplayViewer : boolean  = false;
  inciVideoQuestionDisplayViewer : boolean  = false;
  inciPostQuestionDisplayViewer  : boolean = false;
  inciWaitingDivViewer : boolean  = false;
  inciResultWaitingDivViewer : boolean  = false;
  inciResultDivViewerForGroupTraining : boolean = false;
  noDataViewer : boolean  = false;
  inciResultDivViewer : boolean = false;
  subTrainingNameDisplay = "";
  preQuestionDisplayArr = [];
  videoQuestionDisplayArr = [];
  postQuestionDisplayArr = [];
  preResult : any;
  postResult : any;
  prePercentage : any;
  postPercentage : any;
  preQuestionJson = [];
  postQuestionJson = [];
  ticketNum : any;
  preQuestionStep: number;
  videoQuestionStep: number;
  postQuestionStep: number;
  maxStep: number;
  tId  : any;;
  taskId  : any;;
  startPreQuestionTime  : any;
  stopPreQuestionTime : any;
  startVideoQuestionTime : any;
  stopVideoQuestionTime : any;
  startPostQuestionTime : any;
  stopPostQuestionTime : any;
  trainingNameDisplay : any;
  isPre : any = "NO";
  isPost : any = "NO";
  isFeedback : any = "NO";
  video1 : any;
  video2 : any;
  prePassingPercentage : any;
  postPassingPercentage : any;
  startFeedbackQuestionTime : any = "";
  stopFeedbackQuestionTime : any = "";
  loginEmpId : any = "";
  loginEmpRole : any = "";
  
  public groupName : any = "";
  public groupTrainingQuestionArr : any = [];
  public groupTrainingQuestionSize : any = 0;

  public brillocaLogo : string = "";
  public hsilLogo : string = "";
  public shilLogo : string = "";
  public organizationLogo : string = "";
  public organizationName : string = "";
  public submenuName : string = "";
  public mediaButtonText : string = "";
  constructor(private router:Router,private plannedService : PlannedTrainingService,private spinner: NgxSpinnerService,
    private toastr: ToastrService,private datePipe : DatePipe) {
      this.loginEmpId = sessionStorage.getItem("username");
      this.loginEmpRole = localStorage.getItem("empRole");
      this.brillocaLogo = localStorage.getItem("brillocaLogo");
      this.hsilLogo = localStorage.getItem("hsilLogo");
      this.shilLogo = localStorage.getItem("shilLogo");
      this.organizationLogo = localStorage.getItem("organizationLogo");
      this.organizationName = localStorage.getItem("organizationName");
      this.submenuName = localStorage.getItem("plannedTraining");
      this.mediaButtonText = localStorage.getItem("mediaButtonText");
      localStorage.setItem("currentPage","plannedTraining");
     }

  video : any;
  ngOnInit() {
    this.getAssignTask();
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

  getAssignTask(){
    this.imgLoader = true;
    let reqData = {
      "id": this.loginEmpId,
      "short_code": "EN"
    };
    this.plannedService.getAssignedTask(reqData)
    .subscribe((response) => {
      //console.log(JSON.stringify(response));
      if (response.code == 200) {
        this.assignTaskList = response.data;
        this.imgLoader = false;
        this.trainingDisplay = true;
        
      }
     else if (response.code == 204) {
        this.toastr.info('No Training found', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.imgLoader = false;
        this.noDataViewer = true;
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

  startTrainingObj : any;
  isVideo : any;
  mediaType : any;
  trainingType : any = "";
  startTraining(trObj){
    this.startTrainingObj = trObj;
    var bulkDataReq = {
      "trainingId" : trObj.tId,
      "trainingName" : trObj.training,
      "subTrainingName" : trObj.subTraining,
      "trainingType" : trObj.trainingType
  };
    //console.log(JSON.stringify(bulkDataReq));
    this.trainingDisplay = false;
    this.imgLoader = true; 
    
    this.plannedService.startPlannedTraining(bulkDataReq)
    .subscribe((response) => {
      //console.log(JSON.stringify(response));

      if(trObj.trainingType == Constant.GROUP_TRAINING){
        this.ticketNum = trObj.ticketNum;
        this.tId = trObj.groupTrainingId;
        this.trainingType = trObj.trainingType;
        this.groupName = trObj.training;
        this.startGroupPlannedTraining(response);
        return false;
      }

      if (response.responseCode == Constant.SUCCESSFUL_STATUS_CODE) {
        let bulkResponseData = response.wrappedList[0];
        this.trainingDataResponse = bulkResponseData.training;
        
        if(bulkResponseData.length != 0){
          this.preQuestionResponse = bulkResponseData.preQuestion;
          this.postQuestionResponse = bulkResponseData.postQuestion;
          this.feedbackQuestionResponse = bulkResponseData.feedbackQuestion;
        }
        

        this.trainingNameDisplay = trObj.training;
        this.subTrainingNameDisplay = trObj.subTraining;
        this.ticketNum = trObj.ticketNum;
        this.tId = trObj.tId;
        this.isPre = trObj.pre;
        this.isPost = trObj.post;
        this.isFeedback = trObj.feedback;
        this.mediaType = trObj.mediaType;
        this.video1 = trObj.video1;
        this.video2 = trObj.video2;
        this.prePassingPercentage = this.trainingDataResponse[0].prePassingPercentage;
        this.postPassingPercentage = this.trainingDataResponse[0].postPassingPercentage;
        this.isVideo = "NO"
        let isVideoOne = false;
        let isVideoTwo = false;
        if( (this.video1 != "null" && this.video1 != "" && this.video1 != null ) || (this.video2 != "null" && this.video2 != "" && this.video2 != null)){
          this.isVideo = "YES";
        }
        
        if(this.video1 != "null" && this.video1 != "" && this.video1 != null ){
          var trainingVideo = {
              id : 1,
              trVideo : this.video1
          }
          this.videoQuestionDisplayArr.push(trainingVideo);
          
          isVideoOne = true;
        }
        
        if(this.video2 != "null" && this.video2 != "" && this.video2 != null ){
          var trainingVideo = {
            id : 2,
            trVideo : this.video2
          }
          this.videoQuestionDisplayArr.push(trainingVideo);
          isVideoTwo = true;
        }
        
        
        this.preQuestionStep = 0;
        this.videoQuestionStep = 0;
        this.postQuestionStep = 0;
        this.maxStep = 0;
        
        //console.log(this.isPre+" "+isPost+" "+video1+" "+video2+" "+this.isVideo+" "+isVideoOne+" "+isVideoTwo)
        if(this.isPre == "YES" && this.isVideo == "YES" && this.isPost == "YES" ){
          this.preQuestionStep = 1;
          this.videoQuestionStep = 2;
          this.postQuestionStep = 3;
          this.maxStep = 3;
          this.inciPreQuestionDisplayViewer = true;
          
          this.startPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
          
        }
        
        else if(this.isPre == "YES" && this.isVideo == "YES" && this.isPost == "NO" ){
          this.preQuestionStep = 1;
          this.videoQuestionStep = 2;
          this.maxStep = 2;
          this.inciPreQuestionDisplayViewer = true;
          
          this.startPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        else if(this.isPre == "YES" && this.isVideo == "NO" && this.isPost == "YES" ){
          this.preQuestionStep = 1;
        
          this.postQuestionStep = 2;
          this.maxStep = 2;
          this.inciPreQuestionDisplayViewer = true;
          
          this.startPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        else if(this.isPre == "YES" && this.isVideo == "NO" && this.isPost == "NO" ){
          this.preQuestionStep = 1;
          this.maxStep = 1;
          this.inciPreQuestionDisplayViewer = true;
          
          this.startPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        /* if post is yes */
        
        else if(this.isPre == "NO" && this.isVideo == "YES" && this.isPost == "YES" ){
          
          this.videoQuestionStep = 1;
          this.postQuestionStep = 2;
          this.maxStep = 2;
          this.inciVideoQuestionDisplayViewer = true;
          
          //this.playTrainingVideo();
          this.startVideoQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        else if(this.isPre == "YES" && this.isVideo == "YES" && this.isPost == "NO" ){
          this.preQuestionStep = 1;
          this.videoQuestionStep = 2;
          
          this.maxStep = 2;
          this.inciPreQuestionDisplayViewer = true;
          
          this.startPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        else if(this.isPre == "NO" && this.isVideo == "YES" && this.isPost == "NO" ){
          this.videoQuestionStep = 1;
          
          this.maxStep = 1;
          this.inciVideoQuestionDisplayViewer = true;

          //this.playTrainingVideo();
          this.startVideoQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        /* if video is yes */
        
        else if(this.isPre == "NO" && this.isVideo == "YES" && this.isPost == "YES" ){
          this.videoQuestionStep = 1;
          this.postQuestionStep = 2;
          this.maxStep = 2;
          this.inciVideoQuestionDisplayViewer = true;
          //this.playTrainingVideo();
          
          this.startVideoQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        
        else if(this.isPre == "YES" && this.isVideo == "NO" && this.isPost == "YES" ){
          this.preQuestionStep = 1;
          
          this.postQuestionStep = 2;
          this.maxStep = 2;
          this.inciPreQuestionDisplayViewer = true;
          
          this.startPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        else if(this.isPre == "NO" && this.isVideo == "NO" && this.isPost == "YES" ){
          this.postQuestionStep = 1;
          this.maxStep = 1;
          this.inciPostQuestionDisplayViewer = true;
          

          this.startPostQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        
        else{
          
        }
        
        this.imgLoader = false;
        
        setTimeout(() => {
          this.showNextAndPrevious("preQuesSlides");
          this.showNextAndPrevious("videoQuesSlides"); 
          this.showNextAndPrevious("postQuesSlides");
        }, 50);
        
      }
     else if (response.responseCode == Constant.NO_RECORDS_FOUND_CODE) {
        this.toastr.info('No Training found', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.imgLoader = false;
        this.noDataViewer = true;
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

  

  // playTrainingVideo(){
  //   setTimeout(() => {
  //     $('.trainingVideo').each(function(i, obj) {
  //       $(this).children("source").attr("src", this.videoQuestionDisplayArr[i].trVideo);
  //       $(this).load()
  //     });
  //   }, 50);
  
  // }

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
        console.log(this.currentpos)
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

  public playedScromURL : string = "";
  playScrom(videoUrl,mediaIndex){
    this.showMedia(mediaIndex);
    this.playedScromURL = videoUrl;
    jQuery("iframe").attr("src",this.playedScromURL);
    setTimeout(() => {
      jQuery("#scromPlayModal").modal({
        backdrop : 'static',
        keyboard : false
      });  
    }, 100);
  }
		
  closeScromPlayModal(){
    let isClose = confirm("Are you sure close this window ??");
    if(isClose){
      jQuery("iframe").attr("src","");
      jQuery("#scromPlayModal").modal("hide");
      this.playedScromURL = "";
    }
  }

  showNextAndPrevious(classValue){
    var postDiv = document.getElementsByClassName(classValue)
    
    for(var i=0;i<postDiv.length;i++){
      
      if(i!=0){
        (<HTMLInputElement>postDiv[i]).style.display = "none";
      }
    }
  }

  slidePreIndex = 1;
  plusPreDivs(n) {
    this.showPreDivs(this.slidePreIndex += n);
  }

  showPreDivs(n) {
    var i;
    var x = document.getElementsByClassName("preQuesSlides");
    if (n > x.length) {this.slidePreIndex = 1}    
    if (n < 1) {this.slidePreIndex = x.length}
    for (i = 0; i < x.length; i++) {
      (<HTMLInputElement>x[i]).style.display = "none";  
    }
    (<HTMLInputElement>x[this.slidePreIndex-1]).style.display = "block";  
  }

  submitPreQuestionTime : any;
  
  preNoOfQuestions : any;
  preCorrectQuestions : any;
  submitPreQuestion = function(){
    this.submitPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
    
    this.preQuestionJson = [];
    let applyQuestionCount = 0;
    let notAttemptQuesIndex = -1;
    this.preNoOfQuestions = 0;
    this.preCorrectQuestions = 0;
    
    for(var i=0;i<this.preQuestionResponse.length;i++){
      var answer = [];
      var prAnswer = this.preQuestionResponse[i].pranswer;
      var preQuesId = this.preQuestionResponse[i].prqId;
      var quesType = this.preQuestionResponse[i].optionType;
      if(quesType==1){
        var textObj = document.getElementById("op-pre-"+preQuesId);
        if((<HTMLInputElement>textObj).value.trim()!=""){
          applyQuestionCount++;
        }
        else{
          if(notAttemptQuesIndex == -1){
            notAttemptQuesIndex = i+1;
          }
        }
      }
      if(quesType==3 || quesType==4 || quesType==6){
        //alert("pre radio and check");
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
      
      if(quesType!=1){
        
        if(this.findCorrectAnswer(prAnswer,answer)){
          this.preCorrectQuestions++;
        }
      }
      
      var preObj = {"PRANSWER": answer.toString(),"PRQID": preQuesId };
      this.preQuestionJson.push(preObj);
    }
    
    if(this.preQuestionResponse.length!=applyQuestionCount){
      var notAttemptQuesCount = parseInt(this.preQuestionResponse.length) - applyQuestionCount;
      var goToQuestion = this.preQuestionResponse.length - notAttemptQuesIndex;
      alert("you not attempt "+notAttemptQuesCount+" question..");
      this.plusPreDivs(-goToQuestion);
    }
    else{
      
      var saveResultConfirm = confirm("Do you want to submit ??");
      if(saveResultConfirm){
        let totalQuestion = this.preNoOfQuestions;
        let totalCorrectQuestion = this.preCorrectQuestions;
        this.prePercentage = (totalCorrectQuestion / totalQuestion) * 100;
        if(this.prePercentage < this.prePassingPercentage){
          this.preResult = "FAIL";
        }
        else{
          this.preResult = "PASS";
        }
        
        if(this.isVideo === "YES" && this.isPost === "YES"){
          this.inciPreQuestionDisplayViewer = false;
          this.inciVideoQuestionDisplayViewer = true;
          setTimeout(() => {
            this.showVideoDivs(0)
            //this.playTrainingVideo();
          }, 50);                
        
          this.stopPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');;
          this.startVideoQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');;
        }
        else if(this.isVideo === "YES" && this.isPost === "NO"){
          this.inciPreQuestionDisplayViewer = false;
          this.inciVideoQuestionDisplayViewer = true;
          setTimeout(() => {
            this.showVideoDivs(0)
            //this.playTrainingVideo();
          }, 50); 
          
          
          this.stopPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
          this.startVideoQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        }
        else if(this.isVideo === "NO" && this.isPost === "YES"){
          this.inciPreQuestionDisplayViewer = false;
          this.inciPostQuestionDisplayViewer = true;
          setTimeout(() => {
            this.showPostDivs(this.postQuestionResponse.length)
          }, 50); 
          
          this.stopPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');;
          this.startPostQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');;
        }
        else if(this.isVideo === "NO" && this.isPost === "NO"){
          this.inciPreQuestionDisplayViewer = false;
          this.inciResultWaitingDivViewer = true;
          
          this.stopPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');;
          if(this.isFeedback=="YES"){
            this.startFeedbackQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
            jQuery("#feedbackModal").modal({
              backdrop : 'static',
              keyboard : false
            });
          }
          else{
            this.saveTrainingResult();
          }
        }
        else{
          
        }
        
        
      }
    }
    //console.log("pre json "+JSON.stringify(preQuestionJson));
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

  feedbackAnswerArr = [];
  saveTrainingResult = function(){

    if(this.trainingType == Constant.GROUP_TRAINING){
      this.saveGroupTrainingResult()
      return false;
    }


    this.inciPostQuestionDisplayViewer = false;
    this.inciResultWaitingDivViewer = true;
  
    let currentTimeStamp = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
    
    let saveResultDataJson = {
        "POST_STOP": this.stopPostQuestionTime,
        "PRE_STOP": this.stopPreQuestionTime,
        "empide": this.loginEmpId,
        "PRE_DATA": this.preQuestionJson,
        "POST_START": this.startPostQuestionTime,
        "Ticket_Num": this.ticketNum,
        "refTicketNum" : "",
        "task_id": "",
        "POST_VIDEO_START": this.startVideoQuestionTime,
        "PRE_START": this.startPreQuestionTime,
        "tid" : this.tId,
        "PO_DATA": this.postQuestionJson,
        "POST_VIDEO_STOP": this.stopVideoQuestionTime,
        "POST_STATUS" : this.postResult,
        "pre_status" : this.preResult,
        "pre_percentage": this.prePercentage,
        "post_percentage": this.postPercentage,
        "submitDate" : currentTimeStamp,
        "FEEDBACK" : this.feedbackAnswerArr,
        "FEEDBACK_START" : this.startFeedbackQuestionTime,
        "FEEDBACK_STOP" : this.stopFeedbackQuestionTime
    }

    //console.log(JSON.stringify(saveResultDataJson));

    this.plannedService.saveResult(saveResultDataJson)
    .subscribe((response) => {
      if (response.responseCode == Constant.SUCCESSFUL_STATUS_CODE) {
        this.inciResultWaitingDivViewer = false;
                this.inciResultDivViewer = true;
                
                setTimeout(() => {
                  if(this.postResult === 'FAIL'  ){
                    
                    jQuery("#traininReassignModal").modal({
                        backdrop : 'static',
                        keyboard : false
                      });
                  }
                  
                  
                }, 100);
                
                this.showTrainingAnswer();
      }
      else {
        this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        //this.spinner.hide();
      }
    },
      (error) => {
        this.toastr.warning(Constant.returnServerErrorMessage("openIncidentSubTrainingName"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        //this.spinner.hide();
      })
    
     
  }

  showTrainingAnswer(){
    let preData = this.preQuestionJson;
    let postData = this.postQuestionJson;
    
    for(let i=0;i<preData.length;i++){
      for(let j=0;j<this.preQuestionResponse.length;j++){
        if(preData[i].PRQID === this.preQuestionResponse[j].prqId){
          var answerJson = {
              "question" : this.preQuestionResponse[j].question,
              "optionType" : this.preQuestionResponse[j].optionType,
              "answer" : this.preQuestionResponse[j].answer
          }
          this.preAnswerJsonArr.push(answerJson);
        }
      }
    }

    for(let i=0;i<postData.length;i++){
      for(let j=0;j<this.postQuestionResponse.length;j++){
        if(postData[i].POQID === this.postQuestionResponse[j].poqId){
          var answerJson = {
              "question" : this.postQuestionResponse[j].question,
              "optionType" : this.postQuestionResponse[j].optionType,
              "answer" : this.postQuestionResponse[j].answer
          }
          this.postAnswerJsonArr.push(answerJson);
        }
      }
    }        
  }

  slideVideoIndex = 1;

  plusVideoDivs(n) {
    this.showVideoDivs(this.slideVideoIndex += n);
    //this.pauseVideo();
  }

  // pauseVideo(){
  //   var vidObj = document.getElementsByClassName("trainingVideo");
  //   for(var i = 0;i<vidObj.length;i++){
    
  //     vidObj[i].pause(); 
  //   }
  // }

  showVideoDivs(n) {
    var i;
    var x = document.getElementsByClassName("videoQuesSlides");
    if (n > x.length) {this.slideVideoIndex = 1}    
    if (n < 1) {this.slideVideoIndex = x.length}
    for (i = 0; i < x.length; i++) {
      (<HTMLInputElement>x[i]).style.display = "none";  
    }
    (<HTMLInputElement>x[this.slideVideoIndex-1]).style.display = "block";  
  }

  shownMedia1 : boolean = false;
  shownMedia2 : boolean = false;
  shownMediaIdArr : any = [];
  showMedia(i){
    this.shownMediaIdArr.push(i);
    if(i==1){
      this.shownMedia1 = true;
    }
    else if(i==2){
      this.shownMedia2 = true;
    }
  }

  validateShownMedia() : any{
    let mediaName = jQuery(".mediaName").html();
    for(let i=1;i<=this.videoQuestionDisplayArr.length;i++){
      if(i==1 && this.shownMedia1 == false){
        alert("you not show "+mediaName+" 1, please show first");
        return false;
      }
      else if(i==2 && this.shownMedia2 == false){
        alert("you not show "+mediaName+" 2, please show first");
        return false;
      }
    }
    return true;
  }

  submitVideoQuestion = function(){

    if(!this.validateShownMedia()){
      return false;
    }
            
    var saveResultConfirm = confirm("Do you want to submit ??");
    if(saveResultConfirm){
      //this.videoPause();
      
      if(this.isPost!="YES"){
        this.inciVideoQuestionDisplayViewer = false;
        this.stopVideoQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        if(this.isFeedback=="YES"){
          this.startFeedbackQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
          jQuery("#feedbackModal").modal({
            backdrop : 'static',
            keyboard : false
          });
        }
        else{
          this.saveTrainingResult();
        }
        
      }
      else{
        this.inciVideoQuestionDisplayViewer = false;
        this.inciPostQuestionDisplayViewer = true;
        setTimeout(() => {
          this.showPostDivs(this.postQuestionResponse.length)
        }, 50); 
        
        this.stopVideoQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        this.startPostQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        
      }
    } 
      
  }

  slidePostIndex = 1;

  plusPostDivs(n) {
    this.showPostDivs(this.slidePostIndex += n);
  }

  showPostDivs(n) {
    var i;
    var x = document.getElementsByClassName("postQuesSlides");
    if (n > x.length) {this.slidePostIndex = 1}    
    if (n < 1) {this.slidePostIndex = x.length}
    for (i = 0; i < x.length; i++) {
      (<HTMLInputElement>x[i]).style.display = "none";  
    }
    (<HTMLInputElement>x[this.slidePostIndex-1]).style.display = "block";  
  }

  submitPostQuestionTime : any;
  postNoOfQuestions : any;
  postCorrectQuestions : any;
  submitPostQuestion = function(){
   
    this.submitPostQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
    
    this.postQuestionJson = [];
    let applyQuestionCount = 0;
    let notAttemptQuesIndex = -1;
   
    this.postNoOfQuestions = 0;
    this.postCorrectQuestions = 0;
    for(var i=0;i<this.postQuestionResponse.length;i++){
      var answer = [];
      var poAnswer = this.postQuestionResponse[i].poanswer;
      var postQuesId = this.postQuestionResponse[i].poqId;
      var quesType = this.postQuestionResponse[i].optionType;
      if(quesType==1){
        var textObj = document.getElementById("op-post-"+postQuesId);
        if((<HTMLInputElement>textObj).value.trim()!=""){
          applyQuestionCount++;
        }
        else{
          if(notAttemptQuesIndex == -1){
            notAttemptQuesIndex = i+1;
          }
        }
      }
      if(quesType==3 || quesType==4 || quesType==6){
        var optionCount = document.getElementsByClassName("op-post-"+postQuesId);
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
        
        this.postNoOfQuestions++;
      }
      if(quesType==5){
        var selObj = document.getElementById("op-post-"+postQuesId);
        answer.push((<HTMLInputElement>selObj).value.trim());
        if((<HTMLInputElement>selObj).value.trim()!=""){
          applyQuestionCount++;
        }
        else{
          if(notAttemptQuesIndex == -1){
            notAttemptQuesIndex = i+1;
          }
        }
        
        this.postNoOfQuestions++;
      }
      
      if(quesType!=1){
        if(this.findCorrectAnswer(poAnswer, answer)){
          this.postCorrectQuestions++;
        }
      }
      
      var postObj = {"POANSWER": answer.toString() ,"POQID": postQuesId};
      this.postQuestionJson.push(postObj);
    }
    
    if(this.postQuestionResponse.length!=applyQuestionCount){
      var notAttemptQuesCount = parseInt(this.postQuestionResponse.length) - applyQuestionCount;
      var goToQuestion = this.postQuestionResponse.length - notAttemptQuesIndex;
      alert("you not attempt "+notAttemptQuesCount+" question.. ");
      this.plusPostDivs(-goToQuestion);
    }
    else{
      var saveResultConfirm = confirm("Do you want to submit ??");
      if(saveResultConfirm){
        
        let totalQuestion = this.postNoOfQuestions;
        let totalCorrectQuestion = this.postCorrectQuestions;
        this.postPercentage = (totalCorrectQuestion / totalQuestion) * 100;
        if(this.postPercentage < this.postPassingPercentage){
          this.postResult = "FAIL";
        }
        else{
          this.postResult = "PASS";
        }
      
        this.stopPostQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
        if(this.isFeedback=="YES"){
          this.startFeedbackQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
          jQuery("#feedbackModal").modal({
            backdrop : 'static',
            keyboard : false
          });
        }
        else{
          this.saveTrainingResult();
        }
      }
      
    }
    
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
            // if(j<=optionCount.length-1){
            //   answer += ",";
            // }
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
      this.stopFeedbackQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
      jQuery("#feedbackModal").modal("hide");
      this.saveTrainingResult();
      // this.submitFeedbackQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
      // let saveResultDataJson = {
      //   "FEEDBACK" : this.feedbackAnswerArr
      // }
      // console.log(JSON.stringify(saveResultDataJson));
      
    }

  finishTraining(){
    location.reload();
  }

  restartIncidentTraining = function(actionValue){
            
    if(actionValue === 'yes'){
      jQuery("#traininReassignModal").modal("hide");
      setTimeout(() => {
        this.videoQuestionDisplayArr.splice(0);
        this.preAnswerJsonArr.splice(0);
        this.postAnswerJsonArr.splice(0);
        
        
        this.inciResultWaitingDivViewer = false;
        this.inciResultDivViewer = false;
        this.subTrainingNameDisplayViewer = false;
        this.inciPreQuestionDisplayViewer = false;
        this.inciVideoQuestionDisplayViewer = false;
        this.videoOneDisplayViewer = false;
        this.videoTwoDisplayViewer = false;
        this.inciPostQuestionDisplayViewer = false;
        this.trainingNameDisplayViewer = false;
        this.startPreQuestionTime = "";
        this.stopPreQuestionTime = "";
        this.startVideoQuestionTime = "";
        this.stopVideoQuestionTime = "";
        this.startPostQuestionTime = "";
        this.stopPostQuestionTime = "";
        this.trainingNameDisplayViewer = true;
        
        this.getAssignTask();
        //this.startTraining(this.startTrainingObj);
        
        
        
        
      }, 500);
    }
    else{
      var isRestart = confirm("You will lose all data.. Do you want to restart training??");
      if(isRestart){
        /*---for doing array empty-----*/
        this.videoQuestionDisplayArr.splice(0);
        
        
        this.inciResultWaitingDivViewer = false;
        this.inciResultDivViewer = false;
        this.subTrainingNameDisplayViewer = false;
        this.inciPreQuestionDisplayViewer = false;
        this.inciVideoQuestionDisplayViewer = false;
        this.videoOneDisplayViewer = false;
        this.videoTwoDisplayViewer = false;
        this.inciPostQuestionDisplayViewer = false;
        this.trainingNameDisplayViewer = false;
        this.startPreQuestionTime = "";
        this.stopPreQuestionTime = "";
        this.startVideoQuestionTime = "";
        this.stopVideoQuestionTime = "";
        this.startPostQuestionTime = "";
        this.stopPostQuestionTime = "";
        
        this.startTraining(this.startTrainingObj);
        
      }
    }
    
    
  }


  //=========================== start login for group training ====================================

  startGroupPlannedTraining(response){
    this.imgLoader = false;
    this.groupTrainingDisplayDiv = true;

    for(let i=0;i<response.wrappedList.length;i++){
      let wrappedList = response.wrappedList[i];
      this.groupTrainingQuestionArr = wrappedList.groupTrainingQuestion;
      this.feedbackQuestionResponse = wrappedList.feedbackQuestion;
      this.groupTrainingQuestionSize = wrappedList.groupTrainingQuestionSize;
    }

    for(let i=0;i<this.groupTrainingQuestionArr.length;i++){
      if(this.groupTrainingQuestionArr[i].optionType === '11111'){
        this.videoQuestionDisplayArr.push(this.groupTrainingQuestionArr[i]);
      }
    }

    setTimeout(() => {
      this.startPreQuestionTime = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
      this.showGroupTraining(1);
    }, 10);
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

  submitGroupTrainingQuestion (){
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

  saveGroupTrainingResult(){
    this.groupTrainingDisplayDiv = false;
    this.inciResultWaitingDivViewer = true;

    let currentTimeStamp = this.datePipe.transform(new Date(),'dd-MMM-yyyy hh:mm:ss a');
    this.postResult = "PASS";
    let saveResultDataJson = {
      "empide": this.loginEmpId,
      "PRE_DATA": this.preQuestionJson,
      "PO_DATA": this.postQuestionJson,
      "Ticket_Num": this.ticketNum,
      "refTicketNum" : "",
      "task_id": "",
      "PRE_START": this.startPreQuestionTime,
      "PRE_STOP": this.stopPreQuestionTime,
      "POST_STATUS" : this.postResult,
      "tid" : this.tId,
      "submitDate" : currentTimeStamp,
      "FEEDBACK" : this.feedbackAnswerArr,
      "trainingType" : Constant.GROUP_TRAINING
  }

  
  
  this.plannedService.saveResult(saveResultDataJson)
  .subscribe((response) => {
    if (response.responseCode == Constant.SUCCESSFUL_STATUS_CODE) {
      this.inciResultWaitingDivViewer = false;
      this.inciResultDivViewerForGroupTraining = true;
      
      setTimeout(() => {
        if(this.postResult === 'FAIL'  ){
          
          jQuery("#traininReassignModal").modal({
              backdrop : 'static',
              keyboard : false
            });
        }
        
        
      }, 100);
      this.toastr.success('planned group training result saving is successfully completed', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
      //this.showTrainingAnswer();
    }
    else {
      this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
    }
  },
    (error) => {
      this.toastr.warning(Constant.returnServerErrorMessage("saveGroupTrainingResult"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    })
  }

  

}
