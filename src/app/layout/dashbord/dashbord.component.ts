import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {

  currentPage : string = "";
  constructor(private router:Router) {
    this.currentPage = localStorage.getItem("currentPage");
   }

  ngOnInit() {
    if(this.currentPage == 'createTraining'){
      this.router.navigate(['/layout/tnd-create-training']);
    }
    else if(this.currentPage == 'assignTraining'){
      this.router.navigate(['/layout/tnd-assign-training']);
    }
    else if(this.currentPage == 'ticketStatus'){
      this.router.navigate(['/layout/tnd-ticket-status']);
    }
    else if(this.currentPage == 'trainingHistory'){
      this.router.navigate(['/layout/tnd-training-history']);
    }
    else if(this.currentPage == 'plannedTraining'){
      this.router.navigate(['/layout/tnd-planned-training']);
    }
    else if(this.currentPage == 'incidentTraining'){
      this.router.navigate(['/layout/tnd-incident-training']);
    }
    else if(this.currentPage == 'groupTraining'){
      this.router.navigate(['/layout/tnd-group-training']);
    }
    else if(this.currentPage == 'assignGroupTraining'){
      this.router.navigate(['/layout/tnd-assign-group-training']);
    }
    else if(this.currentPage == 'groupPlannedTraining'){
      this.router.navigate(['/layout/tnd-group-planned-training']);
    }
    else if(this.currentPage == 'groupIncidentTraining'){
      this.router.navigate(['/layout/tnd-group-incident-training']);
    }
    else if(this.currentPage == 'tndNofication'){
      this.router.navigate(['/layout/tnd-notification']);
    }
    else if(this.currentPage == 'offlineTraining'){
      this.router.navigate(['/layout/tnd-offline-training']);
    }
  }

}
