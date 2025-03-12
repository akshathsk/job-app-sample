document.addEventListener('DOMContentLoaded', () => {
    const jobListingsSection = document.getElementById('job-listings');
    const applicationFormContainer = document.getElementById('application-form-container');
    const quickApplyBtn = document.getElementById('quick-apply-btn');
    const fullApplyBtn = document.getElementById('full-apply-btn');
    const quickApplyForm = document.getElementById('quick-apply-form');
    const fullApplicationForm = document.getElementById('full-application-form');
    const infoPopup = document.getElementById('info-popup');
    const infoPopupCloseBtn = document.getElementById('info-popup-close');
    const infoPopupApplyBtn = document.getElementById('info-popup-apply-btn');
    const confirmationPopup = document.getElementById('confirmation-popup');
    const confirmationPopupCloseBtn = document.getElementById('confirmation-popup-close');
    const errorPopup = document.getElementById('error-popup');
    const errorPopupCloseBtn = document.getElementById('error-popup-close');
    const loadingPopup = document.getElementById('loading-popup');

    // Sample Job Data (Replace with your actual data or fetch from an API)
    const jobs = [
        {
            title: 'Software Engineer',
            company: 'Tech Solutions Inc.',
            location: 'New York, NY',
            description: 'Develop and maintain software applications...',
            applicationType: 'full' // or 'quick'
        },
        {
            title: 'Web Designer',
            company: 'Creative Designs Co.',
            location: 'Los Angeles, CA',
            description: 'Design and build user-friendly websites...',
            applicationType: 'quick'
        },
        {
            title: 'Data Analyst',
            company: 'Analytics Pro',
            location: 'Chicago, IL',
            description: 'Analyze data to provide insights and reports...',
            applicationType: 'full'
        }
    ];

    // Function to create and append job listings to the job listings section
    function renderJobListings() {
        jobListingsSection.innerHTML = ''; // Clear existing listings
        jobs.forEach(job => {
            const jobListingDiv = document.createElement('div');
            jobListingDiv.classList.add('job-listing');
            jobListingDiv.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p>${job.description}</p>
                <button class="apply-button" data-job-title="${job.title}" data-job-description="${job.description}" data-application-type="${job.applicationType}">Apply Now</button>
            `;
            jobListingsSection.appendChild(jobListingDiv);
        });

        // Add event listeners to "Apply Now" buttons after they are rendered
        attachApplyButtonListeners();
    }

    function attachApplyButtonListeners() {
        const applyButtons = document.querySelectorAll('.apply-button');
        applyButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const jobTitle = event.target.dataset.jobTitle;
                const jobDescription = event.target.dataset.jobDescription;
                const applicationType = event.target.dataset.applicationType;

                // Set popup content based on job info
                document.getElementById('info-popup-title').textContent = jobTitle;
                document.getElementById('info-popup-description').textContent = jobDescription;
                infoPopup.style.display = 'block'; // Show info popup

                // Determine which form to show when "Apply Now" is clicked in the info popup
                if (applicationType === 'quick') {
                    infoPopupApplyBtn.onclick = () => {
                        hidePopup(infoPopup);
                        showForm('quick');
                    };
                } else { // applicationType === 'full' or default to full
                    infoPopupApplyBtn.onclick = () => {
                        hidePopup(infoPopup);
                        showForm('full');
                    };
                }
            });
        });
    }

    // Function to show the application form container and hide job listings
    function showForm(formType) {
        jobListingsSection.style.display = 'none';
        applicationFormContainer.style.display = 'block';

        if (formType === 'quick') {
            quickApplyBtn.classList.add('active');
            fullApplyBtn.classList.remove('active');
            quickApplyForm.classList.add('active-form');
            fullApplicationForm.classList.classList.remove('active-form'); // Corrected line
        } else if (formType === 'full') {
            fullApplyBtn.classList.add('active');
            quickApplyBtn.classList.remove('active');
            fullApplicationForm.classList.add('active-form');
            quickApplyForm.classList.classList.remove('active-form'); // Corrected line
        }
    }

    // Function to hide a popup
    function hidePopup(popupElement) {
        popupElement.style.display = 'none';
    }

    // Event listeners for form type selector buttons
    quickApplyBtn.addEventListener('click', () => {
        showForm('quick');
    });

    fullApplyBtn.addEventListener('click', () => {
        showForm('full');
    });

    // Event listeners to close popups
    infoPopupCloseBtn.addEventListener('click', () => hidePopup(infoPopup));
    confirmationPopupCloseBtn.addEventListener('click', () => hidePopup(confirmationPopup));
    errorPopupCloseBtn.addEventListener('click', () => hidePopup(errorPopup));

    // Close popups if clicked outside the content area
    window.addEventListener('click', (event) => {
        if (event.target == infoPopup) {
            hidePopup(infoPopup);
        }
        if (event.target == confirmationPopup) {
            hidePopup(confirmationPopup);
        }
        if (event.target == errorPopup) {
            hidePopup(errorPopup);
        }
        if (event.target == loadingPopup) {
            hidePopup(loadingPopup);
        }
    });


    // ------------------------ Form Submission Handling ------------------------
    quickApplyForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateQuickApplyForm()) {
            simulateFormSubmission(quickApplyForm);
        }
    });

    fullApplicationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateFullApplicationForm()) {
            simulateFormSubmission(fullApplicationForm);
        }
    });

    function validateQuickApplyForm() {
        const nameInput = document.getElementById('quick-name');
        const emailInput = document.getElementById('quick-email');
        const resumeInput = document.getElementById('quick-resume');
        let isValid = true;
        let errorMessages = [];

        if (!nameInput.value.trim()) {
            isValid = false;
            errorMessages.push("Full Name is required.");
        }
        if (!emailInput.value.trim()) {
            isValid = false;
            errorMessages.push("Email is required.");
        } else if (!isValidEmail(emailInput.value.trim())) {
            isValid = false;
            errorMessages.push("Email is not valid.");
        }
        if (!resumeInput.files.length) { // Check if a file is selected
            isValid = false;
            errorMessages.push("Resume is required.");
        }

        if (!isValid) {
            showErrorPopup(errorMessages.join("<br>")); // Display errors in popup
            return false;
        }
        return true;
    }

    function validateFullApplicationForm() {
        const nameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('full-email');
        const resumeInput = document.getElementById('full-resume');
        let isValid = true;
        let errorMessages = [];

        if (!nameInput.value.trim()) {
            isValid = false;
            errorMessages.push("Full Name is required.");
        }
        if (!emailInput.value.trim()) {
            isValid = false;
            errorMessages.push("Email is required.");
        } else if (!isValidEmail(emailInput.value.trim())) {
            isValid = false;
            errorMessages.push("Email is not valid.");
        }
        if (!resumeInput.files.length) {
            isValid = false;
            errorMessages.push("Resume is required.");
        }

        if (!isValid) {
            showErrorPopup(errorMessages.join("<br>"));
            return false;
        }
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function simulateFormSubmission(formElement) {
        showLoadingPopup();
        setTimeout(() => {
            hideLoadingPopup();
            showConfirmationPopup();
            formElement.reset(); // Clear the form after successful submission
            applicationFormContainer.style.display = 'none'; // Hide form container
            jobListingsSection.style.display = 'grid';      // Show job listings again
        }, 2000); // Simulate 2 seconds submission time
    }

    function showConfirmationPopup() {
        confirmationPopup.style.display = 'block';
    }

    function showErrorPopup(message) {
        document.getElementById('error-popup-message').innerHTML = message; // Set error message
        errorPopup.style.display = 'block';
    }

    function showLoadingPopup() {
        loadingPopup.style.display = 'block';
    }

    function hideLoadingPopup() {
        loadingPopup.style.display = 'none';
    }

    // Initial rendering of job listings when the page loads
    renderJobListings();
});
