// JavaScript Document



const opt = {
	apiUrl : 'https://ws.audioscrobbler.com/2.0/?',
	api_key : 'e2805d5ce0b3beab9baba72efd52d7c2',
	method : 'tag.gettopalbums',
	//method : 'tag.gettopartists',
	//method : 'tag.gettoptracks',
	//method : 'geo.gettoptracks',
	//method : 'geo.gettopartists',
	country : 'brazil',
	tag : 'eurodance',
	limit: '20'
}


getTopList = (opt) => $.ajax({
	url: (opt.apiUrl+ 'method=' +opt.method+ '&tag=' +opt.tag+ '&country=' +opt.country+ '&api_key=' +opt.api_key+ '&format=json&limit='+opt.limit),
    method: 'GET',
    dataType: 'JSON',
	success: function (data) {
		
		let key = Object.keys(data)[0];
		//console.log(key)
		let key2 = Object.keys(data[key])[0];
		//console.log(key2)
		let objItems = data[key][key2], html;
		
		let method = opt.method.substr(0,3);
		//console.log(method)
		
			objItems.map((item) => 
				$('.list').append(function(){
				
				if(method=='tag')
				 	switch (key2) {
						case 'track':
							html = "<li><figure><img src='"+item.image[1]['#text']+"'></img></figure><a target='blank' href='"+item.url+"'>"+item.name+"</a></li>";
						case 'artist':
							html ="<li><figure><img src='"+item.image[1]['#text']+"'></img></figure><a target='blank' href='"+item.url+"'>"+item.name+"</a></li>";

						case 'album':
							html = "<li><figure><img src='"+item.image[1]['#text']+"'></img></figure><a target='blank' href='"+item.url+"'>"+item.name+"</a></li>";
				}
				else if(method=='geo')
					switch (key2) {
						case 'track':
							html = "<li><figure><img src='"+item.image[1]['#text']+"'></img></figure><a target='blank' href='"+item.url+"'>"+item.name+"</a></li>";

						case 'artist':
							html ="<li><figure><img src='"+item.image[1]['#text']+"'></img></figure><a target='blank' href='"+item.url+"'>"+item.name+"</a></li>";	
					}
				return html 
				})
			)
				
        },
})


$(getTopList(opt));



