import { ChangeDetectionStrategy, Component, computed, effect, inject, input, RESPONSE_INIT } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { isLang, Lang } from '../core/lang';
import { PageFrame } from './page-frame';

const TEXT = {
  ru: { h1: 'Страница не найдена', back: 'На главную' },
  en: { h1: 'Page not found', back: 'Back to home' },
} as const;

@Component({
  selector: 'app-not-found-page',
  imports: [PageFrame, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-frame [lang]="current()">
      <h1 class="t-headline mb-4">{{ t().h1 }}</h1>
      <a
        class="inline-flex min-h-12 items-center bg-print-black px-4 font-semibold text-tag-stock no-underline"
        [routerLink]="['/', current()]"
        >{{ t().back }}</a
      >
    </app-page-frame>
  `,
})
export class NotFoundPage {
  readonly lang = input<string>();
  protected readonly current = computed<Lang>(() => (isLang(this.lang()) ? (this.lang() as Lang) : 'en'));
  protected readonly t = computed(() => TEXT[this.current()]);

  private readonly title = inject(Title);

  constructor() {
    // На сервере отвечаем 404, а не 200.
    const init = inject(RESPONSE_INIT, { optional: true });
    if (init) init.status = 404;
    effect(() => this.title.setTitle(`${this.t().h1} | esim-compass`));
  }
}
