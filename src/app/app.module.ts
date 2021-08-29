import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { TimePipe } from './pipes/time/time.pipe';

@NgModule({
  declarations: [AppComponent, VideoPlayerComponent, TimePipe],
  imports: [AppRoutingModule, BrowserModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
