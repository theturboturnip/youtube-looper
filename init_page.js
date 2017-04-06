window.onload=function(evt){
	var inputParent=document.getElementById("input-parent");
	appendTextInput(inputParent,"channelSearch","Channel");
	appendTextInput(inputParent,"searchTerm","Search Term");
	appendTextInput(inputParent,"requiredKeyword","Keyword");
	appendSelection(inputParent,"sortType",{"relevance":"Random","date":"Date"});
	appendLineBreak(inputParent);
	appendButton(inputParent,"searchButton","L∞p","constructPlaylist()");

	var playerInputParent=document.getElementById("player-input-parent");
	appendButton(playerInputParent,"prevButton","Previous","previousVideo()").setAttribute("style","float:left");
	appendButton(playerInputParent,"nextButton","Next","nextVideo()").setAttribute("style","float:right");
	var debugDiv=createElementWithAttr("div","",{
		"id":"message",
		"style":"float:center;"
	},"");
	playerInputParent.appendChild(debugDiv);
}

function appendTextInput(parentNode,id,printName){
	var textNode=document.createElement("div");
	textNode.className="mdl-textfield mdl-js-textfield";
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
										"type":"text"
									},
									"");

	textNode.appendChild(input);
	parentNode.appendChild(textNode);
	return textNode;
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
	return topNode;
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
	console.log(node.innerHTML);
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