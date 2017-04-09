console.log("loaded google_auth.js");

var API_KEY="AIzaSyBxbg2tZk5IO914xdCWBPEeCIyZi2UcLS4";

googleApiClientReady=function(){
	gapi.client.init({apiKey:API_KEY});
	gapi.client.load("youtube","v3",youtubeTest);
	//gapi.client.load("ytsubscribe","v3",youtubeTest);
}

youtubeTest=function(){
	console.log(gapi.client.youtube);
}

function search(data,onSearch){
	data.part='snippet';
	data.key=API_KEY;
	$.ajax({
		async:true,
		type: 'GET',
		url: 'https://www.googleapis.com/youtube/v3/search',
		data:data,
		success:onSearch
	})
}