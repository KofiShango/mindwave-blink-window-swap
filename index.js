const { createClient } = require("node-thinkgear-sockets");
const debounce = require('debounce');
const robotjsCombos = require('robotjs-combo');
const brain = createClient({ enableRawOutput: false });

const swapRight = ['command', 'control', 'right'];
const swapLeft = ['command', 'control', 'left'];

let blink = true;
// Toggle right next?
let goRight = true;
let debugLogging = false;

/**
 * Debounce toggle by 5 secs
 * to keep from spamming
 */
const toggle = debounce(()=>{
    console.log("Window toggled");
    if(goRight){
        robotjsCombos(swapRight,function(){
            console.log("swap right");
        },300);
    }else{
        robotjsCombos(swapLeft,function(){
            console.log("swap left");
        },300);
    }
    goRight = !goRight;
}, 5000, true);

brain.connect();

// Blink logic
brain.on('blink_data', data=>{
    console.log("Blink mode active. Blink to swap desktops.");
    const blinkStrength = data && data.blinkStrength;
    debugLogging && console.log("Blink Strength: ", blinkStrength);
    if(blinkStrength > 65){
        toggle();
    }
});
