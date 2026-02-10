import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from "src/app/pages/game/game.component";
import { MainMenuComponent } from "src/app/pages/main-menu/main-menu.component";
import { AddPlayersComponent } from "./pages/add-players/add-players.component";
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
    {path: 'game', component: GameComponent},
    {path: 'menu', component: MainMenuComponent},
    {path: 'players', component: AddPlayersComponent},
    {path: 'settings', component: SettingsComponent},
    {path: '**', redirectTo: '/menu', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
