document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('counterForm');
    const inputText = document.getElementById('inputText');
    const inputFile = document.getElementById('inputFile');
    const removeFileBtn = document.getElementById('rmv1');

    inputText.addEventListener('input', processInput);
    inputFile.addEventListener('change', processInput);
    processInput();


    inputFile.addEventListener('change', function() {
        if (this.files.length > 0) {
            // change inputText bootstrap class text-light to some darker
            inputText.classList.remove('text-light');
            inputText.classList.add('text-dark');
            inputText.disabled = true;
            processInput();        
        }
    });

    removeFileBtn.addEventListener('click', function() {
        inputFile.value = '';
        inputText.disabled = false;
        inputText.classList.remove('text-dark');
        inputText.classList.add('text-light');
        processInput();    
    });

    function processInput() {
        let text = '';
        if (inputFile.files.length > 0) {
            const file = inputFile.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                text = e.target.result;
                analyzeText(text);
            };
            reader.readAsText(file);
        } else {
            text = inputText.value;
            analyzeText(text);
        }
    }

    function analyzeText(text) {
        const wordCount = countWords(text);
        const charCountWithSpaces = text.length;
        const charCountWithoutSpaces = text.replace(/\s/g, '').length;
        const lineCount = countLines(text);
        const sentenceCount = countSentences(text);
        const paragraphCount = countParagraphs(text);
        const avgWordsPerSentence = (sentenceCount > 0) ? (wordCount / sentenceCount).toFixed(2) : 0;
        const avgCharsPerWord = (wordCount > 0) ? (charCountWithoutSpaces / wordCount).toFixed(2) : 0;

        updateResults({
            wordCount,
            charCountWithSpaces,
            charCountWithoutSpaces,
            lineCount,
            sentenceCount,
            paragraphCount,
            avgWordsPerSentence,
            avgCharsPerWord
        });
    }

    function countWords(text) {
        return text.trim().split(/\s+/).length;
    }

    function countLines(text) {
        return text.split(/\r\n|\r|\n/).length;
    }

    function countSentences(text) {
        return (text.match(/[.!?]+/g) || []).length;
    }

    function countParagraphs(text) {
        return text.split(/\n\s*\n/).length;
    }

    function updateResults(results) {
        document.getElementById('wordCount').textContent = results.wordCount;
        document.getElementById('charCountWithSpaces').textContent = results.charCountWithSpaces;
        document.getElementById('charCountWithoutSpaces').textContent = results.charCountWithoutSpaces;
        document.getElementById('lineCount').textContent = results.lineCount;
        document.getElementById('sentenceCount').textContent = results.sentenceCount;
        document.getElementById('paragraphCount').textContent = results.paragraphCount;
        document.getElementById('avgWordsPerSentence').textContent = results.avgWordsPerSentence;
        document.getElementById('avgCharsPerWord').textContent = results.avgCharsPerWord;
    }

    function downloadResults(results) {
        const resultsText = `
Text Analysis Results:
----------------------
Word Count: ${results.wordCount}
Character Count (with spaces): ${results.charCountWithSpaces}
Character Count (without spaces): ${results.charCountWithoutSpaces}
Line Count: ${results.lineCount}
Sentence Count: ${results.sentenceCount}
Paragraph Count: ${results.paragraphCount}
Average Words Per Sentence: ${results.avgWordsPerSentence}
Average Characters Per Word: ${results.avgCharsPerWord}
        `.trim();

        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'text_analysis_results.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});