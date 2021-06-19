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

  private onError(ev) {
    this._app.emit('error', ev);
  }

  private onEnded(ev) {
    this._app.emit('ended', ev);
  }

  private onTimeUpdate(ev) {
    this._app.emit('timeupdate', ev);
  }

  private onCanPlay(ev) {
    this._app.emit('canplaythrough', ev);
  }

  private onLoadedData(ev) {
    this._app.emit('loadeddata', ev);
  }

  private onPlay(ev) {
    this._app.emit('play', ev);
  }

  private onPause(ev) {
    this._app.emit('pause', ev);
  }

}