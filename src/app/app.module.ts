import { AdminDetallePartidaEditRoutedComponent } from './components/detalle_partida/admin-detallePartida-edit-routed/admin-detallePartida-edit-routed.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

//--

//--

//


//--

//Sin esto da error!



import { UserAjaxService } from './service/user.ajax.service.service';
import { AdminUsuarioPlistRoutedComponent } from './components/usuario/admin-usuario-plist-routed/admin-usuario-plist-routed.component';
import { AdminUsuarioViewRoutedComponent } from './components/usuario/admin-usuario-view-routed/admin-usuario-view-routed.component';
import { AdminUsuarioNewRoutedComponent } from './components/usuario/admin-usuario-new-routed/admin-usuario-new-routed.component';
import { AdminUsuarioEditRoutedComponent } from './components/usuario/admin-usuario-edit-routed/admin-usuario-edit-routed.component';
import { AdminUsuarioPlistUnroutedComponent } from './components/usuario/admin-usuario-plist-unrouted/admin-usuario-plist-unrouted.component';
import { AdminUsuarioDetailUnroutedComponent } from './components/usuario/admin-usuario-detail-unrouted/admin-usuario-detail-unrouted.component';
import { AdminUsuarioFormUnroutedComponent } from './components/usuario/admin-usuario-form-unrouted/admin-usuario-form-unrouted.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuUnroutedComponent } from './components/shared/menu-unrouted/menu-unrouted.component';
import { AppComponent } from './app.component';
import { PaginatorModule } from 'primeng/paginator';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminStandPlistRoutedComponent } from './components/stand/admin-stand-plist-routed/admin-stand-plist-routed.component';
import { AdminStandPlistUnroutedComponent } from './components/stand/admin-stand-plist-unrouted/admin-stand-plist-unrouted.component';
import { StandAjaxService } from './service/stand.ajax.service.service';
import { ConfirmationService } from 'primeng/api';
import { OpinionAjaxService } from './service/opinion.ajax.service.service';
import { AdminOpinionPlistUnroutedComponent } from './components/opinion/admin-opinion-plist-unrouted/admin-opinion-plist-unrouted.component';
import { AdminOpinionPlistRoutedComponent } from './components/opinion/admin-opinion-plist-routed/admin-opinion-plist-routed.component';
import { AdminPartidaPlistRoutedComponent } from './components/partida/admin-partida-plist-routed/admin-partida-plist-routed.component';
import { AdminPartidaPlistUnroutedComponent } from './components/partida/admin-partida-plist-unrouted/admin-partida-plist-unrouted.component';
import { PartidaAjaxService } from './service/partida.ajax.service.service';
import { AdminDetallePartidaPlistRoutedComponent } from './components/detalle_partida/admin-detallePartida-plist-routed/admin-detallePartida-plist-routed.component';
import { AdminDetallePartidaPlistUnroutedComponent } from './components/detalle_partida/admin-detallePartida-plist-unrouted/admin-detallePartida-plist-unrouted.component';
import { DetallePartidaAjaxService } from './service/detallePartida.ajax.service.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminOpinionDetailUnroutedComponent } from './components/opinion/admin-opinion-detail-unrouted/admin-opinion-detail-unrouted.component';
import { AdminPartidaDetailUnroutedComponent } from './components/partida/admin-partida-detail-unrouted/admin-partida-detail-unrouted.component';
import { AdminDetallePartidaDetailUnroutedComponent } from './components/detalle_partida/admin-detallePartida-detail-unrouted/admin-detallePartida-detail-unrouted.component';
import { ConfirmEventType } from 'primeng/api'; // Importa ConfirmationService de primeng/api
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { AdminStandDetailUnroutedComponent } from './components/stand/admin-stand-detail-unrouted/admin-stand-detail-unrouted.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AdminOpinionViewRoutedComponent } from './components/opinion/admin-opinion-view-routed/admin-opinion-view-routed.component';
import { AdminStandViewRoutedComponent } from './components/stand/admin-stand-view-routed/admin-stand-view-routed.component';
import { AdminPartidaViewRoutedComponent } from './components/partida/admin-partida-view-routed/admin-partida-view-routed.component';
import { AdminDetallePartidaViewRoutedComponent } from './components/detalle_partida/admin-detallePartida-view-routed/admin-detallePartida-view-routed.component';
import { AdminStandEditRoutedComponent } from './components/stand/admin-stand-edit-routed/admin-stand-edit-routed.component';
import { AdminStandFormUnroutedComponent } from './components/stand/admin-stand-form-unrouted/admin-stand-form-unrouted.component';
import { AdminStandNewRoutedComponent } from './components/stand/admin-stand-new-routed/admin-stand-new-routed.component';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AdminPartidaNewRoutedComponent } from './components/partida/admin-partida-new-routed/admin-partida-new-routed.component';
import { AdminPartidaEditRoutedComponent } from './components/partida/admin-partida-edit-routed/admin-partida-edit-routed.component';
import { AdminPartidaFormUnroutedComponent } from './components/partida/admin-partida-form-unrouted/admin-partida-form-unrouted.component';
import { AdminOpinionNewRoutedComponent } from './components/opinion/admin-opinion-new-routed/admin-opinion-new-routed.component';
import { AdminOpinionEditRoutedComponent } from './components/opinion/admin-opinion-edit-routed/admin-opinion-edit-routed.component';
import { AdminOpinionFormUnroutedComponent } from './components/opinion/admin-opinion-form-unrouted/admin-opinion-form-unrouted.component';
import { AdminDetallePartidaFormUnroutedComponent } from './components/detalle_partida/admin-detallePartida-form-unrouted/admin-detallePartida-form-unrouted.component';
import { AdminDetallePartidaNewRoutedComponent } from './components/detalle_partida/admin-detallePartida-new-routed/admin-detallePartida-new-routed.component';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AdminUsuarioSelectionUnroutedComponent } from './components/usuario/admin-usuario-selection-unrouted/admin-usuario-selection-unrouted.component';
import { AdminStandSelectionUnroutedComponent } from './components/stand/admin-stand-selection-unrouted/admin-stand-selection-unrouted.component';
import { LoginRoutedComponent } from './components/shared/login-routed/login-routed.component';
import { CryptoService } from './service/crypto.service';
import { SessionAjaxService } from './service/session.ajax.service.service';
import { LogoutRoutedComponent } from './components/shared/logout-routed/logout-routed.component';
import { AdminPartidaSelectionUnroutedComponent } from './components/partida/admin-partida-selection-unrouted/admin-partida-selection-unrouted.component';
import { MediaService } from './service/media.service';
//--
@NgModule({
  declarations: [
    
    AppComponent,
  
    //--
    AdminUsuarioPlistRoutedComponent,
    AdminUsuarioViewRoutedComponent,
    AdminUsuarioNewRoutedComponent,
    AdminUsuarioEditRoutedComponent,
    AdminUsuarioPlistUnroutedComponent,
    AdminUsuarioDetailUnroutedComponent,
    AdminUsuarioFormUnroutedComponent,
    MenuUnroutedComponent,
   AdminStandPlistRoutedComponent,
   AdminStandPlistUnroutedComponent,
  
  
   AdminOpinionPlistUnroutedComponent,
   AdminOpinionPlistRoutedComponent,
   AdminPartidaPlistRoutedComponent,
   AdminPartidaPlistUnroutedComponent,
   AdminDetallePartidaPlistRoutedComponent,
   AdminDetallePartidaPlistUnroutedComponent,
 
   AdminOpinionDetailUnroutedComponent,
   AdminPartidaDetailUnroutedComponent,
   AdminDetallePartidaDetailUnroutedComponent,
   AdminStandDetailUnroutedComponent, 
   AdminUsuarioViewRoutedComponent,
   AdminOpinionViewRoutedComponent,
   AdminStandViewRoutedComponent,
   AdminPartidaViewRoutedComponent,
   AdminDetallePartidaViewRoutedComponent,
   AdminStandEditRoutedComponent,
   AdminStandFormUnroutedComponent,
   AdminStandNewRoutedComponent,
   AdminPartidaNewRoutedComponent,
   AdminPartidaEditRoutedComponent,
   AdminPartidaFormUnroutedComponent,
   AdminOpinionNewRoutedComponent,
   AdminOpinionEditRoutedComponent,
   AdminOpinionFormUnroutedComponent,
   AdminDetallePartidaFormUnroutedComponent,
   AdminDetallePartidaEditRoutedComponent,
   AdminDetallePartidaNewRoutedComponent,
   AdminPartidaSelectionUnroutedComponent,
   AdminUsuarioSelectionUnroutedComponent,
   AdminStandSelectionUnroutedComponent,
   LoginRoutedComponent,
   LogoutRoutedComponent
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    PaginatorModule,
   BrowserAnimationsModule,
   ConfirmDialogModule,
   DynamicDialogModule,
   FormsModule,
   MatButtonModule,
   MatCardModule,
   MatInputModule,
   MatRadioModule,
   ConfirmPopupModule,
   MatFormFieldModule,
   MatToolbarModule,
   MatIconModule,
   ToolbarModule,
   MatSelectModule,
   ReactiveFormsModule,
   SplitButtonModule
  ],
  providers: [
    DialogService,
    UserAjaxService,
   StandAjaxService,
  
   OpinionAjaxService,
   PartidaAjaxService,
   ConfirmationService,
   DetallePartidaAjaxService,
   CryptoService,
  SessionAjaxService,
  MediaService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }