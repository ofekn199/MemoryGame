$(document).ready(function() {
    const allCardImages = [
        "images/bear.jpg", "images/bird.jpg", "images/butterfly.jpg",
        "images/cat.jpg", "images/cow.jpg", "images/dog.jpg",
        "images/dog2.jpg", "images/flamingo.jpg", "images/fox.jpg",
        "images/giraffe.jpg", "images/owl.jpg", "images/rabbit.jpg",
        "images/reptile.jpg", "images/tiger.jpg", "images/zebra.jpg"
    ];
    let firstCard = null;
    let secondCard = null;
    let score = 0;
    let moves = 0;
    let isProcessing = false;
    let timerInterval = null;
    let matchedPairs = 0; // מעקב אחרי מספר הצמדים התואמים

    function startGame(numPairs, timeLimit = null) {
        firstCard = null;
        secondCard = null;
        score = 0;
        moves = 0;
        isProcessing = false;
        matchedPairs = 0; // איפוס מספר הצמדים
        $('#score').text(score);
        $('#moves').text(moves);
        $('#game-board').empty(); // ניקוי הלוח הקודם

        let cardImages = [];
        for (let i = 0; i < numPairs; i++) {
            cardImages.push(allCardImages[i]);
            cardImages.push(allCardImages[i]);
        }
        cardImages.sort(() => 0.5 - Math.random());

        cardImages.forEach(image => {
            const card = $('<div class="card"></div>');
            const img = $('<img>').attr('src', image);
            card.append(img);
            $('#game-board').append(card);
        });

        // התחלת הטיימר
        startTimer(timeLimit);

        $('.card').click(function() {
            if (isProcessing || $(this).hasClass('flipped') || $(this).hasClass('matched')) {
                return;
            }

            $(this).addClass('flipped');

            if (!firstCard) {
                firstCard = $(this);
            } else {
                secondCard = $(this);
                isProcessing = true;

                moves++;
                $('#moves').text(moves);

                if (firstCard.find('img').attr('src') === secondCard.find('img').attr('src')) {
                    firstCard.addClass('matched'); // הפעלת אנימציה על הקלף הראשון
                    secondCard.addClass('matched'); // הפעלת אנימציה על הקלף השני
                    score += 10;
                    matchedPairs++; // עדכון מספר הצמדים התואמים
                    $('#score').text(score);
                    resetSelection();

                    if (matchedPairs === numPairs) {
                        clearInterval(timerInterval); // עצירת הטיימר
                        alert("כל הכבוד! סיימת את המשחק.");
                    }
                } else {
                    setTimeout(() => {
                        firstCard.removeClass('flipped');
                        secondCard.removeClass('flipped');
                        resetSelection();
                    }, 500);
                }
            }
        });
    }

    function resetSelection() {
        firstCard = null;
        secondCard = null;
        isProcessing = false;
    }

    function startTimer(timeLimit) {
        clearInterval(timerInterval);
        let startTime = Date.now();
        timerInterval = setInterval(function() {
            let elapsedTime = Date.now() - startTime;
            let totalSeconds = Math.floor(elapsedTime / 1000);
            let milliseconds = elapsedTime % 1000;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            $('#timer').text(
                (minutes < 10 ? '0' : '') + minutes + ':' +
                (seconds < 10 ? '0' : '') + seconds + ':' +
                (milliseconds < 100 ? (milliseconds < 10 ? '00' : '0') : '') + milliseconds
            );

            if (timeLimit !== null && totalSeconds >= timeLimit) {
                clearInterval(timerInterval); // עצירת הטיימר
                alert("נגמר הזמן! התחלה מחדש");
                resetGame(); // אתחול המשחק כשנגמר הזמן
            }
        }, 50); // עדכון כל 50ms עבור טיימר חלק יותר
    }

    function resetGame() {
        const difficulty = $('#difficulty-level').val();
        let numCards;
        let timeLimit;

        switch (difficulty) {
            case 'easy':
                numCards = 10;
                timeLimit = null; // אין הגבלת זמן
                break;
            case 'medium':
                numCards = 20;
                timeLimit = 120; // 2 דקות
                break;
            case 'hard':
                numCards = 30;
                timeLimit = 90; // 1.5 דקות
                break;
        }

        const numPairs = numCards / 2;
        startGame(numPairs, timeLimit);
    }

    $('#start-game').click(function() {
        const difficulty = $('#difficulty-level').val();
        let numCards;
        let timeLimit;

        switch (difficulty) {
            case 'easy':
                numCards = 10;
                timeLimit = null; // אין הגבלת זמן
                break;
            case 'medium':
                numCards = 20;
                timeLimit = 120; // 2 דקות
                break;
            case 'hard':
                numCards = 30;
                timeLimit = 90; // 1.5 דקות
                break;
        }

        const numPairs = numCards / 2;
        startGame(numPairs, timeLimit);
    });

    $('#restart').click(function() {
        resetGame(); // התחלה מחדש של המשחק
    });
});