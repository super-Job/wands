class ProxyEvents {

  constructor(app) {
    this._app = app;
    this.destory = this.bindEvents();
  }

  bindEvents() {
    let _app = this._app;

    function onError(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;
      const playing = _app.playing;
      _app.emit('error', { ...ev, currentTime, duration, playing });
    }

    function onEnded(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;

      _app.cancelCheckProgresses();
      _app.emit('ended', { ...ev, currentTime, duration, playing: false });
      _app.emit('playstatus', { ...ev, currentTime, duration, playing: false });
    }

    function onTimeUpdate(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;
      const playing = _app.playing;
      _app.emit('timeupdate', { ...ev, currentTime, duration, playing });
    }

    function onCanPlay(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;
      const playing = _app.playing;
      _app.emit('canplaythrough', { ...ev, currentTime, duration, playing });
    }

    function onLoadedData(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;
      const playing = _app.playing;
      _app.emit('loadeddata', { ...ev, currentTime, duration, playing });
    }

    function onPlay(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;
      _app.emit('play', { ...ev, currentTime, duration, playing: true });
      _app.emit('playstatus', { ...ev, playing: true, currentTime, duration });
    }

    function onPause(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;
      _app.emit('playstatus', { ...ev, playing: false, currentTime, duration })
      _app.emit('pause', { ...ev, currentTime, duration, playing: false });
    }


    function onComplete(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;
      const playing = _app.playing;
      _app.emit('complete', { ...ev, currentTime, duration, playing });
    }

    function onDurationChange(ev) {
      const currentTime = _app.currentTime;
      const duration = _app.duration;
      const playing = _app.playing;
      _app.emit('durationchange', { ...ev, currentTime, duration, playing });
    }

    this._app._media.addEventListener('error', onError);
    this._app._media.addEventListener('ended', onEnded);
    this._app._media.addEventListener('timeupdate', onTimeUpdate);
    this._app._media.addEventListener('canplaythrough', onCanPlay);
    this._app._media.addEventListener('loadeddata', onLoadedData);
    this._app._media.addEventListener('play', onPlay);
    this._app._media.addEventListener('pause', onPause);
    this._app._media.addEventListener('complete', onComplete);
    this._app._media.addEventListener('durationchange', onDurationChange);

    return () => {
      this._app._media.removeEventListener('error', onError);
      this._app._media.removeEventListener('ended', onEnded);
      this._app._media.removeEventListener('timeupdate', onTimeUpdate);
      this._app._media.removeEventListener('canplaythrough', onCanPlay);
      this._app._media.removeEventListener('loadeddata', onLoadedData);
      this._app._media.removeEventListener('play', onPlay);
      this._app._media.removeEventListener('pause', onPause);
      this._app._media.removeEventListener('complete', onComplete);
      this._app._media.removeEventListener('durationchange', onDurationChange);
    }
  }
}

export default ProxyEvents;