const sets = [
    { name: "集中時間", minutes: 25, instruction: "集中：ミュート", style: "bg-danger" },
    { name: "休憩時間", minutes: 5, instruction: "休憩：ミュート解除", style: "bg-info" }
]

const body = document.getElementById("body");
const time = document.getElementById("time");
const cycle = document.getElementById("cycle");
const instruction = document.getElementById("instruction");

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startTimer);

const audio = new Audio();
audio.src = "chime.mp3";

let cycles = 0;     // 集中＋休憩を何周したか
let currentSet = 0; 
let startTime;      // 現在のセットの開始時刻のタイムスタンプ [ms]
let timer;

function reset(){
    cycles = 0;
    currentSet = 0;
}

function startTimer(){
    audio.play();

    startTime = Date.now(); // 開始時刻を変数に記録する
    if(timer) clearInterval(timer);

    body.classList.add(sets[currentSet].style);             // 背景色を変える
    instruction.textContent = sets[currentSet].instruction; // 説明を変える
    startButton.disabled = true;                            // スタートボタンを無効にする

    timer = setInterval(updateTimer, 200);
}


function updateTimer(){
    const now = Date.now(); // 現在時刻[ミリ秒]
    const ellapsedTime = Math.round((now - startTime) / 1000); // セット開始後の経過時間[秒]
    const setFinishTime = sets[currentSet].minutes * 60;       // セットの時間[秒]
    const remainingTime = setFinishTime - ellapsedTime;        // セットの残り時間[秒]

    if(remainingTime >= 0){ // 残り時間の表示を更新する
        time.textContent = Math.floor(remainingTime / 60) + ":" + ('0' + remainingTime % 60).slice(-2);
    }
    else{ // セット終了
        if(timer) clearInterval(timer);
        audio.play();
        nextSet();
    }
}


function nextSet(){
    instruction.textContent = sets[currentSet].name + "終了"
    body.classList.remove(sets[currentSet].style);

    currentSet++;
    if(currentSet >= sets.length){
        cycles++;
        currentSet = 0;
    }

    cycle.textContent = cycles;

    startButton.disabled = false;
    startButton.textContent = sets[currentSet].name + "を始める";
}