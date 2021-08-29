# Angular Video Player

This project contains:

- `VideoPlayerComponent`: Built with custom controls. Takes in a `source` and auto plays it.
- `VideoService`: Exposing a `extractFramesFromVideo` method that takes in a video url and pre-renders snapshots from it at regular interval and returns an `Observable<Array<string>>`
- `TimePipe`: That transforms durations at several instances in the `VideoPlayerComponent`'s template into human readable strings in format `hh:mm:ss`

## Brief:

In order to display a preview frame for a video at a particular time duration, the client(the Angular App) would need a list of frames that could be taken by pre-rendering the video(ideally on the server). But since there's no server involved here, we'd need to pre-render the whole video on the client and extract frames from it.

In order to do that, the client needs to download the whole video file as a blob. But this should happen in the background while the video is still playing. In order to inform the users that the frames are loading in the background, they're displayed a message that reads `Generating Frames...` on the video controls.

Once the frames get generated, the message disappears and the user can hover over the video progress bar in order to peek at a frame and the time at the hovered position.

## Limitations:

- The Component is listening to the `mouseover` event on the `div` with the template variable `#timerWrapper`. But that doesn't fire when scrolling while inside the region surrounding the `div`. And so the user will have to `mouseout` of the `div` and `mouseover` again at a different location to peek at it's preview frame.
- The player isn't responsive as that would require different media urls for different device breakpoints(S/M/L). So that's not taken care of for simplicity's sake. That's the reason why the position of the preview frame might be visible at an ideal location when the App is viewed with DevTools ON.

## Technicals:

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.3.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
