const jokeBtn = document.getElementById('joke-btn');
const copyBtn = document.getElementById('copy-btn');
const jokeText = document.getElementById('joke-text');
const loadingSpinner = document.getElementById('loading');
const errorMsg = document.getElementById('error-msg');
const categorySelect = document.getElementById('category');
const counter = document.getElementById('counter');

let jokeCount = 0;

// Fetch joke from API
async function fetchJoke() {
    try {
        // Clear previous error
        errorMsg.classList.remove('active');
        errorMsg.textContent = '';

        // Show loading spinner
        loadingSpinner.classList.add('active');
        jokeBtn.disabled = true;
        copyBtn.disabled = true;

        const category = categorySelect.value;
        
        // Map category to API format
        let apiCategory = 'Any';
        if (category === 'general') {
            apiCategory = 'General';
        } else if (category === 'programming') {
            apiCategory = 'Programming';
        } else if (category === 'knock-knock') {
            apiCategory = 'Knock-Knock';
        }

        const response = await fetch(`https://v2.jokeapi.dev/joke/${apiCategory}?format=txt`);

        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }

        const joke = await response.text();

        // Display joke
        jokeText.textContent = joke;
        jokeCount++;
        counter.textContent = jokeCount;

    } catch (error) {
        console.error('Error:', error);
        errorMsg.textContent = '❌ Failed to load joke. Please try again!';
        errorMsg.classList.add('active');
    } finally {
        loadingSpinner.classList.remove('active');
        jokeBtn.disabled = false;
        copyBtn.disabled = false;
    }
}

// Copy joke to clipboard
function copyToClipboard() {
    const text = jokeText.textContent;
    
    if (text === 'Click "Get Joke" to start laughing!' || text === '') {
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        errorMsg.textContent = '❌ Failed to copy to clipboard';
        errorMsg.classList.add('active');
    });
}

// Event listeners
jokeBtn.addEventListener('click', fetchJoke);
copyBtn.addEventListener('click', copyToClipboard);
categorySelect.addEventListener('change', fetchJoke);

// Load a joke on page load
window.addEventListener('load', fetchJoke);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        fetchJoke();
    }
});
