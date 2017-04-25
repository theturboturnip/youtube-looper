console.log("loaded init_page.js");

window.onload=function(evt){
	var inputParent=document.getElementById("input-parent");
	var channelSearchTermInput=appendTextInput(inputParent,"channelSearchTerm","Channel");
	appendLineBreak(inputParent);
	//var searchTermInput=appendTextInput(inputParent,"searchTerm","Search Term");
	//appendLineBreak(inputParent);
	var requiredKeywordInput=appendTextInput(inputParent,"requiredKeyword","Keyword");
	appendLineBreak(inputParent);
	var sortTypeInput=appendSelection(inputParent,"sortType",{"relevance":"Random","date":"Date","title":"TV Series"});
	appendLineBreak(inputParent);
	var videoCountInput=appendTextInput(inputParent,"videoCount","Maximum Video Count","\\d+?","Value is not a number!");
	appendLineBreak(inputParent);
	appendButton(inputParent,"searchButton","L∞p","currentPlaylistIndex=0;currentVideoID=null;constructPlaylist();");

	var playerInputParent=document.getElementById("player-input-parent");
	appendButton(playerInputParent,"prevButton","Previous","previousVideo()").setAttribute("style","float:left;display:inline-block;");
	var indexDiv=createElementWithAttr("div",
									   "",
									   {
									   		"id":"indexDiv",
									   		"style":"display:inline-block;float:center;width:25%;"
									   },
									   "");
	playerInputParent.appendChild(indexDiv);
	var playlistIndexInput=appendTextInput(indexDiv,"currentPlaylistIndex","","\\d+?","Value is not a number!");
	playlistIndexInput.setAttribute("onchange","changePlaylistIndex()");
	//playlistIndexInput.setAttribute("style","position:relative;left:0%;width:flex;display:inline-block;height:50px");
	/*var playlistLength=createElementWithAttr("div",
											 "playlistLength",
											 {
											 	"style":"position:relative;right:0%;width:100px;display:inline-block;height:50px;"
											 },"/?");*/
	//playerInputParent.appendChild(playlistLength);
	appendLineBreak(indexDiv);
	//appendButton(indexDiv,"debugButton","Debug","console.log(playlist[currentPlaylistIndex]);")
	//appendButton(indexDiv,"changePlaylistButton","Go","changePlaylistIndex()");
	appendButton(playerInputParent,"nextButton","Next","nextVideo()").setAttribute("style","float:right;display:inline-block;");
	var debugDiv=createElementWithAttr("div","",{
		"id":"message",
		"style":"float:center;"
	},"");
	indexDiv.appendChild(debugDiv);

	var cookieData=loadCookies();
	/*console.log(cookieData);
	for(var key in cookieData)
		console.log(key);*/
	
	if (cookieData["cookieVersion"]=="1.1"){
		console.log("Valid cookie found");

		channelSearchTermInput.value=cookieData["channelSearchTerm"];
		console.log(channelSearchTermInput.value);
		//searchTermInput.value=cookieData["searchTerm"];
		requiredKeywordInput.value=cookieData["requiredKeyword"];
		sortTypeInput.value=cookieData["sortType"];
		currentVideoID=cookieData["videoId"];
		currentPlaylistIndex=parseInt(cookieData["index"]);
		videoCountInput.value=parseInt(cookieData["pageCount"]*50);
		console.log("Cookie applied");
		constructPlaylist();
	}
}

function appendTextInput(parentNode,id,printName,pattern,errorText){
	if (pattern==null) pattern=".+";
	if (errorText==null) errorText="Invalid Input";
	var textNode=document.createElement("div");
	textNode.className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
	var label=createElementWithAttr("label",
									"mdl-textfield__label",
									{
										"for":id
									},
									printName);
	textNode.appendChild(label);
	var input=createElementWithAttr("input",
									"mdl-textfield__input",
									{
										"id":id,
										"type":"text",
										"pattern":pattern
									},
									"");
	var error=createElementWithAttr("span",
									"mdl-textfield__error",
									{},
									errorText);

	textNode.appendChild(input);
	parentNode.appendChild(textNode);
	return input;
}

