// url e chave api do max hists no last.fm
const optAPI = {
	apiUrl: 'https://ws.audioscrobbler.com/2.0/?',
	apiKey: 'e2805d5ce0b3beab9baba72efd52d7c2',
}


//carregando opcões padrões para o inicio do carregamento da página
const optType = {
	cat: "Eletrônica",
	midia: "Tracks",
	country: "Brasil",
	midiaCountry: "Tracks",
	radio: "electrohouse",
	name: "eletronics"
}

//opcão padrão para as tags ou categorias
const optTag = {
	//method : 'tag.gettopalbums',
	//method : 'tag.gettopartists',
	method: 'tag.gettoptracks',
	tag: 'eletronic',
	limit: '30',
}

//opcão padrão para paises
const optCountry = {
	method: 'geo.gettoptracks',
	//method : 'geo.gettopartists',
	country: 'brazil',
	limit: '10'
}

//captura clique das categorias
$('ul.cat li').on('touchend click',function () {
	execSlide();
	$('.radio').animate({'margin-bottom': '0px', 'top': '0px'}, 200).css({"display": "block"});
})

//captura clique da tab de midias tracks, artistas e albums para categorias
$('ul.tabsCat li').click(function () {
	let data = $(this).attr('data');
	$('ul.tabsCat li').removeClass('current');
	$('div.tab-content-cat').removeClass('current');
	$(this).addClass('current');
	$("#" + data).addClass('current').html("<span class='loading'></span>");
	optType.cat = $('ul.cat li.itemslide-active span').text();
	optType.midia = $('ul.tabsCat li.itemslide-active').text();
	optTag.method = 'tag.gettop' + data;
	getTopList(optTag, data, optType);
	//console.log(data)	
})

//captura click do selectbox
$('#selectCountry-box-scroll .icon').click(function () {
	let country = $('#selectCountry-box-scroll div.selected img').attr('icon-value');
	$('ul.tabsCountry li').removeClass('current');
	$('div.tab-content-country').removeClass('current');
	$("#tabtracksCountry").addClass('current');
	$("#tracksCountry").addClass('current').html("<span class='loading'></span>");
	optType.country = $('#selectCountry-box-scroll div.selected img').attr('name');
	optType.midiaCountry = $('ul.tabsCountry li.current').text();
	optCountry.country = country;
	optCountry.method = 'geo.gettoptracks';
	getTopList(optCountry, 'tracksCountry', optType);
	//console.log(country);

})

//captura clique da tab de midias tracks e artistas para paises
$('ul.tabsCountry li').click(function () {
	let data = $(this).attr('data');
	$('ul.tabsCountry li').removeClass('current');
	$('div.tab-content-country').removeClass('current');
	$(this).addClass('current');
	$("#tab" + data + "Country").addClass('current');
	$("#" + data + "Country").addClass('current').html("<span class='loading'></span>");
	optType.country = $('#selectCountry-box-scroll div.selected img').attr('name');
	optType.midiaCountry = $('ul.tabsCountry li.current').text();
	optCountry.method = 'geo.gettop' + data;
	getTopList(optCountry, data + "Country", optType);
	//console.log(data)	
})

//buscando as midias
$('#submit').click(function () {
	execSearch();
})

$('#search').keypress(function (e) {
	if(e.which == 13) 
		execSearch();
})

