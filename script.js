// script.js – with detailed logging at each stage

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Initializing application');
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
        console.log('renderJobListings: Clearing and rendering job listings');
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
        console.log('renderJobListings: Job listings created');
        attachApplyButtonListeners();
    }

    function attachApplyButtonListeners() {
        console.log('attachApplyButtonListeners: Attaching click listeners');
        document.querySelectorAll('.apply-button').forEach(button => {
            button.addEventListener('click', event => {
                const { jobTitle, jobDescription, applicationType } = event.target.dataset;
                console.log(`apply-button clicked: ${jobTitle} (${applicationType})`);
                document.getElementById('info-popup-title').textContent = jobTitle;
                document.getElementById('info-popup-description').textContent = jobDescription;
                infoPopup.style.display = 'block';
                console.log('infoPopup: Shown');

                infoPopupApplyBtn.onclick = () => {
                    console.log('infoPopupApplyBtn clicked: proceeding to', applicationType, 'form');
                    hidePopup(infoPopup);
                    showForm(applicationType === 'quick' ? 'quick' : 'full');
                };
            });
        });
    }

    function showForm(type) {
        console.log('showForm:', type);
        jobListingsSection.style.display = 'none';
        applicationFormContainer.style.display = 'block';
        quickApplyForm.classList.toggle('active-form', type === 'quick');
        fullApplicationForm.classList.toggle('active-form', type === 'full');
        quickApplyBtn.classList.toggle('active', type === 'quick');
        fullApplyBtn.classList.toggle('active', type === 'full');
    }

    function hidePopup(popup) {
        console.log('hidePopup:', popup.id);
        popup.style.display = 'none';
    }

    // Popup close handlers
    quickApplyBtn.addEventListener('click', () => {
        console.log('quickApplyBtn clicked');
        showForm('quick');
    });
    fullApplyBtn.addEventListener('click', () => {
        console.log('fullApplyBtn clicked');
        showForm('full');
    });
    infoPopupCloseBtn.addEventListener('click', () => hidePopup(infoPopup));
    confirmationPopupCloseBtn.addEventListener('click', () => hidePopup(confirmationPopup));
    errorPopupCloseBtn.addEventListener('click', () => hidePopup(errorPopup));
    window.addEventListener('click', event => {
        if (event.target === infoPopup) hidePopup(infoPopup);
        if (event.target === confirmationPopup) hidePopup(confirmationPopup);
        if (event.target === errorPopup) hidePopup(errorPopup);
        if (event.target === loadingPopup) hidePopup(loadingPopup);
    });

    // Submit handlers – dummy fetch to induce failure
    quickApplyForm.addEventListener('submit', handleQuickSubmit);
    fullApplicationForm.addEventListener('submit', handleFullSubmit);

    async function handleQuickSubmit(e) {
        e.preventDefault();
        console.log('handleQuickSubmit: started');
        showLoading();
        try {
            console.log('handleQuickSubmit: calling /api/quickApply/submit');
            const response = await fetch('/api/quickApply/submit', { method: 'POST' });
            console.log('handleQuickSubmit: response status', response.status);
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (err) {
            console.error('handleQuickSubmit error:', err);
            showError('Submission failed: Not invoking the API correctly on quick apply submit.');
        } finally {
            hideLoading();
        }
    }

    async function handleFullSubmit(e) {
        e.preventDefault();
        console.log('handleFullSubmit: started');
        showLoading();
        try {
            console.log('handleFullSubmit: calling /api/fullApply with GET');
            const response = await fetch('/api/fullApply', { method: 'GET' });
            console.log('handleFullSubmit: response status', response.status);
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (err) {
            console.error('handleFullSubmit error:', err);
            showError('Submission failed: Not invoking the API correctly on full application submit.');
        } finally {
            hideLoading();
        }
    }

    function showLoading() {
        console.log('showLoading: displaying loading popup');
        loadingPopup.style.display = 'block';
    }
    function hideLoading() {
        console.log('hideLoading: hiding loading popup');
        loadingPopup.style.display = 'none';
    }

    function showError(message) {
        console.log('showError:', message);
        document.getElementById('error-popup-message').innerHTML = message;
        errorPopup.style.display = 'block';
    }

    // Initial rendering
    renderJobListings();
    console.log('Initialization complete');
});
