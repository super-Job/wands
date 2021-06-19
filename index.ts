import Observer from "./utils/observer";
import ProxyEvents from "./utils/proxyevents";
import { WandsProps } from './types';

class Wands extends Observer {
  _media: HTMLVideoElement | HTMLAudioElement;
  _proxy: ProxyEvents;
  _frameKey: any;
  _startTime: number;
  _endTime: number;

  constructor(args: WandsProps) {
    super();
    const { media } = args;
    if (!media) throw new Error(`${media} is not an HTMLVideoElement type or an HTMLAudioElement type parameter`);
    this._media = media;
    this._frameKey = null;
    this.startTime = NaN;
    this.endTime = NaN;
    this._proxy = new ProxyEvents(this);
  }

  public toggle() {
    if (!this.playing) this.play();
    else this.pause();
  }

  public pause() {
    this._media.pause();
  }

  public play() {
    if (this.currentTime >= this.endTime && !isNaN(this.startTime)) {
      this.currentTime = this.startTime;
    }

    this._media.play();

    window.cancelAnimationFrame(this._frameKey);
    this.checkProgresses();
  }

  public removeListener(name: string, fn: Function) {
    this.remove(name, fn);
  }

  public removeListenerAll() {
    this.clear();
  }

  public destory() {
    this.clear();
    this._proxy.destory();
  }

  private checkProgresses() {
    const { duration, currentTime, playing } = this;

    if (!isNaN(this.endTime)) {
      if (this.endTime < duration && this, currentTime >= this.endTime) {
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

    this._frameKey = window.requestAnimationFrame(this.checkProgresses);
  }

  set startTime(time: number) {
    this._startTime = time;
  }

  get startTime() {
    return this._startTime;
  }

  set endTime(time: number) {
    this._endTime = time;
  }

  get endTime() {
    return this._endTime;
  }

  set currentTime(time: number) {
    this._media.currentTime = time / 1000;
  }

  get currentTime() {
    return this._media.currentTime * 1000;
  }

  set loop(loop: boolean) {
    this._media.loop = loop;
  }

  get loop() {
    return this._media.loop;
  }

  set volume(vol: number) {
    this._media.volume = vol;
  }

  get volume() {
    return this._media.volume;
  }

  set src(url: string) {
    this._media.src = url;
  }

  get src() {
    return this._media.src;
  }

  get duration() {
    return this._media.duration;
  }

  get playing() {
    return !this._media.pause && !this._media.ended;
  }


}

export default Wands;