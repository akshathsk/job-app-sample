// script.js – with dummy API call invoked incorrectly to trigger error popup

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

    const jobs = [
        { title: 'Software Engineer', company: 'Tech Solutions Inc.', location: 'New York, NY', description: 'Develop and maintain software applications...', applicationType: 'full' },
        { title: 'Web Designer', company: 'Creative Designs Co.', location: 'Los Angeles, CA', description: 'Design and build user-friendly websites...', applicationType: 'quick' },
        { title: 'Data Analyst', company: 'Analytics Pro', location: 'Chicago, IL', description: 'Analyze data to provide insights and reports...', applicationType: 'full' }
    ];

    function renderJobListings() {
        jobListingsSection.innerHTML = '';
        jobs.forEach(job => {
            const div = document.createElement('div');
            div.classList.add('job-listing');
            div.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p>${job.description}</p>
                <button class="apply-button" 
                        data-job-title="${job.title}" 
                        data-job-description="${job.description}" 
                        data-application-type="${job.applicationType}">Apply Now</button>
            `;
            jobListingsSection.appendChild(div);
        });
        attachApplyButtonListeners();
    }

    function attachApplyButtonListeners() {
        document.querySelectorAll('.apply-button').forEach(button => {
            button.addEventListener('click', event => {
                const { jobTitle, jobDescription, applicationType } = event.target.dataset;
                document.getElementById('info-popup-title').textContent = jobTitle;
                document.getElementById('info-popup-description').textContent = jobDescription;
                infoPopup.style.display = 'block';

                infoPopupApplyBtn.onclick = () => {
                    hidePopup(infoPopup);
                    showForm(applicationType === 'quick' ? 'quick' : 'full');
                };
            });
        });
    }

    function showForm(type) {
        jobListingsSection.style.display = 'none';
        applicationFormContainer.style.display = 'block';
        quickApplyForm.classList.toggle('active-form', type === 'quick');
        fullApplicationForm.classList.toggle('active-form', type === 'full');
        quickApplyBtn.classList.toggle('active', type === 'quick');
        fullApplyBtn.classList.toggle('active', type === 'full');
    }

    function hidePopup(popup) {
        popup.style.display = 'none';
    }

    // Popup close handlers
    quickApplyBtn.addEventListener('click', () => showForm('quick'));
    fullApplyBtn.addEventListener('click', () => showForm('full'));
    infoPopupCloseBtn.addEventListener('click', () => hidePopup(infoPopup));
    confirmationPopupCloseBtn.addEventListener('click', () => hidePopup(confirmationPopup));
    errorPopupCloseBtn.addEventListener('click', () => hidePopup(errorPopup));
    window.addEventListener('click', event => {
        if (event.target === infoPopup) hidePopup(infoPopup);
        if (event.target === confirmationPopup) hidePopup(confirmationPopup);
        if (event.target === errorPopup) hidePopup(errorPopup);
        if (event.target === loadingPopup) hidePopup(loadingPopup);
    });

    // Submit handlers now attempt a dummy fetch with wrong URL to induce failure
    quickApplyForm.addEventListener('submit', handleQuickSubmit);
    fullApplicationForm.addEventListener('submit', handleFullSubmit);

    async function handleQuickSubmit(e) {
        e.preventDefault();
        showLoading();
        try {
            const response = await fetch('/api/quickApply/submit', {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (err) {
            console.error('Quick apply API error:', err);
            showError('Submission failed: Not invoking the API correctly on quick apply submit.');
        } finally {
            hideLoading();
        }
    }

    async function handleFullSubmit(e) {
        e.preventDefault();
        showLoading();
        try {
            const response = await fetch('/api/fullApply', {
                method: 'GET'
            });
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (err) {
            console.error('Full apply API error:', err);
            showError('Submission failed: Not invoking the API correctly on full application submit.');
        } finally {
            hideLoading();
        }
    }

    function showLoading() { loadingPopup.style.display = 'block'; }
    function hideLoading() { loadingPopup.style.display = 'none'; }

    function showConfirmationPopup() { confirmationPopup.style.display = 'block'; }
    function showError(message) {
        document.getElementById('error-popup-message').innerHTML = message;
        errorPopup.style.display = 'block';
    }

    renderJobListings();
});
