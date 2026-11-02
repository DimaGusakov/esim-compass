import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { Api } from '../core/api';
import { gb } from '../core/format';
import { fill, STRINGS } from '../core/i18n';
import { Lang } from '../core/lang';
import { CountrySummary, EstimateRequest, EstimateResponse, ScenarioNorm } from '../core/models';
import { TariffTable } from './tariff-table';

type CalcState = 'loading' | 'ok' | 'error';

// Стартовые значения часов в день по сценариям: соцсети 2, видео 0, карты 1, работа 1.
const DEFAULT_HOURS: Record<string, string> = {
  social_media: '2',
  video_streaming: '0',
  navigation_maps: '1',
  work_tools: '1',
};

/** Калькулятор трафика: параметры слева, результат справа, подходящие тарифы под ними. */
@Component({
  selector: 'app-calculator',
  imports: [RouterLink, TariffTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="calc-h">
      <h2 id="calc-h">{{ s().calcTitle }}</h2>
      <div class="calc">
        <form class="calc-form" (submit)="$event.preventDefault()" [attr.aria-label]="s().calcParams">
          <div class="fields2">
            <div class="field">
              <label for="f-country">{{ s().country }}</label>
              <select class="ctl" id="f-country" (change)="slug.set(val($event))">
                @for (c of countries(); track c.slug) {
                  <option [value]="c.slug" [selected]="c.slug === slug()">{{ c.name }}</option>
                }
              </select>
            </div>
            <div class="field">
              <span class="lbl" id="f-days-l">{{ s().days }}</span>
              <div class="stepper" role="group" aria-labelledby="f-days-l">
                <button type="button" [attr.aria-label]="s().daysLess" (click)="bumpDays(-1)">−</button>
                <input
                  class="ctl"
                  type="number"
                  inputmode="numeric"
                  min="1"
                  max="90"
                  step="1"
                  [value]="daysRaw()"
                  aria-labelledby="f-days-l"
                  [attr.aria-invalid]="daysError() ? 'true' : null"
                  [attr.aria-describedby]="daysError() ? 'days-err' : null"
                  (input)="daysRaw.set(val($event))"
                />
                <button type="button" [attr.aria-label]="s().daysMore" (click)="bumpDays(1)">+</button>
              </div>
              @if (daysError()) {
                <span class="field-err" id="days-err">{{ s().calcInvalidDays }}</span>
              }
            </div>
          </div>
          <div class="scen-h">{{ s().hoursPerDay }}</div>
          @for (sc of scenarios(); track sc.slug) {
            <div class="scen">
              <div>
                <b [id]="'sc-' + sc.slug">{{ sc.title }}</b>
                <span>{{ sc.description }}</span>
              </div>
              <div class="stepper" role="group" [attr.aria-labelledby]="'sc-' + sc.slug">
                <button type="button" [attr.aria-label]="s().hoursLess + ': ' + sc.title" (click)="bumpHours(sc.slug, -0.5)">−</button>
                <input
                  class="ctl"
                  type="number"
                  inputmode="decimal"
                  min="0"
                  max="24"
                  step="0.5"
                  [value]="hours()[sc.slug]"
                  [attr.aria-labelledby]="'sc-' + sc.slug"
                  [attr.aria-invalid]="hoursInvalid(sc.slug) ? 'true' : null"
                  (input)="setHours(sc.slug, val($event))"
                />
                <button type="button" [attr.aria-label]="s().hoursMore + ': ' + sc.title" (click)="bumpHours(sc.slug, 0.5)">+</button>
              </div>
            </div>
          }
          @if (hoursError()) {
            <p class="field-err scen-err">{{ s().calcInvalidHours }}</p>
          }
        </form>

        <div class="calc-out" [class.is-updating]="busy()" aria-live="polite" [attr.aria-busy]="busy()">
          @if (!request() && !daysError() && !hoursError()) {
            <div class="out-label">{{ s().need }}</div>
            <p class="out-note">{{ s().calcZero }}</p>
          } @else if (daysError() || hoursError()) {
            <div class="out-label">{{ s().need }}</div>
            <p class="out-note">{{ daysError() ? s().calcInvalidDays : s().calcInvalidHours }}</p>
          } @else if (state() === 'error' && !result()) {
            <div class="out-label">{{ s().need }}</div>
            <p class="out-note">{{ s().calcError }}</p>
            <button type="button" class="out-link" (click)="retry()">{{ s().calcRetry }}</button>
          } @else if (!result()) {
            <div class="out-label">{{ s().need }}</div>
            <p class="out-note">{{ s().calcLoading }}</p>
          } @else {
            @let r = result()!;
            <div class="out-label">{{ s().need }}</div>
            <div class="out-gb">{{ gbText(r.estimated_gb) }}<small>{{ s().gb }}</small></div>
            <div class="out-range">
              {{ rangeText(r) }}
            </div>
            @if (r.recommended_package_gb) {
              <div class="out-pack">
                <span class="small">{{ s().package }}</span>
                <b>{{ r.recommended_package_gb }} {{ s().gb }} / 30 {{ s().days_ }}@if (r.recommended_packages_count > 1) { × {{ r.recommended_packages_count }} }</b>
                <span class="out-note">{{
                  r.recommended_packages_count > 1 ? fillN(r.recommended_packages_count) : s().packageOne
                }}</span>
              </div>
            }
            @if (showCountryLink()) {
              <a class="out-link" [routerLink]="['/', lang(), 'country', slug()]">{{ fillName(s().allTariffs) }}</a>
            }
            <p class="out-note">{{ normsText(r) }}</p>
            @if (state() === 'error') {
              <p class="out-note">{{ s().calcError }}</p>
              <button type="button" class="out-link" (click)="retry()">{{ s().calcRetry }}</button>
            }
          }
        </div>
      </div>

      @if (result(); as r) {
        <div class="res-head">
          <h3>{{ fillName(s().calcMatching) }}</h3>
          <span class="muted small">{{ s().calcNeutral }}</span>
        </div>
        @if (r.matching_tariffs.length) {
          <app-tariff-table [tariffs]="r.matching_tariffs" [lang]="lang()" />
        } @else {
          <p class="empty">{{ s().calcEmpty }}</p>
        }
      }
    </section>
  `,
})
export class Calculator {
  readonly lang = input.required<Lang>();
  readonly countries = input.required<readonly CountrySummary[]>();
  readonly scenarios = input.required<readonly ScenarioNorm[]>();
  readonly initialSlug = input.required<string>();
  /** Страница, на которой стоит калькулятор: ссылка «Все тарифы» нужна, только если выбрана другая страна. */
  readonly pageSlug = input<string | null>(null);

  private readonly api = inject(Api);
  protected readonly s = computed(() => STRINGS[this.lang()]);

  protected readonly slug = linkedSignal(() => this.initialSlug());
  protected readonly daysRaw = signal('7');
  protected readonly hours = linkedSignal<readonly ScenarioNorm[], Record<string, string>>({
    source: this.scenarios,
    computation: (list) => Object.fromEntries(list.map((x) => [x.slug, DEFAULT_HOURS[x.slug] ?? '0'])),
  });
  private readonly retryCount = signal(0);

  protected readonly state = signal<CalcState>('loading');
  protected readonly result = signal<EstimateResponse | null>(null);
  protected readonly busy = computed(() => this.state() === 'loading' && !!this.result());

  protected readonly daysNum = computed(() => Number(this.daysRaw()));
  protected readonly daysError = computed(() => {
    const n = this.daysNum();
    return this.daysRaw().trim() === '' || !Number.isInteger(n) || n < 1 || n > 90;
  });
  protected readonly hoursError = computed(() => this.scenarios().some((sc) => this.hoursInvalid(sc.slug)));

  /** Запрос к API, либо null, если ввод некорректен или расход нулевой. */
  protected readonly request = computed<EstimateRequest | null>(() => {
    if (this.daysError() || this.hoursError()) return null;
    const scenarios = this.scenarios().map((sc) => ({
      scenario_slug: sc.slug,
      hours_per_day: Number(this.hours()[sc.slug]),
    }));
    if (scenarios.every((x) => x.hours_per_day === 0)) return null;
    return { country_slug: this.slug(), days: this.daysNum(), scenarios };
  });

  protected readonly showCountryLink = computed(() => this.slug() !== this.pageSlug());

  constructor() {
    // Расчёт идёт только в браузере: POST не кэшируется между сервером и клиентом.
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      toObservable(computed(() => ({ req: this.request(), n: this.retryCount(), lang: this.lang() })))
        .pipe(
          debounceTime(250),
          distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
          tap(({ req }) => {
            if (!req) this.result.set(null);
            else this.state.set('loading');
          }),
          switchMap(({ req, lang }) =>
            req
              ? this.api.estimate(req, lang).pipe(
                  map((data) => ({ data }) as const),
                  catchError(() => of({ error: true } as const)),
                )
              : of(null),
          ),
          takeUntilDestroyed(inject(DestroyRef)),
        )
        .subscribe((out) => {
          if (!out) return;
          if ('data' in out) {
            this.result.set(out.data);
            this.state.set('ok');
          } else {
            this.state.set('error');
          }
        });
    }
  }

  protected val(e: Event): string {
    return (e.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected bumpDays(delta: number): void {
    const n = Number.isFinite(this.daysNum()) ? this.daysNum() : 1;
    this.daysRaw.set(String(Math.min(90, Math.max(1, Math.round(n + delta)))));
  }

  protected bumpHours(slug: string, delta: number): void {
    const n = Number(this.hours()[slug]);
    const next = Math.min(24, Math.max(0, Math.round(((Number.isFinite(n) ? n : 0) + delta) * 2) / 2));
    this.setHours(slug, String(next));
  }

  protected setHours(slug: string, value: string): void {
    this.hours.update((h) => ({ ...h, [slug]: value }));
  }

  protected hoursInvalid(slug: string): boolean {
    const raw = this.hours()[slug] ?? '';
    const n = Number(raw);
    return raw.trim() === '' || !Number.isFinite(n) || n < 0 || n > 24 || (n * 2) % 1 !== 0;
  }

  protected retry(): void {
    this.retryCount.update((n) => n + 1);
  }

  protected gbText(v: number): string {
    return gb(v, this.lang());
  }

  protected rangeText(r: EstimateResponse): string {
    return fill(this.s().range, {
      pct: r.variance_percent,
      min: gb(r.estimated_gb_min, this.lang()),
      max: gb(r.estimated_gb_max, this.lang()),
    });
  }

  protected normsText(r: EstimateResponse): string {
    return fill(this.s().norms, { url: new URL(r.norms_source_url).hostname, date: r.norms_checked_at });
  }

  protected fillN(n: number): string {
    return fill(this.s().packageMany, { n });
  }

  protected fillName(template: string): string {
    const name = this.countries().find((c) => c.slug === this.slug())?.name ?? '';
    return fill(template, { name });
  }
}