//recuperando listas de tracks, albuns e artistas por categoria e/ou por pais 
let getTopList = (opt, id, type) => $.ajax({
		url: (optAPI.apiUrl + 'method=' + opt.method + '&tag=' + opt.tag + '&country=' + opt.country + '&api_key=' + optAPI.apiKey + '&format=json&limit=' + opt.limit),
		method: 'GET',
		dataType: 'JSON',
		success: function (json) {
			//console.log(opt);
			let firstKey = Object.keys(json)[0];
			//console.log(firstKey)
			let secondKey = Object.keys(json[firstKey])[0];
			//console.log(secondKey)
			let objItems = json[firstKey][secondKey],
				html;

			let method = opt.method.substr(0, 3);
			//console.log(method)

			let localization, midias;
			if (method === 'tag') {
				localization = " em " + type.cat;
				midias = type.midia;
			} else {
				localization = " " + type.country;
				midias = type.midiaCountry;
			}

			//monta o titulo da tab
			$("div#" + id).html("<ul id='ul" + id + "'><span class='topTitle'>Top " + opt.limit + " " + midias + localization + "</span></ul>");

			objItems.map((item) =>
					$("#ul" + id).append(function () {
						if (method === 'tag') { // por categorias ou ritmos
							switch (secondKey) {
								case 'track':
									html = "<li class='track'><span class='rank'>#" + item['@attr']['rank'] + "</span><figure><img width='60' height='60' src='" + ((item.image[1]['#text']) ? item.image[1]['#text'] : "images/track.png") + "'></img></figure><p class='trackName'>" + item.name + ((item.duration!="0") ? " [" + formatSeconds(item.duration) + "]" : "" ) + "<a data-lity  href='#boxInfo'  onclick=\"$('#boxInfo').html('<span class=loading></span>'); getInformation('artist.getInfo', '" + addslashes(item.artist.name) + "')\">" + item.artist.name + "</a></p><a data-lity class='info' href='#boxInfo' onclick=\"$('#boxInfo').html('<span class=loading></span>'); getInformation('track.getInfo', '" + addslashes(item.artist.name) + "', '" + addslashes(item.name) + "')\"><i class='fa fa-info-circle'></i></a></li>"
									break;
								case 'artist':
									html = "<li class='artist'><span class='rank'>#" + item['@attr']['rank'] + "</span><figure><img width='90' height='90'src='" + ((item.image[2]['#text']) ? item.image[2]['#text'] : "images/artist.png") + "'></img></figure><p class='artistName'>" + item.name + "</p><a data-lity class='info' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(item.name) + "')\"><i class='fa fa-info-circle'></i></a></li>"
									break;
								case 'album':
									html = "<li class='album'><span class='rank'>#" + item['@attr']['rank'] + "</span><figure><img width='90' height='90' src='" + ((item.image[2]['#text']) ? item.image[2]['#text'] : "images/album.png") + "'></img></figure><p class='albumName'>" + item.name + "</p><a data-lity class='info' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('album.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.name) + "')\"><i class='fa fa-info-circle'></i></a></li>"
									break;
							}
						} else if (method === 'geo') { //por paises
							switch (secondKey) {
								case 'track':
									html = "<li class='track'><span class='rank'>#" + (parseInt(item['@attr']['rank']) + 1) + "</span><figure><img width='34' height='34' src='" + ((item.image[0]['#text']) ? item.image[0]['#text'] : "images/track.png") + "'></img></figure><p><a data-lity class='info' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('track.getInfo', '" + addslashes(item.artist.name) + "', '" + addslashes(item.name) + "')\">" + item.name + "</a><a data-lity href='#boxInfo'  onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo','" + addslashes(item.artist.name) + "')\">" + item.artist.name + "</a></p><span class='ouvintes'><i class='fa fa-headphones'></i>" + nFormatter(item.listeners, 1) + "</span></li>"
									break;

								case 'artist':
									html = "<li class='artist'><figure><img width='34' height='34' src='" + ((item.image[0]['#text']) ? item.image[0]['#text'] : "images/artist.png") + "'></img></figure><p><a data-lity class='artistName' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(item.name) + "')\">" + item.name + "</a></p><span class='ouvintes'><i class='fa fa-headphones'></i>" + nFormatter(item.listeners, 1) + "</span></li>"
									break;

							}
						}
						return html;
					}) //fim funcao append
				) //fim map
		}, //fim json
		error: function (json) {
			//alert("Error");
		}
	}) //fim ajax

