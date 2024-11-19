document.addEventListener('DOMContentLoaded', function() {
    const filterInput = document.getElementById('faq-filter');
    FAQ = document.getElementById('faq');
    if (FAQ) {
        if (FAQ.classList.contains("faq-block")) {
            iterateFAQblock(FAQ);
        }
    } else {
        return
    }

    // Load filter from local storage
    const savedFilter = localStorage.getItem('faqFilter');
    if (savedFilter) {
        filterInput.value = savedFilter;
        filterFAQs(FAQ.children, savedFilter);
    }

    // Add event listener for input change
    filterInput.addEventListener('input', function() {
        const filterValue = filterInput.value.toLowerCase();
        localStorage.setItem('faqFilter', filterValue); // Save filter to local storage
        filterFAQs(FAQ.children, filterValue);
    });

    function filterFAQs(faqSections, filterValue, level=0) {
        Array.from(faqSections).forEach(section => {
            if (section.classList.contains("faq-block")) {
                filterFAQs(section.children, filterValue, level+1);
                
            }
            const question = section.querySelector('.faq-question');
            if (question) {
                const text = question.textContent.toLowerCase();
                if (text.includes(filterValue)) {
                    section.classList.remove(".faq-hidden")
                    for (var i = 0; i < 1; i++) {
                        var child = section.children[i];
                        child.style.backgroundColor = ""
                        child.classList.remove('faq-collapsed');
                    }
                } else {
                    section.classList.add(".faq-hidden")
                    for (var i = 0; i < 1; i++) {
                        var child = section.children[i];
                        if (level > 0) {
                            child.classList.add('faq-collapsed');
                        }
                    }
                }
            }
        });
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
                child.classList.add('faq-collapsed');;
            }
        }
        if (child.classList.contains("faq-question")) {
            let answers = Array.from(faqBlock.children).filter((e) => {return e.classList.contains("faq-answer")})
            child.onclick = function() { toggleAnswer(answers) };
        }
    }
}

function toggleAnswer(answers) {
    for (var i = 0; i < answers.length; i++) {
        var child = answers[i];
        child.classList.toggle('faq-collapsed');
    }
}