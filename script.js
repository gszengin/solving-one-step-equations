let score = 0;
let timeLeft = 60;
let timer;
let correctAnswers = 0;
let wrongAnswers = 0;
let correctStreak = 0; // Declare correctStreak
let currentQuestion = {};

// Function to generate random integers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate one-step equations with only integer solutions
function generateQuestion() {
    let type = getRandomInt(1, 4);
    let x, num, answer, question;

    switch (type) {
        case 1: // Addition (x + num = result)
            x = getRandomInt(1, 20);
            num = getRandomInt(1, 20);
            answer = x;
            question = `x + ${num} = ${x + num}`;
            break;
        case 2: // Subtraction (x - num = result)
            x = getRandomInt(10, 30);
            num = getRandomInt(1, 10);
            answer = x;
            question = `x - ${num} = ${x - num}`;
            break;
        case 3: // Multiplication (num * x = result)
            num = getRandomInt(2, 10);
            x = getRandomInt(1, 10);
            answer = x;
            question = `${num}x = ${num * x}`;
            break;
        case 4: // Division (x / num = result) - Ensures integer solution
            num = getRandomInt(2, 10);  // Divisor
            answer = getRandomInt(1, 10);  // Quotient
            x = num * answer;  // Ensure x is a multiple of num
            
            // Wrap everything in a flex container for full centering
            question = `<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
                            <span style="font-weight: bold; margin-right: 10px;">Solve:</span>
                            <span style="display: inline-flex; align-items: center;">
                                <span style="display: inline-block; text-align: center; margin-right: 5px;">
                                    <span style="border-bottom: 2px solid black; display: block; padding: 2px 5px;">x</span>
                                    <span>${num}</span>
                                </span>
                                &nbsp;= ${answer}
                            </span>
                        </div>`;
            break;
    }

    currentQuestion = { answer: x };  // Store correct value of x
    document.getElementById("question").innerHTML = question;  
    document.getElementById("answer").value = ""; // Clear previous answer
}


// Allow Enter key to submit answer
document.addEventListener("DOMContentLoaded", function () {
    // Initially disable the answer input and submit button
    document.getElementById("answer").disabled = true;
    document.querySelector("#question-box button").disabled = true;

    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("answer").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    // Generate the first question but disable answering
    generateQuestion();
});

// Check user answer
function checkAnswer() {
    let userAnswer = document.getElementById("answer").value.trim(); // Remove spaces
    let correctAnswer = Number(currentQuestion.answer); // Ensure correct answer is a number
    let feedbackElement = document.getElementById("feedback"); // Get feedback element

    // Check if an answer has been entered
    if (userAnswer === "") {
        feedbackElement.innerText = "⚠️ Please enter an answer.";
        return;
    }

    let userNumber = Number(userAnswer);

    // Check if the entered answer is a number
    if (isNaN(userNumber)) {
        feedbackElement.innerText = "❌ Please enter a valid number.";
        return;
    }

    if (userNumber === correctAnswer) {
        score++;
        correctAnswers++;
        correctStreak++; // Increase correct streak

        // Random positive feedback messages
        let positiveFeedback = [
            "Great job! 🎉",
            "You're a math master! 🔥",
            "Keep it up! 🚀",
            "Awesome work! ✅",
            "You’re nailing this! 🌟"
        ];

        // Pick a random phrase
        let feedbackMessage = positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)];

        // Special bonus messages for streaks
        if (correctStreak === 3) {
            feedbackMessage = "Incredible! You're on fire! 🔥🔥🔥";
        } else if (correctStreak === 5) {
            feedbackMessage = "Math genius alert! 🚀💡";
        } else if (correctStreak === 10) {
            feedbackMessage = "Unstoppable! 🏆 You should be teaching this! 👏";
        }

        feedbackElement.innerText = feedbackMessage;
    } else {
        correctStreak = 0; // Reset streak if incorrect
        wrongAnswers++;
        feedbackElement.innerText = "❌ Incorrect, try again!";
    }

    document.getElementById("score").textContent = score; // Update only the score number
    generateQuestion(); // Generate new question
}


// Start the challenge
function startGame() {
    score = 0;
    timeLeft = parseInt(document.querySelector('input[name="timer"]:checked').value);

    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timeLeft;

    if (timer) {
        clearInterval(timer);
    }

    generateQuestion();

    // Enable the answer input field and the submit button
    document.getElementById("answer").disabled = false;
    document.querySelector("#question-box button").disabled = false;

    // Clear the previous answer field value
    document.getElementById("answer").value = "";

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("timer").textContent = timeLeft;
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();  // ✅ Ensure the game ends when time runs out
        }
    }, 1000);
}




// End the challenge
function endGame() {
    clearInterval(timer);
    document.getElementById("final-score").innerText = score;
    document.getElementById("end-screen").classList.remove("hidden");

    // ❌ Disable input and submit button after game ends
    document.getElementById("answer").disabled = true;
    document.querySelector("#question-box button").disabled = true;
}


// Generate and display certificate
function generateCertificate() {

    document.getElementById("certificate").style.display = "block";

    let playerName = document.getElementById("player-name").value.trim();
    if (playerName === "") {
        playerName = "Student"; // Default if no name is entered
    }

    let totalQuestions = correctAnswers + wrongAnswers;
    let percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;

    // Achievement messages based on performance
    let achievementMessage = "";
    if (percentage === 100) {
        achievementMessage = "Outstanding performance! You achieved a perfect score! 🌟";
    } else if (percentage >= 90) {
        achievementMessage = "Amazing work! You're mastering one-step equations like a pro! 🚀";
    } else if (percentage >= 75) {
        achievementMessage = "Great job! You're on your way to becoming a math expert! 💡";
    } else if (percentage >= 50) {
        achievementMessage = "Good effort! Keep practicing and you'll be a pro in no time! 🔥";
    } else {
        achievementMessage = "Keep going! Every mistake is a step toward improvement. 💪";
    }

    // Get the selected timer challenge
    let selectedTimer = document.querySelector('input[name="timer"]:checked')?.value || "Unknown";

    // Certificate template
    let certificateHTML = `
        <h2>Solving One-Step Equations Challenge Certificate</h2>
        <p><strong>Congratulations, ${playerName}!</strong></p>
        <p>You completed the Solving One-Step Equations Challenge in <strong>${selectedTimer} seconds</strong> with the following results:</p>
        <ul>
            <p><strong>Correct Answers:</strong> ${correctAnswers} and <strong>Wrong Answers:</strong> ${wrongAnswers}</p>
            <p><strong>Total Questions Attempted:</strong> ${totalQuestions}</p>
            <p><strong>Accuracy:</strong> ${percentage}%</p>
        </ul>
        <p>${achievementMessage}</p>
        <p>Keep up the great work, and continue sharpening your math skills! </p>
    `;

    document.getElementById("certificate").innerHTML = certificateHTML;
}


// Save certificate as an image
function saveCertificateAsImage() {
    html2canvas(document.getElementById("certificate")).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "Equation_Certificate.png";
        link.click();
    });
}


function saveCertificateAsPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "landscape", // Landscape format
        unit: "in", // Use inches
        format: [11, 8.5] // US Letter size (11 x 8.5 inches)
    });

    const certificateElement = document.getElementById("certificate");

    html2canvas(certificateElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        const margin = 0.5; // Adjust bottom margin (in inches)
        const imgWidth = 10.2; // Keep some space on left/right
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.setFontSize(15); // Adjust font size (default is 16)

        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight - margin); // Adds spacing at bottom
        pdf.save("Solving_One_Step_Equations_Certificate.pdf"); // Updated file name
    });
}
