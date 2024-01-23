
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminUsuarioViewRoutedComponent } from './components/usuario/admin-usuario-view-routed/admin-usuario-view-routed.component';
import { AdminUsuarioPlistRoutedComponent } from './components/usuario/admin-usuario-plist-routed/admin-usuario-plist-routed.component';
import { AdminUsuarioEditRoutedComponent } from './components/usuario/admin-usuario-edit-routed/admin-usuario-edit-routed.component';
import { AdminUsuarioNewRoutedComponent } from './components/usuario/admin-usuario-new-routed/admin-usuario-new-routed.component';
import { AdminStandPlistRoutedComponent } from './components/stand/admin-stand-plist-routed/admin-stand-plist-routed.component';
import { AdminAtaqueStandPlistRoutedComponent } from './components/ataque_stand/admin-ataqueStand-plist-routed/admin-ataqueStand-plist-routed.component';
import { AdminOpinionPlistRoutedComponent } from './components/opinion/admin-opinion-plist-routed/admin-opinion-plist-routed.component';
import { AdminPartidaPlistRoutedComponent } from './components/partida/admin-partida-plist-routed/admin-partida-plist-routed.component';
import { AdminDetallePartidaPlistRoutedComponent } from './components/detalle_partida/admin-detallePartida-plist-routed/admin-detallePartida-plist-routed.component';
import { AdminOpinionViewRoutedComponent } from './components/opinion/admin-opinion-view-routed/admin-opinion-view-routed.component';
import { AdminStandViewRoutedComponent } from './components/stand/admin-stand-view-routed/admin-stand-view-routed.component';
import { AdminPartidaViewRoutedComponent } from './components/partida/admin-partida-view-routed/admin-partida-view-routed.component';
import { AdminDetallePartidaViewRoutedComponent } from './components/detalle_partida/admin-detallePartida-view-routed/admin-detallePartida-view-routed.component';
import { AdminStandNewRoutedComponent } from './components/stand/admin-stand-new-routed/admin-stand-new-routed.component';
export const routes: Routes = [
    { path: 'admin/usuario/plist', component: AdminUsuarioPlistRoutedComponent },
    { path: 'admin/usuario/new', component: AdminUsuarioNewRoutedComponent },
    { path: 'admin/usuario/view/:id', component: AdminUsuarioViewRoutedComponent },    
    { path: 'admin/usuario/new', component: AdminUsuarioNewRoutedComponent },
    { path: 'admin/usuario/edit/:id', component: AdminUsuarioEditRoutedComponent },
    {path: 'admin/stand/plist', component: AdminStandPlistRoutedComponent},
    {path: 'admin/stand/view/:id', component:AdminStandViewRoutedComponent},
    {path: 'admin/ataques/plist', component: AdminAtaqueStandPlistRoutedComponent},
    {path: 'admin/ataques/new', component:AdminStandNewRoutedComponent},  
{path: 'admin/ataques/edit/:id', component:AdminStandNewRoutedComponent},

    {path: 'admin/opinion/plist', component: AdminOpinionPlistRoutedComponent},
    {path: 'admin/opinion/view/:id', component:AdminOpinionViewRoutedComponent},

    {path: 'admin/partida/plist', component: AdminPartidaPlistRoutedComponent},
    {path: 'admin/partida/view/:id', component: AdminPartidaViewRoutedComponent},
    {path: 'admin/detallePartida/plist', component: AdminDetallePartidaPlistRoutedComponent},
    {path: 'admin/detallePartida/view/:id', component: AdminDetallePartidaViewRoutedComponent},

] 

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
