document.getElementById('emailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const button = form.querySelector('button');
    const statusDiv = document.getElementById('status');
    
    // Get form values
    const recipients = document.getElementById('recipients').value;
    const subject = document.getElementById('subject').value;
    const htmlContent = document.getElementById('content').value;
    
    // Update button state
    button.classList.add('loading');
    button.textContent = 'Sending...';
    
    // Clear previous status
    statusDiv.className = '';
    statusDiv.style.display = 'none';
    
    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipients,
                subject,
                htmlContent
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            statusDiv.className = 'success';
            statusDiv.textContent = '✓ Emails sent successfully';
            form.reset();
        } else {
            statusDiv.className = 'error';
            statusDiv.textContent = '× Error: ' + result.message;
        }
    } catch (error) {
        statusDiv.className = 'error';
        statusDiv.textContent = '× Error: Unable to send emails. Please try again.';
    } finally {
        button.classList.remove('loading');
        button.textContent = 'Send Email';
        statusDiv.style.display = 'block';
    }
});

// Add this new function to handle CSV upload
function handleCSVUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const text = e.target.result;
        const emails = text.split(/\r?\n/)  // Split by newlines
                          .map(line => line.split(',')[0].trim()) // Get first column
                          .filter(email => email.includes('@')); // Basic email validation
        
        document.getElementById('recipients').value = emails.join(', ');
    };
    
    reader.readAsText(file);
} 