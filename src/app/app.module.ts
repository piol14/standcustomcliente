
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

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
import { AtaqueStandAjaxService } from './service/ataqueStand.ajax.service.service';
import { AdminAtaqueStandPlistUnroutedComponent } from './components/ataque_stand/admin-ataqueStand-plist-unrouted/admin-ataqueStand-plist-unrouted.component';
import { AdminAtaqueStandPlistRoutedComponent } from './components/ataque_stand/admin-ataqueStand-plist-routed/admin-ataqueStand-plist-routed.component';
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
import { AdminAtaqueStandDetailUnroutedComponent } from './components/ataque_stand/admin-ataque_stand-detail-unrouted/admin-ataque_stand-detail-unrouted.component';
import { AdminOpinionDetailUnroutedComponent } from './components/opinion/admin-opinion-detail-unrouted/admin-opinion-detail-unrouted.component';
import { AdminPartidaDetailUnroutedComponent } from './components/partida/admin-partida-detail-unrouted/admin-partida-detail-unrouted.component';
import { AdminDetallePartidaDetailUnroutedComponent } from './components/detalle_partida/admin-detallePartida-detail-unrouted/admin-detallePartida-detail-unrouted.component';


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
   AdminAtaqueStandPlistUnroutedComponent,
   AdminAtaqueStandPlistRoutedComponent,
   AdminOpinionPlistUnroutedComponent,
   AdminOpinionPlistRoutedComponent,
   AdminPartidaPlistRoutedComponent,
   AdminPartidaPlistUnroutedComponent,
   AdminDetallePartidaPlistRoutedComponent,
   AdminDetallePartidaPlistUnroutedComponent,
   AdminAtaqueStandDetailUnroutedComponent,
   AdminOpinionDetailUnroutedComponent,
   AdminPartidaDetailUnroutedComponent,
   AdminDetallePartidaDetailUnroutedComponent
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    PaginatorModule,
   BrowserAnimationsModule

  
    
  ],
  providers: [
    DialogService,
    UserAjaxService,
   StandAjaxService,
   AtaqueStandAjaxService,
   OpinionAjaxService,
   PartidaAjaxService,
   ConfirmationService,
   DetallePartidaAjaxService,
   

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }