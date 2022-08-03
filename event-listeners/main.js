box = document.getElementById('the-box');

// document.querySelector('body').addEventListener('keypress', _ => {
//     console.log('I heard something...')
// })



// window.addEventListener('keyup', (e) => {
    //Didn't work
//     switch (e.key) {
//         case 'ArrowLeft':
//             box.style.left = parseInt(box.style.left) - moveBy + 'px';
//             break;
//         case 'ArrowRight':
//             box.style.left = parseInt(box.style.left) + moveBy + 'px';
//             break;
//         case 'ArrowUp':
//             box.style.top = parseInt(box.style.top) - moveBy + 'px';
//             break;
//         case 'ArrowDown':
//             box.style.top = parseInt(box.style.top) + moveBy + 'px';
//             break;
//     }
// });
document.onkeydown = detectKey;
function detectKey(e) {
    var posLeft = document.getElementById('the-box').offsetLeft;
    var posTop = document.getElementById('the-box').offsetTop;
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        document.getElementById('the-box').style.marginTop  = (posTop-58)+"px";
    }
    else if (e.keyCode == '40') {
        // down arrow
        document.getElementById('the-box').style.marginTop  = (posTop+58)+"px";
    }
    else if (e.keyCode == '37') {
       // left arrow
        document.getElementById('the-box').style.marginLeft  = (posLeft-58)+"px";
    }
    else if (e.keyCode == '39') {
       // right arrow
        document.getElementById('the-box').style.marginLeft  = (posLeft+58)+"px";
    }
}

document.onmousemove = function(e) { 
    var x = e.clientX; 
    var y = e.clientY; 
    document.getElementById('chaser').style.marginLeft  = x+"px";
    document.getElementById('chaser').style.marginTop  = y+"px";
    
}