document.body.classList.add('js-anim');
// ==============================
// Utility: current year in footer
// ==============================
document.getElementById('year').textContent = new Date().getFullYear();

// ==============================
// Mobile navigation toggle
// ==============================
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// ==============================
/* Tilt interaction (vanilla JS)
   This adds a subtle 3D tilt on elements with .tilt */
// ==============================
const tiltElems = document.querySelectorAll('.tilt');
tiltElems.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = (x - rect.width / 2) / rect.width;
    const dy = (y - rect.height / 2) / rect.height;
    el.style.transform = `rotateX(${dy * -6}deg) rotateY(${dx * 6}deg)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});

// ==============================
// Typewriter cycling text
// ==============================
(function(){
  const tw = document.querySelector('.typewriter');
  if(!tw) return;
  const items = (tw.getAttribute('data-text') || '').split('•').map(s => s.trim()).filter(Boolean);
  let idx = 0, pos = 0, dir = 1; // dir: 1 typing, -1 deleting
  let current = items[0] || '';
  function tick(){
    if(dir === 1){
      pos++;
      if(pos >= current.length + 8){ dir = -1; }
    } else {
      pos--;
      if(pos <= 0){
        dir = 1;
        idx = (idx + 1) % items.length;
        current = items[idx] || '';
      }
    }
    tw.textContent = current.slice(0, Math.max(0,pos));
    setTimeout(tick, dir===1 ? 80 : 40);
  }
  tick();
})();

// ==============================
// Reveal on scroll
// ==============================
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));
setTimeout(() => revealEls.forEach(el => el.classList.add('visible')), 50); /* Fallback reveal */

// ==============================
// Contact form: open mail client with prefilled content
// ==============================
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const subject = data.get('subject');
    const message = data.get('message');
    // Build a mailto URL
    const mailto = `mailto:rasheedghafoury@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} <${email}>

${message}`)}`;
    window.location.href = mailto;
    statusEl.textContent = 'Opening your email app…';
  });
}

// ==============================
// Contact form: Formspree AJAX submit (no page reload)
// ==============================
const form = document.getElementById('contactForm');
if(form){
  const statusEl = document.getElementById('formStatus');
  form.addEventListener('submit', async (e) => {
    // If form has an action (e.g., Formspree), submit via fetch
    if(form.getAttribute('action')){
      e.preventDefault();
      try{
        const data = new FormData(form);
        const res = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept':'application/json' }});
        if(res.ok){
          statusEl && (statusEl.textContent = 'Thanks! Your message has been sent.');
          form.reset();
        }else{
          statusEl && (statusEl.textContent = 'Sorry, there was an error. Please try again.');
        }
      }catch(err){
        statusEl && (statusEl.textContent = 'Network error. Please try again.');
      }
    }
  });
}
