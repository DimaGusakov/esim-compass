import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { isLang, Lang } from '../core/lang';
import { PageFrame } from './page-frame';

const TEXT = {
  ru: { prefix: 'eSIM для', stub: 'Страница страны в разработке: сводка, калькулятор и таблица тарифов.' },
  en: { prefix: 'eSIM for', stub: 'Country page in progress: summary, calculator and plan table.' },
} as const;

@Component({
  selector: 'app-country-page',
  imports: [PageFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-frame [lang]="current()">
      <h1 class="t-headline mb-3">{{ t().prefix }} {{ slug() }}</h1>
      <p class="max-w-prose text-faded-print">{{ t().stub }}</p>
    </app-page-frame>
  `,
})
export class CountryPage {
  readonly lang = input<string>();
  readonly slug = input.required<string>();
  protected readonly current = computed<Lang>(() => (isLang(this.lang()) ? (this.lang() as Lang) : 'en'));
  protected readonly t = computed(() => TEXT[this.current()]);

  private readonly title = inject(Title);

  constructor() {
    effect(() => this.title.setTitle(`${this.t().prefix} ${this.slug()} | esim-compass`));
  }
}
