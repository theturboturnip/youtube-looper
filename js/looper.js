console.log("loaded looper.js");

var player;
var playlist=[];
var currentPlaylistIndex;
var loadedYouTubeAPI=false;
var channelLimit={},requiredKeyword="",sortType="",searchTerm,channelSearchTerm,channelUploadsPlaylist;
var pages=0,maxPages=20;
var numberRegex=/(\d+)/;
var seasonRegex=/[sS](eason)?(\s+)?(\d+)/;//"[sS](eason)?\\s"+numberRegex;
var episodeRegex=/[eE]p?(isode|\.)?(\s+)?(\d+)/;
var partRegex=/[pP](ar)?[tT]?(\s+)?(\d+)/;
var chapterRegex=/[cC]([hH])?(apter)?(\s)?(\d+)/;
var currentVideoID=null;

function setMessage(msg){
	document.getElementById("message").innerHTML=msg;
}

function constructPlaylist(){
	console.log(currentVideoID);
	if (currentVideoID!=null){
		console.log("Using initial video");
		createPlayer(currentVideoID);
		//player.loadVideoById(currentVideoID);
		document.getElementById("currentPlaylistIndex").value=currentPlaylistIndex;
	}

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
	//searchTerm=document.getElementById("searchTerm").value;
	requiredKeyword=document.getElementById("requiredKeyword").value;
	sortType=document.getElementById("sortType").value;
	var videoCount=parseInt(document.getElementById("videoCount").value);
	if (videoCount<=0) maxPages=-1;
	else maxPages=Math.max(1,videoCount/50);
	console.log(sortType,maxPages);
	playlist=[];

	getChannelDetails(channelLimit.id.channelId,function(response){
		console.log(response);
		channelUploadsPlaylist=response.items[0].contentDetails.relatedPlaylists.uploads;
		var initialSearchData={
			playlistId : channelUploadsPlaylist,
			maxResults : 50,
		}

		searchPlaylist(initialSearchData,addResponseToPlaylist);
	})
}

function addResponseToPlaylist(response){
	//console.log("Added response");
	playlist=playlist.concat(response.items);
	pages+=1;
	setMessage("Found Page "+pages);

	if (response.nextPageToken==null || (pages>=maxPages&&maxPages!=-1) ){
		randomizePlaylist();
		return;
	}
	var nextSearchData={
		playlistId : channelUploadsPlaylist,
		maxResults : 50,
		pageToken : response.nextPageToken,
		order:sortType
	}
	searchPlaylist(nextSearchData,addResponseToPlaylist);
}

function randomizePlaylist(){
	console.log(playlist.length);
	setMessage("Randomizing Playlist");
	var oldPlaylist=playlist.slice(0);
	playlist=[];
	for(var i=0;i<oldPlaylist.length;i++){
		if (!oldPlaylist[i].snippet.title.includes(requiredKeyword)) continue;
		if (sortType=="title" && ((oldPlaylist[i].snippet.title.search(episodeRegex)==-1&&oldPlaylist[i].snippet.title.search(chapterRegex)==-1)||oldPlaylist[i].snippet.title.search(seasonRegex)==-1)) continue; //Remove item if it isn't an episode
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
	}else if (sortType=="title"){
		for (var episodeIndex in playlist){
			var episode=playlist[episodeIndex];
			var title=episode.snippet.title;

			var seasonMatch=title.match(seasonRegex),seasonNumber=-1;
			if (seasonMatch!=null) seasonNumber=parseFloat(seasonMatch[0].match(numberRegex)[0]);

			var episodeMatch=title.match(episodeRegex),episodeNumber=-1;
			if (episodeMatch!=null) episodeNumber=parseFloat(episodeMatch[0].match(numberRegex)[0]);

			var chapterMatch=title.match(chapterRegex);
			if (chapterMatch!=null&&episodeNumber==-1) episodeNumber=parseFloat(chapterMatch[0].match(numberRegex)[0]);

			var partMatch=title.match(partRegex),partNumber=0;
			if (partMatch!=null) partNumber=parseFloat(partMatch[0].match(numberRegex)[0]);

			episode.showPosition={seasonNumber,episodeNumber,partNumber};
		}
		playlist.sort(function(a,b){
			if (a.showPosition.seasonNumber==b.showPosition.seasonNumber){
				if (a.showPosition.episodeNumber==b.showPosition.episodeNumber)
					return a.showPosition.partNumber-b.showPosition.partNumber;
				return a.showPosition.episodeNumber-b.showPosition.episodeNumber;
			}
			return a.showPosition.seasonNumber-b.showPosition.seasonNumber;
		})
	}

	console.log(currentPlaylistIndex,playlist.length);
	setMessage("Done!");

	if (player==null){
		createPlayer();
		applyPlaylistCookie();
	}else if (currentVideoID==null)
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

function changePlaylistIndex(){
	currentPlaylistIndex=parseInt(document.getElementById("currentPlaylistIndex").value);
	applyPlaylistToSite();
}

function applyPlaylistToSite(){
	setMessage("");
	console.log(playlist[currentPlaylistIndex].contentDetails.videoId);
	currentVideoID=playlist[currentPlaylistIndex].contentDetails.videoId;
	player.loadVideoById(currentVideoID,0,"large");
	document.getElementById("currentPlaylistIndex").value=currentPlaylistIndex;
	applyPlaylistCookie();
	//document.getElementById("next").src=playlist[playlist.length-1].snippet.thumbnails.default.url;
}

function applyPlaylistCookie(){
	setCookies({
		"cookieVersion":"1.1",
		"channelSearchTerm":channelSearchTerm,
		"searchTerm":searchTerm,
		"requiredKeyword":requiredKeyword,
		"sortType":sortType,
		"index":currentPlaylistIndex,
		"currentVideoID":currentVideoID,
		"pageCount":maxPages
	});
}

function onYouTubeIframeAPIReady() {
	if (playlist.length>0) createPlayer();
	
	//document.getElementById("searchButton").disabled=false;
	//document.getElementById("nextButton").disabled=false;
}

function createPlayer(videoID){
	if (player!=null) return;
    if (videoID==null) videoID=playlist[currentPlaylistIndex].contentDetails.videoId;
	player = new YT.Player('player', {
		height: '100%',
		width: '100%',
		videoId: videoID,
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
