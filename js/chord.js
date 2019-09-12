var codeId = 0;
var codes = [];
var maxCodeId = 0;
var name;

getJSON();
		
function getJSON(){
	var id = getQuery('chord');
	$.getJSON("chords.json", function(json) {
		name = json[id].name;
		maxCodeId = Object.keys(json[id].code).length-1;
		codes = Object.values(json[id].code);
		$('h1').append('No BS <u>' +name+ '</u> Chord'); //append chord name to h1
		assignVal(name, codes[0]); 
	});
}
		 
function assignVal(name, code){
	$('#count').empty();
	$('#count').append((codeId+1)+'/'+(maxCodeId+1));
	var chord = {"name": name, "code" : code}; 
	math(chord); //go do math
}
	
function getQuery(variable) { //get the chord id
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
}

function math(chord){ //everything here calculates and draws the chord shape
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
		
	window.addEventListener('resize', resizeCanvas, false);
		
	var x = [false, false, false, false, false, false];
	var start = 0;
	var end = 0;
		
	mathChord();
		
	function mathChord(){ //calculations for drawing
		code = chord.code.split(""); //split code into individual array values
			
		var temp = [];
		for (var i=0; i<6; i++){ 
			if(code[i]=="x"){ //check for an x, change that value to a 0 and save the fact that column had an x (var x = [false,false,false,false,false,false]; by default, make x[i] true if needed)
				x[i]=true;
				code[i]=0;
			}
				
				code[i]=parseInt(code[i], 16); //convert hex values to base 10 numbers
				
			if(code[i]>0){ //add number to array if not 0 to find the minimum later
				temp.push(code[i]);
			}
		} 
			
		start = Math.min.apply(Math, temp); //find start, save start location (var start = 0; by default)
		end = Math.max.apply(Math, temp); //find end
			
		if (end>4){
			for (var i=0; i<6; i++){
				code[i]=code[i]-start+1; //convert to placement values (subtract 555555 if start is 5)
			}
		}
	}
		
	function drawBoard(){ //drawing
		var bw = document.body.clientWidth/1.5;
		var bh = document.body.clientHeight/1.3;
		
		var h = bh/4;
		var w = bw/5;
		var tmp;
		var d =0;
			
		if (end>4) {
			context.font = "20px Arial";
			context.fillText(start, 0, 40);
		}
			
		for (var i = 25; i <= bw+25; i += w) { //vertical lines
			context.moveTo(i, 25);
			context.lineTo(i, bh+25);
		}

		for (var j = 25; j <= bh+25; j += h) { //horizontal lines
			context.moveTo(25, j);
			context.lineTo(bw+25, j);
		}

		context.strokeStyle = "black";
		context.stroke();
			
		for (var i = 25; i <= bw+25; i += w) { //dots
			if (code[d] > 0){ //draw dots only if not open or muted
				tmp = h * (code[d]-0.5);
				drawDot(i, tmp+25, 25);
			}
			if(x[d]==true){ //draw X for muted string
				context.font = "20px Arial";
				context.fillText("X", i, 20);
			}
			d++;
		}
			
		function drawDot(x, y, radius) { //
			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI, false);
			context.fillStyle = '#000';
			context.fill();
		}
			
	}
		
	function resizeCanvas() { //keeping chord display proportional to window size
		canvas.width = window.innerWidth/1.1;
		canvas.height = window.innerHeight/1.1;

		drawBoard(); 
	}
		
	resizeCanvas();
	
};

function nextSlide() {
	if(codeId == maxCodeId){
		codeId = 0;
	}else{
		codeId++;
	}
	assignVal(name, codes[codeId]);
}

function prevSlide() {
	if(codeId == 0){
		codeId = maxCodeId;
	}else{
		codeId--;
	}
	assignVal(name, codes[codeId]);
}
