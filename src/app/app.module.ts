import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DartBoardComponent } from './components/dartboard/dartboard.component';
import { ThrowsComponent } from './components/throws/throws.component';
import { DartboardThrowsComponent } from './components/dartboard-throws/dartboard-throws.component';

@NgModule({
  declarations: [
    AppComponent,
    DartBoardComponent,
    ThrowsComponent,
    DartboardThrowsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
