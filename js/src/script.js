$(document).ready(function(e){
	$('.search-panel .dropdown-menu').find('a').click(function(e) {
	e.preventDefault();
		var param = $(this).attr("href").replace("#","");
		var concept = $(this).text();
	$('.search-panel span#search_concept').text(concept);
		$('.input-group #search_param').val(param);
    
	});
});


/* API URL, you need to supply your API key */
let city ='islamabad' ;
let key ='c73aa228bfba692462f96e89080aa39a' ;
let URL ='';
let dataArray=[];
let tempUnitState='C';
function fetchWeather(url) {
  fetch(url)
    .then(function(response) {
			return response.json()
    })
    .then(function(result){

			displayWeather(result);
			$('.display-box').show();
			//console.log(result);
			//console.log(result.city.name);
			//console.log(result.list[0].main.temp);
			//$("#cityName").text(result.city.name);
			//console.log( moment.unix(1517378400).format("MM/DD/YYYY") );
			//console.log( moment("2018-01-30 09:00:00").format("DD/MM/YYYY") );
    })
    .catch(function(error){
			console.log(`Error occured, ${error}`);
			$('.display-box').hide();
			alert('Please entered valid input! ');
    })
}




$(".five-box").click(function(){
	//alert($(this).attr("id"));
	setWeatherDisplay(dataArray[$(this).attr("id").replace('day','')-1]);

  });


$("#search-btn").click(function(){

	//alert($('#search_concept').text());
	//alert($('#input_data').val());
	let data = $('#input_data').val();
	let type = $('#search_concept').text();
	if(type!='Search by')
	{
		makeURL(data , type );
		fetchWeather(URL);
	}
	else{
		alert('Please select type');
	}
	
});

function makeURL(data,type)
{
	if(type=="City Name")
	{
		URL = `http://api.openweathermap.org/data/2.5/forecast?q=${data}&units=metric&appid=${key}`;
	}
	else if ( type=="City Id")
	{
		URL = `http://api.openweathermap.org/data/2.5/forecast?id=${data}&units=metric&appid=${key}`;
	}
	else if ( type=="Zip Code")
	{
		URL = `http://api.openweathermap.org/data/2.5/forecast?zip=${data}&units=metric&appid=${key}`;
	}
	
}


$(".conversion").click(function(e){
	
	//alert($(this).attr("id"));
	if($(this).attr("id")=='c' && tempUnitState=="F")
	{
		//alert('f to c');
		tempUnitState='C';
		$("#c").css('text-decoration', 'underline');
		$("#f").css('text-decoration', '');
		$('#tempratureDigit').text( fToC($('#tempratureDigit').text()) );
		for(let i= 0; i<5 ; i++)
		{
			$(`#d${i+1}_min`).text( fToC($(`#d${i+1}_min`).text()) );
			$(`#d${i+1}_max`).text( fToC($(`#d${i+1}_max`).text()) );
		}

	}
	else if(($(this).attr("id")=='f' && tempUnitState=="C"))
	{
		//alert('c to f');
		tempUnitState='F';
		$("#f").css('text-decoration', 'underline');
		$("#c").css('text-decoration', '');
		$('#tempratureDigit').text( cToF($('#tempratureDigit').text()) );
		for(let i= 0; i<5 ; i++)
		{
			$(`#d${i+1}_min`).text( cToF($(`#d${i+1}_min`).text()) );
			$(`#d${i+1}_max`).text( cToF($(`#d${i+1}_max`).text()) );
		}
	}
	

});  

function fToC(fahrenheit){
	return Math.round((fahrenheit - 32) * 5/9);
}

function cToF(celsius){
	return Math.round((celsius * (9/5)) + 32);
}


function displayWeather(obj){
	 dataArray = getArrayOfDaysWeather(obj);
	console.log(dataArray);
	$("#cityName").text(`${obj.city.name}, ${obj.city.country}`);
		setWeatherDisplay(dataArray[0]);
	displayDaysWeather(dataArray);	

}

function displayDaysWeather(obj){
	for(let i=0 ; i<5 ; i++)
	{
		
		$(`#day${i+1}`).empty();
		
		$(`#day${i+1}`).append(moment(obj[i].dt_txt).format('dddd'));
		$(`#day${i+1}`).append(`<br><img  src= images/${obj[i].weather[0].icon}.png>`);
		let temp=`<br><span id='d${i+1}'><b><span id='d${i+1}_min'>${Math.round(obj[i].main.temp_min)}</span><sup style="padding-left:5px" >O</sup></b>`;
		temp+=` <span id='d${i+1}_max'>  ${Math.round(obj[i].main.temp_max)}</span><sup style="padding-left:5px" >O</sup></span>`;
		$(`#day${i+1}`).append(temp);
	}

}

function setWeatherDisplay(obj){
	$("#dayName").text(moment(obj.dt_txt).format('dddd'));
	$("#weatherType").text(obj.weather[0].main);
	$("#weatherImage").attr("src",`images/${obj.weather[0].icon}.png`);
	$("#pressure").text(`Pressure: ${obj.main.pressure} hPa`);
	$("#humidity").text(`Humidity: ${obj.main.humidity}%`);
	$("#wind").text(`Wind Speed: ${obj.wind.speed} m/s`);
	if(tempUnitState=='F')
	{
		$("#tempratureDigit").text(Math.round(cToF(Math.round(obj.main.temp)))) ;
		$("#f").css('text-decoration', 'underline');
		$("#c").css('text-decoration', '');
	}
	else
	{
		$("#tempratureDigit").text(Math.round(obj.main.temp)) ;
		$("#c").css('text-decoration', 'underline');
		$("#f").css('text-decoration', '');
	}
	
	//console.log(obj);
}

function getArrayOfDaysWeather(object){
	let array=[];
	let indexOfArray=0;
	let time="00:00:00";
	//console.log(moment().format('D'));
	//console.log(moment("2018-01-02 09:00:00").format("D"));
	let date = moment().format('D');
	for(let i=0 ; i<object.cnt ; i++)
	{
		if(date==moment(object.list[i].dt_txt).format("D"))
		{
			array[indexOfArray++]=object.list[i];
			break;
		}

	}
	for(let i=0 ; i<object.cnt ; i++)
	{
		if(date!=moment(object.list[i].dt_txt).format("D")&&time==moment(object.list[i].dt_txt).format("HH:mm:ss"))
		{
			array[indexOfArray++]=object.list[i];
			date=moment(object.list[i].dt_txt).format("D");
		}

	}

	return array;
}




/*
function displayWeather(obj){
	for(let i=0 ; i<5 ; i++)
	{
		let	dayIndex = getIndexOfDay(obj.cnt, i+1);
		console.log(obj.list[dayIndex].dt_txt);
				 
	}

}

function getIndexOfDay(length,day){
	return day==1? 0 : (length-8*(6-day));
}
*/

