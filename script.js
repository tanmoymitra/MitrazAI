document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');

            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');

                // Reset hamburger
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Smooth Scrolling for Anchor Links (polishing standard behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Account for fixed header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.card, .service-card, .section-header, .hero-text, .benefits-text, .stat-box');

    // Add initial CSS for animation
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Class to add when visible
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

});

// Old Contact Form Logic Removed - Replaced by Strategy Modal

// Multi-Step Strategy Call Modal Logic
document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('strategy-modal');
    const strategyForm = document.getElementById('strategy-form');
    // Select all buttons that should open the modal
    const openModalBtns = document.querySelectorAll('a[href="#contact"]');
    const closeModalBtn = document.querySelector('.close-modal');

    // Steps & Navigation
    const steps = document.querySelectorAll('.step');
    const progressBar = document.getElementById('progress-bar');
    const currentStepText = document.getElementById('current-step-text');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-modal-btn');

    let currentStep = 0;
    const totalSteps = steps.length;

    // --- Modal Control ---

    // Open Modal
    function openModal(e) {
        e.preventDefault(); // Prevent jump to #contact
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Disable scroll
    }

    openModalBtns.forEach(btn => {
        // We override the default anchor behavior for "Book Strategy Call" buttons
        // Note: The specific buttons might need more specific selectors if they are used for other things
        // But based on the request, these seem to be the primary CTAs.
        btn.addEventListener('click', openModal);
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Enable scroll
        // Optional: Reset form after a delay or immediately?
        // setTimeout(resetForm, 300); 
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Form Navigation ---

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });

        // Update Progress
        const progressPercentage = ((stepIndex + 1) / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        currentStepText.textContent = stepIndex + 1;

        // Button Visibility
        prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-block';

        if (stepIndex === totalSteps - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    function validateStep(stepIndex) {
        const currentStepEl = steps[stepIndex];
        const inputs = currentStepEl.querySelectorAll('input, select, textarea');
        let isValid = true;
        let firstInvalidInput = null;

        inputs.forEach(input => {
            if (input.hasAttribute('required')) {
                if (input.type === 'radio') {
                    const name = input.name;
                    const isChecked = currentStepEl.querySelector(`input[name="${name}"]:checked`);
                    if (!isChecked) {
                        isValid = false;
                        if (!firstInvalidInput) firstInvalidInput = input;
                    }
                } else {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = 'red';
                        if (!firstInvalidInput) firstInvalidInput = input;
                    } else {
                        input.style.borderColor = ''; // Reset
                    }
                }
            }
        });

        if (!isValid) {
            // Shake effect or simple alert
            currentStepEl.classList.add('shake');
            setTimeout(() => currentStepEl.classList.remove('shake'), 400); // Assume CSS shake animation exists or add it
        }

        return isValid;
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // --- Form Submission ---

    strategyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Final Validation (just in case)
        if (!validateStep(currentStep)) return;

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Gather Data
        const formData = new FormData(strategyForm);
        const data = Object.fromEntries(formData.entries());

        // Add timestamp or other metadata
        data.timestamp = new Date().toISOString();
        data.source = 'Strategy Call Modal';

        // Webhook URL
        const webhookUrl = 'https://automation.mitrazinfotech.tech/webhook-test/91bc5488-1af4-4d3f-9083-20ba85e3332d';

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    alert("Application Sent! We'll be in touch shortly.");
                    closeModal();
                    strategyForm.reset();
                    currentStep = 0;
                    showStep(0);
                } else {
                    alert('Server Error: ' + response.status + '. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Connection Error. Please try again.');
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
    });

    // Auto-advance for Radio Buttons (Optional UX improvement)
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            // Wait a tiny bit (300ms) then go next
            // Only if validation passes (it should, since one was just checked)
            // And if not on the last step (budget)
            if (currentStep < totalSteps - 1) {
                setTimeout(() => {
                    // Check if still on the same step (user might have clicked back quickly)
                    if (radio.closest('.step') === steps[currentStep]) {
                        nextBtn.click();
                    }
                }, 300);
            }
        });
    });

    // Add Shake Animation to Style
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
        .shake {
            animation: shake 0.4s ease-in-out;
        }
    `;
    document.head.appendChild(style);

});

// Link data for personas
const personaData = {
    saas: {
        headline: "Automate Your SaaS Operations <span class='gradient-text'>Without Hiring More People</span>",
        subhead: "Replace manual workflows across sales, support, onboarding, and ops with AI-powered automation built for fast-scaling SaaS teams.",
        ctaPrimary: "Get My SaaS Automation Roadmap",
        ctaSecondary: "See How It Works",
        problemHeadline: "Stop Losing <span class='highlight'>Time & Revenue</span>",
        problemSubhead: "Manual processes are the bottleneck to your growth.",
        problems: [
            { icon: "📉", title: "Churn Risk", text: "Slow onboarding and support response times lead to dissatisfied customers." },
            { icon: "🔥", title: "Dev Distraction", text: "Your engineers are stuck building internal tools instead of product features." },
            { icon: "💰", title: "OpEx Bloat", text: "Hiring more operational staff kills your margins as you scale." }
        ],
        conversionHeadline: "See What You Can Automate in 30 Minutes",
        conversionSubhead: "Get a free SaaS workflow audit and a custom AI automation plan.",
        conversionCta: "Book My Free SaaS Automation Audit"
    },
    agency: {
        headline: "Deliver More Client Results — <span class='gradient-text'>Without Burning Out Your Team</span>",
        subhead: "Automate fulfillment, reporting, and client operations using AI + no-code workflows. Scale your agency, not your headcount.",
        ctaPrimary: "Automate My Agency Workflows",
        ctaSecondary: "View Agency Solutions",
        problemHeadline: "Is Your Agency <span class='highlight'>Stuck in Delivery Hell?</span>",
        problemSubhead: "You shouldn't be spending all day copy-pasting report data.",
        problems: [
            { icon: "😫", title: "Team Burnout", text: "Account managers are overwhelmed with manual reporting and updates." },
            { icon: "📉", title: "Profit Leaks", text: "Scope creep and manual tasks eat away at your retainer margins." },
            { icon: "🐢", title: "Slow Turnaround", text: "Client deliverables perform slower because of manual bottlenecks." }
        ],
        conversionHeadline: "Scale Your Agency With AI",
        conversionSubhead: "Get a free audit of your agency workflows and find hidden profit margins.",
        conversionCta: "Book My Free Agency Automation Call"
    },
    sme: {
        headline: "Stop Wasting Time on Repetitive Work — <span class='gradient-text'>Let AI Handle It</span>",
        subhead: "Automate sales, support, invoicing, and daily operations so you can focus on growth. No technical skills required.",
        ctaPrimary: "Get My Automation Plan",
        ctaSecondary: "Explore Solutions",
        problemHeadline: "Are You Trapped in <span class='highlight'>Admin Work?</span>",
        problemSubhead: "You started a business to grow, not to manage spreadsheets.",
        problems: [
            { icon: "⏳", title: "Lost Hours", text: "Spending 10+ hours a week on data entry and emails." },
            { icon: "💸", title: "Missed Leads", text: "Potential customers slip through the cracks because you're too busy." },
            { icon: "🤯", title: "Overwhelm", text: "Trying to wear every hat and feeling constantly behind." }
        ],
        conversionHeadline: "Reclaim 20+ Hours a Week",
        conversionSubhead: "See exactly which tasks you can offload to AI today.",
        conversionCta: "Book My Free Automation Call"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.toggle-btn');

    // Elements to update
    const heroHeadline = document.getElementById('hero-headline');
    const heroSubhead = document.getElementById('hero-subhead');
    const heroCtaPrimary = document.getElementById('hero-cta-primary');
    const heroCtaSecondary = document.getElementById('hero-cta-secondary');

    const problemHeadline = document.getElementById('problem-headline');
    const problemSubhead = document.getElementById('problem-subhead');
    const problemGrid = document.getElementById('problem-grid');

    const conversionHeadline = document.getElementById('conversion-headline');
    const conversionSubhead = document.getElementById('conversion-subhead');
    const conversionCta = document.getElementById('conversion-main-cta');

    // Function to render problems
    function renderProblems(problems) {
        if (!problemGrid) return;
        problemGrid.innerHTML = problems.map(p => `
            <div class="feature-card fade-in">
                <div class="icon-box">${p.icon}</div>
                <h3>${p.title}</h3>
                <p>${p.text}</p>
            </div>
        `).join('');
    }

    // Switch Content
    function switchPersona(personaKey) {
        const data = personaData[personaKey];
        if (!data) return;

        // Update Text
        if (heroHeadline) heroHeadline.innerHTML = data.headline;
        if (heroSubhead) heroSubhead.textContent = data.subhead;
        if (heroCtaPrimary) heroCtaPrimary.textContent = data.ctaPrimary;
        if (heroCtaSecondary) heroCtaSecondary.textContent = data.ctaSecondary;

        if (problemHeadline) problemHeadline.innerHTML = data.problemHeadline;
        if (problemSubhead) problemSubhead.textContent = data.problemSubhead;

        renderProblems(data.problems);

        if (conversionHeadline) conversionHeadline.textContent = data.conversionHeadline;
        if (conversionSubhead) conversionSubhead.textContent = data.conversionSubhead;
        if (conversionCta) conversionCta.textContent = data.conversionCta;

        // Update Toggle State
        toggles.forEach(btn => {
            if (btn.dataset.persona === personaKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const persona = btn.dataset.persona;
            switchPersona(persona);
        });
    });
});
