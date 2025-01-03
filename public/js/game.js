class PlakaGame {
  constructor() {
    this.score = 0;
    this.currentQuestion = 0;
    this.timer = null;
    this.timeLeft = 10;
    this.questions = [];
    this.correctAnswer = null;

    // DOM elementleri
    this.startScreen = document.getElementById("start-screen");
    this.startButton = document.getElementById("start-button");
    this.plakaElement = document.getElementById("plaka");
    this.scoreElement = document.getElementById("score");
    this.questionElement = document.getElementById("current-question");
    this.timeElement = document.getElementById("time");
    this.options = document.querySelectorAll(".option");

    // Event listeners
    this.startButton.addEventListener("click", () => this.startGame());
    this.options.forEach((option) => {
      option.addEventListener("click", (e) => this.checkAnswer(e));
    });
  }

  startGame() {
    this.score = 0;
    this.currentQuestion = 0;
    this.questions = this.generateQuestions();
    this.startScreen.style.display = "none";
    this.updateScore();
    this.updateQuestionCount();
    this.showQuestion();
  }

  generateQuestions() {
    // 81 ilden rastgele 15 tanesini seç
    let shuffled = [...PLAKALAR].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 15);
  }

  showQuestion() {
    if (this.currentQuestion >= 15) {
      this.endGame();
      return;
    }

    this.resetTimer();
    this.updateQuestionCount();
    const currentPlaka = this.questions[this.currentQuestion];
    this.plakaElement.textContent = currentPlaka.kod;
    this.correctAnswer = currentPlaka.il;

    // 4 seçenek oluştur (1 doğru, 3 yanlış)
    let options = this.generateOptions(currentPlaka);

    // Seçenekleri karıştır
    options.sort(() => 0.5 - Math.random());

    // Seçenekleri butonlara yerleştir
    this.options.forEach((button, index) => {
      button.textContent = options[index];
      button.disabled = false;
      button.className =
        "option btn btn-outline-primary animate__animated animate__fadeIn";
    });
  }

  generateOptions(currentPlaka) {
    let options = [currentPlaka.il];
    let otherCities = PLAKALAR.filter((plaka) => plaka.il !== currentPlaka.il);

    // Rastgele 3 yanlış şehir seç
    for (let i = 0; i < 3; i++) {
      let randomIndex = Math.floor(Math.random() * otherCities.length);
      options.push(otherCities[randomIndex].il);
      otherCities.splice(randomIndex, 1);
    }

    return options;
  }

  checkAnswer(e) {
    clearInterval(this.timer);
    const selectedAnswer = e.target.textContent;
    const button = e.target;

    if (selectedAnswer === this.correctAnswer) {
      this.score += 100;
      button.className =
        "option btn btn-success animate__animated animate__pulse";
      this.updateScore();
    } else {
      button.className =
        "option btn btn-danger animate__animated animate__shakeX";
      // Doğru cevabı göster
      this.options.forEach((option) => {
        if (option.textContent === this.correctAnswer) {
          option.className =
            "option btn btn-success animate__animated animate__pulse";
        }
      });
    }

    // Tüm butonları devre dışı bırak
    this.options.forEach((button) => (button.disabled = true));

    // 1 saniye sonra diğer soruya geç
    setTimeout(() => {
      this.currentQuestion++;
      this.showQuestion();
    }, 1000);
  }

  resetTimer() {
    this.timeLeft = 10;
    this.timeElement.textContent = this.timeLeft;

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.timeElement.textContent = this.timeLeft;

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.currentQuestion++;
        this.showQuestion();
      }
    }, 1000);
  }

  updateScore() {
    this.scoreElement.textContent = this.score;
  }

  endGame() {
    this.startScreen.style.display = "block";
    this.startScreen.innerHTML = `
            <h1>Oyun Bitti!</h1>
            <p>Toplam Skorunuz: ${this.score}</p>
            <button id="start-button">Tekrar Oyna</button>
        `;

    // Yeni start button için event listener ekle
    document
      .getElementById("start-button")
      .addEventListener("click", () => this.startGame());
  }

  updateQuestionCount() {
    this.questionElement.textContent = this.currentQuestion + 1;
  }
}

// Oyunu başlat
window.onload = () => {
  new PlakaGame();
};
