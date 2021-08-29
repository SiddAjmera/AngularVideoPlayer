import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { VideoService } from './../../services/video/video.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements AfterViewInit {
  @Input() source!: string;
  @ViewChild('video') media!: ElementRef<HTMLVideoElement>;
  @ViewChild('controls') controlsElement!: ElementRef<HTMLDivElement>;
  @ViewChild('timerWrapper') timerWrapperElement!: ElementRef<HTMLDivElement>;
  @ViewChild('timerBar') timerBarElement!: ElementRef<HTMLDivElement>;
  @ViewChild('timer') timerElement!: ElementRef<HTMLSpanElement>;
  @ViewChild('preview') previewElement!: ElementRef<HTMLCanvasElement>;
  isVideoPlaying = true;
  frames: Array<any> = [];
  frames$!: Observable<Array<any>>;
  seekedMediaTime!: number;
  seekedMediaCoordinate!: string;

  private get player(): HTMLVideoElement {
    return this.media.nativeElement;
  }
  private get controls(): HTMLDivElement {
    return this.controlsElement.nativeElement;
  }
  private get timerWrapper(): HTMLDivElement {
    return this.timerWrapperElement.nativeElement;
  }
  private get timerBar(): HTMLDivElement {
    return this.timerBarElement.nativeElement;
  }
  private get preview(): HTMLCanvasElement {
    return this.previewElement.nativeElement;
  }

  constructor(private readonly videoService: VideoService) {}

  ngAfterViewInit(): void {
    // Removing default controls in favor of custom controls, in case our JS loads.
    this.player.removeAttribute('controls');
    this.controls.style.visibility = 'visible';
    // Generating frames in the background while the video plays.
    this.frames$ = this.videoService.extractFramesFromVideo(this.source).pipe(
      tap((frames: Array<string>) => {
        this.frames = frames;
      })
    );
  }

  playOrPauseMedia(): void {
    if (this.player.paused) {
      this.isVideoPlaying = true;
      this.player.play();
    } else {
      this.isVideoPlaying = false;
      this.player.pause();
    }
  }

  stopMedia(): void {
    this.player.pause();
    this.player.currentTime = 0;
    this.isVideoPlaying = false;
  }

  updateVideoProgressBar(): void {
    const barLength =
      this.timerWrapper.clientWidth *
      (this.player.currentTime / this.player.duration);
    this.timerBar.style.width = `${barLength}px`;
  }

  clearPreviewFrame(): void {
    this.preview.style.visibility = 'hidden';
    this.seekedMediaTime = 0;
    this.seekedMediaCoordinate = '0px';
  }

  // TODO: Update this to also listen to events that won't be captured by the mouseover event
  // Note: Ideally scroll event should be listened but that would be extremely noisy
  previewFrame({ x: seekingForFrameAtCoordinate }: MouseEvent): void {
    // console.group();
    const {
      x: startCoordinate,
      right: endCoordinate,
    } = this.timerWrapper.getBoundingClientRect();
    /* console.log(
      `Start Coordinates: ${startCoordinate} | End Coordinates: ${endCoordinate}`
    ); */

    const videoDuration = this.player.duration;
    // console.log('Video Duration: ', videoDuration);
    this.seekedMediaCoordinate = `${
      seekingForFrameAtCoordinate <= 148 ? 0 : seekingForFrameAtCoordinate - 150
    }px`;
    // console.log('Seeking frame for coordinate: ', seekingForFrameAtCoordinate);

    const seekingForFrameAtPercentage =
      ((seekingForFrameAtCoordinate - startCoordinate) /
        (endCoordinate - startCoordinate)) *
      100;
    // console.log('seekingForFrameAtPercentage: ', seekingForFrameAtPercentage);
    let seekingForFrameAtIndex = Math.floor(
      (this.frames.length / 100) * seekingForFrameAtPercentage
    );
    seekingForFrameAtIndex =
      seekingForFrameAtIndex >= this.frames.length
        ? this.frames.length - 1
        : seekingForFrameAtIndex;
    /* console.log(
      `Seeking frame at index ${seekingForFrameAtIndex} of a total of ${this.frames.length}`
    ); */
    // console.log('Seeked Frame: ', this.frames[seekingForFrameAtIndex]);

    this.seekedMediaTime = (seekingForFrameAtPercentage / 100) * videoDuration;
    // console.log('Seeked Media Time at Duration: ', this.seekedMediaTime);

    this.printFrameToScreen(this.frames[seekingForFrameAtIndex]);
    // console.groupEnd();
  }

  private printFrameToScreen(frameSource: string): void {
    this.preview.width = this.player.videoWidth;
    this.preview.height = this.player.videoHeight;
    const context = this.preview.getContext('2d');

    const image = new Image();
    image.onload = () => {
      context?.drawImage(image, 0, 0);
      this.preview.style.visibility = 'visible';
    };
    image.src =
      frameSource ||
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  }
}
