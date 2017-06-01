function Creator(){
	var self = this;


	self.Iter = function(){
		for(var i = 0; i < 300; i++){
			for(var j = 0; j < 300; j++){
				var curr = self.field[i + ' ' + j];
				var count = 0;
				var average = null;
				var avg = null;
				for(var x = -5; x < 6; x++){
					for(var y = -5; y < 6; y++){
						var around = self.field[(i + x) + ' ' + (j + y)];
						if(!around){
							continue;
						}
						
						if(around.value != curr.value){
							count++;
							if(!avg) avg = around.value;
							else avg += around.value;
						}
						if(!average) average = {};
						if(!average[around.value]) average[around.value] = 1;
						else average[around.value] = average[around.value] + 1;
							
						
					}
				}
				self.field[i + ' ' + j].count = count;
				self.field[i + ' ' + j].avg = count == 0 || avg == null ? curr.value : Math.floor(avg/count);
				var maxVal = 0;
				var theVal = curr.value;
				for(var p = 0; p < 16; p++){
					if(average && average[p]){
						if(average[p] > maxVal){
							maxVal = average[p];
							theVal = p;
						}
					}
				}
				self.field[i + ' ' + j].average = theVal;
				// = {value: rnd(0,16)};
			}
		}
		for(var i = 0; i < 300; i++){
			for(var j = 0; j < 300; j++){
				var curr = self.field[i + ' ' + j];
				if(curr.count > 4){
					self.field[i + ' ' + j].value = self.field[i + ' ' + j].average
					//if(curr.value > 2 && curr.avg > curr.value + 1) self.field[i + ' ' + j].value = self.field[i + ' ' + j].value - 1;
				}
			}
		}
	}

	self.CreateLandMasses = function(){
		for(var i = 0; i < 300; i++){
			for(var j = 0; j < 300; j++){
				var curr = self.field[i + ' ' + j];
				if(Math.random() < 2){
					self.field[i + ' ' + j].last = self.field[i + ' ' + j].value;
					self.field[i + ' ' + j].value = 2;
				}
			}
		}
		for(var i = 0; i < 300; i++){
			for(var j = 0; j < 300; j++){
				var curr = self.field[i + ' ' + j];
				var count = 0;
				var deepWater = 0;
				var average = null;
				var avg = null;
				if(curr.value == 2){
					for(var x = -2; x < 3; x++){
						for(var y = -2; y < 3; y++){
							var around = self.field[(i + x) + ' ' + (j + y)];
							if(!around){
								continue;
							}
							
							if(around.value == curr.value){
								count++;
							}

							if(around.value == 0 || around.last == 0){
								deepWater++;
							}
								
							
						}
					}
					if(deepWater > 0  || count < 2) self.field[i + ' ' + j].value = self.field[i + ' ' + j].last;
				}
			}
		}
	}

	self.GrowGrass = function(){
		for(var i = 0; i < 300; i++){
			for(var j = 0; j < 300; j++){
				var curr = self.field[i + ' ' + j];
				if(Math.random() < 2){
					self.field[i + ' ' + j].last = self.field[i + ' ' + j].value;
					self.field[i + ' ' + j].value = 3;
				}
			}
		}
		for(var i = 0; i < 300; i++){
			for(var j = 0; j < 300; j++){
				var curr = self.field[i + ' ' + j];
				var count = 0;
				var deepWater = 0;
				var average = null;
				var avg = null;
				if(curr.value == 3){
					for(var x = -2; x < 3; x++){
						for(var y = -2; y < 3; y++){
							var around = self.field[(i + x) + ' ' + (j + y)];
							if(!around){
								continue;
							}
							
							if(around.value == curr.value){
								count++;
							}

							if(around.value < 2 || around.last  < 2){
								deepWater++;
							}
								
							
						}
					}
					if(deepWater > 0  || count < 2) self.field[i + ' ' + j].value = self.field[i + ' ' + j].last;
				}
			}
		}
	}

	self.Run = function(){
		self.canvas = $('#my_canvas')[0];

		self.canvas.width = window.innerWidth;
		self.canvas.height = window.innerHeight;

		self.ctx = self.canvas.getContext('2d');

		self.ClearToBlack();

		self.field = {};
		for(var i = 0; i < 300; i++){
			for(var j = 0; j < 300; j++){
				self.field[i + ' ' + j] = {value: Math.random() < .5 ? 1 : 0};
			}
		}
		for(var j = 0; j < 10; j ++){
			self.Iter();
			//self.Draw();
		}
		self.CreateLandMasses();
		self.Draw();
		window.count = 0;
		setInterval(function(){
			//if(window.count < 10) self.Iter();
			//else 
			self.GrowGrass();
			window.count++;
			self.Draw();
		},2000)
		
		


	}

	self.Draw = function(){
		self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
		for(var i = 0; i < 300; i++){
			for(var j = 0; j < 300; j++){
				var curr = self.field[i + ' ' + j];
				var width = Math.floor(self.canvas.height / 300);
				var height = Math.floor(self.canvas.height /300);
				self.ctx.fillStyle = 'rgba(0,' + Math.floor((self.field[i + ' ' + j].value/16)*255) + ',0,1)';
				if(self.field[i + ' ' + j].value == 1) self.ctx.fillStyle = '#0050ff';
				else if(curr.value == 0) self.ctx.fillStyle = 'blue';
				else if(curr.value == 2) self.ctx.fillStyle = 'yellow';
				else if(curr.value == 3) self.ctx.fillStyle = 'green';
				self.ctx.fillRect(i*width,j*height,width,height);

			}
		}
	}

	self.ClearToBlack = function(){

		self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
		self.ctx.fillStyle = "#000000";
		self.ctx.fillRect(0,0,self.canvas.width,self.canvas.height);
	};


}

function rnd(x,y){
	return Math.floor(x + Math.random()*(y - x));
}