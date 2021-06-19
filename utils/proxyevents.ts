export default class ProxyEvents {
  _app: any;
  destory: Function;

  constructor(app: any) {
    this._app = app;
    this.destory = this.bindEvents();
  }

  bindEvents() {
    this._app._media.addEventListener('error', this.onError);
    this._app._media.addEventListener('ended', this.onEnded);
    this._app._media.addEventListener('timeupdate', this.onTimeUpdate);
    this._app._media.addEventListener('canplaythrough', this.onCanPlay);
    this._app._media.addEventListener('loadeddata', this.onLoadedData);
    this._app._media.addEventListener('play', this.onPlay);
    this._app._media.addEventListener('pause', this.onPause);

    return () => {
      this._app._media.removeEventListener('error', this.onError);
      this._app._media.removeEventListener('ended', this.onEnded);
      this._app._media.removeEventListener('timeupdate', this.onTimeUpdate);
      this._app._media.removeEventListener('canplaythrough', this.onCanPlay);
      this._app._media.removeEventListener('loadeddata', this.onLoadedData);
      this._app._media.removeEventListener('play', this.onPlay);
      this._app._media.removeEventListener('pause', this.onPause);
    }
  }

  private onError = (ev) => {
    const currentTime = this._app.currentTime;
    const duration = this._app.duration;
    const playing = this._app.playing;
    this._app.emit('error', { ...ev, currentTime, duration, playing });
  }

  private onEnded = (ev) => {
    const currentTime = this._app.currentTime;
    const duration = this._app.duration;
    const playing = this._app.playing;
    this._app.emit('ended', { ...ev, currentTime, duration, playing });
  }

  private onTimeUpdate = (ev) => {
    const currentTime = this._app.currentTime;
    const duration = this._app.duration;
    const playing = this._app.playing;
    this._app.emit('timeupdate', { ...ev, currentTime, duration, playing });
  }

  private onCanPlay = (ev) => {
    const currentTime = this._app.currentTime;
    const duration = this._app.duration;
    const playing = this._app.playing;
    this._app.emit('canplaythrough', { ...ev, currentTime, duration, playing });
  }

  private onLoadedData = (ev) => {
    const currentTime = this._app.currentTime;
    const duration = this._app.duration;
    const playing = this._app.playing;
    this._app.emit('loadeddata', { ...ev, currentTime, duration, playing });
  }

  private onPlay = (ev) => {
    const currentTime = this._app.currentTime;
    const duration = this._app.duration;
    const playing = this._app.playing;
    this._app.emit('play', { ...ev, currentTime, duration, playing });
  }

  private onPause = (ev) => {
    const currentTime = this._app.currentTime;
    const duration = this._app.duration;
    const playing = this._app.playing;
    this._app.emit('pause', { ...ev, currentTime, duration, playing });
  }

}