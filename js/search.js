	$(document).ready(function(){
		$('#search').keyup(function(){
			$('#result').html('');
			var searchField = $('#search').val();
			var expression = new RegExp(searchField, "i");
			$.getJSON('chords.json', function(chords){
				$.each(chords, function(key, value){
					//add for loop? j++ to iterate thru altnames?
					if(value.name.search(expression) != -1){
						$('#result').append('<li><a href="chord.html?chord=' +key+ '">' +value.name+ '</a></li>');
					}
				});
			});
		});
	});
	
	