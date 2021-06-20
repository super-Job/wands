import Observer from "../utils/observer";
import ProxyEvents from "../utils/proxyevents";

class Wands extends Observer {
  constructor(media) {
    super();
    if (!media) throw new Error(`${media} is not an HTMLVideoElement type or an HTMLAudioElement type parameter`);
    this._media = media;
    this._frameKey = null;
    this._startTime = NaN;
    this._endTime = NaN;
    this._proxy = new ProxyEvents(this);
    window.wands = this;
  }

  toggle() {
    if (!this.playing) this.play();
    else this.pause();
  }

  pause() {
    this._media.pause();
    this.cancelCheckProgresses();
  }

  play() {
    if (!isNaN(this.startTime)) {
      if (!isNaN(this.endTime) && this.endTime < this.duration && this.currentTime >= this.endTime - 16) {
        this.currentTime = this.startTime;
      } else if (this.currentTime >= this.duration) {
        this.currentTime = this.startTime;
      } else if (this.startTime >= this.currentTime) {
        this.currentTime = this.startTime;
      }
    } else {
      if (!isNaN(this.endTime) && this.endTime < this.duration && this.currentTime >= this.endTime - 16) {
        this.currentTime = 0;
      }
    }

    this._media.play();
    this.cancelCheckProgresses();
    this.checkProgresses();
  }

  checkProgresses() {
    if (!isNaN(this.endTime)) {
      if (this.endTime < this.duration && this.currentTime >= this.endTime - 16) {
        if (!this.loop) {
          this.pause();
          this.emit('ended', { playing: this.playing, currentTime: this.currentTime, duration: this.duration });
          return window.cancelAnimationFrame(this._frameKey)
        } else {
          this.play();
        }
      }
    } else if (!isNaN(this.startTime) && this.loop && this.currentTime >= this.duration - 32) {
      this.currentTime = this.startTime;
    }

    this.emit('timeupdate', { playing: this.playing, currentTime: this.currentTime, duration: this.duration });
    this._frameKey = window.requestAnimationFrame(this.checkProgresses.bind(this));
  }

  cancelCheckProgresses() {
    window.cancelAnimationFrame(this._frameKey);
  }

  removeListener(name, fn) {
    this.remove(name, fn);
  }

  removeListenerAll() {
    this.clear();
  }

  destory() {
    this.clear();
    this._proxy.destory();
  }

  set startTime(time) {
    this._startTime = !!time ? time : NaN;
  }

  get startTime() {
    return this._startTime;
  }

  set endTime(time) {
    this._endTime = !!time ? time : NaN;
  }

  get endTime() {
    return this._endTime;
  }

  set currentTime(time) {
    this._media.currentTime = time / 1000;
  }

  get currentTime() {
    return this._media.currentTime * 1000;
  }

  set loop(loop) {
    this._media.loop = loop;
  }

  get loop() {
    return this._media.loop;
  }

  set volume(vol) {
    this._media.volume = vol;
  }

  get volume() {
    return this._media.volume;
  }

  set src(url) {
    this._media.src = url;
  }

  get src() {
    return this._media.src;
  }

  set range(range) {
    this._media.playbackRate = range;
  }

  get range() {
    return this._media.playbackRate;
  }

  get duration() {
    return this._media.duration * 1000;
  }

  get playing() {
    return !this._media.paused && !this._media.ended;
  }


}

export default Wands;