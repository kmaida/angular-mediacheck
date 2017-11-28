import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MediacheckService } from './mediacheck.service';
import { HomeComponent } from './home/home.component';
import { LargeComponent } from './home/large.component';
import { SmallComponent } from './home/small.component';
import { InstanceComponent } from './instance/instance.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LargeComponent,
    SmallComponent,
    InstanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    MediacheckService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
