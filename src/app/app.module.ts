import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DartBoardComponent } from './components/dartboard/dartboard.component';
import { ThrowsComponent } from './components/throws/throws.component';
import { DartboardThrowsComponent } from './components/dartboard-throws/dartboard-throws.component';
import { GameComponent } from './pages/game/game.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { CustomBtnComponent } from './components/custom-btn/custom-btn.component';
import { AddPlayersComponent } from './pages/add-players/add-players.component';
import { PlayerComponent } from './components/player/player.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { GenericButtonComponent } from './components/generic-button/generic-button.component';
import { CharacterSelectorComponent } from './components/player/character-selector/character-selector.component';
import { SkillSelectorComponent } from './components/player/skill-selector/skill-selector.component';
import { HpbarComponent } from './components/player/hpbar/hpbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DartBoardComponent,
    ThrowsComponent,
    DartboardThrowsComponent,
    GameComponent,
    MainMenuComponent,
    HeaderComponent,
    CustomBtnComponent,
    AddPlayersComponent,
    PlayerComponent,
    BackButtonComponent,
    GenericButtonComponent,
    CharacterSelectorComponent,
    SkillSelectorComponent,
    HpbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
