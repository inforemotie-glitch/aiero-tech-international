/* ==========================================================
   Aiero Tech International
   Site interactions: navigation, tabs, accordion, modal,
   counters, scroll reveal, copy buttons and contact form.
   ========================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  /* Extra detail shown in the service quick-view modal */
  var SERVICES = {
    helpdesk: {
      tag: 'Managed IT',
      intro: 'Your staff call one number and talk to a technician who knows your setup. Meanwhile we keep every device patched, monitored and running well in the background.',
      points: [
        'Unlimited helpdesk support by phone, email and chat',
        'On-site visits across metropolitan Adelaide',
        '24/7 monitoring with automatic alerts',
        'Patch management for Windows, Mac and business apps',
        'New starter and leaver setups handled for you'
      ]
    },
    security: {
      tag: 'Security',
      intro: 'We put practical protection in place and document it, so you can answer insurance forms and client security questions with confidence.',
      points: [
        'Managed antivirus with threat detection and response',
        'Email filtering and phishing protection',
        'Multi-factor authentication for every account',
        'Essential Eight assessments and improvement plans',
        'Staff awareness training and phishing simulations'
      ]
    },
    network: {
      tag: 'Networks',
      intro: 'We design, install and look after networks that stay fast and secure, whether you have one office or several sites.',
      points: [
        'Wi-Fi surveys and access point placement',
        'Firewall setup, rules and ongoing updates',
        'Switching, cabling and comms rack tidy-ups',
        'Site-to-site and remote access VPNs',
        'NBN and business fibre coordination'
      ]
    },
    cloud: {
      tag: 'Cloud',
      intro: 'Moving to the cloud should make work easier, not harder. We plan the move, migrate your data safely and keep everything tidy afterwards.',
      points: [
        'Email and file migrations with no lost data',
        'SharePoint, OneDrive and Teams structure',
        'Azure and hosted server management',
        'Conditional access and device management',
        'Quarterly licence reviews to control costs'
      ]
    },
    backup: {
      tag: 'Backup',
      intro: 'We back up your servers, PCs and cloud data automatically, keep copies in Australian data centres and prove they work with regular test restores.',
      points: [
        'Automated daily backups with alerts if a job fails',
        'Microsoft 365 email, OneDrive and SharePoint backup',
        'Encrypted copies stored in Australia',
        'Monthly restore tests with written results',
        'A documented recovery plan for your business'
      ]
    },
    comms: {
      tag: 'Communications',
      intro: 'One phone system for the office, home and the road. We move your numbers across and set everything up so calls are never missed.',
      points: [
        'Number porting with no downtime',
        'Microsoft Teams Phone or hosted PBX',
        'Call queues, menus and after-hours routing',
        'Meeting room cameras, screens and speakers',
        'Mobile and laptop apps for remote staff'
      ]
    },
    hardware: {
      tag: 'Hardware',
      intro: 'We source business-grade devices at fair prices and set them up before they arrive, so new gear is ready to use on day one.',
      points: [
        'Laptops, desktops, screens and docking stations',
        'Network gear, printers and meeting room tech',
        'Devices configured and tested before delivery',
        'Warranty and asset tracking',
        'Secure data wiping and recycling of old devices'
      ]
    },
    strategy: {
      tag: 'Strategy',
      intro: 'We help you plan IT spending and projects a year ahead, so technology supports your goals instead of surprising your budget.',
      points: [
        'Twelve-month IT roadmap and budget',
        'Quarterly business reviews with a senior consultant',
        'Software and vendor recommendations',
        'Project planning and delivery',
        'Risk and compliance check-ins'
      ]
    }
  };

  /* ---------- Footer year ---------- */
  function initYear() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;
    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    var toggle = $('.nav-toggle');
    var nav = $('#primary-nav');
    var header = $('.site-header');
    if (!toggle || !nav || !header) return;

    function setOpen(open) {
      if (open) {
        var top = Math.max(header.getBoundingClientRect().bottom, 0);
        document.documentElement.style.setProperty('--nav-top', top + 'px');
      }
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    var desktop = window.matchMedia('(min-width: 1081px)');
    var onChange = function (event) {
      if (event.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- Highlight the current section in the nav ---------- */
  function initActiveNav() {
    var links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = [];
    links.forEach(function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) sections.push({ section: section, link: link });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (item) {
          var active = item.section === entry.target;
          item.link.classList.toggle('is-active', active);
          if (active) item.link.setAttribute('aria-current', 'true');
          else item.link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (item) { observer.observe(item.section); });
  }

  /* ---------- Gentle fade-up on scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.remove('reveal'); });
      return;
    }

    items.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return child.classList.contains('reveal');
      });
      if (siblings.length > 1) {
        el.style.setProperty('--delay', Math.min(siblings.indexOf(el), 5) * 80 + 'ms');
      }
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        el.classList.add('is-visible');

        var finished = false;
        var finish = function () {
          if (finished) return;
          finished = true;
          el.classList.remove('reveal', 'is-visible');
          el.style.removeProperty('--delay');
        };
        el.addEventListener('transitionend', function handler(ev) {
          if (ev.target === el && ev.propertyName === 'opacity') {
            el.removeEventListener('transitionend', handler);
            finish();
          }
        });
        setTimeout(finish, 1800);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Stat counters ---------- */
  function initCounters() {
    var counters = $$('[data-count]');
    if (!counters.length || reduceMotion || !('IntersectionObserver' in window)) return;

    function render(el, value) {
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = value.toLocaleString('en-AU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
    }

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var duration = 1600;
      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        render(el, target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else render(el, target);
      }
      requestAnimationFrame(tick);
    }

    counters.forEach(function (el) { render(el, 0); });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        animate(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Tabs (FAQ topics) ---------- */
  function initTabs() {
    $$('[data-tabs]').forEach(function (group) {
      var tabs = $$('[role="tab"]', group);

      function select(tab, moveFocus) {
        tabs.forEach(function (t) {
          var active = t === tab;
          t.setAttribute('aria-selected', String(active));
          t.tabIndex = active ? 0 : -1;
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !active;
        });
        if (moveFocus) tab.focus();
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { select(tab, false); });
        tab.addEventListener('keydown', function (event) {
          var next = null;
          if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
          else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
          else if (event.key === 'Home') next = tabs[0];
          else if (event.key === 'End') next = tabs[tabs.length - 1];
          if (next) {
            event.preventDefault();
            select(next, true);
          }
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initAccordions() {
    $$('[data-accordion]').forEach(function (accordion) {
      accordion.addEventListener('click', function (event) {
        var button = event.target.closest('.faq-q');
        if (!button || !accordion.contains(button)) return;

        var item = button.closest('.faq-item');
        var open = !item.classList.contains('is-open');

        $$('.faq-item.is-open', accordion).forEach(function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          $('.faq-q', other).setAttribute('aria-expanded', 'false');
        });

        item.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------- Toast notifications ---------- */
  var toastTimer = null;
  function showToast(message, isError) {
    var toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('is-error', Boolean(isError));
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  /* ---------- Copy to clipboard ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }, function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function initCopyButtons() {
    $$('[data-copy]').forEach(function (button) {
      var label = $('span', button);
      var original = label ? label.textContent : '';
      var resetTimer = null;

      button.addEventListener('click', function () {
        var name = button.getAttribute('data-copy-label') || 'Text';
        copyText(button.getAttribute('data-copy')).then(function (ok) {
          if (!ok) {
            showToast('Sorry, that did not copy. Please copy it manually.', true);
            return;
          }
          showToast(name + ' copied to clipboard');
          button.classList.add('is-copied');
          if (label) label.textContent = 'Copied';
          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            button.classList.remove('is-copied');
            if (label) label.textContent = original;
          }, 2000);
        });
      });
    });
  }

  /* ---------- Service quick-view modal ---------- */
  function initServiceModal() {
    var modal = $('#service-modal');
    if (!modal) return;

    var img = $('#modal-img', modal);
    var tag = $('#modal-tag', modal);
    var title = $('#modal-title', modal);
    var intro = $('#modal-intro', modal);
    var list = $('#modal-points', modal);
    var enquire = $('[data-modal-enquire]', modal);
    var lastFocus = null;
    var currentService = '';
    var supportsDialog = typeof modal.showModal === 'function';

    function open(card) {
      var data = SERVICES[card.getAttribute('data-service')] || {};
      var cardImg = $('img', card);
      var points = data.points || $$('.dot-list li', card).map(function (li) { return li.textContent; });

      currentService = $('h3', card).textContent.trim();
      title.textContent = currentService;
      tag.textContent = data.tag || 'Service';
      intro.textContent = data.intro || $('p', card).textContent;
      img.src = cardImg.getAttribute('src').replace(/w=\d+/, 'w=1000').replace(/h=\d+/, 'h=900');
      img.alt = cardImg.alt;

      list.innerHTML = '';
      points.forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });

      lastFocus = document.activeElement;
      document.body.classList.add('modal-open');
      if (supportsDialog) modal.showModal();
      else modal.setAttribute('open', '');
      $('.modal__close', modal).focus();
    }

    function afterClose() {
      document.body.classList.remove('modal-open');
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus({ preventScroll: true });
      }
      lastFocus = null;
    }

    function close() {
      if (supportsDialog) {
        if (modal.open) modal.close();
      } else {
        modal.removeAttribute('open');
        afterClose();
      }
    }

    modal.addEventListener('close', afterClose);

    $$('.service-card').forEach(function (card) {
      card.addEventListener('click', function (event) {
        if (event.target.closest('a')) return;
        open(card);
      });
    });

    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-modal-close]')) close();
    });

    if (enquire) {
      enquire.addEventListener('click', function () {
        var select = $('#service');
        if (select) {
          Array.prototype.forEach.call(select.options, function (option) {
            if (option.text === currentService) select.value = option.value;
          });
        }
        lastFocus = null;
        close();
      });
    }
  }

  /* ---------- Contact form ---------- */
  function initContactForm() {
    var form = $('#contact-form');
    var success = $('#form-success');
    if (!form || !success) return;

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var phonePattern = /^[+()\d\s-]{8,20}$/;

    var rules = {
      name: function (value) {
        return value.trim().length >= 2 || 'Please enter your name.';
      },
      email: function (value) {
        return emailPattern.test(value.trim()) || 'Please enter a valid email address.';
      },
      phone: function (value) {
        return !value.trim() || phonePattern.test(value.trim()) || 'Please enter a valid phone number.';
      },
      message: function (value) {
        return value.trim().length >= 10 || 'Please add a few more details (at least 10 characters).';
      }
    };

    function field(name) {
      return form.elements.namedItem(name);
    }

    function validate(input) {
      var result = rules[input.name](input.value);
      var wrapper = input.closest('.field');
      var error = $('.field__error', wrapper);
      var valid = result === true;
      wrapper.classList.toggle('has-error', !valid);
      input.setAttribute('aria-invalid', String(!valid));
      if (error) error.textContent = valid ? '' : result;
      return valid;
    }

    Object.keys(rules).forEach(function (name) {
      var input = field(name);
      if (!input) return;
      input.addEventListener('blur', function () {
        if (input.value.trim()) validate(input);
      });
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var invalid = Object.keys(rules)
        .map(field)
        .filter(function (input) { return input && !validate(input); });

      if (invalid.length) {
        invalid[0].focus();
        showToast('Please check the highlighted fields.', true);
        return;
      }

      var get = function (name) {
        var input = field(name);
        return input ? input.value.trim() : '';
      };

      var brand = form.getAttribute('data-company') || 'Aiero Tech International';
      var name = get('name');
      var company = get('company');
      var subject = brand + ': Free IT review request from ' + name + (company ? ' (' + company + ')' : '');
      var lines = ['Name: ' + name];
      if (company) lines.push('Business: ' + company);
      lines.push('Email: ' + get('email'));
      if (get('phone')) lines.push('Phone: ' + get('phone'));
      if (get('service')) lines.push('Main interest: ' + get('service'));
      if (get('staff')) lines.push('Team size: ' + get('staff'));
      lines.push('', get('message'), '', 'Sent from the ' + brand + ' website');

      var mailto = 'mailto:' + form.getAttribute('data-email') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      $('h3', success).textContent = 'Thanks, ' + name.split(/\s+/)[0] + '! Your request to ' + brand + ' is ready.';
      form.hidden = true;
      success.hidden = false;
      success.focus();

      showToast('Opening your email app to send this to ' + brand);
      window.location.href = mailto;
    });

    var reset = $('[data-form-reset]', success);
    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        $$('.field', form).forEach(function (wrapper) { wrapper.classList.remove('has-error'); });
        $$('[aria-invalid]', form).forEach(function (input) { input.removeAttribute('aria-invalid'); });
        success.hidden = true;
        form.hidden = false;
        field('name').focus();
      });
    }
  }

  initYear();
  initHeader();
  initMobileNav();
  initActiveNav();
  initReveal();
  initCounters();
  initTabs();
  initAccordions();
  initCopyButtons();
  initServiceModal();
  initContactForm();
})();
