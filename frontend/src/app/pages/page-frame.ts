import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lang, LANGS } from '../core/lang';

/** Шапка, область содержимого и подвал. Общий каркас всех страниц. */
@Component({
  selector: 'app-page-frame',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      class="absolute left-4 -top-16 z-10 bg-print-black px-3.5 py-2.5 text-tag-stock focus:top-2"
      href="#main"
      >{{ lang() === 'ru' ? 'К содержимому' : 'Skip to content' }}</a
    >
    <header class="border-b-2 border-print-black">
      <div class="wrap flex min-h-14 items-center justify-between">
        <a
          class="font-display text-2xl font-extrabold uppercase leading-none tracking-wide no-underline"
          [routerLink]="['/', lang()]"
          >esim-compass</a
        >
        <nav class="flex border-2 border-print-black" [attr.aria-label]="lang() === 'ru' ? 'Язык' : 'Language'">
          @for (l of langs; track l) {
            <a
              class="grid min-h-10 min-w-11 place-items-center text-sm font-semibold uppercase no-underline"
              [class.bg-print-black]="l === lang()"
              [class.text-tag-stock]="l === lang()"
              [routerLink]="['/', l]"
              [attr.aria-current]="l === lang() ? 'page' : null"
              [attr.lang]="l"
              [attr.hreflang]="l"
              >{{ l }}</a
            >
          }
        </nav>
      </div>
    </header>
    <main id="main" class="wrap pt-7 md:pt-10">
      <ng-content />
    </main>
    <footer class="wrap mt-16 border-t-2 border-print-black pb-10 pt-5 text-sm text-faded-print">
      <p class="max-w-prose">
        {{
          lang() === 'ru'
            ? 'Справочник тарифов eSIM. Цены сняты со страниц провайдеров, в исходных валютах, без пересчёта.'
            : 'eSIM plan directory. Prices are taken from provider pages in their original currencies, without conversion.'
        }}
      </p>
    </footer>
  `,
})
export class PageFrame {
  readonly lang = input.required<Lang>();
  protected readonly langs = LANGS;
  private readonly doc = inject(DOCUMENT);

  constructor() {
    effect(() => {
      this.doc.documentElement.lang = this.lang();
    });
  }
}
