/**
 * UI UTILITIES & COMMON HELPERS
 */

const UI = {
    // Show toast message
    showToast(message, type = 'info', duration = 3500) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div style="font-size: 16px;">
                ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
            </div>
            <div style="flex: 1;">${message}</div>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // Modal helpers
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Priority badge generator
    getPriorityBadge(level) {
        const norm = String(level || 'MEDIUM').toUpperCase();
        if (norm === 'HIGH' || norm === 'CRITICAL') {
            return `<span class="badge badge-high">● High</span>`;
        } else if (norm === 'LOW') {
            return `<span class="badge badge-low">● Low</span>`;
        }
        return `<span class="badge badge-medium">● Medium</span>`;
    },

    // Status badge generator
    getStatusBadge(status) {
        const s = String(status || '').toLowerCase();
        if (s.includes('active')) return `<span class="badge badge-active">Active</span>`;
        if (s.includes('review')) return `<span class="badge badge-review">Under Review</span>`;
        if (s.includes('closed')) return `<span class="badge badge-low">Closed</span>`;
        if (s.includes('seized')) return `<span class="badge badge-high">Seized</span>`;
        if (s.includes('isolated')) return `<span class="badge badge-high">Isolated</span>`;
        if (s.includes('imaged')) return `<span class="badge badge-info">Imaged</span>`;
        return `<span class="badge badge-medium">${status || 'Unknown'}</span>`;
    },

    // Format bytes to human readable string
    formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Highlight active sidebar navigation item
    highlightNav() {
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    UI.highlightNav();

    // Close modals on clicking outside or close buttons
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.style.display = 'none';
            }
        });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-backdrop');
            if (modal) modal.style.display = 'none';
        });
    });
});
