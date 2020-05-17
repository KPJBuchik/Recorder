// navigator.mediaDevices.getUserMedia({audio:true})
// .then(stream => {handlerFunction(stream)})


//       function handlerFunction(stream) {
//       rec = new MediaRecorder(stream);
//       rec.ondataavailable = e => {
//         audioChunks.push(e.data);
//         if (rec.state == "inactive"){
//           let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
//           recordedAudio.src = URL.createObjectURL(blob);
//           recordedAudio.controls=true;
//           recordedAudio.autoplay=true;
//           sendData(blob)
//         }
//       }
//     }
//           function sendData(data) {}

//   record.onclick = e => {
//     console.log('I was clicked')
//     record.disabled = true;
//     stopRecord.disabled=false;
//     audioChunks = [];
//     rec.start();
//   }
//   stopRecord.onclick = e => {
//     console.log("I was clicked")
//     record.disabled = false;
//     stop.disabled=true;
//     record.style.backgroundColor = "red"
//     rec.stop();
//   }

//   var img = document.querySelector('.winder');
// // img.addEventListener('click', onClick, false);


// // function onClick() {
// //     this.removeAttribute('style');
    
// //     var deg = 100 + Math.round(Math.random() * 100);
    
// //     var css = '-webkit-transform: rotate(' + deg + 'deg);';
    
// //     this.setAttribute(
// //         'style', css
// //     );
// // }

window.onload = function() {
  $("#lap").on("click", recordLap);
  $("#stopRecord").on("click", stop);
  $("#record").on("click", reset);
  $("#record").on("click", start);
};

//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

// prevents the clock from being sped up unnecessarily
var clockRunning = false;
var time = 0;
var lap = 1;

function reset() {

  time = 0;
  lap = 1;

  // DONE: Change the "display" div to "00:00."
  $("#display").text("00:00");

  // DONE: Empty the "laps" div.
  $("#laps").text("");
}
function start() {

  // DONE: Use setInterval to start the count here and set the clock to running.
  if (!clockRunning) {
    intervalId = setInterval(count, 1000);
    clockRunning = true;
  }
}
function stop() {

  // DONE: Use clearInterval to stop the count here and set the clock to not be running.
  clearInterval(intervalId);
  clockRunning = false;
}
function recordLap() {

  // DONE: Get the current time, pass that into the timeConverter function,
  //       and save the result in a variable.
  var converted = timeConverter(time);

  // DONE: Add the current lap and time to the "laps" div.
  $("#laps").append("<p>Lap " + lap + " : " + converted + "</p>");

  // DONE: Increment lap by 1. Remember, we can't use "this" here.
  lap++;
}
function count() {

  // DONE: increment time by 1, remember we cant use "this" here.
  time++;

  // DONE: Get the current time, pass that into the timeConverter function,
  //       and save the result in a variable.
  var converted = timeConverter(time);
  console.log(converted);

  // DONE: Use the variable we just created to show the converted time in the "display" div.
  $("#display").text(converted);
}
function timeConverter(t) {

  var minutes = Math.floor(t / 60);
  var seconds = t - (minutes * 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (minutes === 0) {
    minutes = "00";
  }
  else if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return minutes + ":" + seconds;
}





$("#record").on("click", function () {
var deg = 100 + Math.round(Math.random() * 100);

$(".winder").css('-webkit-transform: rotate(' + deg + 'deg);')
$(".recording").css("display", "block");
$(".recording").fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(1000);


})
var vid = document.getElementById("recordedAudio");

// Assign an ontimeupdate event to the video element, and execute a function if the current playback position has changed
vid.ontimeupdate = function () { myFunction() };

function myFunction() {
    console.log("current-time" + vid.currentTime)
    // Display the current position of the video in a p element with id="demo"
    document.getElementById("demo").innerHTML = vid.currentTime;
}


var vid = document.getElementById("recordedAudio");
vid.ontimeupdate = function () {
    var percentage = (vid.currentTime / vid.duration) * 100;
    $("#custom-seekbar span").css("width", percentage + "%");
};

$("#custom-seekbar").on("click", function (e) {
    var offset = $(this).offset();
    var left = (e.pageX - offset.left);
    var totalWidth = $("#custom-seekbar").width();
    var percentage = (left / totalWidth);
    var vidTime = vid.duration * percentage;
    vid.currentTime = vidTime;
});//click()


$('#record').click(function() {
    $('.winder').animate(
      { deg: 360 },
      {
        duration: 20000,
        step: function(now) {
          $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }
      }
    );
  });
  
  $('#record').click(function() {
    $('.winder2').animate(
      { deg: 360 },
      {
        duration: 20000,
        step: function(now) {
          $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }
      }
    );
  });
// var audioSrc= $("audio").val("src")
//   var wavesurfer = WaveSurfer.create({
//     container: '#waveform',
//     waveColor: 'violet',
//     progressColor: 'purple'
// });
// wavesurfer.load(audioSrc);
// webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("record");
var stopButton = document.getElementById("stopRecord");
var pauseButton = document.getElementById("pause");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
	console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/
		audioContext = new AudioContext();

		//update the format 

		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUserMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		//pause
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML="Pause";
	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
  rec.exportWAV(createDownloadLink);

}

function createDownloadLink(blob) {
	var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  au.classList.add("new-recording");
  var li = document.createElement('ul');

  var link = document.createElement('div');
  var dink = document.createElement('a');

  link.classList.add("download-icon");

  var customBar= document.createElement('div');
  var playNewRecording = document.createElement("div");
  var audioSeekBar = document.createElement("div")
  audioSeekBar.classList.add("newSeekBar");

  playNewRecording.classList.add("playNewRecording");
  customBar.classList.add("custom-seekbar");
	//name of .wav file to use during upload and download (without extendion)
  var filename = new Date().toISOString();
  var trackName = $("#track-name").val();
	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	dink.href = url;
	// dink.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	dink.innerHTML = "hey";

	//add the new audio element to li
	li.appendChild(au);

  //add default filename if no name is given
  
  if (trackName === ""){
  li.appendChild(document.createTextNode(filename+".wav "))
  }
  else {
   li.appendChild(document.createTextNode(trackName+".wav "))
  }
	//add the save to disk link to li
	audioSeekBar.appendChild(link);
  li.appendChild(playNewRecording)
  li.appendChild(audioSeekBar)
  li.appendChild(customBar)
	//upload link
	// li.appendChild(document.createTextNode (" "))//add a space in between
	//add the li element to the ol
  recordingsList.appendChild(li);
  
  $(".playNewRecording").on("click", function(){
    console.log("hey")
    $("audio").trigger("play");
    
    
    })
    
}

$(".submit").on("click", function(event){
event.preventDefault()
})

// $("#stopRecord").on("click", function(event){
//   event.preventDefault()
//   $("#track-name").val("")
// })
