import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Lang, LANGS } from './lang';
import { PUBLIC_URL } from './site-config';

export interface SeoInput {
  lang: Lang;
  /** Путь без языка: '' для главной, '/country/turkey' для страны. */
  path: string;
  title: string;
  description: string;
  /** Структурированные данные (schema.org), по одному объекту на скрипт. */
  jsonLd?: object[];
  noindex?: boolean;
}

const OG_LOCALE: Record<Lang, string> = { ru: 'ru_RU', en: 'en_US' };

/** Метатеги, canonical, hreflang, Open Graph и JSON-LD. Работает и на сервере, и в браузере. */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly publicUrl = inject(PUBLIC_URL).replace(/\/+$/, '');

  readonly url = (lang: Lang, path: string): string => `${this.publicUrl}/${lang}${path}`;

  set(input: SeoInput): void {
    const canonical = this.url(input.lang, input.path);
    this.doc.documentElement.lang = input.lang;
    this.title.setTitle(input.title);

    this.meta.updateTag({ name: 'description', content: input.description });
    this.meta.updateTag({ name: 'robots', content: input.noindex ? 'noindex' : 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: input.title });
    this.meta.updateTag({ property: 'og:description', content: input.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE[input.lang] });

    this.clearLinks('link[rel="canonical"], link[rel="alternate"][data-seo]');
    this.addLink({ rel: 'canonical', href: canonical });
    for (const l of LANGS) {
      this.addLink({ rel: 'alternate', hreflang: l, href: this.url(l, input.path), 'data-seo': '' });
    }
    this.addLink({ rel: 'alternate', hreflang: 'x-default', href: this.url('en', input.path), 'data-seo': '' });

    this.clearLinks('script[type="application/ld+json"]');
    for (const obj of input.jsonLd ?? []) {
      const script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      // Экранируем «<», чтобы данные не могли закрыть тег script
      script.textContent = JSON.stringify(obj).replace(/</g, '\\u003c');
      this.doc.head.appendChild(script);
    }
  }

  private clearLinks(selector: string): void {
    this.doc.head.querySelectorAll(selector).forEach((el) => el.remove());
  }

  private addLink(attrs: Record<string, string>): void {
    const el = this.doc.createElement('link');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    this.doc.head.appendChild(el);
  }
}
