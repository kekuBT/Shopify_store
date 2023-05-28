let tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let yt_players = {};

function onYouTubeIframeAPIReady() {
  yt_players['1-5'] = new YT.Player('ytplayer_static', {events: {'onReady': onPlayerReady}});
}

function onPlayerReady(event) {
  event.target.playVideo();
}