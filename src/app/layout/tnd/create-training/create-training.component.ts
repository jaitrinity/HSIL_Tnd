import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TndSharedService } from 'src/app/shared/service/TndSharedService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Constant } from 'src/app/shared/constant/Contant';
import { SharedService } from 'src/app/shared/service/SharedService';
declare var jQuery;

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.css'],
  //providers: [TndSharedService]
})
export class CreateTrainingComponent implements OnInit {

  loginEmpId: any = "";
  loginEmpRole: any = "";
  questionType: any = "";
  trainingName: any = "";
  subTrainingName: any = "";
  roleList = [];
  selectedRoleList = [];
  circleNameList = [];
  selectedCircleNameList = [];
  zoneNameList = [];
  selectedZoneNameList = [];
  clusterNameList = [];
  selectedClusterNameList = [];
  trainingDisabled: boolean = false;
  trainingTypeDisabled: boolean = false;
  questionTypeDisabled: boolean = true;
  isPre: boolean = false;
  isVideo: boolean = false;
  isPost: boolean = false;
  isPreDone: boolean = false;
  isVideoDone: boolean = false;
  isPostDone: boolean = false;
  mediaType : any = "";
  minPreQuestion: any = "";
  minPostQuestion: any = "";
  prePassPercentage: any = "";
  postPassPercentage: any = "";
  language: any = "";
  question: any = "";
  multiSelectropdownSettings = {};
  singleSelectropdownSettings = {};
  questionTypeList = [];
  mediaTypeList = [];
  languageList = [];
  trainingVideoList = [];
  preTrainingViewDiv: boolean = false;
  videoTrainingViewDiv: boolean = false;
  postTrainingViewDiv: boolean = false;
  imageOneString: any = "";
  imageTwoString: any = "";
  imageThreeString: any = "";
  imageFourString: any = "";
  videoOneString: any = "";
  videoTwoString: any = "";
  public organizationLogo : string = "";
  public organizationName : string = "";
  public submenuName : string = "";
  constructor(
    private router: Router, 
    private tndSharedService: TndSharedService, 
    private sharedService : SharedService,
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService) {
    this.loginEmpId = sessionStorage.getItem("username");
    this.loginEmpRole = localStorage.getItem("empRole");
    this.organizationLogo = localStorage.getItem("organizationLogo");
    this.organizationName = localStorage.getItem("organizationName");
    this.submenuName = localStorage.getItem("createTraining");
    localStorage.setItem("currentPage","createTraining");
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

    //this.languageList = [{ "paramCode": "EN", "paramDesc": "English" }, { "paramCode": "HI", "paramDesc": "Hindi" }]

    for (let i = 1; i <= 2; i++) {
      let v = {
        id: i
      }
      this.trainingVideoList.push(v);
    }

    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    //   this.toastr.success('Welcome to create training', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
    // }, 2000);

    

    this.getQuestionType();
    //this.getUserCircleZoneCluster("CIRCLE");
    this.loadRoleList();
    this.getMediaType();
    this.loadLanguageList();
    this.getOrganizationData(Constant.ORGANIZATION);
  }

  clickOnUploadDiv(divId){
    //alert(divId);
    jQuery("#video_"+divId).click();
  }

  reloadPage(){
    let isReloadPage = confirm("Do you want reload this page??");
    if(isReloadPage){
      this.router.navigate(['/layout/dashboard']);
    }
  }

