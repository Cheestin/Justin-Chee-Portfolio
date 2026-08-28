// =====================================================================
// Mobile menu toggle
// (declared before the tab logic below, since activateTab() references
// navToggle when closing the mobile menu on tab select)
// =====================================================================
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// =====================================================================
// Tab navigation
// Shows/hides the four tab-panels and keeps the URL hash in sync so
// tabs are linkable and the back/forward buttons work.
// =====================================================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

function activateTab(targetId, updateHash = true) {
  tabButtons.forEach((btn) => {
    const isMatch = btn.dataset.tabTarget === targetId;
    btn.classList.toggle('is-active', isMatch);
    btn.setAttribute('aria-selected', String(isMatch));
  });

  tabPanels.forEach((panel) => {
    const isMatch = panel.id === targetId;
    panel.classList.toggle('is-active', isMatch);
    panel.hidden = !isMatch;
  });

  if (updateHash) {
    history.replaceState(null, '', `#${targetId}`);
  }

  // Close mobile menu after selecting a tab
  header.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tabTarget));
});

// Support the logo linking back to the Summary tab
document.querySelectorAll('[data-tab-target]').forEach((el) => {
  if (el.tagName === 'A' && !el.classList.contains('tab-btn')) {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab(el.dataset.tabTarget);
    });
  }
});

// Open the tab matching the URL hash on load (defaults to Summary)
const initialTab = window.location.hash.replace('#', '') || 'summary';
if (document.getElementById(initialTab)) {
  activateTab(initialTab, false);
}

// =====================================================================
// Contact form — submits via fetch so the page never navigates away.
// Requires a Formspree endpoint set in the form's action="" attribute
// in index.html. See the comment above the form for setup steps.
// =====================================================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        formStatus.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
        formStatus.classList.add('is-success');
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong sending that — please try again, or email me directly.';
      formStatus.classList.add('is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}

// =====================================================================
// Projects row — redirects normal vertical scroll into horizontal scroll
// while the cursor is over the row, instead of scrolling the page.
// Eases toward a target position each frame instead of jumping instantly,
// so it feels smooth rather than jagged/stepped.
// =====================================================================
const projectGrid = document.querySelector('.project-grid');

if (projectGrid) {
  let targetScroll = projectGrid.scrollLeft;
  let isAnimating = false;

  function easeTowardTarget() {
    const current = projectGrid.scrollLeft;
    const distance = targetScroll - current;

    if (Math.abs(distance) < 0.5) {
      projectGrid.scrollLeft = targetScroll;
      isAnimating = false;
      return;
    }

    // Move a fraction of the remaining distance each frame — this is what
    // creates the smooth "settling" feel instead of an instant jump.
    projectGrid.scrollLeft = current + distance * 0.15;
    requestAnimationFrame(easeTowardTarget);
  }

  projectGrid.addEventListener('wheel', (e) => {
    // Only take over vertical scroll gestures; let horizontal trackpad
    // swipes pass through untouched.
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();

      const maxScroll = projectGrid.scrollWidth - projectGrid.clientWidth;
      targetScroll = Math.min(Math.max(targetScroll + e.deltaY, 0), maxScroll);

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(easeTowardTarget);
      }
    }
  }, { passive: false });
}

// =====================================================================
// Footer year
// =====================================================================
document.getElementById('year').textContent = new Date().getFullYear();
