/* ============================================================
   JDI SA — Main JavaScript
   ============================================================ */

// --- Navbar scroll effect ---
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// --- Mobile nav toggle ---
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// --- Mark active nav link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// --- Donation amount buttons ---
const amountBtns = document.querySelectorAll('.amount-btn');
const customInput = document.getElementById('custom-amount');
amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (customInput && btn.dataset.amount !== 'custom') {
      customInput.value = btn.dataset.amount;
    }
    if (btn.dataset.amount === 'custom' && customInput) {
      customInput.focus();
    }
  });
});

// --- Filter buttons ---
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.filter-bar');
    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCards(btn.dataset.filter, document);
  });
});

function filterCards(filter, scope) {
  const cards = scope.querySelectorAll('[data-category]');
  cards.forEach(card => {
    if (filter === 'all' || card.dataset.category === filter) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Newsletter form ---
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');
    if (!input || !input.value) return;
    btn.textContent = 'Subscribed!';
    btn.disabled = true;
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.disabled = false;
    }, 4000);
  });
});

// --- Contact / donation forms ---
document.querySelectorAll('form.jdi-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Thank you!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
});

// --- Search ---
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('[data-searchable]').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// --- Scroll animations (IntersectionObserver) ---
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

const _style = document.createElement('style');
_style.textContent = '.animate-on-scroll.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(_style);

