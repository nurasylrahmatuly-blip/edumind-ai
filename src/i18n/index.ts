import type ruMessages from './ru.json';

export type Messages = typeof ruMessages;

export const defaultLocale = 'ru' as const;
export const locales = ['ru', 'en', 'kz'] as const;
export type Locale = (typeof locales)[number];
