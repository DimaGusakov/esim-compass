import { Routes } from '@angular/router';
import { langMatcher } from './core/lang';
import { CountryPage } from './pages/country-page';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found-page';

export const routes: Routes = [
  {
    matcher: langMatcher,
    children: [
      { path: '', component: HomePage },
      { path: 'country/:slug', component: CountryPage },
      { path: '**', component: NotFoundPage },
    ],
  },
  { path: '**', component: NotFoundPage },
];
