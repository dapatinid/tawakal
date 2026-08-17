import { InertiaLinkProps } from '@inertiajs/vue3';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function urlIsActive(
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl: string,
) {
    const target = normalizePath(toUrl(urlToCheck))
    const current = normalizePath(currentUrl)

    // exact match
    if (current === target) return true

    // nested route match
    return current.startsWith(target + '/')
}

export function toUrl(href: NonNullable<InertiaLinkProps['href']>) {
    return typeof href === 'string' ? href : href?.url;
}

function normalizePath(url?: string) {
    if (!url) return ''

    // buang query & hash
    return url.split('?')[0].split('#')[0]
}

