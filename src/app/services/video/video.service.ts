import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private readonly http: HttpClient) {}

  extractFramesFromVideo(
    videoUrl: string,
    fps = 0.2
  ): Observable<Array<string>> {
    // Download the complete video:
    return this.http.get(videoUrl, { responseType: 'blob' }).pipe(
      switchMap((videoBlob) => {
        const frames$: Promise<Array<string>> = new Promise(async (resolve) => {
          // Create a video element on the fly.
          const videoObjectUrl = URL.createObjectURL(videoBlob);
          const video = document.createElement('video');

          let seekResolve: any;
          video.addEventListener('seeked', async () => {
            if (seekResolve) {
              seekResolve();
            }
          });

          // When the data loads, start capturing frames every 5 seconds.
          video.addEventListener('loadeddata', async () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const [w, h] = [video.videoWidth, video.videoHeight];
            canvas.width = w;
            canvas.height = h;

            const frames: Array<string> = [];
            const interval = 1 / fps;
            let currentTime = 0;
            const duration = video.duration;

            while (currentTime < duration) {
              video.currentTime = currentTime;
              await new Promise((r) => (seekResolve = r));

              context?.drawImage(video, 0, 0, w, h);
              const base64ImageData = canvas.toDataURL();
              frames.push(base64ImageData);

              currentTime += interval;
            }
            resolve(frames);
          });

          // Set video src AFTER listening to events in case it loads so fast that the events occur before we were listening.
          video.src = videoObjectUrl;
        });

        // Return an Observable containing all the captured frames.
        return from(frames$);
      })
    );
  }
}
