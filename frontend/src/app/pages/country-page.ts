import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loaded } from '../core/api';
import { Calculator } from '../components/calculator';
import { StatusView } from '../components/status-view';
import { TariffTable } from '../components/tariff-table';
import { money, sortTariffs, term, volume } from '../core/format';
import { fill, STRINGS } from '../core/i18n';
import { isLang, Lang } from '../core/lang';
import { CurrencyCode, TariffItem } from '../core/models';
import { Seo } from '../core/seo';
import { BRAND_NAME } from '../core/site-config';
import { PageFrame } from './page-frame';
import { CountryData } from './resolvers';

type VolumeFilter = 'all' | '5' | '10' | 'unl';
type CurrencyFilter = 'all' | CurrencyCode;

@Component({
  selector: 'app-country-page',
  imports: [PageFrame, StatusView, Calculator, TariffTable, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-frame [lang]="current()" [rest]="rest()">
      @if (loaded(); as d) {
        <nav class="crumbs" [attr.aria-label]="s().breadcrumbs">
          <ol>
            <li>
              <a [routerLink]="['/', current()]">{{ s().home }}</a>
            </li>
            <li aria-current="page">{{ d.country.name }}</li>
          </ol>
        </nav>

        <div class="c-hero">
          <p class="c-code" aria-hidden="true">{{ d.country.iso_code }}</p>
          <div>
            <h1>{{ heading() }}</h1>
            <p class="prose">{{ d.country.seo.intro_text }}</p>
          </div>
        </div>

        <div class="sum tbl-wrap">
          <table>
            <caption>
              {{ pricesCaption() }}
            </caption>
            <thead>
              <tr>
                <th scope="col">{{ s().colPackage }}</th>
                <th scope="col" class="num">EUR</th>
                <th scope="col" class="num">PLN</th>
              </tr>
            </thead>
            <tbody>
              @for (row of summary(); track row.gb) {
                <tr>
                  <th scope="row">{{ row.gb }} {{ s().gb }} / 30 {{ s().days_ }}</th>
                  <td class="num">
                    <span class="price">{{ row.eur }}</span>
                  </td>
                  <td class="num">
                    <span class="price">{{ row.pln }}</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (d.country.restriction_notice) {
          <aside class="notice" aria-labelledby="n-h">
            <h2 id="n-h">{{ s().noticeTitle }}</h2>
            <p>{{ d.country.restriction_notice }}</p>
          </aside>
        }

        <app-calculator
          [lang]="current()"
          [countries]="d.countries"
          [scenarios]="d.providers.calculator_scenarios"
          [initialSlug]="d.country.slug"
          [pageSlug]="d.country.slug"
        />

        <section aria-labelledby="t-h">
          <h2 id="t-h">{{ s().tariffsTitle }}</h2>
          <form class="filters" (submit)="$event.preventDefault()" [attr.aria-label]="s().tariffsTitle">
            <fieldset class="seg">
              <legend>{{ s().filterVolume }}</legend>
              <div>
                @for (o of volumeOptions(); track o.value) {
                  <label>
                    <input type="radio" name="vol" [value]="o.value" [checked]="vol() === o.value" (change)="vol.set(o.value)" />
                    <span>{{ o.label }}</span>
                  </label>
                }
              </div>
            </fieldset>
            <fieldset class="seg">
              <legend>{{ s().filterCurrency }}</legend>
              <div>
                @for (o of currencyOptions(); track o.value) {
                  <label>
                    <input type="radio" name="cur" [value]="o.value" [checked]="cur() === o.value" (change)="cur.set(o.value)" />
                    <span>{{ o.label }}</span>
                  </label>
                }
              </div>
            </fieldset>
          </form>
          @if (filtered().length) {
            <app-tariff-table [tariffs]="filtered()" [lang]="current()" />
          } @else {
            <p class="empty">{{ s().filterEmpty }}</p>
          }
          <p class="count" aria-live="polite">{{ countText() }}</p>
        </section>

        @if (conditions().length) {
          <section class="cond" aria-labelledby="c-h">
            <h2 id="c-h">{{ s().conditionsTitle }}</h2>
            <dl>
              @for (c of conditions(); track c.name) {
                <div class="row">
                  <dt>{{ c.name }}</dt>
                  <dd>
                    @for (p of c.parts; track p.label) {
                      <span>{{ p.label }}:</span> {{ p.text }}<br />
                    }
                  </dd>
                </div>
              }
            </dl>
          </section>
        }
      } @else {
        <app-status-view [kind]="failure()" [lang]="current()" />
      }
    </app-page-frame>
  `,
})
export class CountryPage {
  readonly lang = input<string>();
  readonly slug = input<string>();
  readonly data = input.required<Loaded<CountryData>>();

  protected readonly current = computed<Lang>(() => (isLang(this.lang()) ? (this.lang() as Lang) : 'en'));
  protected readonly s = computed(() => STRINGS[this.current()]);
  protected readonly loaded = computed(() => {
    const r = this.data();
    return r.ok ? r.data : null;
  });
  protected readonly failure = computed<'not_found' | 'error'>(() => {
    const r = this.data();
    return r.ok ? 'error' : r.kind;
  });
  protected readonly rest = computed(() => `/country/${this.slug() ?? ''}`);

  protected readonly vol = signal<VolumeFilter>('all');
  protected readonly cur = signal<CurrencyFilter>('all');

  private readonly all = computed(() => sortTariffs(this.loaded()?.country.tariffs ?? []));
  protected readonly filtered = computed(() =>
    this.all().filter(
      (t) =>
        (this.vol() === 'all' ||
          (this.vol() === 'unl' ? t.is_unlimited : !t.is_unlimited && String(t.data_gb) === this.vol())) &&
        (this.cur() === 'all' || t.currency === this.cur()),
    ),
  );
  protected readonly countText = computed(() =>
    fill(this.s().shown, { n: this.filtered().length, total: this.all().length }),
  );

  protected readonly volumeOptions = computed(() => [
    { value: 'all' as const, label: this.s().all },
    { value: '5' as const, label: `5 ${this.s().gb}` },
    { value: '10' as const, label: `10 ${this.s().gb}` },
    { value: 'unl' as const, label: this.s().unlimited },
  ]);
  protected readonly currencyOptions = computed(() => [
    { value: 'all' as const, label: this.s().all },
    { value: 'EUR' as const, label: 'EUR' },
    { value: 'PLN' as const, label: 'PLN' },
  ]);

  /** H1 берётся из SEO-заголовка страны до двоеточия: «eSIM для Турции». */
  protected readonly heading = computed(() => {
    const d = this.loaded();
    return d ? d.country.seo.title.split(':')[0].trim() : '';
  });

  protected readonly pricesCaption = computed(() =>
    fill(this.s().pricesCaption, { date: this.loaded()?.country.last_checked_at ?? '' }),
  );

  /** Сводка цен на пакеты 5 и 10 ГБ на 30 дней: диапазон по каждой валюте отдельно, без пересчёта. */
  protected readonly summary = computed(() => {
    const lang = this.current();
    const fixed = (this.loaded()?.country.tariffs ?? []).filter((t) => !t.is_unlimited && t.duration_days === 30);
    const range = (gb: number, cur: CurrencyCode) => {
      const prices = fixed.filter((t) => t.data_gb === gb && t.currency === cur).map((t) => t.price);
      if (!prices.length) return '—';
      const [lo, hi] = [Math.min(...prices), Math.max(...prices)];
      return lo === hi ? `${money(lo, lang)} ${cur}` : `${money(lo, lang)} – ${money(hi, lang)} ${cur}`;
    };
    return [5, 10].map((gb) => ({ gb, eur: range(gb, 'EUR'), pln: range(gb, 'PLN') }));
  });

  /** Условия только тех провайдеров, у которых есть тарифы в этой стране и опубликованный текст. */
  protected readonly conditions = computed(() => {
    const d = this.loaded();
    if (!d) return [];
    const present = new Set(d.country.tariffs.map((t) => t.provider_slug));
    const s = this.s();
    return d.providers.providers
      .filter((p) => present.has(p.slug))
      .map((p) => ({
        name: p.name,
        parts: [
          { label: s.speed, text: p.speed_limit_policy },
          { label: s.activation, text: p.activation_policy },
          { label: s.refund, text: p.refund_policy },
        ].filter((x): x is { label: string; text: string } => !!x.text),
      }))
      .filter((c) => c.parts.length > 0);
  });

  private readonly seo = inject(Seo);

  constructor() {
    effect(() => {
      const lang = this.current();
      const d = this.loaded();
      const slug = this.slug() ?? '';
      if (!d) {
        this.seo.set({ lang, path: `/country/${slug}`, title: `${this.s().notFoundTitle} | ${BRAND_NAME}`, description: this.s().errorText, noindex: true });
        return;
      }
      const path = `/country/${d.country.slug}`;
      const offers = this.all()
        .filter((t) => t.is_verified)
        .map((t, i) => this.offer(t, i + 1));
      this.seo.set({
        lang,
        path,
        title: d.country.seo.title,
        description: d.country.seo.description,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: this.s().home, item: this.seo.url(lang, '') },
              { '@type': 'ListItem', position: 2, name: d.country.name, item: this.seo.url(lang, path) },
            ],
          },
          { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: offers },
        ],
      });
    });
  }

  private offer(t: TariffItem, position: number) {
    const s = this.s();
    return {
      '@type': 'ListItem',
      position,
      item: {
        '@type': 'Offer',
        name: fill(s.offerName, { provider: t.provider_name, volume: volume(t, s), term: term(t, s) }),
        price: t.price,
        priceCurrency: t.currency,
        url: t.source_url,
      },
    };
  }
}
