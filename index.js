import Observer from "./utils/observer";
import ProxyEvents from "./utils/proxyevents";

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
  }

  play() {
    if (this.currentTime >= this.endTime && !isNaN(this.startTime)) {
      this.currentTime = this.startTime;
    }

    this._media.play();

    this.cancelCheckProgresses();
    this.checkProgresses();
  }

  checkProgresses() {
    const duration = this.duration;
    const currentTime = this.currentTime;
    const playing = this.playing;

    if (!isNaN(this.endTime)) {
      if (this.endTime < duration && this.currentTime >= this.endTime) {
        if (!this.loop) {
          this.pause();
          this.emit('ended', {});
        } else {
          this.currentTime = !isNaN(this.startTime) ? this.startTime : 0;
          this.play();
        }
      }

      if (this.endTime >= duration && this.currentTime >= this.endTime - 50) {
        if (this.loop) {
          this.currentTime = this.currentTime;
          this.play();
        }
      }
    }

    this.emit('timeupdate', { playing, currentTime, duration });

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
    this._startTime = time;
  }

  get startTime() {
    return this._startTime;
  }

  set endTime(time) {
    this._endTime = time;
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

  get duration() {
    return this._media.duration;
  }

  get playing() {
    return !this._media.paused && !this._media.ended;
  }


}

export default Wands;