function initScrollAnimations(root) {
  const scope = root || document;
  scope.querySelectorAll('.animate-on-scroll:not([data-observed])').forEach((el, i) => {
    el.dataset.observed = '1';
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.transitionDelay = `${i * 0.08}s`;
    scrollObserver.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  loadDynamicContent();
});

// ============================================================
// CMS-driven content rendering
// ============================================================

const STATEMENT_CATEGORIES = {
  'community':    { cls: 'card-tag green', label: 'Community' },
  'human-rights': { cls: 'card-tag gold',  label: 'Human Rights' },
  'gaza':         { cls: 'card-tag',        label: 'Gaza &amp; Conflict' },
  'occupation':   { cls: 'card-tag',        label: 'Occupation', style: 'background:#f3e8ff;color:#6b21a8;' },
  'south-africa': { cls: 'card-tag green',  label: 'South Africa' }
};

const MEDIA_GRADIENTS = {
  primary:  'linear-gradient(135deg,var(--color-primary),var(--color-primary-light))',
  green:    'linear-gradient(135deg,#2d6a4f,#1b4332)',
  red:      'linear-gradient(135deg,#6b2a1a,#a0412a)',
  blue:     'linear-gradient(135deg,#1a4a8a,#3a6ab8)',
  gray:     'linear-gradient(135deg,#374151,#4b5563)',
  purple:   'linear-gradient(135deg,#7c3aed,#5b21b6)',
  teal:     'linear-gradient(135deg,#0f766e,#0d9488)',
  darkblue: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
  pink:     'linear-gradient(135deg,#be185d,#9d174d)',
  amber:    'linear-gradient(135deg,#92400e,#b45309)'
};

const MEDIA_CATEGORIES = {
  community: { cls: 'card-tag green', label: 'Community' },
  media:     { cls: 'card-tag gold',  label: 'In the Media' },
  opinion:   { cls: 'card-tag',       label: 'Opinion' },
  report:    { cls: 'card-tag',       label: 'Report' },
  event:     { cls: 'card-tag',       label: 'Event', style: 'background:#f3e8ff;color:#6b21a8;' }
};

function renderStatements(container, items) {
  // Group by year (derived from date string)
  const byYear = {};
  items.forEach(item => {
    const yr = (item.date.match(/\d{4}/) || ['Other'])[0];
    (byYear[yr] = byYear[yr] || []).push(item);
  });

  let html = '';
  Object.keys(byYear).sort((a, b) => b - a).forEach((year, i) => {
    const margin = i === 0 ? 'margin-bottom:1.5rem;' : 'margin:3rem 0 1.5rem;';
    html += `<h3 style="color:var(--color-primary);${margin}padding-bottom:.75rem;border-bottom:2px solid var(--color-gold);">${year}</h3>`;

    byYear[year].forEach(item => {
      const cat = STATEMENT_CATEGORIES[item.category] || { cls: 'card-tag', label: item.category };
      const tagStyle = cat.style ? ` style="${cat.style}"` : '';
      const isExternal = /\.(pdf|docx|doc)$/i.test(item.link);
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const href = item.link.startsWith('http') ? item.link : '../' + item.link;

      html += `
      <div class="statement-item animate-on-scroll" data-searchable data-category="${item.category}">
        <div class="statement-date">${item.date}</div>
        <div class="statement-body">
          <span class="${cat.cls}"${tagStyle}>${cat.label}</span>
          <h3><a href="${href}"${target}>${item.title}</a></h3>
          <p>${item.excerpt}</p>
          <a href="${href}"${target} class="read-more">${item.linkText} →</a>
        </div>
      </div>`;
    });
  });

  container.innerHTML = html;
  initScrollAnimations(container);
}

function renderMedia(data) {
  const featuredEl = document.getElementById('media-featured');
  const gridEl     = document.getElementById('media-grid');

  if (featuredEl && data.featured) {
    const f = data.featured;
    featuredEl.innerHTML = `
      <div class="card" style="display:grid;grid-template-columns:1fr 1fr;border-radius:var(--radius-lg);overflow:hidden;margin-bottom:3rem;" data-category="opinion" data-searchable>
        <div style="background:linear-gradient(135deg,var(--color-primary),var(--color-primary-light));display:flex;align-items:center;justify-content:center;min-height:280px;">
          <span style="font-size:5rem;">📰</span>
        </div>
        <div class="card-body" style="padding:2.5rem;display:flex;flex-direction:column;justify-content:center;">
          <span class="card-tag">Featured · Opinion</span>
          <div class="meta"><span>${f.date}</span><span class="sep">•</span><span>${f.duration}</span></div>
          <h2 style="margin-bottom:1rem;font-size:1.6rem;">${f.title}</h2>
          <p>${f.excerpt}</p>
          <a href="${f.link}" class="btn btn-primary mt-2" style="align-self:flex-start;">${f.linkText} →</a>
        </div>
      </div>`;
  }

  if (gridEl && data.items) {
    gridEl.innerHTML = data.items.map(item => {
      const gradient = MEDIA_GRADIENTS[item.colorScheme] || MEDIA_GRADIENTS.primary;
      const cat = MEDIA_CATEGORIES[item.category] || { cls: 'card-tag', label: item.category };
      const tagStyle = cat.style ? ` style="${cat.style}"` : '';
      return `
        <article class="card animate-on-scroll" data-category="${item.category}" data-searchable>
          <div class="card-img-placeholder" style="background:${gradient};">
            <span style="font-size:3rem;">${item.icon || '📄'}</span>
          </div>
          <div class="card-body">
            <span class="${cat.cls}"${tagStyle}>${cat.label}</span>
            <div class="meta"><span>${item.date}</span><span class="sep">•</span><span>${item.duration}</span></div>
            <h3>${item.title}</h3>
            <p>${item.excerpt}</p>
            <a href="${item.link}" class="read-more">${item.linkText} →</a>
          </div>
        </article>`;
    }).join('');
    initScrollAnimations(gridEl);
  }
}

function loadDynamicContent() {
  if (document.getElementById('media-featured') || document.getElementById('media-grid')) {
    fetch('../_data/media.json')
      .then(r => r.json())
      .then(data => renderMedia(data))
      .catch(() => {
        const grid = document.getElementById('media-grid');
        if (grid) grid.innerHTML = '<p style="padding:2rem 0;color:var(--color-primary);">Unable to load articles.</p>';
      });
  }
}
