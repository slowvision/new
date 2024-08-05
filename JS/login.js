document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const loading = document.getElementById('loading');
    const container = document.querySelector('.container');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple validation (for demo purposes)
        if (username === 'Tayyab Irfan' && password === 'Tayyab123') {
            loginMessage.textContent = 'Login successful!';
            loginMessage.style.color = '#4caf50'; // Green for success

            // Show loading spinner and hide login container
            container.classList.add('loading-active');

            // Delay before redirection
            setTimeout(() => {
                window.location.href = 'homepage.html'; // Ensure this path is correct
            }, 2000); // 2000 milliseconds = 2 seconds

        } else {
            loginMessage.textContent = 'Invalid username or password.';
            loginMessage.style.color = '#ff6f6f'; // Red for error
        }
    });
});