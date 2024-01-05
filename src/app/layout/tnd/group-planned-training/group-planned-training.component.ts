import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-planned-training',
  templateUrl: './group-planned-training.component.html',
  styleUrls: ['./group-planned-training.component.css']
})
export class GroupPlannedTrainingComponent implements OnInit {

  public organizationLogo : string = "";
  public organizationName : string = "";
  public submenuName : string = "";
  loginEmpId : any = "";
  loginEmpRole : any = "";
  constructor(private router: Router) {
    this.loginEmpId = sessionStorage.getItem("username");
    this.loginEmpRole = localStorage.getItem("empRole");
    this.organizationLogo = localStorage.getItem("organizationLogo");
    this.organizationName = localStorage.getItem("organizationName");
    this.submenuName = localStorage.getItem("groupPlannedTraining");
    localStorage.setItem("currentPage","groupPlannedTraining");
   }

  ngOnInit() {
  }

  reloadPage(){
    let isReloadPage = confirm("Do you want reload this page??");
    if(isReloadPage){
      this.router.navigate(['/layout/dashboard']);
    }
  }

}
