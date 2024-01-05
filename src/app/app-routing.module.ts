import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashbordComponent } from './layout/dashbord/dashbord.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { CreateTrainingComponent } from './layout/tnd/create-training/create-training.component';
import { AssignTrainingComponent } from './layout/tnd/assign-training/assign-training.component';
import { TicketStatusComponent } from './layout/tnd/ticket-status/ticket-status.component';
import { IncidentTrainingComponent } from './layout/tnd/incident-training/incident-training.component';
import { PlannedTrainingComponent } from './layout/tnd/planned-training/planned-training.component';
import { TrainingHistoryComponent } from './layout/tnd/training-history/training-history.component';
import { GroupTrainingComponent } from './layout/tnd/group-training/group-training.component';
import { AssignGroupTrainingComponent } from './layout/tnd/assign-group-training/assign-group-training.component';
import { GroupIncidentTrainingComponent } from './layout/tnd/group-incident-training/group-incident-training.component';
import { GroupPlannedTrainingComponent } from './layout/tnd/group-planned-training/group-planned-training.component';
import { NotificationComponent } from './layout/tnd/notification/notification.component';
import { OfflineTrainingComponent } from './layout/tnd/offline-training/offline-training.component';

const routes: Routes = [
  {path : '' ,  redirectTo: '/login', pathMatch: 'full'},
  {path : 'login', component :LoginComponent},
  {path : 'layout', component :LayoutComponent,  canActivate: [AuthGuard],
  children: [
    { path: 'dashboard', component: DashbordComponent },
    { path: 'tnd-create-training', component: CreateTrainingComponent },
    { path: 'tnd-assign-training', component: AssignTrainingComponent },
    { path: 'tnd-ticket-status', component: TicketStatusComponent },
    { path: 'tnd-incident-training', component: IncidentTrainingComponent },
    { path: 'tnd-group-training', component: GroupTrainingComponent },
    { path: 'tnd-assign-group-training', component: AssignGroupTrainingComponent },
    { path: 'tnd-planned-training', component: PlannedTrainingComponent },
    { path: 'tnd-training-history', component: TrainingHistoryComponent },
    { path: 'tnd-group-incident-training', component: GroupIncidentTrainingComponent },
    { path: 'tnd-group-planned-training', component: GroupPlannedTrainingComponent },
    { path: 'tnd-notification', component: NotificationComponent },
    { path: 'tnd-offline-training', component: OfflineTrainingComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
