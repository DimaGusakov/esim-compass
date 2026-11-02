import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { StatusView } from '../components/status-view';
import { STRINGS } from '../core/i18n';
import { isLang, Lang } from '../core/lang';
import { Seo } from '../core/seo';
import { PageFrame } from './page-frame';

@Component({
  selector: 'app-not-found-page',
  imports: [PageFrame, StatusView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-frame [lang]="current()">
      <app-status-view kind="not_found" [lang]="current()" />
    </app-page-frame>
  `,
})
export class NotFoundPage {
  readonly lang = input<string>();
  protected readonly current = computed<Lang>(() => (isLang(this.lang()) ? (this.lang() as Lang) : 'en'));
  private readonly seo = inject(Seo);

  constructor() {
    effect(() => {
      const lang = this.current();
      this.seo.set({ lang, path: '', title: `${STRINGS[lang].notFoundTitle} | esim-compass`, description: STRINGS[lang].notFoundTitle, noindex: true });
    });
  }
}
