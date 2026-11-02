import { Routes } from '@angular/router';
import { langMatcher } from './core/lang';
import { CountryPage } from './pages/country-page';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found-page';
import { countryResolver, homeResolver } from './pages/resolvers';

export const routes: Routes = [
  {
    matcher: langMatcher,
    children: [
      { path: '', component: HomePage, resolve: { data: homeResolver } },
      { path: 'country/:slug', component: CountryPage, resolve: { data: countryResolver } },
      { path: '**', component: NotFoundPage },
    ],
  },
  { path: '**', component: NotFoundPage },
];
