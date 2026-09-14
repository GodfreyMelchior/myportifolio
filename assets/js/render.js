'use strict';

/**
 * render.js
 * Inasoma content kutoka data/*.json na kuijaza kwenye ukurasa.
 * MUHIMU: script.js inasoma elements (testimonials, projects, filters) MARA MOJA
 * wakati wa load. Kwa hiyo tunajaza DOM KWANZA, KISHA tunaappend script.js.
 * Hivyo script.js haihitaji kubadilishwa kabisa.
 */

// --- Vifaa vidogo ---
const $ = (sel) => document.querySelector(sel);
const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// "2022-02-23" -> "Feb 23, 2022" (bila kutegemea timezone)
const fmtDate = (iso) => {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${MONTHS[parseInt(mo, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
};

async function getJSON(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

// --- Render kila section ---
function renderProfile(p) {
  if (!p) return;
  const avatar = $('[data-profile-avatar]');
  if (avatar) { avatar.src = p.avatar; avatar.alt = p.name || ''; }
  const name = $('[data-profile-name]');
  if (name) { name.textContent = p.name || ''; name.title = p.name || ''; }
  const title = $('[data-profile-title]');
  if (title) title.textContent = p.title || '';

  const contacts = $('[data-contacts]');
  if (contacts) {
    contacts.innerHTML = [
      contactItem('mail-outline', 'Email', p.email, `mailto:${p.email}`),
      contactItem('phone-portrait-outline', 'Phone', p.phone, `tel:${(p.phone || '').replace(/[^+\d]/g, '')}`),
      contactBlock('calendar-outline', 'Birthday', `<time>${esc(p.birthday)}</time>`),
      contactBlock('location-outline', 'Location', `<address>${esc(p.location)}</address>`)
    ].join('');
  }

  const socials = $('[data-socials]');
  if (socials) {
    socials.innerHTML = (p.socials || []).map((s) => `
      <li class="social-item">
        <a href="${esc(s.url)}" class="social-link" target="_blank" rel="noopener">
          <ion-icon name="logo-${esc(s.network)}"></ion-icon>
        </a>
      </li>`).join('');
  }
}

function contactItem(icon, label, value, href) {
  return contactBlock(icon, label, `<a href="${esc(href)}" class="contact-link">${esc(value)}</a>`);
}
function contactBlock(icon, label, inner) {
  return `
    <li class="contact-item">
      <div class="icon-box"><ion-icon name="${icon}"></ion-icon></div>
      <div class="contact-info">
        <p class="contact-title">${esc(label)}</p>
        ${inner}
      </div>
    </li>`;
}

function renderAbout(a) {
  if (!a) return;
  const text = $('[data-about-text]');
  if (text) text.innerHTML = (a.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('');

  const services = $('[data-services]');
  if (services) {
    services.innerHTML = (a.services || []).map((s) => `
      <li class="service-item">
        <div class="service-icon-box">
          <img src="${esc(s.icon)}" alt="${esc(s.title)} icon" width="40">
        </div>
        <div class="service-content-box">
          <h4 class="h4 service-item-title">${esc(s.title)}</h4>
          <p class="service-item-text">${esc(s.text)}</p>
        </div>
      </li>`).join('');
  }

  const testimonials = $('[data-testimonials]');
  if (testimonials) {
    testimonials.innerHTML = (a.testimonials || []).map((t) => `
      <li class="testimonials-item">
        <div class="content-card" data-testimonials-item>
          <figure class="testimonials-avatar-box">
            <img src="${esc(t.avatar)}" alt="${esc(t.name)}" width="60" data-testimonials-avatar>
          </figure>
          <h4 class="h4 testimonials-item-title" data-testimonials-title>${esc(t.name)}</h4>
          <div class="testimonials-text" data-testimonials-text>
            <p>${esc(t.text)}</p>
          </div>
        </div>
      </li>`).join('');
  }

  const clients = $('[data-clients]');
  if (clients) {
    clients.innerHTML = (a.clients || []).map((c) => `
      <li class="clients-item">
        <a href="${esc(c.url || '#')}"><img src="${esc(c.logo)}" alt="client logo"></a>
      </li>`).join('');
  }
}

function renderResume(r) {
  if (!r) return;
  const timelineItem = (it) => `
    <li class="timeline-item">
      <h4 class="h4 timeline-item-title">${esc(it.title)}</h4>
      <span>${esc(it.period)}</span>
      <p class="timeline-text">${esc(it.text)}</p>
    </li>`;

  const edu = $('[data-education]');
  if (edu) edu.innerHTML = (r.education || []).map(timelineItem).join('');
  const exp = $('[data-experience]');
  if (exp) exp.innerHTML = (r.experience || []).map(timelineItem).join('');

  const skills = $('[data-skills]');
  if (skills) {
    skills.innerHTML = (r.skills || []).map((s) => `
      <li class="skills-item">
        <div class="title-wrapper">
          <h5 class="h5">${esc(s.name)}</h5>
          <data value="${esc(s.percent)}">${esc(s.percent)}%</data>
        </div>
        <div class="skill-progress-bg">
          <div class="skill-progress-fill" style="width: ${esc(s.percent)}%;"></div>
        </div>
      </li>`).join('');
  }
}

function renderPortfolio(p) {
  if (!p) return;
  const cats = p.categories && p.categories.length ? p.categories : ['All'];

  const filterList = $('[data-filter-list]');
  if (filterList) {
    filterList.innerHTML = cats.map((c, i) => `
      <li class="filter-item">
        <button class="${i === 0 ? 'active' : ''}" data-filter-btn>${esc(c)}</button>
      </li>`).join('');
  }

  const selectList = $('[data-select-list]');
  if (selectList) {
    selectList.innerHTML = cats.map((c) => `
      <li class="select-item"><button data-select-item>${esc(c)}</button></li>`).join('');
  }

  const projects = $('[data-projects]');
  if (projects) {
    projects.innerHTML = (p.projects || []).map((proj) => `
      <li class="project-item active" data-filter-item data-category="${esc((proj.category || '').toLowerCase())}">
        <a href="${esc(proj.url || '#')}">
          <figure class="project-img">
            <div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div>
            <img src="${esc(proj.image)}" alt="${esc(proj.title)}" loading="lazy">
          </figure>
          <h3 class="project-title">${esc(proj.title)}</h3>
          <p class="project-category">${esc(proj.category)}</p>
        </a>
      </li>`).join('');
  }
}

function renderBlog(b) {
  if (!b) return;
  const list = $('[data-blog]');
  if (!list) return;
  list.innerHTML = (b.posts || []).map((post) => `
    <li class="blog-post-item">
      <a href="${esc(post.url || '#')}">
        <figure class="blog-banner-box">
          <img src="${esc(post.image)}" alt="${esc(post.title)}" loading="lazy">
        </figure>
        <div class="blog-content">
          <div class="blog-meta">
            <p class="blog-category">${esc(post.category)}</p>
            <span class="dot"></span>
            <time datetime="${esc(post.date)}">${esc(fmtDate(post.date))}</time>
          </div>
          <h3 class="h3 blog-item-title">${esc(post.title)}</h3>
          <p class="blog-text">${esc(post.excerpt)}</p>
        </div>
      </a>
    </li>`).join('');
}

function renderContact(c) {
  if (!c) return;
  const map = $('[data-map]');
  if (map && c.mapEmbedUrl) map.src = c.mapEmbedUrl;
}

// --- Endesha ---
(async function init() {
  try {
    const [profile, about, resume, portfolio, blog, contact] = await Promise.all([
      getJSON('./data/profile.json'),
      getJSON('./data/about.json'),
      getJSON('./data/resume.json'),
      getJSON('./data/portfolio.json'),
      getJSON('./data/blog.json'),
      getJSON('./data/contact.json')
    ]);

    renderProfile(profile);
    renderAbout(about);
    renderResume(resume);
    renderPortfolio(portfolio);
    renderBlog(blog);
    renderContact(contact);
  } catch (err) {
    console.error('Content render error:', err);
  } finally {
    // Baada ya DOM kujazwa, pakia script.js ili listeners zishike elements zilizopo.
    const s = document.createElement('script');
    s.src = './assets/js/script.js';
    document.body.appendChild(s);
  }
})();
