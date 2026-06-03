/* SportEquity – main.js — Redesigned edition with Sidebar & Interactive Cards */

// ─── Set today's date on empty date inputs ───────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    var today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(function (el) {
        if (!el.value) el.value = today;
    });

    // Auto-dismiss alerts after 5 s
    document.querySelectorAll('.alert-dismissible').forEach(function (el) {
        setTimeout(function () {
            var bsAlert = bootstrap.Alert.getOrCreateInstance(el);
            if (bsAlert) bsAlert.close();
        }, 5000);
    });

    // Bootstrap tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
        new bootstrap.Tooltip(el);
    });

    // Training intensity range → live badge
    var range = document.getElementById('intensityRange');
    var badge = document.getElementById('intensityValue');
    if (range && badge) {
        range.addEventListener('input', function () {
            badge.textContent = range.value;
            badge.className = 'badge ' + (
                range.value >= 80 ? 'bg-danger' :
                range.value >= 60 ? 'bg-warning' :
                'bg-success'
            );
        });
        range.dispatchEvent(new Event('input'));
    }

    // ── Sidebar Toggle ──
    initSidebar();

    // ── Interactive Card Effects ──
    initCardInteractivity();

    // ── Intersection Observer for scroll animations ──
    initScrollAnimations();

    // ── Voice Commands ──
    initVoiceCommands();
});

// ─── Voice Commands ──────────────────────────────────────────────────────────
function initVoiceCommands() {
    const btn = document.getElementById('voiceCommandBtn');
    const toast = document.getElementById('voiceStatusToast');
    const statusText = document.getElementById('voiceStatusText');
    const indicator = document.getElementById('voiceIndicator');
    
    if (!btn || !window.webkitSpeechRecognition) return;

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    let bsToast = null;
    if (toast) bsToast = new bootstrap.Toast(toast, { autohide: false });

    btn.addEventListener('click', () => {
        try {
            recognition.start();
            btn.classList.add('btn-pulse-active');
            statusText.textContent = 'Listening for commands...';
            indicator.className = 'voice-pulse listening';
            if (bsToast) bsToast.show();
        } catch (e) {
            console.error('Speech recognition already started');
        }
    });

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Voice Command:', command);
        statusText.textContent = `Processing: "${command}"`;
        indicator.className = 'voice-pulse processing';

        setTimeout(() => {
            handleCommand(command);
            if (bsToast) bsToast.hide();
            btn.classList.remove('btn-pulse-active');
        }, 1000);
    };

    recognition.onerror = (event) => {
        statusText.textContent = 'Error recognizing speech.';
        indicator.className = 'voice-pulse error';
        setTimeout(() => {
            if (bsToast) bsToast.hide();
            btn.classList.remove('btn-pulse-active');
        }, 2000);
    };

    recognition.onend = () => {
        btn.classList.remove('btn-pulse-active');
    };

    function handleCommand(cmd) {
        if (cmd.includes('dashboard')) {
            window.location.href = '/dashboard';
        } else if (cmd.includes('training')) {
            window.location.href = '/athlete/training/log';
        } else if (cmd.includes('health')) {
            window.location.href = '/athlete/health/log';
        } else if (cmd.includes('diet') || cmd.includes('nutrition')) {
            window.location.href = '/athlete/diet/log';
        } else if (cmd.includes('id card') || cmd.includes('identity')) {
            window.location.href = '/athlete/id-card';
        } else if (cmd.includes('profile')) {
            window.location.href = '/athlete/profile';
        } else if (cmd.includes('chat') || cmd.includes('coach') || cmd.includes('ai')) {
            window.location.href = '/athlete/chatbot';
        } else if (cmd.includes('appointment')) {
            window.location.href = '/appointments';
        } else if (cmd.includes('tournament')) {
            window.location.href = '/tournaments';
        } else if (cmd.includes('emergency') || cmd.includes('help') || cmd.includes('alert')) {
            const emergencyModal = new bootstrap.Modal(document.getElementById('emergencyModal'));
            if (emergencyModal) emergencyModal.show();
        } else {
            alert('Command not recognized: ' + cmd);
        }
    }
}

// ─── Sidebar Toggle ──────────────────────────────────────────────────────────
function initSidebar() {
    var sidebar     = document.getElementById('appSidebar');
    var toggle      = document.getElementById('sidebarToggle');
    var overlay     = document.getElementById('sidebarOverlay');

    if (!sidebar || !toggle) return;

    toggle.addEventListener('click', function () {
        sidebar.classList.toggle('sidebar-open');
        if (overlay) overlay.classList.toggle('active');
        // Toggle icon
        var icon = toggle.querySelector('i');
        if (sidebar.classList.contains('sidebar-open')) {
            icon.className = 'bi bi-x-lg';
        } else {
            icon.className = 'bi bi-list';
        }
    });

    if (overlay) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('sidebar-open');
            overlay.classList.remove('active');
            var icon = toggle.querySelector('i');
            icon.className = 'bi bi-list';
        });
    }
}

