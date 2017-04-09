console.log("loaded looper.js");

var player;
var playlist=[];
var currentPlaylistIndex;
var loadedYouTubeAPI=false;
var channelLimit={},requiredKeyword="",sortType="",searchTerm,channelSearchTerm;
var pages=0,maxPages=20;

/*function getGoodItemFromResponse(response,required,oldVideoId){
	if (response.length==0) return null;
	var video=response.items[Math.floor(Math.random()*response.items.length)];
	var tries=0;

	while ((video==null || video==undefined || !video.snippet.title.includes(required) || video.id.videoId==oldVideoId)&& tries<response.items.length ){
		video=response.items[Math.floor(Math.random()*response.items.length)];
		tries+=1;
	}

	//console.log(video.id.videoId+","+oldVideoId);
	return video;
}*/

function setMessage(msg){
	document.getElementById("message").innerHTML=msg;
}

function constructPlaylist(){
	console.log(currentPlaylistIndex);
	channelLimit="";
	channelSearchTerm=document.getElementById("channelSearchTerm").value;
	setMessage("Beginning search");

	if (channelSearchTerm!=""){
		var channelSearchData={
			type : 'channel',
			order : 'viewCount',
			q : channelSearchTerm,
			maxResults : 1
		}

		search(channelSearchData,function(response){
			console.log("yo");
			resetChannelLimit();
			channelLimit=response.items[0];//.id.channelId;
			//console.log("Found Channel "+channelLimit);
			setMessage("Found Channel "+channelLimit);
			pages=0;
			compileVideoList();
			/*var options = {
				'channelId': channelLimit,
				'layout': 'full',
			};
			//gapi.ytsubscribe.render(document.getElementById("limitingChannel"), options);*/
		});
	}else{
		//Do error
		setMessage("Error: No channel specified");
	}
}

function compileVideoList(){
	console.log("Compiling list");
	searchTerm=document.getElementById("searchTerm").value;
	requiredKeyword=document.getElementById("requiredKeyword").value;
	sortType=document.getElementById("sortType").value;
	console.log(sortType);
	playlist=[];

	var initialSearchData={
		type : 'video',
		q : searchTerm,
		maxResults : 50,
		channelId : channelLimit.id.channelId,
		order:sortType
	}

	search(initialSearchData,addResponseToPlaylist);
}

function addResponseToPlaylist(response){
	//console.log("Added response");
	playlist=playlist.concat(response.items);
	pages+=1;
	setMessage("Found Page "+pages);

	if (response.nextPageToken==null || pages>=maxPages){
		randomizePlaylist();
		return;
	}
	var nextSearchData={
		type : 'video',
		q : searchTerm,
		maxResults : 50,
		channelId : channelLimit.id.channelId,
		pageToken : response.nextPageToken,
		order:sortType
	}
	search(nextSearchData,addResponseToPlaylist);
}

function randomizePlaylist(){
	console.log(playlist.length);
	setMessage("Randomizing Playlist");
	var oldPlaylist=playlist.slice(0);
	playlist=[];
	for(var i=0;i<oldPlaylist.length;i++){
		if (oldPlaylist[i].snippet.title.includes(requiredKeyword))
			playlist.push(oldPlaylist[i]);
	}

	console.log(playlist.length);
	if (sortType=="relevance"){
		//Durstenfeld shuffle
		for (var i = playlist.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = playlist[i];
			playlist[i] = playlist[j];
			playlist[j] = temp;
		}
		currentPlaylistIndex=Math.floor(Math.random()*(playlist.length));
	}else if (sortType=="date"){
		playlist.reverse();
	}

	console.log(currentPlaylistIndex,playlist.length);
	setMessage("Done!");

	if (player==null){
		createPlayer();
		applyPlaylistCookie();
	}else
		applyPlaylistToSite();
}

function resetChannelLimit(){
	channelLimit={};
	/*var element=document.getElementById("limitingChannel");
	element.innerHTML="";
	var errorTables=document.getElementsByClassName(" gc-bubbleDefault pls-container");
	if (errorTables.length>0)
		errorTables[0].parentNode.parentNode.removeChild(errorTables[0].parentNode);*/
}

function nextVideo(){
	currentPlaylistIndex+=1;
	if (currentPlaylistIndex>=playlist.length) currentPlaylistIndex-=playlist.length;
	applyPlaylistToSite();
}

function previousVideo(){
	currentPlaylistIndex-=1;
	if (currentPlaylistIndex<0) currentPlaylistIndex+=playlist.length;
	applyPlaylistToSite();
}

function applyPlaylistToSite(){
	setMessage("");
	player.loadVideoById(playlist[currentPlaylistIndex].id.videoId,0,"large");

	applyPlaylistCookie();
	//document.getElementById("next").src=playlist[playlist.length-1].snippet.thumbnails.default.url;
}

function applyPlaylistCookie(){
	setCookies({
		"cookieVersion":"1.0",
		"channelSearchTerm":channelSearchTerm,
		"searchTerm":searchTerm,
		"requiredKeyword":requiredKeyword,
		"sortType":sortType,
		"index":currentPlaylistIndex
	});
}

function onYouTubeIframeAPIReady() {
	if (playlist.length>0) createPlayer();
	
	//document.getElementById("searchButton").disabled=false;
	//document.getElementById("nextButton").disabled=false;
}

function createPlayer(){
	if (player!=null) return;
	player = new YT.Player('player', {
		height: '100%',
		width: '100%',
		videoId: playlist[currentPlaylistIndex].id.videoId,
		modestBranding: 1,
		rel: 0,

		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	if (playlist.length==0) return;
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		nextVideo();
	}
}

function stopVideo() {
	player.stopVideo();
}