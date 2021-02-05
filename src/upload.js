function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (!bytes) {
    return '0 Byte'
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag)

  if (classes.length) {
    node.classList.add(...classes)
  }

  if (content) {
    node.textContent = content
  }

  return node
}

function noop() {}

function upload(selector, options = {}) {
  let files = []
  const onUpload = options.onUpload ?? noop
  const input = document.querySelector(selector)
  const preview = element('div', ['preview'])
  const open = element('button', ['btn'], 'Открыть')
  const upload = element('button', ['btn', 'primary'], 'Загрузить')
  upload.style.display = 'none'

  console.log(options);
  if (options.multi) {
    input.setAttribute('multiple', true)
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }

  if(options.trackClass) {
    var trackClass = options.trackClass;
  } else {
    var trackClass = "music-track";
  }

  if(options.playerId) {
    var playerId = options.playerId;
  } else {
    var playerId = "audio-player";
  }

  if(options.playerShow === false) {
    var playerShow = false;
  } else {
    var playerShow = true;
  }

  if(options.volume && options.volume > 0.1 && options.volume <= 1) {
    var volume = options.volume;
  } else {
    var volume = 0.2;
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', upload)
  input.insertAdjacentElement('afterend', open)

  const triggerInput = () => input.click()

  const playTrack = function(event) {
    console.log(event.target);
    var player = document.getElementById(playerId);
    var track = event.target.dataset.src;
    player.volume = volume;
    player.setAttribute("src", track);
    player.play();
  }

  const stopTrack = () => {
    var player = document.getElementById(playerId);
    player.pause();
    player.currentTime = 0;
  }

  const data = [];

  const changeHandler = event => {
    if (!event.target.files.length) {
      return
    }

    files = Array.from(event.target.files)
    preview.innerHTML = ''
    upload.style.display = 'inline'

    files.forEach(file => {
      if (!file.type.match('audio')) {
        return
      }
      console.log(file);

      var fileReader  = new FileReader;
      fileReader.readAsArrayBuffer(file);

      var url = URL.createObjectURL(file);
      data.push([url, file.name]);
    })

    var tempVideoEl = document.createElement("audio");
    tempVideoEl.setAttribute("controls", "controls");
    tempVideoEl.setAttribute("id", playerId);
    if(!playerShow) {
      tempVideoEl.style.display = "none";
    }
    var musics = `<div class="musics">`
    data.forEach((value,i) => {
      musics += `<span class="buttons-tracks"><button class="btn btn-primary btn-track ${trackClass}" data-src="${value[0]}">${value[1]}</button><button data-id="${i}" data-name="${value[1]}" class="remove-track">X</button></span>`;
    });
    musics += `</div>`;


    var musicElement = document.createElement("div");
    musicElement.innerHTML = musics;

    var canvas = document.querySelector(".card");
    canvas.appendChild(tempVideoEl);
    canvas.appendChild(musicElement);

    var item = document.getElementsByClassName(trackClass);
    for (var i = 0; i < item.length; i++) {
      item[i].addEventListener("click", playTrack);
    }

    var item = document.getElementsByClassName("remove-track");
    for (var i = 0; i < item.length; i++) {
      item[i].addEventListener("click", removeHandler);
    }
    // document.querySelector(".music-track").addEventListener('click', playTrack);
  }



  const removeHandler = event => {
    if (!event.target.dataset.name) {
      return
    }

    const {name} = event.target.dataset
    const {id} = event.target.dataset
    files = files.filter(file => file.name !== name)
    data.forEach((value, i) => {

      if(value[1] == name) {
        data.splice(i, 1);
        console.clear();
        console.log(value[1]);
        console.log(name);
        console.log(i);
      }
    });

    console.log(data);

    if (!files.length) {
      upload.style.display = 'none'
      stopTrack();
    }

        setTimeout(() => event.target.parentElement.remove(), 300)
  }

  const clearPreview = el => {
    el.style.bottom = '4px'
    el.innerHTML = '<div class="preview-info-progress"></div>'
  }

  const uploadHandler = () => {
    preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
    const previewInfo = preview.querySelectorAll('.preview-info')
    previewInfo.forEach(clearPreview)
    onUpload(files, previewInfo)
  }

  open.addEventListener('click', triggerInput)
  input.addEventListener('change', changeHandler)
  preview.addEventListener('click', removeHandler)
  upload.addEventListener('click', uploadHandler)
}