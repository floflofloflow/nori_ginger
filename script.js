// Quiz and Reservation Data
const quizData = [
    {
        question: "What's our favorite cuisine?",
        options: ["Italian", "Japanese", "Mexican", "French"],
        scores: [25, 30, 20, 25]
    },
    {
        question: "Where did we first meet?",
        options: ["At work", "Through friends", "At a restaurant", "Online"],
        scores: [30, 25, 28, 17]
    },
    {
        question: "What's our favorite thing to do together?",
        options: ["Travel", "Cooking", "Movies", "Hiking"],
        scores: [25, 35, 20, 20]
    },
    {
        question: "Which of these best describes our relationship?",
        options: ["Adventurous foodies", "Cozy homebody vibes", "Always exploring", "Spontaneous romantics"],
        scores: [32, 20, 24, 24]
    },
    {
        question: "What time do we usually prefer to dine?",
        options: ["Early dinner (5-6 PM)", "Standard dinner (7-8 PM)", "Late dinner (9-10 PM)", "Varies"],
        scores: [20, 35, 25, 20]
    }
];

const reservations = [
    {
        name: "La Dolce Vita",
        cuisine: "Italian",
        emoji: "🍝",
        description: "A romantic Italian restaurant with candlelit ambiance and authentic pasta dishes. We love the warmth and simplicity of Italian traditions—much like our love story!",
        date: "March 14, 2026",
        time: "7:00 PM",
        minScore: 0,
        maxScore: 60,
        message: "We love your adventurous spirit! Join us for classic Italian romance."
    },
    {
        name: "Sakura Dreams",
        cuisine: "Japanese",
        emoji: "🍣",
        description: "Experience exquisite Japanese cuisine with fresh sushi and intimate seatings. The precision and artistry reflect how we approach our relationship.",
        date: "March 21, 2026",
        time: "7:30 PM",
        minScore: 61,
        maxScore: 75,
        message: "Perfect match! You know how much we appreciate precision and elegance."
    },
    {
        name: "Casa Fiesta",
        cuisine: "Mexican",
        emoji: "🌮",
        description: "Vibrant Mexican flavors with lively atmosphere and amazing cocktails. This captures our playful energy and zest for life together!",
        date: "March 28, 2026",
        time: "7:00 PM",
        minScore: 76,
        maxScore: 85,
        message: "Great answers! Let's celebrate together with bold flavors and good vibes."
    },
    {
        name: "Le Petit Noir",
        cuisine: "French",
        emoji: "🥐",
        description: "Sophisticated French bistro with timeless elegance and world-class service. You truly understand the romance and refinement of our bond!",
        date: "April 4, 2026",
        time: "8:00 PM",
        minScore: 86,
        maxScore: 100,
        message: "Outstanding! You truly know us well. Prepare for an unforgettable evening."
    }
];

class ReservationQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.totalScore = 0;
        this.init();
    }

    init() {
        this.renderQuestion();
        this.attachEventListeners();
    }

    renderQuestion() {
        const question = quizData[this.currentQuestion];
        const questionElement = document.getElementById('question');
        const optionsContainer = document.getElementById('optionsContainer');
        const totalQuestions = document.getElementById('totalQuestions');

        questionElement.textContent = question.question;
        totalQuestions.textContent = quizData.length;

        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option';
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => this.selectOption(index));

            if (this.answers[this.currentQuestion] === index) {
                optionButton.classList.add('selected');
            }

            optionsContainer.appendChild(optionButton);
        });

        this.updateProgress();
    }

    selectOption(index) {
        const question = quizData[this.currentQuestion];
        this.answers[this.currentQuestion] = index;

        // Update score
        this.totalScore = this.answers.reduce((sum, answerIndex, questionIndex) => {
            if (answerIndex !== undefined) {
                return sum + quizData[questionIndex].scores[answerIndex];
            }
            return sum;
        }, 0);

        this.renderQuestion();
        this.updateButtons();
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / quizData.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
    }

    updateButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.style.display = this.currentQuestion > 0 ? 'block' : 'none';
        nextBtn.style.display = 'block';

        if (this.currentQuestion === quizData.length - 1) {
            nextBtn.textContent = 'See My Reservation →';
            nextBtn.onclick = () => this.completeQuiz();
        } else {
            nextBtn.textContent = 'Next →';
            nextBtn.onclick = () => this.nextQuestion();
        }

        prevBtn.onclick = () => this.previousQuestion();
    }

    nextQuestion() {
        if (this.currentQuestion < quizData.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }

    completeQuiz() {
        // Show reservation section
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('reservationSection').style.display = 'block';

        // Get reservation based on score
        const maxPossibleScore = quizData.reduce((sum, q) => {
            return sum + Math.max(...q.scores);
        }, 0);

        const percentage = Math.round((this.totalScore / maxPossibleScore) * 100);
        const reservation = this.getReservation(percentage);

        // Display score
        document.getElementById('scoreDisplay').textContent = percentage;
        document.getElementById('scoreFill').style.width = percentage + '%';

        // Display reservation
        this.displayReservation(reservation);

        // Attach button listeners
        document.getElementById('retakeBtn').addEventListener('click', () => this.restartQuiz());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareResult(reservation));
    }

    getReservation(percentage) {
        return reservations.find(
            res => percentage >= res.minScore && percentage <= res.maxScore
        ) || reservations[0];
    }

    displayReservation(reservation) {
        document.getElementById('restaurantName').textContent = reservation.name;
        document.getElementById('cuisine').textContent = reservation.cuisine + ' Cuisine';
        document.getElementById('restaurantImage').textContent = reservation.emoji;
        document.getElementById('dateDisplay').textContent = reservation.date;
        document.getElementById('timeDisplay').textContent = reservation.time;
        document.getElementById('description').textContent = reservation.description;
        document.getElementById('specialMessage').textContent = reservation.message;
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        this.totalScore = 0;

        document.getElementById('quizSection').style.display = 'block';
        document.getElementById('reservationSection').style.display = 'none';

        this.renderQuestion();
    }

    shareResult(reservation) {
        const text = `I got a reservation at ${reservation.name} on ${reservation.date} at ${reservation.time}! 🎉 Take the quiz to find YOUR celebration dinner: ${window.location.href}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Reservation details copied! You can now share it with others.');
        }).catch(() => {
            alert(`Share this: ${text}`);
        });
    }

    attachEventListeners() {
        this.updateButtons();
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReservationQuiz();
});
