document.addEventListener('DOMContentLoaded', function() {
    FAQ = document.getElementById('faq');

    if (FAQ.classList.contains("faq-block")) {
        iterateFAQblock(FAQ);
    }
});

function iterateFAQblock(faqBlock, level = 0) {
    for (var i = 0; i < faqBlock.children.length; i++) {
        var child = faqBlock.children[i];
        if (child.classList.contains("faq-block")) {
            iterateFAQblock(child, level+1);
        }
        if (level > 0) {
            if (child.classList.contains("faq-answer")) {
                child.hidden = true;
            }
        }
        if (child.classList.contains("faq-question")) {
            let answers = Array.from(faqBlock.children).filter((e) => {return e.classList.contains("faq-answer")})
            child.onclick = function() { toggleAnswer(answers, child) };
        }
    }
}

function toggleAnswer(answers, block) {
    for (var i = 0; i < answers.length; i++) {
        var child = answers[i];
        //child.style.background = 'red';
        child.hidden = !child.hidden;
    }
}