// ─── Interactive Card Effects ────────────────────────────────────────────────
function initCardInteractivity() {
    // Ripple effect on card-ripple class
    document.querySelectorAll('.card-ripple').forEach(function (card) {
        card.addEventListener('click', function (e) {
            var rect = card.getBoundingClientRect();
            var ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            var size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top  = (e.clientY - rect.top - size/2) + 'px';
            card.appendChild(ripple);
            setTimeout(function () { ripple.remove(); }, 700);
        });
    });

    // Tilt effect on tilt-card class
    document.querySelectorAll('.tilt-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 20;
            var rotateY = (centerX - x) / 20;
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Stat card counter animations on hover
    document.querySelectorAll('.stat-card-enhanced').forEach(function (card) {
        var numEl = card.querySelector('.stat-number');
        if (!numEl) return;
        var original = numEl.textContent;
        card.addEventListener('mouseenter', function () {
            var target = parseFloat(original) || 0;
            if (isNaN(target) || original.includes('%') || original.includes('+')) return;
            animateCounter(numEl, target);
        });
    });
}

// ─── Scroll Animations ───────────────────────────────────────────────────────
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.card-interactive, .page-banner, .img-card').forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16,1,0.3,1)';
        observer.observe(el);
    });
}

// ─── Counter Animation ───────────────────────────────────────────────────────
function animateCounter(el, target) {
    var current = 0;
    var step = target / 30;
    var timer = setInterval(function () {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current);
        if (current >= target) {
            clearInterval(timer);
            el.textContent = target;
        }
    }, 20);
}

// ─── Chart.js global defaults ─────────────────────────────────────────────────
if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size   = 12;
    Chart.defaults.color       = '#444651';
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.plugins.tooltip.backgroundColor = '#2F3036';
    Chart.defaults.plugins.tooltip.titleColor      = '#FAF8FF';
    Chart.defaults.plugins.tooltip.bodyColor       = 'rgba(250,248,255,0.8)';
    Chart.defaults.plugins.tooltip.cornerRadius    = 8;
    Chart.defaults.plugins.tooltip.padding         = 12;
}

// ─── Utility: line chart ──────────────────────────────────────────────────────
function makeLineChart(ctxId, labels, datasets, yMax) {
    var el = document.getElementById(ctxId);
    if (!el) return null;
    return new Chart(el.getContext('2d'), {
        type: 'line',
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { display: datasets.length > 1 } },
            scales: {
                x: {
                    grid: { color: 'rgba(197,197,211,0.15)', drawBorder: false },
                    ticks: { color: '#757682' }
                },
                y: {
                    beginAtZero: true,
                    max: yMax || undefined,
                    grid: { color: 'rgba(197,197,211,0.15)', drawBorder: false },
                    ticks: { color: '#757682' }
                }
            }
        }
    });
}

// ─── Utility: bar chart ───────────────────────────────────────────────────────
function makeBarChart(ctxId, labels, datasets) {
    var el = document.getElementById(ctxId);
    if (!el) return null;
    return new Chart(el.getContext('2d'), {
        type: 'bar',
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: datasets.length > 1 } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#757682' } },
                y: { beginAtZero: true, grid: { color: 'rgba(197,197,211,0.15)', drawBorder: false }, ticks: { color: '#757682' } }
            }
        }
    });
}

// ─── Sport-score counter animation ───────────────────────────────────────────
function animateScore(el, target) {
    if (!el) return;
    var current = 0;
    var step = target / 40;
    var timer = setInterval(function () {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
    }, 25);
}

// ─── Generic API helpers ──────────────────────────────────────────────────────
async function apiGet(url) {
    try {
        var res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
    } catch (e) {
        console.error('API error [' + url + ']:', e);
        return null;
    }
}

async function apiPost(url, body) {
    try {
        var res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch (e) {
        console.error('API POST error [' + url + ']:', e);
        return null;
    }
}

// ─── Global Emergency Trigger ────────────────────────────────────────────────
async function triggerGlobalEmergency() {
    try {
        var data = await apiPost('/emergency', {});
        if (data && data.message) {
            alert(data.message);
        } else {
            alert('Emergency alert sent! Help is on the way.');
        }
        var modal = bootstrap.Modal.getInstance(document.getElementById('emergencyModal'));
        if (modal) modal.hide();
    } catch (e) {
        alert('Emergency alert triggered. Please also call local emergency services.');
    }
}
