function wordOfTheDay() {
    const url = "https://api.frontendeval.com/fake/word";

    return fetch(url)
        .then(response => response.text())
        .then(data => data.toString().trim())
        .catch(error => {
            console.error("error fetching suggestions: ", error);
            throw error;
        });    
}

async function checkingWord(enteredWord) {
    const url = "https://api.frontendeval.com/fake/word/valid";

    let isWordValid = false;

    try {
        const dailyWord = enteredWord;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word: dailyWord })
        });
        const data = await response.json();
        if (data) {
            isWordValid = true;
            return isWordValid;
        } else {
            return isWordValid;
        }
      } catch (error) {
        console.error("Error:", error);
    }
}

function squareCreation() {
    const page = document.querySelector('#page');

    for(let i = 0; i < 6; i++) {
        const pastGuesses = document.createElement('div');
        let guestNumber = `guess${i + 1}`;
        pastGuesses.setAttribute('id', guestNumber);
        page.appendChild(pastGuesses);

        for(let j = 0; j < 5; j++) {
            const letter = document.createElement('div');
            let letterId = `guess${i + 1}letter${j + 1}`;
            letter.setAttribute('id', letterId);
            pastGuesses.appendChild(letter);            
        }
    }
}

function enterPressed() {
    let numberOfGuesses = 0;
    let totalAllowedGuesses = 6;

    const input = document.querySelector('#wordInput');

    let dailyWord;
    let enteredWord;

    wordOfTheDay()
    .then(word => dailyWord = word)
    .catch(error => console.error("Error:", error));

    input.addEventListener("keydown", async (event) => {
        if(event.key === "Enter") {
            enteredWord = input.value;
            input.value = "";

            let isEnteredWordValid = await checkingWord(enteredWord);

            if(isEnteredWordValid === false) {
                alert("you have put in an invalid word");
            } else {
                numberOfGuesses++;
                totalAllowedGuesses--;

                for(let i = 0; i < 5; i++) {
                    const letter = document.querySelector(`#guess${numberOfGuesses}letter${i + 1}`);
                    letter.textContent = enteredWord.substring(i, i + 1);
                }
    
                const label = document.querySelector('#remainingTries');
                label.textContent = `You have ${totalAllowedGuesses} guesses remaining`;
    
                for(let i = 0; i < 5; i++) {
                    const inputLetter = document.querySelector(`#guess${numberOfGuesses}letter${i + 1}`);
                    for(let j = 0; j < 5; j++) {
                        if(inputLetter.textContent === dailyWord.substring(j, j + 1)) {
                            if(parseInt(inputLetter.id.charAt(inputLetter.id.length - 1)) === j + 1) {  
                                inputLetter.style.backgroundColor = "green";
                                break;
                            } else {
                                inputLetter.style.backgroundColor = "yellow";
                                let theLetterWeAreAt = inputLetter.id.charAt(inputLetter.id.length - 1);
    
                                for(let i = 1; i < theLetterWeAreAt; i++) {
                                    const previousLetters = document.querySelector(`#guess${numberOfGuesses}letter${i}`);
    
                                    if((getComputedStyle(previousLetters).backgroundColor === "rgb(0, 128, 0)" || getComputedStyle(previousLetters).backgroundColor === "rgb(255, 255, 0)") && inputLetter.textContent === previousLetters.textContent) {
                                        let letterCounter = 0;
                                        for(let j = 0; j < dailyWord.length; j++) {
                                            if(dailyWord.charAt(j) === inputLetter.textContent) {
                                                letterCounter++;
                                            }
                                        }
    
                                        let letterGiven = 0;
                                        for(let z = 1; z < theLetterWeAreAt; z++) {
                                            if(inputLetter.textContent === previousLetters.textContent) {
                                                letterGiven++;
                                            }
                                        }
    
                                        if(letterCounter < letterGiven) {
                                            inputLetter.style.backgroundColor = "gray";
                                        }
                                    }
                                }
                                break;
                            }
                        } else {
                            inputLetter.style.backgroundColor = "gray";
                        }
                    }
                }
            }

            if(enteredWord === dailyWord) {
                alert(`You correctly guessed the word in ${numberOfGuesses} tries!`);
            } else if(enteredWord != dailyWord && numberOfGuesses === 6) {
                alert(`The word was '${dailyWord}'`);
            }
        }
    });
}

squareCreation();
enterPressed();