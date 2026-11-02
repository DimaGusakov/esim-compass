import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STRINGS } from '../core/i18n';
import { Lang, LANGS } from '../core/lang';

/** Шапка с переключателем языка, область содержимого и подвал. Общий каркас всех страниц. */
@Component({
  selector: 'app-page-frame',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#main">{{ s().skip }}</a>
    <header class="top">
      <div class="wrap">
        <a class="brand" [routerLink]="['/', lang()]" aria-label="esim-compass">esim-compass</a>
        <nav class="lang" [attr.aria-label]="s().langNav">
          @for (l of langs; track l) {
            <a
              [href]="'/' + l + rest()"
              [attr.aria-current]="l === lang() ? 'page' : null"
              [attr.lang]="l"
              [attr.hreflang]="l"
              >{{ l.toUpperCase() }}</a
            >
          }
        </nav>
      </div>
    </header>
    <main id="main" class="wrap">
      <ng-content />
    </main>
    <footer>
      <div class="wrap">
        <p class="prose">{{ s().footer }}</p>
      </div>
    </footer>
  `,
})
export class PageFrame {
  readonly lang = input.required<Lang>();
  /** Путь страницы без языка: '' или '/country/turkey'. По нему строится ссылка парной версии. */
  readonly rest = input('');
  protected readonly langs = LANGS;
  protected readonly s = computed(() => STRINGS[this.lang()]);
}
