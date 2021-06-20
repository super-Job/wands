# wands
A native audio and video player extension class, using less code to achieve more functions
### Author's own account
作者是个刚刚入行前端开发一年多的一个前端工作者,对计算机技术无比的热情,目前从事音视频领域的前端开发工作,遇到过很多疑问,包括现在也是,希望借着wands这个开源项目的机会,可以和众多开发者交流学习,同时也为社区生态做一点事情.由于刚刚进入行业不久,对很多技术的应用和开源的规范并不熟悉.也希望同行们可以多多建议
### Project brief
目前wands支持部分原生事件,并在此基础上,提供了额外的事件用来完善媒体播放的各种场景的需求.此外也提供了部分自定义API供您使用.我希望可以借此来简化音视频开发过程的额外操作,目前是个初步的构想,后面会逐步完善,敬请期待

### 安装

```
npm install -save wands
```

### react案例
我的目标是,只需要wands的一个实例,就可以完成播放的全部功能

```javascript
import React, { useRef, useState } from "react";
import Wands from "wands";

function Player(){
  const [wands,setWands] = useState(null);
  const [playing,setPlaying] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    const videoEle = video.current;
    if(!videoEle) return;

    const wands = new Wands(videoEle);
    setWands(wands);

    // 订阅playstatus事件,当媒体的播放状态发生改变时触发
    wands.on("playstatus",onPlayStatus);
    return () => {
      wands.destory();
    }

  },[]);

  function onPlayStatus(ev){
    const { playing } = ev;
    setPlaying(playing);
  }

  function toggle(){

    // 调用toggle方法 可以轻松实现播放暂停的功能
    wands.toggle();
  }

  return (
    <div>
      <button onClick={toggle}>{playing ? "暂停" : "播放"}</button>
      <video src="https://test.map4" ref={video}/>
    </div>
  )
}

```


# API
### wands.play
播放媒体
```javascript
const wands = new Wands(video) // 接收video或者audio的dom;

wands.play();
```

### wands.pause
暂停媒体
```javascript
const wands = new Wands(video); // 接收video或者audio的dom;

wands.pause()
```
### wands.toggle
播放与暂停来回切换

```javascript
const wands = new Wands(video); // 接收video或者audio的dom;

wands.toggle();
```


### wands.on
订阅事件
```javascript
const wands = new Wands(video); // 接收video或者audio的dom;

function onPlayStatus(ev){
  const { duration,playing,currentTime, ...nativeEventObj } = ev;
  // to do sth
}

wands.on("playstatus",onPlayStatus);

```

### wands.once
单次订阅,当事件被触发一次后,将不会再次触发
```javascript
const wands = new Wands(video); // 接收video或者audio的dom;

function onPlayStatus(ev){
  const { duration,playing,currentTime, ...nativeEventObj } = ev;
  // to do sth
}

wands.once("playstatus",onPlayStatus);

```

### wands.remove or wands.removeListener
取消订阅
```javascript
const wands = new Wands(video); // 接收video或者audio的dom;

function onPlayStatus(ev){
  const { duration,playing,currentTime, ...nativeEventObj } = ev;
  // to do sth
}

wands.on("playstatus",onPlayStatus);
// 取消订阅
wands.remove("playstatus",onPlayStatus); // 使用removeListener与remove相同

```

### wands.clear or wands.removeListenerAll
清空订阅, 全部事件将会被取消订阅
```javascript
const wands = new Wands(video); // 接收video或者audio的dom;

function onPlayStatus(ev){
  const { duration,playing,currentTime, ...nativeEventObj } = ev;
  // to do sth
}

wands.on("playstatus",onPlayStatus);
// 清空订阅
wands.clear(); // 使用removeListenerAll与clear相同

```

### wands.destory
清空代理事件,同时取消全部原生事件监听,此方法会取消代理事件的同时,将底层原生事件的监听一并取消. 所有事件监听会被彻底销毁(慎用)

```javascript
const wands = new Wands(video); // 接收video或者audio的dom;

function onPlayStatus(ev){
  const { duration,playing,currentTime, ...nativeEventObj } = ev;
  // to do sth
}

wands.on("playstatus",onPlayStatus);
// 取消订阅
wands.destory();

```

# 事件
所有代理事件的事件对象中,都加入了currentTime,duration,playing三个自定义属性,wands将全部暴露在外的时间,以及接收的时间规范为毫秒
### loadeddata
媒体加载完成第一帧,已经可以播放,在此事件,以及在其后触发的事件中可以取到有效的duration, 可以作为视频加载成功的标志;

### canplaythrough
媒体完全加载,与loadeddata的区别主要在于,此事件触发时,表示媒体已经加载完成,加载的数据足够满足播放到最后,无需额外的加载

### play
当媒体开始播放时触发

###  pause
当媒体暂停播放时触发

### ended
当媒体停止播放时触发, 因此事件为在代理事件的基础上,进行了扩展, 在设置了endTime时,播放到endTime会触发ended事件

### timeupdate
当媒体currentTime改变时,以及开始播放之后, 结束播放之前会被触发, 该事件也是基于原生事件进行了代理扩展, 播放时,提高了触发频率,将会以大约16ms每次的频率被触发.

### playstatus
当媒体播放状态发生变化时触发,比如播放 -> 暂停/结束; 暂停/结束 -> 播放的变化过程都会进行触发, 该事件为自定义事件

### error
当媒体出现错误时触发

# 属性
## 可读写属性(写入时间的属性,单位一律为毫秒)
startTime
播放的开始时间, 当被设置了一个有效时间后,每次播放将会从startTime开始播放,循环播放也将会从startTime开始新的循环

endTime
播放的结束时间, 当被设置了一个有效时间后,每次播放将会以endTime为结束时间,循环播放也将会从endTime结束当前的循环

currentTime
媒体播放的当前事件,当被设置了一个有效时间时,媒体会跳到该时间的位置

loop
循环播放,接收一个boolean

volume
媒体音量

range
播放速率

src
当前播放资源的资源地址

## 只读属性
duration
当前媒体的总时长

playing
当前媒体的播放状态

##### 当前为测试版本, 不建议生产环境使用

