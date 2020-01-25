const getVideo = () => document.getElementById('video');

const play = () => {
  const video = getVideo();
  video.play();
};

const pause = () => {
  const video = getVideo();
  video.pause();
};

const stop = () => {
  const video = getVideo();

  const objVideo = getStorage('video');
  objVideo.desc.push('Video load aborted');
  objVideo.time.push(video.currentTime);
  objVideo.volume.push(video.volume);
  setStorage('video', objVideo);

  video.load();
};

const volume = () => {
  let volume = document.getElementById('volume').value;
  console.log('aqui vol value', volume.length);
  if (volume === '100') {
    volume = 1;
  } else {
    volume = parseFloat(`0.${volume}`).toFixed(1);
    console.log('aqui', volume);
  }
  const video = getVideo();
  video.volume = volume;
};

const muted = () => {
  const video = getVideo();
  const mut = document.getElementById('muted');
  if (video.muted) {
    video.muted = false;
    mut.style.color = 'black';
  } else {
    video.muted = true;
    mut.style.color = 'red';
  }
};

getVideo().oncanplay = function () {
  const list = getStorage('listVideo');
  setTable(list);
};

const full = () => {
  const video = getVideo();
  video.requestFullscreen();
};

getVideo().onplay = () => {
  if (getVideo().currentTime === 0) {
    setStorage('video', { desc: ['The video has started play'], time: [0], volume: [getVideo().volume] });
  } else {
    const objVideo = getStorage('video');
    objVideo.desc.push('else The video has started play');
    objVideo.time.push(getVideo().currentTime);
    objVideo.volume.push(getVideo().volume);
    setStorage('video', objVideo);
  }
};

getVideo().onpause = () => {
  console.log('The video onpause');

  const objVideo = getStorage('video');
  objVideo.desc.push('else The video has been pausse');
  objVideo.time.push(getVideo().currentTime);
  objVideo.volume.push(getVideo().volume);
  setStorage('video', objVideo);
};

getVideo().onabort = () => {
  console.log('The video stop');

  const objVideo = getStorage('video');
  setStorage('video', {});

  let listVideo = getStorage('listVideo');

  if (!listVideo.length) {
    listVideo = [];
  }

  listVideo.push(objVideo);
  setStorage('listVideo', listVideo);
};

getVideo().onvolumechange = () => {
  console.log('The volume has been change');

  const objVideo = getStorage('video');
  objVideo.desc.push('The volume has been change');
  objVideo.time.push(getVideo().currentTime);
  objVideo.volume.push(getVideo().volume);
  setStorage('video', objVideo);
};

setStorage = (id, list) => {
  localStorage.setItem(id, JSON.stringify(list));
};

getStorage = (id) => {
  const storage = localStorage.getItem(id);
  if (storage) {
    return JSON.parse(storage);
  }
  return {};
};


setTable = (list) => {
  let table = '<thead><tr><td>...</td><td>Desc</td><td>Time</td><td>Volume</td></tr></thead><tbody>';
  for (const k in list) {
    table += `<tr><td>${k}</td>`;
    let desc = '';
    let time = '';
    let volume = '';
    for (const j in list[k].desc) {
      desc += `<p>${list[k].desc[j]}</p>`;
      time += `<p>${formatTime(list[k].time[j])}</p>`;
      volume += `<p>${list[k].volume[j]}</p>`;
    }
    table += `<td>${desc}</td>`;
    table += `<td>${time}</td>`;
    table += `<td>${volume}</td>`;
    table += '</tr></tbody>';
  }

  document.getElementById('tableList').innerHTML = table;
};

const formatTime = (time) => {
  let second = parseInt(time % 60);
  const minAux = time / 60;
  const minute = parseInt(minAux % 60);
  const hour = parseInt(minAux / 60);

  if (second < 10) {
    second = `0${second}`;
  }

  return `${hour}:${minute}:${second}`;
};
