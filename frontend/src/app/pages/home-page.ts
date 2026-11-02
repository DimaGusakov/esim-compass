import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { catchError, map, of } from 'rxjs';
import { Api } from '../core/api';
import { isLang, Lang } from '../core/lang';
import { PageFrame } from './page-frame';

const TEXT = {
  ru: {
    title: 'Справочник тарифов eSIM по странам и калькулятор трафика | esim-compass',
    h1: 'Сколько ГБ нужно в поездке',
    stub: 'Страница в разработке: калькулятор, каталог стран и таблица тарифов появятся здесь.',
    api: 'Состояние API',
  },
  en: {
    title: 'eSIM Plans Directory by Country and Data Calculator | esim-compass',
    h1: 'How much data you need',
    stub: 'Work in progress: the calculator, country catalog and plan table will appear here.',
    api: 'API status',
  },
} as const;

@Component({
  selector: 'app-home-page',
  imports: [PageFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-frame [lang]="current()">
      <h1 class="t-display mb-3">{{ t().h1 }}</h1>
      <p class="max-w-prose text-faded-print">{{ t().stub }}</p>
      <p class="mt-8 text-sm text-faded-print">{{ t().api }}: {{ health() }}</p>
    </app-page-frame>
  `,
})
export class HomePage {
  readonly lang = input<string>();
  protected readonly current = computed<Lang>(() => (isLang(this.lang()) ? (this.lang() as Lang) : 'en'));
  protected readonly t = computed(() => TEXT[this.current()]);

  // Запрос идёт через Api: на сервере в API_INTERNAL_URL, в браузере в /api/v1.
  protected readonly health = toSignal(
    inject(Api)
      .health()
      .pipe(
        map((r) => r.status),
        catchError(() => of('unavailable')),
      ),
    { initialValue: '…' },
  );

  private readonly title = inject(Title);

  constructor() {
    effect(() => this.title.setTitle(this.t().title));
  }
}