//recuperando as informações de artista, album ou track
let getInformation = (method, artist, trackOrAlbum) => $.ajax({
		url: (optAPI.apiUrl + 'method=' + method + '&artist=' + artist + '&track=' + trackOrAlbum + '&album=' + trackOrAlbum + '&api_key=' + optAPI.apiKey + '&format=json'),
		method: 'GET',
		dataType: 'JSON',
		success: function (json) {
				let key = Object.keys(json)[0];
				//console.log(key);
				let item = json[key],
					html;
				//console.log(objItems);
				method = method.split('.')[0];
				//console.log(method);

				$("#boxInfo").html(function () {
						if (method == 'track') {
							$(".lity").css({
								'background-image': 'url(images/overlay.png), url(' + ((item.album && item.album.image[3]['#text'] != '') ? item.album.image[3]['#text'] : "images/album.png") + ')'
							});

							html = "<div class='contentInfo'><div class='contentTop'><a class='infoTitle' target='_blank' href='" + item.url + "'><i class='fa fa-play'></i>" + item.name + ((item.duration!="0") ? " [" + formatMiliSeconds(item.duration) + "]" : "" )+ "</a></div><div class='contentLeft'><figure><img class='imgTrackInfo' src='" + ((item.album && item.album.image[3]['#text'] != '') ? item.album.image[3]['#text'] : "images/album.png") + "'></figure>" + ((item.album) ? "<p class='Album'><a class='infoAlbum' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('album.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.album.title) + "')\"><i class='fa fa-music'></i>" + item.album.title + "</a></p>" : '') + "<p class='Artist'><a  class='infoArtist' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(item.artist.name) + "')\"><i class='fa fa-user-circle'></i>" + item.artist.name + "</a></p> <span class='ouvintes'><i class='fa fa-headphones'></i>" + ((item.listeners) ? nFormatter(item.listeners, 1) : 'sem') + " ouvintes</span> <span class='toptags'><i class='fa fa-tags'></i>Top Tags:<br>" + item.toptags.tag.map(t => '#' + t.name).join(' ') + "</span></div><div class='contentRight'>" + ((item.wiki) ? "<p class='wiki'>Biografia by Wiki</p><p class='publibWiki'><i class='fa fa-calendar-o'></i>" + item.wiki.published + "</p><p class='sumaryWiki'><i class='fa fa-comments'></i>" + item.wiki.summary + "</p><p class='contentWiki'><i class='fa fa-align-justify'></i>" + item.wiki.content + "</p>" + ((item.wiki.content.length > 720) ? "<p class='expand'><a class='textExpand'><i class='fa fa-angle-double-down'></i></a><p>" : '' ) : '') + "</div></div>";

							//tracks similares
							getTrackSimilar(item.artist.name.replace('&', '%26'), item.name.replace('&', '%26'));

						} else if (method == 'artist') {
							$(".lity").css({
								'background-image': 'url(images/overlay.png), url(' + ((item.image && item.image[5]['#text'] != '') ? item.image[5]['#text'] : "images/artist.png") + ')'
							});

							html = "<div class='contentInfo'><div class='contentTop'><a class='infoTitle' target='_blank' href='" + item.url + "'><i class='fa fa-user-circle'></i>" + item.name + "</a></div><div class='contentLeft'><figure><img class='imgArtistInfo' src='" + ((item.image && item.image[3]['#text'] != '') ? item.image[3]['#text'] : "images/artist.png") + "'></figure><span class='ouvintes'><i class='fa fa-headphones'></i>" + ((item.stats.listeners) ? nFormatter(item.stats.listeners, 1) : 'sem') + " ouvintes</span> <span class='toptags'><i class='fa fa-tags'></i>Tags Relacionadas:<br>" + item.tags.tag.map(t => '#' + t.name).join('  ') + "</span></div><div class='contentRight'>" + ((item.bio) ? "<p class='wiki'>Biografia</p><p class='publibWiki'><i class='fa fa-calendar-o'></i>" + item.bio.published + "</p><p class='sumaryWiki'><i class='fa fa-comments'></i>" + item.bio.summary + "</p>" + ((item.bio.content && item.bio.content != '') ? "<p class='contentWiki'><i class='fa fa-align-justify'></i>" + item.bio.content + "</p>" + ((item.bio.content.length > 720) ? "<p class='expand'><a class='textExpand'><i class='fa fa-angle-double-down'></i></a><p>" : '' ) : '') : "<p class='noPublic'>Sem Publicação</p>") + "</div><div class='contentDown'>" + ((item.similar && item.similar.artist != '') ? "<p class='titleSimilar'>Artistas Similares</p><div class='artistsSimilares'>" + item.similar.artist.map((s) => "<div class='artistSimilar'><figure><img class='imgArtistInfo' width='174' src='" + ((s.image && s.image[2]['#text'] != '') ? s.image[2]['#text'] : "images/artist.png") + "'/></figure><p class='Artist'><a class='infoArtist' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(s.name) + "')\"><i class='fa fa-user-circle'></i>" + s.name + "</a></p></div>").join('') + "</div>" : "<p class='noPublic'>Sem Artistas Similares</p>") + "</div></div>";

							// top albums do artista
							getTopTracksOrAlbumsforArtist(item.name.replace('&', '%26'), 'album', 5);

							// top tracks do artista
							getTopTracksOrAlbumsforArtist(item.name.replace('&', '%26'), 'track', 16);
							
							
							

						} else if (method == 'album') {
							$(".lity").css({
								'background-image': 'url(images/overlay.png), url(' + ((item.image && item.image[5]['#text'] != '') ? item.image[5]['#text'] : "images/album.png") + ')'
							});

							html = "<div class='contentInfo'><div class='contentTop'><a class='infoTitle' target='_blank' href='" + item.url + "'><i class='fa fa-music'></i>" + item.name + "</a></div><div class='contentLeft'><figure><img class='imgAlbumInfo' src='" + ((item.image && item.image[3]['#text'] != '') ? item.image[3]['#text'] : "images/album.png") + "'></figure><a class='infoArtist' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(item.artist) + "')\"><i class='fa fa-user-circle'></i>" + item.artist + "</a><span class='ouvintes'><i class='fa fa-headphones'></i>" + ((item.listeners) ? nFormatter(item.listeners, 1) : 'sem') + " ouvintes</span> <span class='toptags'><i class='fa fa-tags'></i>Tags Relacionadas:<br>" + item.tags.tag.map(t => '#' + t.name).join('  ') + "</span></div><div class='contentRight'>" + item.tracks.track.map((tr) => "<a class='infoAlbumTrack' target='_blank' href='" + tr.url + "'><i class='fa fa-play-circle'></i><span class='infoTitleTrack'>" + tr.name + "</span><span class='infoDuracTrack'>[" + formatSeconds(tr.duration) + "]</span></a>").join('') + "</div><div class='contentDown'>" + ((item.wiki) ? "<p class='wiki'>Biografia</p><p class='publibWiki'><i class='fa fa-calendar-o'></i>" + item.wiki.published + "</p><p class='sumaryWiki'><i class='fa fa-comments'></i>" + item.wiki.summary + "</p><p class='contentWiki'><i class='fa fa-align-justify'></i>" + item.wiki.content + "</p>" : "") + "</div></div>";
						}

						return html;

					}) //fim funcao html
				
					
							//link que espande o conteudo da biografia
							$('.textExpand').click(function() {
							let contentWiki = $('.contentWiki');

							if(contentWiki.height() == 200){
								contentWiki.css("height","auto");
								
								let height = contentWiki.height();
								
								contentWiki.css("height","200px");
								contentWiki.animate({height: height + "px"},1000, function(){
									contentWiki.css("height","auto");        
								}); 
							}else{
								contentWiki.animate({height: "200px"}, 1500);
								$('#boxInfo').animate({scrollTop: 0}, 1000);
							}
								$('.textExpand i').toggleClass('fa-angle-double-down fa-angle-double-up')	
								
						});


			} //fim json
	}) //fim ajax

//recuperado as midias pelo campo de busca
let getSearch = (method, type, midia) => $.ajax({
		url: (optAPI.apiUrl + 'method=' + method + '&' + type + '=' + midia + '&api_key=' + optAPI.apiKey + '&format=json&limit=54'),
		method: 'GET',
		dataType: 'JSON',
		success: function (json) {

				let results = Object.keys(json)[0];
				//console.log(results)

				let matches = Object.keys(json[results])[4];
				//console.log(matches)

				let key = Object.keys(json[results][matches])[0];
				//console.log(key)

				let objItems = json[results][matches][key],
					html;
				//console.log(objItems[0])

				$(".resultSearch").html("<p class=titleSearch>Procurando por: \"" + midia + "\"</p><div class=itensResult></div>");

				objItems.map((item) =>
						$(".itensResult").append(function () {
							html = "<a data-lity class='itemResult result" + type + "' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('" + type + ".getInfo', '" + ((item.artist) ? addslashes(item.artist) : addslashes(item.name)) + "','" + addslashes(item.name) + "')\"><figure><img class='img" + type + "Search' src='" + ((item.image && item.image[2]['#text'] != '') ? item.image[2]['#text'] : "images/" + type + ".png") + "'></figure><span class='nameResult'>" + item.name + "</span>" + ((item.artist) ? "<span class='artistNameResult'><i class='fa fa-user-circle'></i>" + item.artist + "</span>" : '') + "</a>";

							return html;
						}) //fim funcao apeend
					) //fim map

				if (json.results["opensearch:totalResults"] == 0) {
					$(".itensResult").html("<p class='noResult'>Nenhum Resultado Encontrado! :( </p>");
				}
					
					//inserindo os botoes voltar e topo
				$(".resultSearch").append("<div class='btArrows'><span class='backSearch'><i class='fa fa-arrow-left'></i></span><span class='scrollTop'><i class='fa fa-arrow-up'></i></span><div>");
					
					//botao que retorna a estrutura inicial da pagina e volta para o topo da pagina
				$('.backSearch').click(function () {
					$('html, body').animate({scrollTop: 0}, 2000);
					$('.resultSearch').fadeOut();
					$('#carousel').fadeIn();
					$('#search').val('');
					$('.lists').fadeIn();
				})
					//botao que volta para o topo da pagina
				$('.scrollTop').click(function () {
					$('html, body').animate({scrollTop: 0}, 2000);
				});
			} //fim json
	}) //fim ajax

//recuperando tracks similares
let getTrackSimilar = (artist, track) => $.ajax({
		url: (optAPI.apiUrl + 'method=track.getsimilar&artist=' + artist + '&track=' + track + '&api_key=' + optAPI.apiKey + '&format=json&limit=15'),
		method: 'GET',
		dataType: 'JSON',
		success: function (json) {
				let firstKey = Object.keys(json)[0];
				//console.log(firstKey);

				let secondKey = Object.keys(json[firstKey])[0];
				//console.log(secondKey)
				let objItems = json[firstKey][secondKey],
					html;
				//console.log(objItems);


				$(".contentRight").append("<p class=titleTrackSimilar>Tracks Similares</p><div class=tracksSimilares></div>");

				objItems.map((item) =>
						$(".tracksSimilares").append(function () {
							html = "<a class='itemSimilar'  href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('track.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.name) + "')\"><figure><img class='imgSimilar' src='" + ((item.image && item.image[2]['#text'] != '') ? item.image[2]['#text'] : "images/track.png") + "'></figure><span class='nameSimilar'>" + item.name + "</span>" + ((item.artist) ? "<span class='artistSimilar'><i class='fa fa-user-circle'></i>" + item.artist.name + "</span>" : '') + "</a>";
							return html;
						}) //fim funcao append
					) //fim map
			} //fim json
	}) //fim ajax


//retornando os top Tracks ou Albuns do artista
let getTopTracksOrAlbumsforArtist = (artist, trackOrAlbum, limit) => $.ajax({
		url: (optAPI.apiUrl + 'method=artist.gettop' + trackOrAlbum + 's&artist=' + artist + '&api_key=' + optAPI.apiKey + '&format=json&limit=' + limit),
		method: 'GET',
		dataType: 'JSON',
		success: function (json) {
				let firstKey = Object.keys(json)[0];
				//console.log(firstKey);
				let secondKey = Object.keys(json[firstKey])[0];
				//console.log(secondKey)
				let objItems = json[firstKey][secondKey],
					html, title, icon, totalOuvintes;
				//console.log(objItems);


				if (secondKey == 'track') {

					//totalOuvintes = objItems.reduce((sum, item) => (sum + parseInt(item.listeners)), 0);
					totalOuvintes = parseInt(objItems[0].listeners);

					$(".contentDown").prepend("<p class=titleArtistTopTrack>Top Tracks de " + json[firstKey]['@attr'].artist + "</p><div class=graficTracks></div>");


					let $i = 1;

					objItems.map((item) =>
							$(".graficTracks").append(function () {
								html = "<div class='itemsGrafic'><p class='tracksNamesGrafic'><a class='nameArtistTopTrack' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('track.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.name) + "')\"><span class='numberTracks'>#" + ($i++) + "</span><i class='fa fa-play'></i>" + item.name + "</a></p><p class='tracksBarsGrafic'><span class='barsGrafic' style='width:" + ((parseInt(item.listeners) / totalOuvintes) * 100) + "%'></span><i class='fa fa-headphones'></i><span class='ouvintesArtistTopTrack'>" + nFormatter(parseInt(item.listeners), 1) + "</span></p><div>";
								return html;
							}) //fim funcao apeend
						) //fim map

				} else if (secondKey == 'album'){

					$(".contentDown").prepend("<p class=titleArtistTopAlbum>Top Álbums de " + json[firstKey]['@attr'].artist + "</p><div class=ArtistTopAlbum></div>");

					objItems.map((item) =>
							$(".ArtistTopAlbum").append(function () {
								html = "<div class='itemArtistTopAlbum'><figure><img class='imgArtistTopAlbum' src='" + ((item.image && item.image[2]['#text'] != '') ? item.image[2]['#text'] : "images/album.png") + "'></figure><a class='nameArtistTopAlbum' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('album.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.name) + "')\"><i class='fa fa-music'></i>" + item.name + "</a></div>";
								return html;
							}) //fim funcao append
						) //fim map
				} //fim else
			} //fim json
	}) //fim ajax


let getRadio = (opt) => {
	//const url = `http://prem1.di.fm/${opt.radio}?5f14551afa408910a820a8af`;
	//const url = `https://hot.friezy.ru/?radio=di&station=${radio}&bitrate=320`;
	//const url = `https://pub2.diforfree.org:8000/di_${radio}_hi`;
	//console.log(radio);
	let stream = {
		m4a: `https://hot.friezy.ru/?radio=di&station=${opt.radio}&bitrate=320`
	}
	$(".interface .folder").css({"background-image":"url('images/ritmos/"+opt.name+".jpg')"});
	//$(".interface .titleRadio").html(opt.cat);
	$(".interface .titleRadio").animate({
		opacity : 0
	}, 10).animate({
		opacity : 1,
	}, 200).html(opt.cat);
	$("#jplayer").jPlayer("destroy");
	let ready = false;
	$("#jplayer").jPlayer({
		ready: function (event) {
			ready = true;
			$(this).jPlayer("setMedia", stream).jPlayer("play");
		},
		pause: function() {
			$(this).jPlayer("clearMedia");
		},
		stop: function() {
			$(this).jPlayer("destroy");
			
		},
		error: function(event) {
			if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
				// Setup the media stream again and play it.
				$(this).jPlayer("setMedia", stream).jPlayer("play");
			}
		},
		supplied: "m4a, oga",
		wmode: "transparent",
		autoBlur: false,
		keyEnabled: false,
		preload: 'none',
	});
	
	$('.stop').click(function(){
		$("#jplayer").jPlayer("destroy");
		$('.radio').animate({'margin-bottom': '-100px', 'top': '-100px'}, 50);
	})
}


let execSlide = () => {
	$('ul.tabsCat li').removeClass('current');
	$('div.tab-content-cat').removeClass('current');
	$("#tabtracks").addClass('current');
	$("#tracks").addClass('current').html("<span class='loading'></span>");
	optType.name = $('.itemslide-active').attr('data-name');
	optType.radio = $('.itemslide-active').attr('data-radio');
	optType.cat = $('ul.cat li.itemslide-active span').text();
	optType.midia = $('ul.tabsCat li.current').text();
	optTag.tag = optType.name;
	optTag.method = 'tag.gettoptracks';
	getTopList(optTag, 'tracks', optType);
	getRadio(optType);
		//console.log(data);
}

let execSearch = () =>{
	let search = $('#search').val();
	let method = $('#select').val();
	let type = method.split('.')[0];
	if (search != "") {
		//console.log(validacampo(search));
		if(validateInput(search)){
			$('#carousel').fadeOut();
			$('.lists').fadeOut();
			$('.resultSearch').css({
				'display': 'block'
			}).html("<span class='loading'></span>");
			getSearch(method, type, search);
		}else {
			$('#search').focus();
			alertify.alert('Por favor, digite um nome válido para buscar !');
		}
		
	} else {
		$('#search').focus();
		alertify.alert('Por favor, digite o nome de uma mídia para buscar !');
	}
}

//formata milisegundos em time min
let formatMiliSeconds = (ms) => {
	let hours = Math.floor(ms / 3600000);
	let minutes = Math.floor((ms % 3600000) / 60000);
	let seconds = Math.floor(((ms % 360000) % 60000) / 1000);
	let result = (minutes < 10 ? "0" + minutes : minutes);
	result += ":" + (seconds < 10 ? "0" + seconds : seconds);
	return result;
}

//formata segundos em time min
let formatSeconds = (totalSeconds) => {
	let hours = Math.floor(totalSeconds / 3600);
	let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
	let seconds = totalSeconds - (hours * 3600) - (minutes * 60);
	seconds = Math.round(seconds * 100) / 100
	let result = (minutes < 10 ? "0" + minutes : minutes);
	result += ":" + (seconds < 10 ? "0" + seconds : seconds);
	return result;
}

//formata numeros em unidades K e M
let nFormatter = (num, digits) => {
	var si = [{
		value: 1,
		symbol: ""
	}, {
		value: 1E3,
		symbol: "K"
	}, {
		value: 1E6,
		symbol: "M"
	}];
	var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value)
			break;
	}
	return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

