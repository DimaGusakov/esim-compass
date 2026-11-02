import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, RESPONSE_INIT } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STRINGS } from '../core/i18n';
import { Lang } from '../core/lang';

/** Состояния «не найдено» и «ошибка API». На сервере отвечает 404 или 503, а не 200. */
@Component({
  selector: 'app-status-view',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (kind() === 'not_found') {
      <h1 class="t-headline status-h">{{ s().notFoundTitle }}</h1>
      <a class="out-link status-link" [routerLink]="['/', lang()]">{{ s().backHome }}</a>
    } @else {
      <h1 class="t-headline status-h">{{ s().errorTitle }}</h1>
      <p class="prose status-p" role="alert">{{ s().errorText }}</p>
      <a class="out-link status-link" href="" (click)="reload($event)">{{ s().reload }}</a>
    }
  `,
})
export class StatusView implements OnInit {
  readonly kind = input.required<'not_found' | 'error'>();
  readonly lang = input.required<Lang>();
  protected readonly s = computed(() => STRINGS[this.lang()]);
  private readonly init = inject(RESPONSE_INIT, { optional: true });

  ngOnInit(): void {
    if (this.init) this.init.status = this.kind() === 'not_found' ? 404 : 503;
  }

  protected reload(e: Event): void {
    e.preventDefault();
    location.reload();
  }
}
