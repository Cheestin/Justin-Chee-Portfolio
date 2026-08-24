// =====================================================================
// Tab navigation
// Shows/hides the four tab-panels and keeps the URL hash in sync so
// tabs are linkable and the back/forward buttons work.
// =====================================================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const header = document.querySelector('.site-header');

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
// Mobile menu toggle
// =====================================================================
const navToggle = document.querySelector('.nav-toggle');
navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// =====================================================================
// Footer year
// =====================================================================
document.getElementById('year').textContent = new Date().getFullYear();
