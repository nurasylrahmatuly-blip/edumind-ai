import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { locales, defaultLocale, type Locale } from './index';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const headersList = headers();

  let locale: Locale = defaultLocale;

  const cookieLocale = cookieStore.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  } else {
    const acceptLang = headersList.get('accept-language') ?? '';
    if (acceptLang.startsWith('en')) locale = 'en';
    else if (acceptLang.startsWith('kk') || acceptLang.startsWith('kz')) locale = 'kz';
  }

  const messages = (await import(`./${locale}.json`)).default;

  return { locale, messages };
});
