const textInput = document.getElementById("textInput");
const voiceSelect = document.getElementById("voiceSelect");
const speakBtn = document.getElementById("speakBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copyBtn = document.getElementById("copyBtn");
const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");

let voices = [];

function loadVoices(){
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  let defaultIndex = 0;

  voices.forEach((voice,i)=>{
    const option = document.createElement("option");
    option.value=i;
    option.textContent = voice.name + " (" + voice.lang + ")";
    voiceSelect.appendChild(option);

    if(
      voice.lang.includes("ur") ||
      voice.lang.includes("hi")
    ){
      defaultIndex=i;
    }
  });

  voiceSelect.value = defaultIndex;
}

speechSynthesis.onvoiceschanged = loadVoices;

// Speak
speakBtn.onclick = ()=>{
  if(!textInput.value) return alert("Text likho pehle!");
  const utter = new SpeechSynthesisUtterance(textInput.value);
  utter.voice = voices[voiceSelect.value];
  utter.rate = rate.value;
  utter.pitch = pitch.value;
  speechSynthesis.speak(utter);
};

// Copy text
copyBtn.onclick = ()=>{
  if(!textInput.value) return alert("Text likho pehle!");
  navigator.clipboard.writeText(textInput.value);
  alert("Text copied!");
};

// Download WAV (browser)
downloadBtn.onclick = async ()=>{
  if(!textInput.value) return alert("Text likho pehle!");
  
  const utter = new SpeechSynthesisUtterance(textInput.value);
  utter.voice = voices[voiceSelect.value];
  utter.rate = rate.value;
  utter.pitch = pitch.value;

  const audioCtx = new AudioContext();
  const dest = audioCtx.createMediaStreamDestination();
  const recorder = new MediaRecorder(dest.stream);
  let chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks,{type:"audio/wav"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EchoLab.wav";
    a.click();
  };

  const source = audioCtx.createMediaStreamSource(dest.stream);
  recorder.start();
  speechSynthesis.speak(utter);
  utter.onend = ()=> recorder.stop();
};

// Dark Mode
function toggleDark(){ document.body.classList.toggle("dark"); }
