// Element references
const htmlElement = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const currentYearSpan = document.getElementById('currentYear');

const startQuizButton = document.getElementById('startQuizButton');
const quizContainer = document.getElementById('quizContainer');
const resultsContainer = document.getElementById('resultsContainer');
const restartQuizButton = document.getElementById('restartQuizButton');

const questionNumberSpan = document.getElementById('questionNumber');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const questionText = document.getElementById('questionText');
const answerOptionsDiv = document.getElementById('answerOptions');

const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const submitQuizButton = document.getElementById('submitQuizButton');
const scoreDisplay = document.getElementById('scoreDisplay');

// Quiz questions array
const quizQuestions = [
    {
        question: "What does HTML stand for?",
        type: "single-select",
        options: [
            "Hyper Text Markup Language",
            "Hyperlink and Text Markup Language",
            "Home Tool Markup Language",
            "Hyper Transfer Markup Language"
        ],
        correctAnswer: "Hyper Text Markup Language"
    },
    {
        question: "Which of these are programming languages? (Select all that apply)",
        type: "multi-select",
        options: [
            "Python",
            "HTML",
            "Java",
            "CSS",
            "JavaScript"
        ],
        correctAnswer: ["Python", "Java", "JavaScript"]
    },
    {
        question: "The capital of France is ______.",
        type: "fill-in-the-blank",
        correctAnswer: "Paris"
    },
    {
        question: "Which CSS property is used for changing the font size of text?",
        type: "single-select",
        options: [
            "text-size",
            "font-style",
            "font-size",
            "text-font"
        ],
        correctAnswer: "font-size"
    },
    {
        question: "What is Node.js primarily used for?",
        type: "single-select",
        options: [
            "Frontend development",
            "Database management",
            "Backend development",
            "Graphic design"
        ],
        correctAnswer: "Backend development"
    }
];

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = Array(quizQuestions.length).fill(null).map((_, i) =>
    quizQuestions[i].type === 'multi-select' ? [] : null
);

// Displays the current question and handles rendering inputs based on question type
function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    questionNumberSpan.textContent = currentQuestionIndex + 1;
    totalQuestionsSpan.textContent = quizQuestions.length;
    questionText.textContent = question.question;
    answerOptionsDiv.innerHTML = '';

    if (question.type === 'single-select') {
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option;
            button.dataset.option = option;
            if (userAnswers[currentQuestionIndex] === option) {
                button.classList.add('selected');
            }
            button.addEventListener('click', () => selectAnswer(option, button, 'single-select'));
            answerOptionsDiv.appendChild(button);
        });
    } else if (question.type === 'multi-select') {
        question.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.classList.add('multi-select-option');
            div.innerHTML = `
                <input type="checkbox" id="option-${currentQuestionIndex}-${index}" value="${option}" class="mr-2 checkbox-input">
                <label for="option-${currentQuestionIndex}-${index}" class="text-lg cursor-pointer">${option}</label>
            `;
            const checkbox = div.querySelector('input[type="checkbox"]');
            if (userAnswers[currentQuestionIndex].includes(option)) {
                checkbox.checked = true;
            }
            checkbox.addEventListener('change', () => selectAnswer(option, checkbox, 'multi-select'));
            answerOptionsDiv.appendChild(div);
        });
    } else if (question.type === 'fill-in-the-blank') {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('fill-in-the-blank-input');
        input.placeholder = 'Type your answer here...';
        if (userAnswers[currentQuestionIndex] !== null) {
            input.value = userAnswers[currentQuestionIndex];
        }
        input.addEventListener('input', (e) => selectAnswer(e.target.value, input, 'fill-in-the-blank'));
        answerOptionsDiv.appendChild(input);
    }

    updateNavigationButtons();
}

// Handles answer selection for different question types
function selectAnswer(value, element, type) {
    if (type === 'single-select') {
        answerOptionsDiv.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
        element.classList.add('selected');
        userAnswers[currentQuestionIndex] = value;
    } else if (type === 'multi-select') {
        let selections = [...userAnswers[currentQuestionIndex]];
        if (element.checked) {
            if (!selections.includes(value)) {
                selections.push(value);
            }
        } else {
            selections = selections.filter(item => item !== value);
        }
        userAnswers[currentQuestionIndex] = selections;
    } else if (type === 'fill-in-the-blank') {
        userAnswers[currentQuestionIndex] = value;
    }
}

// Updates visibility of navigation buttons
function updateNavigationButtons() {
    prevButton.disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex < quizQuestions.length - 1) {
        nextButton.classList.remove('hidden');
        submitQuizButton.classList.add('hidden');
    } else {
        nextButton.classList.add('hidden');
        submitQuizButton.classList.remove('hidden');
    }
}

// Navigation handlers
function nextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Evaluates answers and displays final score
function showResults() {
    score = 0;
    quizQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correctAnswer;

        if (question.type === 'single-select' && userAnswer === correctAnswer) {
            score++;
        } else if (question.type === 'multi-select') {
            const sortedUser = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
            const sortedCorrect = [...correctAnswer].sort();
            if (JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect)) {
                score++;
            }
        } else if (question.type === 'fill-in-the-blank') {
            if (userAnswer && String(userAnswer).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim()) {
                score++;
            }
        }
    });

    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    scoreDisplay.textContent = `You scored ${score} out of ${quizQuestions.length}!`;
}

// Initializes and starts the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = Array(quizQuestions.length).fill(null).map((_, i) =>
        quizQuestions[i].type === 'multi-select' ? [] : null
    );

    startQuizButton.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    displayQuestion();
}

// Resets everything and restarts the quiz
function restartQuiz() {
    startQuiz();
}

// Event bindings
startQuizButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', prevQuestion);
submitQuizButton.addEventListener('click', showResults);
restartQuizButton.addEventListener('click', restartQuiz);

// Dark mode toggle
function applyThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
        themeToggle.checked = true;
    } else {
        htmlElement.classList.remove('dark');
        themeToggle.checked = false;
    }
}

function toggleDarkMode() {
    htmlElement.classList.toggle('dark');
    const theme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('change', toggleDarkMode);

// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    applyThemePreference();
});