function appendSelection(parentNode,id,options){
	var topNode=createElementWithAttr("div","mdl-textfield mdl-js-textfield mdl-select mdl-js-select mdl-select-floating-label",{},"");

	var selectNode=createElementWithAttr("select",
										 "mdl-textfield__input",
										 {
										 	"id":id,
										 	"name":id
										 },
										 "");
	for(var option in options){
		if (!options.hasOwnProperty(option)) continue;
		var optNode=document.createElement("option");
		optNode.setAttribute("value",option);
		optNode.innerHTML=options[option];
		selectNode.appendChild(optNode);
	}
	topNode.appendChild(selectNode);
	parentNode.appendChild(topNode);
	return selectNode;
}

function appendButton(parentNode,id,printName,onclick){
	var buttonNode=createElementWithAttr("button",
										 "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect",
										 {
										 	"id":id,
										 	"onclick":onclick
										 },
										 printName);

	parentNode.appendChild(buttonNode);
	return buttonNode;
}

function createElementWithAttr(type,className,attrs,inner){
	var node=document.createElement(type);
	node.className=className;
	for(var attr in attrs){
		if (!attrs.hasOwnProperty(attr)) continue;
		node.setAttribute(attr,attrs[attr]);
	}
	node.innerHTML=inner;
	//console.log(node.innerHTML);
	return node;
}

function appendLineBreak(parentNode){
	parentNode.appendChild(document.createElement("br"));
}

/*<!--<table id="input" style="left:65%;right:1%;position:absolute;text-align:center">
				<button id="searchButton" onclick="constructPlaylist()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" >L∞p</button>
			
		<tr>
			<th>
				<div class="mdl-textfield mdl-js-textfield">
					<input class="mdl-textfield__input" type="text" id="searchTerm">
					<label class="mdl-textfield__label" for="searchTerm">Search Term...</label>
				</div>
			</th>
			<th>
				<div class="mdl-textfield mdl-js-textfield">
					<input class="mdl-textfield__input" type="text" id="requiredKeyword">
					<label class="mdl-textfield__label" for="requiredKeyword">Required Term...</label>
				</div>
			</th>
		</tr>
		<tr>
			<th>
				<div class="mdl-textfield mdl-js-textfield" >
					<label class="mdl-textfield__label" for="channelSearch">Channel...</label>
					<input class="mdl-textfield__input" type="text" id="channelSearch">
				</div>
			</th>
			<th>
				<div class="mdl-textfield mdl-js-textfield mdl-select mdl-js-select mdl-select-floating-label">
					<select class="mdl-textfield__input" id="sortType" name="sortType">
						<option value="relevance">Random</option>
						<option value="date">Date</option>
						<option value="rating">Rating</option>
						<option value="title">Title</option>
						<option value="videoCount">Video Count</option>
						<option value="viewCount">View Count</option>
					</select>
				</div>
			</th>
		</tr>
		<tr>
			<th>
				<label for="randomStart" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
  					<input type="checkbox" id="randomStart" class="mdl-checkbox__input">
  					<span class="mdl-checkbox__label">Random Start</span>
				</label>
			</th>
			<th>
				<label for="keywordRequired" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
  					<span class="mdl-checkbox__label">Require Keyword</span>
  					<input type="checkbox" id="keywordRequired" class="mdl-checkbox__input">
				</label>
			</th>
		</tr>
		<tr>
			<th style="text-align:left;">
				<button id="searchButton" onclick="constructPlaylist()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" >L∞p</button>
			</th>
			<th style="text-align:right" id="message">
			</th>
		</tr>
		<br>
		<tr>
			<th style="text-align:left;">
				<button id="prevButton" onclick="previousVideo()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" >Back</button>
			</th>
			<th style="text-align:right">
				<button id="nextButton" onclick="nextVideo()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" >Forward</button>
			</th>
		</tr>

	</table>
	<div>

		<br>
		<br>
	</div>!-->*/