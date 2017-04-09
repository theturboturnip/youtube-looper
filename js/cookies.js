console.log("loaded cookies.js");




function loadCookies(){
	console.log("loading cookies");
	var cookieStr=document.cookie.trim();
	//console.log(cookieStr);
	var dataStrs=cookieStr.split(";");
	//console.log(dataStrs);

	var data={},keyValuePair;
	for(var index in dataStrs){
		//console.log(dataStrs[index]);
		keyValuePair=dataStrs[index].trim().split("=");
		data[keyValuePair[0]]=keyValuePair[1];
	}
	console.log("cookies loaded: ");
	console.log(data);
	return data;
}

function loadCookie(name){
	
	return loadCookies()[name];
}

function setCookie(name,value,cookieExpireTime){
	console.log("Setting Cookie");
	var cookieStr="path=/;";
	if (cookieExpireTime!=0){
		var d = new Date();
		d.setTime(d.getTime() + (cookieExpireTime*24*60*60*1000));
		var expiresStr = "expires="+ d.toUTCString();
		cookieStr = expiresStr+";"+cookieStr;
	}

	/**/
	cookieStr=name+"="+value+"; "+cookieStr;

	document.cookie=cookieStr;
	console.log("Set Cookie: "+cookieStr);
}

function setCookies(data){
	for(var key in data){
		if (!data.hasOwnProperty(key)) continue;
		console.log(key);
		setCookie(key,data[key],0);
	}
}

