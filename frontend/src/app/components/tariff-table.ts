import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { host, money, term, volume } from '../core/format';
import { fill, STRINGS } from '../core/i18n';
import { Lang } from '../core/lang';
import { TariffItem } from '../core/models';

/** Таблица тарифов. На телефоне (до 760px) строки перестраиваются в блоки «подпись и значение». */
@Component({
  selector: 'app-tariff-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tbl-wrap">
      <table class="stack">
        <thead>
          <tr>
            <th scope="col">{{ s().colProvider }}</th>
            <th scope="col">{{ s().colVolume }}</th>
            <th scope="col">{{ s().colTerm }}</th>
            <th scope="col">{{ s().colPrice }}</th>
            <th scope="col">{{ s().colSource }}</th>
            <th scope="col">{{ s().colGo }}</th>
          </tr>
        </thead>
        <tbody>
          @for (t of tariffs(); track t.id) {
            <tr>
              <th scope="row" class="prov" [attr.data-label]="s().colProvider">{{ t.provider_name }}</th>
              <td [attr.data-label]="s().colVolume">{{ vol(t) }}</td>
              <td [attr.data-label]="s().colTerm">{{ trm(t) }}</td>
              <td [attr.data-label]="s().colPrice">
                <div>
                  <span class="price">
                    @if (t.is_on_sale && t.original_price) {
                      <s>{{ money(t.original_price) }}</s>
                    }
                    {{ money(t.price) }} {{ t.currency }}
                  </span>
                  @if (t.note) {
                    <span class="cell-note">{{ t.note }}</span>
                  }
                </div>
              </td>
              <td [attr.data-label]="s().colSource">
                <div>
                  {{ t.checked_at }}
                  @if (!t.is_verified) {
                    <span class="tag">{{ s().unverified }}</span>
                  }
                  <span class="cell-note"
                    ><a [href]="t.source_url" target="_blank" rel="noopener noreferrer">{{ host(t.source_url) }}</a></span
                  >
                </div>
              </td>
              <td class="go-cell">
                <div>
                  <a
                    class="go"
                    [href]="t.redirect_path"
                    target="_blank"
                    [attr.rel]="t.is_affiliate_link ? 'sponsored noopener noreferrer' : 'noopener noreferrer'"
                    [attr.aria-label]="label(t)"
                    >{{ linkText(t) }}</a
                  >
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TariffTable {
  readonly tariffs = input.required<readonly TariffItem[]>();
  readonly lang = input.required<Lang>();
  protected readonly s = computed(() => STRINGS[this.lang()]);

  protected readonly host = host;
  protected money = (v: number) => money(v, this.lang());
  protected vol = (t: TariffItem) => volume(t, this.s());
  protected trm = (t: TariffItem) => term(t, this.s());
  /** Подпись перехода по SPEC 3.2: партнёрская ссылка или сайт провайдера. */
  protected linkText = (t: TariffItem) => (t.is_affiliate_link ? this.s().affiliate : this.s().providerSite);
  // Доступное имя начинается с видимой подписи, затем идёт тариф, к которому ведёт ссылка
  protected label = (t: TariffItem) =>
    `${this.linkText(t)}: ${fill(this.s().offerName, {
      provider: t.provider_name,
      volume: this.vol(t),
      term: this.trm(t),
    })}`;
}
