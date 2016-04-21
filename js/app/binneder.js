$(function() {
	// INITIAL SETUP
		var genderInput = $('input[name="gender"]');
		var ageMinInput = $("[name='ageMin']");
		var ageMaxInput = $("[name='ageMax']");

	// FORMS
		// fancy radio
		genderInput.on("change", function () {
			localStorage.gender = $("input[name='gender']:checked").attr("id");
		})

		// fancy range
		var updateFancyRange = function( input ) {
			var id = input.attr("id");
			var val = input.val()
			input.next().html(val);
			localStorage[id] = val;
		}
		$(".fancyRange input").on("change", function () {
			updateFancyRange($(this));
		});

	// SEARCH PAGE
		var search = $('.search .whiteBackground');

		var template = "";
			template += "<div class=person>";
			template += "	<img src=${img}>";
			template += "	<p>${name}</p>";
			template += "</div>";
			template += "<div class='display no'><span class='icon-no'></span></div>";
			template += "<div class='display yes'><span class='icon-yes'></span></div>";
			template += "<div class='next no'></div>";
			template += "<div class='next yes'></div>";

		var activeList = [];
		var activeItem = 0;

		var nextCard = function () {
			search.html('');
			activeItem++;

			var item = activeList[activeItem];
			var activeTemplate = template;

			activeTemplate = activeTemplate.replace('${img}', item.picture.large);
			activeTemplate = activeTemplate.replace('${name}', item.name.first.toUpperCase());

			search.html(activeTemplate);
		}

		var addDataToStorage = function( data ) {
			var storedData;
			if ( !localStorage.votes ) {
				storedData = [];
			} else {
				storedData = JSON.parse(localStorage.votes);
			}
			storedData.push(data);
			localStorage.votes = JSON.stringify(storedData);
			nextCard();
		}

		$('.search').delegate( ".next", "click", function() {
			var vote = 'y';
			var item = activeList[activeItem];

			if ( $(this).hasClass('no') ) {
				vote = 'n';
			}
			
			var data = {
				name: item.name.first.toUpperCase(),
				img: item.picture.large,
				vote: vote
			};

			addDataToStorage( data );
		});

		var displayResults = function ( results ) {
			search.html('');
			activeList = results;
			activeItem = 0;
			nextCard();
		}

		var loadResults = function () {
			var apiURL = 'https://randomuser.me/api/?results=10&noinfo';
			if ( localStorage.gender === "f" ){
				apiURL+="&gender=female";
			} else {
				apiURL+="&gender=male";
			}
			$.ajax({
				url: apiURL,
				dataType: 'json',
				success: function(data){
					displayResults(data.results);
				},
				error: function(data) {
					search.html('Error, please try again later...')
				}
			});
		}


		$('footer').delegate('.search', 'click', function() {
			setTimeout(loadResults(), 100);
		});

	// HISTORY
		var historyTemplate = "";
		historyTemplate += "<div class='historyItem ${class}'>";
		historyTemplate += "	<img src='${img}'>";
		historyTemplate += "	<span>${name}</span>";
		historyTemplate += "</div>";

		$('footer').delegate('.history', 'click', function() {
			var content = "";
			if ( localStorage.votes ) {
				var data = JSON.parse(localStorage.votes);

				for (var i = data.length - 1; i >= 0; i--) {
					var item = data[i];

					var itemTemplate = historyTemplate;
					itemTemplate = itemTemplate.replace('${img}', item.img);
					itemTemplate = itemTemplate.replace('${name}', item.name);
					itemTemplate = itemTemplate.replace('${class}', item.vote);

					content += itemTemplate;
				}

				$('#actionArea .history .whiteBackground').html(content);
			}
		});

	// POST SETUP
		// local storage
		var startOnSearch = true;

		if ( !localStorage.gender ) { startOnSearch = false; localStorage.gender = "m"; }
		$("#"+localStorage.gender).attr('checked', true);

		if ( !localStorage.ageMin ) { startOnSearch = false; localStorage.ageMin = "18"; }
		ageMinInput.val(localStorage.ageMin);
		updateFancyRange(ageMinInput);

		if ( !localStorage.ageMax ) { startOnSearch = false; localStorage.ageMax = "60"; }
		ageMaxInput.val(localStorage.ageMax);
		updateFancyRange(ageMaxInput);

		if ( !localStorage.votes ) { localStorage.votes = []; }

		// step changing
		var changeStep = function ( step ) {
			$('#actionArea > *').hide();
			$('#actionArea .' + step).show();
		}

		$('footer a').on('click', function () {
			changeStep($(this).attr('class'));
		})

		if ( startOnSearch ) { changeStep('search'); loadResults(); }
		// if ( startOnSearch ) { changeStep('history'); }

});