//gera as barras do grafico equalizador
let equalizerBars = (number) => {
	for (let i = 0; i < number; i++)
		$('.equalizer').append('<div class=bar></div>');
}



//replace caracteres especiais nas strings
let addslashes = (ch) => {
	ch = ch.replace(/\'/g, "\\'")
	ch = ch.replace(/\"/g, "\\\"")
	ch = ch.replace(/&/g, "%26")
	return ch
}

//regex de validacao de busca - so permite letras com acentos numeros & ' _ - espaco 
let validateInput = (string) => {
    var rx = /^[a-zA-Z_éúíóáÉÚÍÓÁèùìòàçÇÈÙÌÒÀõãñÕÃÑêûîôâÊÛÎÔÂ&'\-\ \s\d]+$/ig;
    return (string.match(rx)) ? true : false 
}

//carregando todas as funcoes das listas com parametros iniciais
$(getTopList(optTag, 'tracks', optType));
$(getTopList(optCountry, 'tracksCountry', optType));
//$(getRadio(optType));

//inicia variaveis e metodos no carregamento da pagina
$(document).ready(function () {

	//carousel/slides dos ritimos
	var carousel;
	carousel = $("ul.cat");
	carousel.itemslide({
		start: 2
	})
	$(window).resize(function () {
		carousel.reload();
		
	})
	$('.next').click(function(){
		carousel.next();
		execSlide();
	})
	$('.previous').click(function(){
		carousel.previous();
		execSlide() ;
	})
	//barras do grafico equalizador
	equalizerBars(35);

	//imagens do background
	$("body").vegas({
	timer: false,
	autoplay: true,
	animation: 'fade',
	transitionDuration: 8000,
	animationDuration: 50000,
	delay: 10000,
    slides: [
        {src: 'images/backgrounds/bg-max_hits_1.jpg'}, 
					  {src: 'images/backgrounds/bg-max_hits_2.jpg'}, 
					  {src: 'images/backgrounds/bg-max_hits_3.jpg'}, 
					  {src: 'images/backgrounds/bg-max_hits_4.jpg'}, 
					  {src: 'images/backgrounds/bg-max_hits_5.jpg'}, 
					  {src: 'images/backgrounds/bg-max_hits_7.jpg'}, 
					  {src: 'images/backgrounds/bg-max_hits_6.jpg'}
		],
		overlay: 'images/overlay.png'
	});
	
	//selectbox da busca
	$('#select').niceSelect();
	
	alertify.defaults.transition = "slide";
	alertify.defaults.glossary.title = 'AVISO';
	alertify.defaults.glossary.ok = 'Fechar';

});

module.exports = getInformation