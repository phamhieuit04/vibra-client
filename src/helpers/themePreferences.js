export const THEME_STORAGE_KEY = 'theme';
export const COLOR_STORAGE_KEY = 'app_color';

export const COLOR_OPTIONS = [
    '#BC4D15',
    '#645283',
    '#a8bfc9',
    '#CD5C5C',
    '#a3b18a',
    '#9e9fa5',
    '#926F4F',
    '#FEA7A0',
    '#c3a995',
    '#44B78B',
];

export const DEFAULT_THEME = 'light';
export const DEFAULT_COLOR = COLOR_OPTIONS[0];

export function getStoredTheme() {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'dark' || value === 'light' ? value : DEFAULT_THEME;
}

export function applyTheme(theme) {
    if (typeof document === 'undefined') return;
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export function setStoredTheme(theme) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_STORAGE_KEY, theme === 'dark' ? 'dark' : 'light');
}

export function initThemeFromStorage() {
    const theme = getStoredTheme();
    applyTheme(theme);
    return theme;
}

export function getStoredColor() {
    if (typeof window === 'undefined') return DEFAULT_COLOR;
    const value = localStorage.getItem(COLOR_STORAGE_KEY);
    return value && COLOR_OPTIONS.includes(value) ? value : DEFAULT_COLOR;
}

export function setStoredColor(color) {
    if (typeof window === 'undefined') return;
    const normalizedColor = COLOR_OPTIONS.includes(color) ? color : DEFAULT_COLOR;
    localStorage.setItem(COLOR_STORAGE_KEY, normalizedColor);
}

export function initColorFromStorage() {
    const color = getStoredColor();
    setStoredColor(color);
    return color;
}
