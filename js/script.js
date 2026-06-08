/* ─────────────────────────────────────
   SREYA SUNIL · PORTFOLIO
   script.js
───────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Nav — add .stuck class on scroll ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 20);
  }, { passive: true });

  /* ── 2. Scroll reveal ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── 3. Learning bar animations ── */
  // Start all bars at 0
  document.querySelectorAll('.learn-fill').forEach(bar => {
    bar.style.width = '0%';
  });

  // Animate when the panel scrolls into view
  const learnPanel = document.querySelector('.learn-panel');
  if (learnPanel) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.learn-fill').forEach(bar => {
            bar.style.width = bar.dataset.w + '%';
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    barObs.observe(learnPanel);
  }

  /* ── 4. Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
// Copy to clipboard
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 2000);
  });
}

// Send message via mailto
async function sendMessage() {
  const name    = document.getElementById('form-name').value.trim();
  const email   = document.getElementById('form-email').value.trim();
  const message = document.getElementById('form-message').value.trim();
  const status  = document.getElementById('form-status');
  const btn     = document.querySelector('.form-submit');

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  if (!name) {
    status.style.color = '#ff6b6b';
    status.textContent = 'Please enter your name.';
    return;
  }
  if (!email) {
    status.style.color = '#ff6b6b';
    status.textContent = 'Please enter your email.';
    return;
  }
  if (!emailRegex.test(email)) {
    status.style.color = '#ff6b6b';
    status.textContent = 'Please enter a valid email address.';
    return;
  }
  if (!message) {
    status.style.color = '#ff6b6b';
    status.textContent = 'Please write a message.';
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: document.getElementById('access-key').value,
      name,
      email,
      message
    })
  });

  const data = await res.json();

  if (data.success) {
    status.style.color = 'var(--green)';
    status.textContent = '✓ Message sent successfully!';
    document.getElementById('form-name').value = '';
    document.getElementById('form-email').value = '';
    document.getElementById('form-message').value = '';
  } else {
    status.style.color = '#ff6b6b';
    status.textContent = 'Something went wrong. Try again.';
  }

  btn.textContent = 'Send Message';
  btn.disabled = false;
}