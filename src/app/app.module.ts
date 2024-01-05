import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashbordComponent } from './layout/dashbord/dashbord.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedService } from './shared/service/SharedService';
import { Http, HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './shared/guard/auth.guard';
import { NgxSpinnerModule } from 'ngx-spinner';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CreateTrainingComponent } from './layout/tnd/create-training/create-training.component';
import { AssignTrainingComponent } from './layout/tnd/assign-training/assign-training.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SmartTableModule } from 'ngx-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
//import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TndSharedService } from './shared/service/TndSharedService';
import { TicketStatusComponent } from './layout/tnd/ticket-status/ticket-status.component';
import { IncidentTrainingComponent } from './layout/tnd/incident-training/incident-training.component';
import { PlannedTrainingComponent } from './layout/tnd/planned-training/planned-training.component';
import { IncidentTrainingService } from './shared/service/IncidentTrainingService';
import { DatePipe } from '@angular/common';
import { PlannedTrainingService } from './shared/service/PlannedTrainingService';
import { TndTicketStatusService } from './shared/service/TndTicketStatusService';
import { TrainingHistoryComponent } from './layout/tnd/training-history/training-history.component';
import { TndTrainingHistoryService } from './shared/service/TndTrainingHistoryService';
import { GroupTrainingComponent } from './layout/tnd/group-training/group-training.component';
import { TndGroupTrainingService } from './shared/service/TndGroupTrainingService';
import { AssignGroupTrainingComponent } from './layout/tnd/assign-group-training/assign-group-training.component';
import { GroupIncidentTrainingComponent } from './layout/tnd/group-incident-training/group-incident-training.component';
import { GroupPlannedTrainingComponent } from './layout/tnd/group-planned-training/group-planned-training.component';
import { GroupIncidentTrainingService } from './shared/service/GroupIncidentTrainingService';
import { NotificationComponent } from './layout/tnd/notification/notification.component';
import { TndNotificationService } from './shared/service/TndNotificationService';
import { OfflineTrainingComponent } from './layout/tnd/offline-training/offline-training.component';
import { TndOffineTrainingService } from './shared/service/TndOfflineTrainingService';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashbordComponent,
    CreateTrainingComponent,
    AssignTrainingComponent,
    TicketStatusComponent,
    IncidentTrainingComponent,
    PlannedTrainingComponent,
    TrainingHistoryComponent,
    GroupTrainingComponent,
    AssignGroupTrainingComponent,
    GroupIncidentTrainingComponent,
    GroupPlannedTrainingComponent,
    NotificationComponent,
    OfflineTrainingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SmartTableModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    //ModalModule.forRoot(),
    TabsModule.forRoot()
  ],
  providers: [AuthGuard,
    SharedService,GroupIncidentTrainingService,
    TndSharedService,IncidentTrainingService,PlannedTrainingService,TndTicketStatusService,
    TndTrainingHistoryService,TndGroupTrainingService,TndNotificationService,TndOffineTrainingService,
    DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
