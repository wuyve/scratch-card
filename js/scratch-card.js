var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.beginPath();
context.fillStyle = 'grey';
context.fillRect(0, 0, 600, 649);
canvas.onmousedown = () => {
    canvas.onmouseover = () => {
        let x = event.clientX - (window.screen.availWidth - canvas.width) / 2;
        let y = event.clientY - (window.screen.availHeight - canvas.height) / 2;
        console.log(event.clientX, event.clientY);
        console.log(x, y)
        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(x, y, 30, 0, Math.PI * 2);
        context.fill();
    }
}
canvas.onmouseup = () => {
    canvas.onmouseover = () => {}
}