  selectMediaType(){
    if(this.mediaType != ''){
      this.isVideo = true;
      //if(this.isPre || this.isPost){
        this.questionTypeDisabled = false;
      //}
    }
    else{
      this.isVideo = false;
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
          this.circleNameList = response.wrappedList;
          console.log(this.circleNameList);
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

  loadLanguageList(){
    this.tndSharedService.getLanguageList()
      .subscribe((response) => {
        if (response.code == 200) {
          this.languageList = response.data;
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert');
          //this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("loadLanguageList"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        })
  }

  getMediaType() {
    //this.spinner.show();
    this.tndSharedService.getMediaType()
      .subscribe((response) => {
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.mediaTypeList = response.wrappedList;
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getMediaType"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        })
  }

  checkedTrainingType(){
    //console.log("1 : "+this.isPre+" "+this.isVideo+" "+this.isPost);
    setTimeout(() => {
      //console.log("2 : "+this.isPre+" "+this.isVideo+" "+this.isPost);
      if(!this.isPre && !this.isVideo && !this.isPost){
        this.questionTypeDisabled = true;
      }
      else{
        this.questionTypeDisabled = false;
      }
    }, 50);
    
  }

  loadRoleList(){
    //this.spinner.show();
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
      this.spinner.hide();
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

  getQuestionType() {
    //this.spinner.show();
    this.tndSharedService.getQuestionType()
      .subscribe((response) => {
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.questionTypeList = response.wrappedList;
          //this.spinner.hide();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("getQuestionType"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          //this.spinner.hide();
        })
  }

  noOfOptionList = [];
  optionType: any = "";
  selectQuestionType() {
    this.trainingTypeDisabled = true;
    this.optionShowList = [];
    this.noOfOptionList = [];
    for (let i = 0; i < this.questionTypeList.length; i++) {
      if (this.questionTypeList[i].id == this.questionType) {
        let noOfOption = this.questionTypeList[i].noOfOptions;
        this.optionType = this.questionTypeList[i].desc;
        for (let j = 1; j <= noOfOption; j++) {
          let json = { id: j }
          this.noOfOptionList.push(json);
        }
      }
    }
    if (this.isPre && !this.isPreDone) {
      this.preTrainingViewDiv = true;
    }
    else if (this.isVideo && !this.isVideoDone) {
      this.videoTrainingViewDiv = true;
    }
    else if (this.isPost && !this.isPostDone) {
      this.postTrainingViewDiv = true;
    }
  }

  optionShowList = [];
  optionSize: any = "";
  selectOptionSize(os) {
    this.optionSize = os;
    this.optionShowList = [];
    for (let i = 1; i <= os; i++) {
      let json = {
        id: i, type: this.optionType
      }
      this.optionShowList.push(json);
    }
  }

  validateTrainingData(): any {
    if (this.trainingName == "") {
      alert("please enter training name");
      return false;
    }
    else if (this.subTrainingName == "") {
      alert("please enter sub training name");
      return false;
    }
    else if(this.selectedRoleList.length == 0){
      alert("please select atleast one role");
      return false;
    }
    else if(this.selectedCircleNameList.length == 0){
      alert("please select atleast one circle");
      return false;
    }
    else if (this.language == "") {
      alert("please select language");
      return false;
    }
    else if (!this.isPre && !this.isVideo && !this.isPost) {
      alert("please check atleast one training type");
      return false;
    }
    else if (this.isPre && this.minPreQuestion == "") {
      alert("please enter min pre question");
      return false;
    }
    else if (this.isPost && this.minPostQuestion == "") {
      alert("please enter min post question");
      return false;
    }
    else if (this.isPre && this.prePassPercentage == "") {
      alert("please enter pre pass percentage");
      return false;
    }
    else if (this.isPost && this.postPassPercentage == "") {
      alert("please enter post pass percentage");
      return false;
    }
    else {
      return true;
    }
  }

  validateQuestionData(): any {
    if (this.question == "") {
      alert("please enter question");
      return false;
    }
    else if (this.questionType != '1' && this.optionShowList.length == 0) {
      alert("please check number of option");
      return false;
    }
    else {
      return true;
    }

  }

  validateOptionData(): any {
    for (let i = 1; i <= this.optionShowList.length; i++) {
      let v = jQuery("#option_" + i).val();
      if (v == "") {
        alert("please enter option " + i + " value");
        return false;
      }
    }
    return true;
  }

  validateOptionAnswerData(): any {
    let isChecked = false;
    for (let i = 1; i <= this.optionShowList.length; i++) {
      let v = jQuery("#optionAnswer_" + i).prop("checked");
      if (v) {
        isChecked = true;
      }
    }
    if (!isChecked) {
      alert("one option must be checked");
      return false;
    }
    return true;
  }

  preAddedQuestionList = [];
  addPreSameType() {
    if (!this.validateTrainingData()) {
      return false;
    }
    else if (!this.validateQuestionData()) {
      return false;
    }
    else if (this.questionType != '1' && !this.validateOptionData()) {
      return false;
    }
    else if (this.questionType != '1' && !this.validateOptionAnswerData()) {
      return false;
    }

    let saveOptionList = [];
    for (let i = 1; i <= this.optionShowList.length; i++) {
      if (this.optionType == "Image") {
        let isChecked = jQuery("#optionAnswer_" + i).prop("checked");
        if (i == 1) {
          let optionJson = {
            optionNumber: 1,
            optionValue: this.imageOneString,
            isChecked: isChecked
          }
          saveOptionList.push(optionJson);
        }
        else if (i == 2) {
          let optionJson = {
            optionNumber: 2,
            optionValue: this.imageTwoString,
            isChecked: isChecked
          }
          saveOptionList.push(optionJson);
        }
        else if (i == 3) {
          let optionJson = {
            optionNumber: 3,
            optionValue: this.imageThreeString,
            isChecked: isChecked
          }
          saveOptionList.push(optionJson);
        }
        else if (i == 4) {
          let optionJson = {
            optionNumber: 4,
            optionValue: this.imageFourString,
            isChecked: isChecked
          }
          saveOptionList.push(optionJson);
        }
      }
      else {
        let optionValue = jQuery("#option_" + i).val();
        let isChecked = jQuery("#optionAnswer_" + i).prop("checked");
        let saveOptionJson = {
          optionNumber: i,
          optionValue: optionValue,
          isChecked: isChecked
        }
        saveOptionList.push(saveOptionJson);
      }

    }

    let questionJson = {
      question: this.question,
      questionType: this.questionType,
      optionSize: this.optionSize,
      trainingType: "PRE",
      options: saveOptionList
    }

    this.preAddedQuestionList.push(questionJson);
    this.disabledData();
    this.resetQuestionOption();
  }

  disabledData() {
    this.trainingDisabled = true;
    this.questionTypeDisabled = true;
  }

  resetQuestionOption() {
    this.question = "";
    this.selectOptionSize(this.optionSize);
  }

  changeQuestionType() {
    this.questionTypeDisabled = false;
  }



  changeListener($event, i): void {
    this.readThis($event.target, i);
  }

  readThis(inputValue: any, optionNumber): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      if (optionNumber == 1) {
        this.imageOneString = image;
      }
      else if (optionNumber == 2) {
        this.imageTwoString = image;
      }
      else if (optionNumber == 3) {
        this.imageThreeString = image;
      }
      else if (optionNumber == 4) {
        this.imageFourString = image;
      }
    }
    myReader.readAsDataURL(file);
  }

  changeVideoListener($event, i): void {
    this.readVideoThis($event.target, i);
  }

  readVideoThis(inputValue: any, optionNumber): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let video = myReader.result;
      if (optionNumber == 1) {
        this.videoOneString = video;
      }
      else if (optionNumber == 2) {
        this.videoTwoString = video;
      }
    }
    myReader.readAsDataURL(file);
  }

  submitPreTraining() {
    //this.minPreQuestion
    if (this.preAddedQuestionList.length < this.minPreQuestion) {
      alert("added question must be equal or greater than min pre question");
      return false;
    }

    if (confirm("Do want to submit pre training??")) {
      this.isPreDone = true;
      this.preTrainingViewDiv = false;
      if (this.isVideo) {
        this.videoTrainingViewDiv = true;
      }
      else if (this.isPost) {
        this.postTrainingViewDiv = true;
      }
      else {
        this.submitFinalTraining();
      }
    }
  }

  trainingVideoSize = [];
  selectNoOfTrainingVideo(tv) {
    this.trainingVideoSize = [];
    for (let i = 1; i <= tv; i++) {
      let vj = {
        id: i
      }
      this.trainingVideoSize.push(vj);
    }
  }

  submitVideo() {
    if (!this.validateTrainingData()) {
      return false;
    }
    else if (this.trainingVideoSize.length == 0) {
      alert("checked radio for video option");
      return false;
    }

    for (let i = 1; i <= this.trainingVideoSize.length; i++) {
      let v = jQuery("#video_" + i).val();
      if (v == "") {
        alert("please choose video " + i);
        return false;
      }
    }

    if(this.mediaType == '3' || this.mediaType == '7'){
      this.videoOneString = jQuery("#video_1").val();
      this.videoTwoString = jQuery("#video_2").val();

    }

    if (confirm("Do want to submit video training??")) {
      this.isVideoDone = true;
      this.videoTrainingViewDiv = false;
      if (this.isPost) {
        this.postTrainingViewDiv = true;
      }
      else {
        this.submitFinalTraining();
      }
    }
  }

  postAddedQuestionList = [];
  addPostSameType() {
    if (!this.validateTrainingData()) {
      return false;
    }
    else if (!this.validateQuestionData()) {
      return false;
    }
    else if (this.questionType != '1' && !this.validateOptionData()) {
      return false;
    }
    else if (this.questionType != '1' && !this.validateOptionAnswerData()) {
      return false;
    }

    let saveOptionList = [];
    for (let i = 1; i <= this.optionShowList.length; i++) {
      if (this.optionType == "Image") {
        let isChecked = jQuery("#optionAnswer_" + i).prop("checked");
        if (i == 1) {
          let optionJson = {
            optionNumber: 1,
            optionValue: this.imageOneString,
            isChecked: isChecked
          }
          saveOptionList.push(optionJson);
        }
        else if (i == 2) {
          let optionJson = {
            optionNumber: 2,
            optionValue: this.imageTwoString,
            isChecked: isChecked
          }
          saveOptionList.push(optionJson);
        }
        else if (i == 3) {
          let optionJson = {
            optionNumber: 3,
            optionValue: this.imageThreeString,
            isChecked: isChecked
          }
          saveOptionList.push(optionJson);
        }
        else if (i == 4) {
          let optionJson = {
            optionNumber: 4,
            optionValue: this.imageFourString,
            isChecked: isChecked
          }
          saveOptionList.push(optionJson);
        }
      }
      else {
        let optionValue = jQuery("#option_" + i).val();
        let isChecked = jQuery("#optionAnswer_" + i).prop("checked");
        let saveOptionJson = {
          optionNumber: i,
          optionValue: optionValue,
          isChecked: isChecked
        }
        saveOptionList.push(saveOptionJson);
      }

    }

    let questionJson = {
      question: this.question,
      questionType: this.questionType,
      optionSize: this.optionSize,
      trainingType: "POST",
      options: saveOptionList
    }

    this.postAddedQuestionList.push(questionJson);
    //console.log(JSON.stringify(this.postAddedQuestionList))
    this.disabledData();
    this.resetQuestionOption();
  }

  submitPostTraining() {
    if (this.postAddedQuestionList.length < this.minPostQuestion) {
      alert("added question must be equal or greater than min post question");
      return false;
    }

    if (confirm("Do want to submit post training??")) {
      this.isPostDone = true;
      this.submitFinalTraining();
    }
  }

  submitFinalTraining() {
    if (!confirm("Do want to submit traning??")) {
      return false;
    }

    let finalTrainingJson = {
      trainingName: this.trainingName,
      subTrainingName: this.subTrainingName,
      roleList: this.selectedRoleList,
      circleList: this.selectedCircleNameList,
      isPre: this.isPre,
      //isVideo: this.isVideo,
      isPost: this.isPost,
      minPreQuestion: this.minPreQuestion,
      minPostQuestion: this.minPostQuestion,
      prePassPercentage: this.prePassPercentage,
      postPassPercentage: this.postPassPercentage,
      language: this.language,
      video1: this.videoOneString,
      video2: this.videoTwoString,
      mediaType : this.mediaType,
      preAddedQuestionList: this.preAddedQuestionList,
      postAddedQuestionList: this.postAddedQuestionList
    }

    //console.log(JSON.stringify(finalTrainingJson));
    this.spinner.show();
    this.tndSharedService.submitTraining(finalTrainingJson)
      .subscribe((response) => {
        if (response.responseCode === Constant.SUCCESSFUL_STATUS_CODE) {
          this.toastr.success('Successfully created training', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
          //this.router.navigate(['/layout/tnd-create-training']);
          location.reload();
        }
        else {
          this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        }
      },
        (error) => {
          this.toastr.warning(Constant.returnServerErrorMessage("submitFinalTraining"), "Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.spinner.hide();
        })
  }

}
