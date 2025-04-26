// script.js – Quick-Apply hits wrong API to fail, shows error popup; on real success shows confirmation popup

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Initializing application');
    const jobListingsSection        = document.getElementById('job-listings');
    const applicationFormContainer  = document.getElementById('application-form-container');
    const quickApplyBtn             = document.getElementById('quick-apply-btn');
    const fullApplyBtn              = document.getElementById('full-apply-btn');
    const quickApplyForm            = document.getElementById('quick-apply-form');
    const fullApplicationForm       = document.getElementById('full-application-form');
    const infoPopup                 = document.getElementById('info-popup');
    const infoPopupCloseBtn         = document.getElementById('info-popup-close');
    const infoPopupApplyBtn         = document.getElementById('info-popup-apply-btn');
    const confirmationPopup         = document.getElementById('confirmation-popup');
    const confirmationPopupCloseBtn = document.getElementById('confirmation-popup-close');
    const errorPopup                = document.getElementById('error-popup');
    const errorPopupCloseBtn        = document.getElementById('error-popup-close');
    const loadingPopup              = document.getElementById('loading-popup');

    const jobs = [
        { title: 'Software Engineer', company: 'Tech Solutions Inc.', location: 'New York, NY, USA',    description: 'Develop and maintain software applications...', applicationType: 'full'  },
        { title: 'Web Designer',      company: 'Creative Designs Co.', location: 'Los Angeles, CA, USA', description: 'Design and build user-friendly websites...', applicationType: 'quick' },
        { title: 'Data Analyst',      company: 'Analytics Pro',       location: 'Chicago, IL, USA',      description: 'Analyze data to provide insights and reports...', applicationType: 'full'  },
        { title: 'Backend Developer', company: 'Genet.ai',           location: 'Bangalore, India',     description: 'Build scalable backend services...', applicationType: 'quick' },
        { title: 'Frontend Engineer', company: 'Genet.ai',           location: 'Mumbai, India',        description: 'Craft intuitive React dashboards...', applicationType: 'full'  },
        { title: 'DevOps Specialist', company: 'Genet.ai',           location: 'Delhi, India',         description: 'Automate CI/CD for Kubernetes...', applicationType: 'full'  }
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
                        data-job-location="${job.location}">Apply Now</button>
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
                const { jobTitle, jobDescription, jobLocation } = event.target.dataset;
                console.log(`apply-button clicked: ${jobTitle} (${jobLocation})`);

                // India-job bug: NPE on India locations
                if (jobLocation.includes('India')) {
                    console.log('India job validation: about to trigger null-pointer');
                    const validator = null;
                    validator.validate(); // <-- null-pointer exception here
                }

                document.getElementById('info-popup-title').textContent       = jobTitle;
                document.getElementById('info-popup-description').textContent = jobDescription;
                infoPopup.style.display = 'block';
                console.log('infoPopup: Shown');

                // Always Quick Apply
                infoPopupApplyBtn.onclick = () => {
                    console.log('infoPopupApplyBtn clicked: proceeding to QUICK form');
                    hidePopup(infoPopup);
                    showForm('quick');
                };
            });
        });
    }

    function showForm(type) {
        console.log('showForm:', type);
        jobListingsSection.style.display       = 'none';
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

    // Quick Apply tab
    quickApplyBtn.addEventListener('click', () => {
        console.log('quickApplyBtn clicked');
        showForm('quick');
    });

    // Full Application tab – still throws NPE
    fullApplyBtn.addEventListener('click', () => {
        console.log('fullApplyBtn clicked');
        const missingHeader = document.getElementById('full-application-header');
        missingHeader.innerText = 'Full Application'; // <-- null-pointer here
        showForm('full');
    });

    // Submit Quick Apply – wrong endpoint to force failure
    quickApplyForm.addEventListener('submit', handleQuickSubmit);

    async function handleQuickSubmit(e) {
        e.preventDefault();
        console.log('handleQuickSubmit: started');
        showLoading();

        try {
            console.log('handleQuickSubmit: calling WRONG endpoint');
            // deliberately wrong path:
            const response = await fetch('/api/quickApply/not-real', {
                method: 'POST',
                body: new FormData(quickApplyForm)
            });
            console.log('handleQuickSubmit: response status', response.status);

            if (!response.ok) {
                // grab API error message if provided
                let errMsg = `Error ${response.status}`;
                try {
                    const errData = await response.json();
                    errMsg = errData.message || errMsg;
                } catch(_) {}
                throw new Error(errMsg);
            }

            console.log('handleQuickSubmit: success!');
            // when fixed to the real endpoint this will fire:
            confirmationPopup.style.display = 'block';
        } catch (err) {
            console.error('handleQuickSubmit error:', err);
            showError(`Submission failed: ${err.message}`);
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

    // Close popups
    infoPopupCloseBtn.addEventListener('click',    () => hidePopup(infoPopup));
    confirmationPopupCloseBtn.addEventListener('click', () => hidePopup(confirmationPopup));
    errorPopupCloseBtn.addEventListener('click',   () => hidePopup(errorPopup));
    window.addEventListener('click', event => {
        if (event.target === infoPopup)        hidePopup(infoPopup);
        if (event.target === confirmationPopup) hidePopup(confirmationPopup);
        if (event.target === errorPopup)        hidePopup(errorPopup);
        if (event.target === loadingPopup)      hidePopup(loadingPopup);
    });

    renderJobListings();
    console.log('Initialization complete');
});
