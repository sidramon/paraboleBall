// - - - - - Variables - - - - - //

let startPosX
let startPosY
let startAngle
let startSpeed
let ticTimeout

let ball

// - - - - - - - - - - - - - - - //

class Ball {
    constructor(startPos=0){
        this.x = startPos
        this.y = 30
        this.size = 30
        this.color = "red"
        this.maxX
        this.setMaxX()
    }

    move() {
        this.x = Math.min(
                this.x + 9.81/Math.abs(Math.tan(startAngle)),
                this.maxX
            )
        this.y = Math.min(-1 * (
            startPosY*-1 + 
            Math.tan(startAngle) * this.x - 
            (
                9.81 / 
                (
                    2 * Math.pow(startSpeed, 2) * 
                    Math.pow(Math.cos(startAngle), 2)
                )
            ) 
            * Math.pow(this.x, 2)
        ), canvas.height - ball.size)      

        console.log("[" + this.x + ", " + this.y + "] ")
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    setMaxX() {
        function equationParabolique(x, size) {
            return Math.min(-1 * (
                startPosY*-1 + 
                Math.tan(startAngle) * x - 
                (
                    9.81 / 
                    (
                        2 * Math.pow(startSpeed, 2) * 
                        Math.pow(Math.cos(startAngle), 2)
                    )
                ) 
                * Math.pow(x, 2)
            ), canvas.height - size)
        }
    
        // Initialisation des variables
        let x = 0
        let increment = 1
    
        // Recherche du zéro le plus élevé
        do {
            x += increment;
        } while (equationParabolique(x, this.size) < canvas.height - this.size)
        
        this.maxX = x
        console.log(x)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById("box");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startSpeedInput = document.getElementById("startSpeed");
    const startAngleInput = document.getElementById("startAngle");
    
    ball = new Ball()
    startPosX = 0
    startPosY = canvas.height-ball.size
    startSpeed = parseFloat(startSpeedInput.value);
    startAngle = parseFloat(startAngleInput.value);
    ticTimeout = 0

    drawArrow()

    document.getElementById("settingsForm").addEventListener('input', function() {
        // Convertit les valeurs en nombres
        let speedValue = parseFloat(startSpeedInput.value) || 1; // Utilise 1 si la valeur n'est pas définie
        let angleValue = parseFloat(startAngleInput.value) || 0.1; // Utilise 0.1 si la valeur n'est pas définie

        // Impose les limites min et max
        speedValue = Math.min(150, Math.max(1, speedValue));
        angleValue = Math.min(90, Math.max(0.1, angleValue));

        // Met à jour les valeurs dans le champ
        startSpeedInput.value = speedValue;
        startAngleInput.value = angleValue;

        // Utilise les valeurs mises à jour dans la simulation
        startSpeed = speedValue;
        startAngle = angleValue * Math.PI / 180;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawArrow()
    });
});

async function startSimulation(){
    ball = new Ball()

    while(true){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ball.move()
        ball.draw()

        drawArrow()

        await new Promise(resolve => setTimeout(resolve, ticTimeout));

        if(ball.y >= canvas.height - ball.size) {
            // Dessine l'étiquette
            ctx.fillStyle = "black";
            ctx.font = "21px Arial";
            ctx.fillText(`x = ${ball.x}`, ball.x - ball.size, ball.y - ball.size);
            break
        }
    }
}

function drawArrow(){
    const arrowSize = startSpeed;
    const arrowX = 0;
    const arrowY = canvas.height - ball.size;
    const arrowEndX = arrowX + arrowSize * Math.cos(startAngle);
    const arrowEndY = arrowY - arrowSize * Math.sin(startAngle);

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowEndX, arrowEndY);
    
    const arrowTipSize = 10;
    const arrowTipAngle = Math.PI / 8;
    
    ctx.lineTo(arrowEndX - arrowTipSize * Math.cos(startAngle - arrowTipAngle), arrowEndY + arrowTipSize * Math.sin(startAngle - arrowTipAngle));
    
    ctx.lineTo(arrowEndX - arrowTipSize * Math.cos(startAngle + arrowTipAngle), arrowEndY + arrowTipSize * Math.sin(startAngle + arrowTipAngle));
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();
}
