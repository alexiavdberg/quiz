let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let game = new Phaser.Game(config);
let currentIndex = 0;
let answerPanelImage = [];
let answerPanelText = [];
let starPointImage = [];
let score_good = 0;

function preload() {
    // Images
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('questionPanel', './assets/Sprites/Label1.png');
    this.load.image('answerPanel', './assets/Sprites/Label4.png');
    this.load.image('starPoint', './assets/Sprites/Star.png');
    this.load.image('nextButton', './assets/Sprites/Play.png');

    // JSON
    this.load.json('questions', './assets/data/Questions.json');
    
    // Audio
    this.load.audio('goodAnswer', './assets/Sound/good.wav');
    this.load.audio('wrongAnswer', './assets/Sound/wrong.wav');
    this.load.audio('endMenu', './assets/Sound/Finish.wav');
}

function create() {
    // Déclaration json
    questionJSON = this.cache.json.get('questions');

    // Déclaration sons
    goodAnswerSound = this.sound.add('goodAnswer');
    wrongAnswerSound = this.sound.add('wrongAnswer');
    endMenuSound = this.sound.add('endMenu');

    // Background
    backgroundImage = this.add.image(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);
    backgroundImage.setScale(0.5);

    // Bouton prochaine question
    nextButtonImage = this.add.image(game.config.width / 2, 510, 'nextButton').setInteractive();
    nextButtonImage.setScale(0.4);
    nextButtonImage.setVisible(false);
    nextButtonImage.on('pointerdown', nextQuestion);

    // 10 étoiles
    for (let i = 0; i < 10; i++) {
        starPointImage[i] = this.add.image(40 + i*60, 600, 'starPoint');
        starPointImage[i].setScale(0.4);
        starPointImage[i].alpha = 0;
    }

    // Affichage panneau question
    question = this.add.image(game.config.width / 2, game.config.width / 5, 'questionPanel');
    question.setScale(0.5);

    // Affichage panneaux réponses
    for (let i = 0; i < 3; i++) {
        answerPanelImage[i] = this.add.image(300, 230 + i*100, 'answerPanel').setInteractive();
        answerPanelImage[i].on('pointerdown', () => {checkAnswer(i)});
    }

    // Affichage texte question/réponses possibles
    questionPanelText = this.add.text(150, 100, questionJSON.questions[currentIndex].title, 
        { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
    for (let i = 0; i < 3; i++) {
        answerPanelText[i] = this.add.text(180, 215 + i*100, questionJSON.questions[currentIndex].answer[i], 
            { fontFamily: 'Arial', fontSize: 28, color: '#000000' })
    }
}

function update() {

}

function checkAnswer(answerNumber){
    // Couleur après réponse
    for (let i = 0; i < 3; i++) {
        answerPanelText[i].setColor("#ff0000");
    }
    answerPanelText[questionJSON.questions[currentIndex].goodAnswer].setColor("#00ff00");

    // Vérifier les réponses et afficher bouton pour passer au suivent
    if (answerNumber == questionJSON.questions[currentIndex].goodAnswer) {
        starPointImage[currentIndex].alpha = 1;
        goodAnswerSound.play();
        score_good++;
    }
    else {
        starPointImage[currentIndex].alpha = 0.4;
        wrongAnswerSound.play();
    }

    nextButtonImage.setVisible(true);

    // Désactiver boutons 
    for (let i = 0; i < 3; i++) {
        answerPanelImage[i].disableInteractive();
    }
}

function nextQuestion(){
    currentIndex++;
if (currentIndex < Object.keys(questionJSON.questions).length){    
    questionPanelText.text = questionJSON.questions[currentIndex].title
    for (let i = 0; i < 3; i++) {
        answerPanelText[i].text = questionJSON.questions[currentIndex].answer[i];
        answerPanelText[i].setColor('#000000');
        answerPanelImage[i].setInteractive();    
    }
}
else {
    questionPanelText.text = `Vous avez obtenu un score de ${score_good}/10`;
    for (let i = 0; i < 3; i++) {
        answerPanelText[i].text = "";
        answerPanelImage[i].setVisible(false);    
    }
    nextButtonImage.setVisible(false);
    endMenuSound.play();
}
}