/**
 * AUTHENTICATION & SESSION MANAGEMENT
 * Handles demonstration investigator credentials, session storage, and guard checks.
 */

const Auth = {
    KEY: 'dfir_investigator_session',

    getUser() {
        try {
            const raw = localStorage.getItem(this.KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    setUser(user) {
        localStorage.setItem(this.KEY, JSON.stringify(user));
    },

    isLoggedIn() {
        return this.getUser() !== null;
    },

    logout() {
        localStorage.removeItem(this.KEY);
        window.location.href = 'index.html';
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            // Default demo fallback if opened directly without login
            const demoUser = {
                username: 'admin',
                fullName: 'Special Agent Sarah Connor',
                role: 'Lead Digital Forensic Investigator',
                badge: 'DF-7701'
            };
            this.setUser(demoUser);
        }
    },

    initSidebarUser() {
        const user = this.getUser();
        if (!user) return;

        const nameEl = document.getElementById('sidebar-user-name');
        const badgeEl = document.getElementById('sidebar-user-badge');
        const avatarEl = document.getElementById('sidebar-user-avatar');

        if (nameEl) nameEl.textContent = user.fullName;
        if (badgeEl) badgeEl.textContent = `${user.badge} | ${user.role}`;
        if (avatarEl) {
            const initials = user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2);
            avatarEl.textContent = initials;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Only check auth on protected pages (not index.html)
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/')) {
        Auth.requireAuth();
        Auth.initSidebarUser();
    }
});
