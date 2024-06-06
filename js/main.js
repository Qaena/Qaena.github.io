var secondsRemaining;
var wordsGuessed = 0;
var intervalId;
var waitingForTipUp = false;
var usedWords = [];
var globalCategory = "anything";

init();

function init() {
  if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function") {
    document.querySelector(".permissions").classList.remove("hidden");
  }

  document.querySelector(".game").addEventListener("mouseup", () => {
    triggerNextWord();
  });
  document.querySelector(".game").addEventListener("touchend", (event) => {
    event.preventDefault(); 
    triggerNextWord();
  });

  document.querySelector(".recap").addEventListener("mouseup", () => {
    navigate("settings");
  });
  document.querySelector(".recap").addEventListener("touchend", (event) => {
    event.preventDefault(); 
    navigate("settings");
  });

  document.querySelector(".cancelButton").addEventListener("mouseup", () => {
    cancelRound();
  });
  document.querySelector(".cancelButton").addEventListener("touchend", (event) => {
    event.preventDefault(); 
    cancelRound();
  });

  document.querySelector(".startButton").addEventListener("mouseup", () => {
    startRound();
  });
  document.querySelector(".startButton").addEventListener("touchend", (event) => {
    event.preventDefault(); 
    startRound();
  });

  document.querySelector(".minus").addEventListener("mouseup", () => {
    modifyTime(-15);
  });
  document.querySelector(".minus").addEventListener("touchend", (event) => {
    event.preventDefault(); 
    modifyTime(-15);
  });

  document.querySelector(".plus").addEventListener("mouseup", () => {
    modifyTime(15);
  });
  document.querySelector(".plus").addEventListener("touchend", (event) => {
    event.preventDefault(); 
    modifyTime(15);
  });

  document.querySelectorAll(".buttonArrayOption").forEach(el => {
    el.addEventListener("mouseup", () => {
      selectCategory(el.getAttribute("value"));
    });
    el.addEventListener("touchend", (event) => {
      event.preventDefault(); 
      selectCategory(el.getAttribute("value"));
    });
  });
}

function startRound() {
  secondsRemaining = 5;

  document.querySelector(".timer").innerHTML = convertSecondsToText(secondsRemaining);
  globalCategory = document.querySelector(".buttonArrayOption.selected").getAttribute("value");

  navigate("game");

  intervalId = setInterval(secondTick, 1000);
}

function secondTick() {
  secondsRemaining--;

  if (secondsRemaining == 0) {
    if (!document.querySelector(".cover").classList.contains("hidden")) { //if this is the beginning of the game cover
      secondsRemaining = parseInt(document.querySelector(".timeLimit").getAttribute("value"));
      document.querySelector(".cover").classList.add("hidden");
      displayNewWord(globalCategory);
    } else { //otherwise if it's the end of the game
      navigate("recap");
      clearInterval(intervalId);
    }
  }

  document.querySelector(".timer").innerHTML = convertSecondsToText(secondsRemaining);
}

function modifyTime(seconds) {
  const minTime = 30;
  const maxTime = 90;

  let timeLimitEl = document.querySelector(".timeLimit");
  let newSeconds = parseInt(timeLimitEl.getAttribute("value")) + seconds;

  newSeconds = Math.min(newSeconds, maxTime);
  newSeconds = Math.max(newSeconds, minTime);

  timeLimitEl.innerHTML = convertSecondsToText(newSeconds);
  timeLimitEl.setAttribute("value",newSeconds);
}

function convertSecondsToText(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds - (minutes * 60);

  return remainingSeconds < 10 ? minutes + ":0" + remainingSeconds : minutes + ":" + remainingSeconds;
}

function permission () {
  if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
      DeviceMotionEvent.requestPermission()
          .then( response => {
          // (optional) Do something after API prompt dismissed.
          if ( response == "granted" ) {
              window.addEventListener( "devicemotion", (e) => {
                let acceleration = event.accelerationIncludingGravity;
                // Extract device's orientation data (e.g., pitch)
                let pitch = Math.atan2(acceleration.x, Math.sqrt(acceleration.y * acceleration.y + acceleration.z * acceleration.z));

                if (Math.abs(pitch) < 0.75) {
                  waitingForTipUp = true;
                } else if (Math.abs(pitch) > 1.1 && waitingForTipUp) {
                  if (!document.querySelector(".game").classList.contains("hidden")) {
                    triggerNextWord();
                  }
                  waitingForTipUp = false;
                }
              })

              document.querySelector(".permissions").classList.add("hidden");
          }
      })
          .catch( console.error )
  }
}

function triggerNextWord() {
  wordsGuessed++;
  document.querySelector(".wordCount").innerHTML = wordsGuessed;
  displayNewWord(globalCategory);
}

function displayNewWord(category) {
  let potentialNewWord = data[category][Math.floor(Math.random() * data[category].length)];

  while (usedWords.indexOf(potentialNewWord) >= 0) {
    potentialNewWord = data[category][Math.floor(Math.random() * data[category].length)];
  }
  usedWords.push(potentialNewWord);

  document.querySelector(".word").innerHTML = potentialNewWord;
}

function cancelRound() {
  navigate("settings");
  clearInterval(intervalId);
}

function navigate(page) {
  document.querySelectorAll(".page").forEach((pageEl) => pageEl.classList.add("hidden"));
  document.querySelector("." + page).classList.remove("hidden");
}

function selectCategory(dataCategory) {
  document.querySelectorAll(".buttonArrayOption").forEach(el => {
    el.classList.remove("selected");
  });

  document.querySelector(".buttonArrayOption[value=\"" + dataCategory + "\"]").classList.add("selected");
}