// Mobile Menu Toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-x');
    navbar.classList.toggle('active');
};

// Scroll Sections Active Link
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });

    // Sticky Header
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // Remove menu icon when click navbar link (scroll)
    menuIcon.classList.remove('fa-x');
    navbar.classList.remove('active');
};

// Typed.js Animation
const typed = new Typed('.multiple-text', {
    strings: ['Junior Software Developer', 'Web Developer', 'Problem Solver', 'Tech Enthusiast'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

// Scroll Reveal Animation
ScrollReveal({
    reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .skills-grid-container, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            if(nameInput.value === '' || emailInput.value === '' || messageInput.value === '') {
                alert('Please fill in all required fields');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send email using SMTPJS
            Email.send({
                SecureToken: "YOUR_SECURE_TOKEN_HERE", // Replace with your actual token
                To: 'your-email@example.com', // Your receiving email
                From: emailInput.value,
                Subject: document.getElementById('subject').value || 'Message from Portfolio Contact Form',
                Body: `
                    <h3>New Message from Portfolio Contact Form</h3>
                    <p><strong>Name:</strong> ${nameInput.value}</p>
                    <p><strong>Email:</strong> ${emailInput.value}</p>
                    <p><strong>Phone:</strong> ${document.getElementById('phone').value || 'Not provided'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${messageInput.value}</p>
                `
            }).then(
                message => {
                    // Reset button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    if(message === 'OK') {
                        // Success message
                        showAlert('Message sent successfully!', 'success');
                        contactForm.reset();
                    } else {
                        // Try fallback method if SMTPJS fails
                        sendWithFormSubmitFallback();
                    }
                }
            ).catch(error => {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Try fallback method
                sendWithFormSubmitFallback();
            });
        });
    }
});

// Fallback method using FormSubmit.co
function sendWithFormSubmitFallback() {
    const contactForm = document.getElementById('contactForm');
    const formData = new FormData(contactForm);
    
    fetch('https://formsubmit.co/ajax/your-email@example.com', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            showAlert('Message sent successfully!', 'success');
            contactForm.reset();
        } else {
            showAlert('There was an error sending your message. Please try again later.', 'error');
        }
    })
    .catch(error => {
        showAlert('There was an error sending your message. Please try again later.', 'error');
    });
}

// Show alert message
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `form-alert ${type}`;
    alertDiv.textContent = message;
    
    // Insert alert
    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        contactSection.insertBefore(alertDiv, contactSection.firstChild);
    } else {
        document.body.insertBefore(alertDiv, document.body.firstChild);
    }
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}