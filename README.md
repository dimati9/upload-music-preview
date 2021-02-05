# Music preview play // v.0.01

## demo : https://amazing-projects.ru/projects/upload
## using:
### include theme.css // variable
### include upload.js
###  upload(selector, params = {});
##### upload('#file', {  
    multi: true,
    accept: ['.mp3', '.wav', '.ogg'],
    trackClass: "music-track",
    playerId: "audio-player",
  })


#### params: name / type / default
##### multi: bool: false
##### accept: array: ['.mp3', '.ogg']
##### trackClass: string: "music-track"
##### playerId: string: "audio-player"
##### playerShow: bool: true
##### volume: float: 0.2


