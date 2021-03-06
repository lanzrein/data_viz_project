const PLAYER_ID = 'PLAYER';

let singleView = true;
// function HEIGHT() { return PADDING + (agentNum * (INFO_HEIGHT + PADDING)) }
let agents = [];
let tasks = [];
let irisModel;
let loops = 1;

let speed = 64;

function setup() {
  //createCanvas(WIDTH(), HEIGHT());
  //createCanvas(0,0);
  noCanvas();
  //to get rid of bottom menu remove it and set HEIGHT ~~ window.innerHeight
  let behaviors = {
    curious: 3,
    perfectionist: 3,
    geniesser: 2,
    capitalist: 2
  };

  let min_wage = 0;
  let tasks_num = 2;
  let players = 0; // here you set the players for the game
  console.log("Loaded model")
  irisModel = new IrisModel(behaviors, min_wage, tasks_num, players);
  // textSize(TEXT_SIZE);
  //this is the setup for the visualization
  setup_iris();

  add_key_listeners();

}


function draw() {
  //instead of drawing with P5 we use a tick to draw with d3.
  //this sounds clumsy but was the best way to ensure compatibility with the current project without
  //having to change significally the current code.

  // tick_func();
  if(!pause){
    irisModel.update()
  };
  if(frameCount % speed == 0){
      tick();
  }

  // for (let i = 0; i < loops; i++) {
  //   irisModel.update();
  // }
  // if (frameCount % 15 == 0) irisModel.show();
  // document.getElementById('whatFrameRate').innerHTML = 'Frame rate: <br>' + frameRate();
  // // noLoop();
}

// function windowResized() {
//   // resizeCanvas(WIDTH(), HEIGHT());
//   let info = document.getElementById('info-window')
//   console.log(info.getBoundingClientRect().width);
// }

// function mouseClicked(){
//   irisModel.update();
// }

function drawInfos(agent) {
  let infos = agent.getPreferencesAsArray();
  noFill();
  beginShape();
  stroke(0, 255, 255, 70)
  let i = 0;
  for (const info of infos) {
    let posX = map(i, 0, infos.length, PADDING, width - PADDING);
    let posY = map(info, MINIMUM, MAXIMUM, height - PADDING, height - COL_HEIGHT);
    vertex(posX, posY);
    i++;
  }
  endShape();
  // console.log(infos);
}
/**
 * here we add all the event listeners for the menu
 */

 /*
let recordData = document.getElementById('record-data')
recordData.addEventListener('click', () => {
  irisModel.recordData();
});

let showSideBar = true;
$('#show-sidebar').click(() => {
  showSideBar = !showSideBar;
  $('#show-sidebar').text(showSideBar == false ? 'SHOW SIDEBAR' : 'HIDE SIDEBAR');
  $('#info-window').toggle('fast', () => {
    // whe the window is closed resize the sketch
    // resizeCanvas(WIDTH(), HEIGHT());
    let info = document.getElementById('info-window')
    console.log(info.getBoundingClientRect().width);
  });
});

$('#show-menu').click(() => {
  $('.menu').toggle('fast');
})

$('#close-menu').click(() => {
  $('.menu').toggle('fast');
})

$('#select-behavior').click(el => {
  // console.log($("#select-behavior option:selected").val());
  const behavior = $("#select-behavior option:selected").val();
  // irisModel.setAgentsBehavior(behavior);
  const agentsNumber = document.getElementById('how-many-agents');
  const inputCustom = document.getElementsByClassName('custom-behavior');
  // const behavior = $("#select-behavior option:selected").val();
  // here we reset the values of the behaviors to 0
  for (const el of inputCustom) {
    el.value = 0;
  }
  // hee we update them to all *behavior*
  switch (behavior) {
    case 'curious':
      inputCustom.curious.value = agentsNumber.value;
      break;
    case 'perfectionist':
      inputCustom.perfectionist.value = agentsNumber.value;
      break;
    case 'geniesser':
      inputCustom.geniesser.value = agentsNumber.value;
      break;
    case 'capitalist':
      inputCustom.capitalist.value = agentsNumber.value;
      break;
  }
})

const setSpeed = document.getElementById('model-speed');
setSpeed.addEventListener('change', event => {
  loops = setSpeed.value;
})

const minWage = document.getElementById('min-wage');
minWage.addEventListener('change', event => {
  $('#set-min-wage').text(minWage.value);
})

$('.custom-behavior').change(() => {
  let sum = 0;
  const agentsNumber = document.getElementById('how-many-agents');
  const taskNumber = document.getElementById('how-many-task');
  const inputCustom = document.getElementsByClassName('custom-behavior');
  for (const el of inputCustom) {
    sum += parseInt(el.value);
  }
  console.log(sum);
  agentsNumber.value = sum;
  taskNumber.value = Math.floor(sum / 5);
});

function restartModel() {
  const customBehavior = document.getElementsByClassName('custom-behavior');
  const minWage = document.getElementById('min-wage');
  const tasksNum = document.getElementById('how-many-task');
  const behaviors = {
    curious: parseInt(customBehavior.curious.value),
    perfectionist: parseInt(customBehavior.perfectionist.value),
    geniesser: parseInt(customBehavior.geniesser.value),
    capitalist: parseInt(customBehavior.capitalist.value)
  }

  const min_wage = parseInt(minWage.value);
  const tasks_num = parseInt(tasksNum.value);
  const players = 0;
  irisModel = new IrisModel(behaviors, min_wage, tasks_num, players);
}

function updateView() {
  // console.log('hello');
  const view = document.getElementById('view');
  irisModel.setView(parseInt(view.value));
}*/
