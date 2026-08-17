import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import { initializeTheme } from './composables/useAppearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
initializeTheme();

// ===============================
// Inertia Previous URL Handler
// ===============================
// ===============================
// Inertia History Stack (max 10)
// ===============================
const HISTORY_KEY = 'inertia:history';
const MAX_HISTORY = 10;

let pendingUrl: string | null = null;
let isBackNavigation = false;

function getHistory(): string[] {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
        return [];
    }
}

function setHistory(history: string[]) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// expose helper untuk dipanggil dari header
(window as any).__inertiaBack = () => {
    isBackNavigation = true;
};

router.on('start', (event) => {
    if (event.detail.visit.method !== 'get') return;

    // JIKA dari tombol back → JANGAN simpan
    if (isBackNavigation) return;

    pendingUrl =
        window.location.pathname + window.location.search;
});

router.on('success', (event) => {
    if (isBackNavigation) {
        // reset flag setelah back selesai
        isBackNavigation = false;
        pendingUrl = null;
        return;
    }

    if (!pendingUrl) return;

    const next = event.detail.page.url;
    if (pendingUrl === next) {
        pendingUrl = null;
        return;
    }

    const history = getHistory();

    // cegah duplikat berurutan
    if (history[history.length - 1] !== pendingUrl) {
        history.push(pendingUrl);
    }

    // batasi max 10
    if (history.length > MAX_HISTORY) {
        history.splice(0, history.length - MAX_HISTORY);
    }

    setHistory(history);
    pendingUrl = null;
});


