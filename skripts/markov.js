document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('markovForm');
    const outputDiv = document.getElementById('outputText');
    const outputLabel = document.getElementById('outputLabel');
    const inputText = document.getElementById('inputText');
    const inputFile = document.getElementById('inputFile');
    const removeFile = document.getElementById('rmv1');
    const startingPhrase = document.getElementById('inputStartingPhrase');
    const radioToText = document.getElementById('radioToText');
    const radioToFile = document.getElementById('radioToFile');
    const downloadBtn = document.getElementById('download');


    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const chainOrder = parseInt(document.getElementById('chainOrder').value);
        const outputLength = parseInt(document.getElementById('outputLength').value);
        
        if (inputText.value.trim() !== '') {
            processInput(inputText.value, chainOrder, outputLength);
        } else if (inputFile.files.length > 0) {
            const file = inputFile.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                processInput(e.target.result, chainOrder, outputLength);
            };

            reader.readAsText(file);
        } else {
            outputDiv.textContent = "Please enter text or upload a file.";
        }
    });

    removeFile.onclick = function() { 
        inputFile.value = inputFile.defaultValue;
    }

    function processInput(input, order, length) {
        const words = input.split(/\s+/);
        const markovChain = buildMarkovChain(words, order);
        const generatedText = generateMarkovText(markovChain, words, order, length);

        // check radioToText and radioToFile. 
        if (radioToText.checked) {
            if (generatedText.split(" ").length != length) {
                outputDiv.classList.add('border-danger');
            } else {
                outputDiv.classList.remove('border-danger');
            }
            outputLabel.innerText = `Generated Text ${generatedText.split(" ").length}/${length} words`
            outputDiv.textContent = generatedText;
        } else if (radioToFile.checked) {
            var data = generatedText,
                fileName = "my-download.txt";
            
            saveData(data, fileName);
        }           
    }

    var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var json = JSON.stringify(data),
                blob = new Blob([json], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());
    
    function buildMarkovChain(words, order) {
        const markovChain = {};
        for (let i = 0; i < words.length - order; i++) {
            const currentState = words.slice(i, i + order).join(' ');
            const nextWord = words[i + order];

            if (!markovChain[currentState]) {
                markovChain[currentState] = {};
            }

            if (!markovChain[currentState][nextWord]) {
                markovChain[currentState][nextWord] = 0;
            }

            markovChain[currentState][nextWord]++;
        }
        return markovChain;
    }

    function generateMarkovText(markovChain, words, order, length) {
        let currentState = words.slice(0, order).join(' ');
        let result = currentState;
        if (startingPhrase.value.trim() !== '') {
            currentState = startingPhrase.value.trim();
            result = currentState;
            currentState = currentState.split(' ').slice(-order).join(' ');
        }
        
        for (let i = 0; i < length - order + 1 - startingPhrase.value.trim().split(' ').length; i++) {
            const possibleNextWords = markovChain[currentState];
            if (!possibleNextWords) {
                break;
            }

            const nextWord = chooseNextWord(possibleNextWords);
            result += ' ' + nextWord;

            const newWords = currentState.split(' ');
            newWords.shift();
            newWords.push(nextWord);
            currentState = newWords.join(' ');
        }

        return result;
    }

    function chooseNextWord(possibleWords) {
        const totalOccurrences = Object.values(possibleWords).reduce((sum, count) => sum + count, 0);
        const randomNum = Math.random() * totalOccurrences;

        let cumulativeProb = 0;
        for (const [word, count] of Object.entries(possibleWords)) {
            cumulativeProb += count;
            if (randomNum < cumulativeProb) {
                return word;
            }
        }

        // Fallback: return a random word if something goes wrong
        return Object.keys(possibleWords)[Math.floor(Math.random() * Object.keys(possibleWords).length)];
    }
});