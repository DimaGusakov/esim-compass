import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loaded } from '../core/api';
import { Calculator } from '../components/calculator';
import { StatusView } from '../components/status-view';
import { rangeText } from '../core/format';
import { fill, STRINGS } from '../core/i18n';
import { isLang, Lang } from '../core/lang';
import { CountrySummary } from '../core/models';
import { Seo } from '../core/seo';
import { BRAND_NAME } from '../core/site-config';
import { PageFrame } from './page-frame';
import { HomeData } from './resolvers';

@Component({
  selector: 'app-home-page',
  imports: [PageFrame, StatusView, Calculator, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-frame [lang]="current()">
      @if (loaded(); as d) {
        <div class="hero">
          <h1>{{ s().h1Home }}</h1>
          <p class="method">{{ method() }}</p>
        </div>

        <app-calculator
          [lang]="current()"
          [countries]="d.countries"
          [scenarios]="d.providers.calculator_scenarios"
          [initialSlug]="defaultSlug()"
        />

        <p class="prose intro">{{ d.seo.intro_text }}</p>

        <section aria-labelledby="cat-h">
          <h2 id="cat-h">{{ s().catalogTitle }}</h2>
          <div class="tbl-wrap">
            <table class="cat stack">
              <caption>
                {{ s().catalogCaption }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ s().colCountry }}</th>
                  <th scope="col" class="num">{{ s().colTariffs }}</th>
                  <th scope="col" class="num">{{ s().colPriceEur }}</th>
                  <th scope="col" class="num">{{ s().colPricePln }}</th>
                  <th scope="col" class="num">{{ s().colChecked }}</th>
                </tr>
              </thead>
              <tbody>
                @for (c of d.countries; track c.slug) {
                  <tr>
                    <th scope="row" [attr.data-label]="s().colCountry">
                      <a class="cat-link" [routerLink]="['/', current(), 'country', c.slug]">
                        <span class="code" aria-hidden="true">{{ c.iso_code }}</span>
                        <span class="cat-name">{{ c.name }}</span>
                      </a>
                    </th>
                    <td class="num" [attr.data-label]="s().colTariffs">
                      <div>
                        {{ c.verified_tariffs_count + c.unverified_tariffs_count }}
                        @if (c.unverified_tariffs_count) {
                          <span class="cell-note">{{ unverifiedNote(c) }}</span>
                        }
                      </div>
                    </td>
                    <td class="num" [attr.data-label]="'EUR'">
                      <span class="price">{{ range(c, 'EUR') }}</span>
                    </td>
                    <td class="num" [attr.data-label]="'PLN'">
                      <span class="price">{{ range(c, 'PLN') }}</span>
                    </td>
                    <td class="num" [attr.data-label]="s().colChecked">{{ c.last_checked_at ?? '—' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="prov-h">
          <h2 id="prov-h">{{ s().providersTitle }}</h2>
          <div class="tbl-wrap">
            <table class="stack stack-prov">
              <caption>
                {{ s().providersCaption }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ s().colProvider }}</th>
                  <th scope="col">{{ s().colUnlimited }}</th>
                  <th scope="col">{{ s().colSpeed }}</th>
                  <th scope="col">{{ s().colActivation }}</th>
                  <th scope="col">{{ s().colRefund }}</th>
                </tr>
              </thead>
              <tbody>
                @for (p of d.providers.providers; track p.slug) {
                  <tr>
                    <th scope="row" [attr.data-label]="s().colProvider">
                      {{ p.name }}
                      <span class="cell-note">{{ p.summary }}</span>
                    </th>
                    <td [attr.data-label]="s().colUnlimited">{{ p.has_unlimited_plans ? s().yes : s().no }}</td>
                    <td [attr.data-label]="s().colSpeed">{{ p.speed_limit_policy ?? s().notStated }}</td>
                    <td [attr.data-label]="s().colActivation">{{ p.activation_policy ?? s().notStated }}</td>
                    <td [attr.data-label]="s().colRefund">{{ p.refund_policy ?? s().notStated }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      } @else {
        <app-status-view kind="error" [lang]="current()" />
      }
    </app-page-frame>
  `,
})
export class HomePage {
  readonly lang = input<string>();
  readonly data = input.required<Loaded<HomeData>>();

  protected readonly current = computed<Lang>(() => (isLang(this.lang()) ? (this.lang() as Lang) : 'en'));
  protected readonly s = computed(() => STRINGS[this.current()]);
  protected readonly loaded = computed(() => {
    const r = this.data();
    return r.ok ? r.data : null;
  });

  /** Дата снятия цен берётся из данных, а не из текста интерфейса. */
  private readonly checkedAt = computed(
    () => this.loaded()?.countries.map((c) => c.last_checked_at).filter((d): d is string => !!d).sort().at(-1) ?? '',
  );
  protected readonly method = computed(() => fill(this.s().method, { date: this.checkedAt() }));

  /** Страна в калькуляторе по умолчанию: Турция, если она есть в каталоге, иначе первая. */
  protected readonly defaultSlug = computed(() => {
    const list = this.loaded()?.countries ?? [];
    return (list.find((c) => c.slug === 'turkey') ?? list[0])?.slug ?? '';
  });

  private readonly seo = inject(Seo);

  constructor() {
    effect(() => {
      const lang = this.current();
      const d = this.loaded();
      if (!d) {
        this.seo.set({ lang, path: '', title: `${this.s().errorTitle} | ${BRAND_NAME}`, description: this.s().errorText, noindex: true });
        return;
      }
      this.seo.set({
        lang,
        path: '',
        title: d.seo.title,
        description: d.seo.description,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: BRAND_NAME,
            url: this.seo.url(lang, ''),
            inLanguage: lang,
          },
        ],
      });
    });
  }

  protected range(c: CountrySummary, currency: 'EUR' | 'PLN'): string {
    return rangeText(
      c.price_summaries.find((p) => p.currency === currency),
      this.current(),
    );
  }

  protected unverifiedNote(c: CountrySummary): string {
    return fill(this.s().unverifiedCount, { n: c.unverified_tariffs_count });
  }
}
