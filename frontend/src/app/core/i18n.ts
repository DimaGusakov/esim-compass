import { Lang } from './lang';

/** Тексты интерфейса. Данные (названия стран, SEO-тексты, цены) приходят из API. */
export interface Strings {
  home: string;
  skip: string;
  langNav: string;
  breadcrumbs: string;
  footer: string;
  loading: string;
  h1Home: string;
  method: string;
  calcTitle: string;
  calcParams: string;
  country: string;
  days: string;
  daysLess: string;
  daysMore: string;
  hoursPerDay: string;
  hoursLess: string;
  hoursMore: string;
  need: string;
  range: string;
  package: string;
  packageOne: string;
  packageMany: string;
  allTariffs: string;
  norms: string;
  calcMatching: string;
  calcNeutral: string;
  calcLoading: string;
  calcError: string;
  calcRetry: string;
  calcZero: string;
  calcEmpty: string;
  calcInvalidDays: string;
  calcInvalidHours: string;
  catalogTitle: string;
  catalogCaption: string;
  colCountry: string;
  colTariffs: string;
  colPriceEur: string;
  colPricePln: string;
  colChecked: string;
  unverifiedCount: string;
  providersTitle: string;
  providersCaption: string;
  colProvider: string;
  colUnlimited: string;
  colSpeed: string;
  colActivation: string;
  colRefund: string;
  yes: string;
  no: string;
  notStated: string;
  pricesCaption: string;
  colPackage: string;
  noticeTitle: string;
  tariffsTitle: string;
  filterVolume: string;
  filterCurrency: string;
  all: string;
  unlimited: string;
  shown: string;
  filterEmpty: string;
  colVolume: string;
  colTerm: string;
  colPrice: string;
  colSource: string;
  colGo: string;
  open: string;
  affiliate: string;
  providerSite: string;
  unverified: string;
  gb: string;
  day: string;
  days_: string;
  conditionsTitle: string;
  speed: string;
  activation: string;
  refund: string;
  notFoundTitle: string;
  errorTitle: string;
  errorText: string;
  backHome: string;
  reload: string;
  offerName: string;
}

export const STRINGS: Record<Lang, Strings> = {
  ru: {
    home: 'Главная',
    skip: 'К содержимому',
    langNav: 'Язык',
    breadcrumbs: 'Хлебные крошки',
    footer: 'Справочник тарифов eSIM. Цены сняты со страниц провайдеров, в исходных валютах, без пересчёта. Часть ссылок может быть партнёрской; такие ссылки помечены, а порядок тарифов от комиссии не зависит.',
    loading: 'Загрузка',
    h1Home: 'Сколько ГБ нужно в поездке',
    method: 'Цены сняты со страниц провайдеров {date} и показаны в двух исходных валютах, EUR и PLN, без пересчёта. У каждой цены есть дата и ссылка на источник. На сайте есть партнёрские ссылки; подбор тарифов от них не зависит.',
    calcTitle: 'Калькулятор трафика',
    calcParams: 'Параметры поездки',
    country: 'Страна',
    days: 'Дней в поездке, от 1 до 90',
    daysLess: 'Меньше дней',
    daysMore: 'Больше дней',
    hoursPerDay: 'Часов в день по сценариям',
    hoursLess: 'Меньше часов',
    hoursMore: 'Больше часов',
    need: 'Нужно примерно',
    range: 'Диапазон ±{pct}%: {min} – {max} ГБ',
    package: 'Подходящий пакет',
    packageOne: 'Одного пакета хватает на поездку.',
    packageMany: 'Один пакет не покрывает поездку: нужно {n} пакета подряд или безлимит, если он есть.',
    allTariffs: 'Все тарифы: {name}',
    norms: 'Нормы расхода: {url}, {date}. Оценка приблизительная.',
    calcMatching: 'Тарифы страны под этот объём: {name}',
    calcNeutral: 'Подбор не зависит от партнёрских программ',
    calcLoading: 'Считаем…',
    calcError: 'Не удалось выполнить расчёт. Проверьте соединение и повторите.',
    calcRetry: 'Повторить',
    calcZero: 'Укажите часы использования хотя бы в одном сценарии.',
    calcEmpty: 'Для этой страны нет тарифов под такой объём в данных сайта.',
    calcInvalidDays: 'Дней должно быть от 1 до 90.',
    calcInvalidHours: 'Часов в день должно быть от 0 до 24.',
    catalogTitle: 'Каталог стран',
    catalogCaption: 'Диапазон цен по тарифам страны, в исходных валютах. В число тарифов входят и безлимитные.',
    colCountry: 'Страна',
    colTariffs: 'Тарифов',
    colPriceEur: 'Цена, EUR',
    colPricePln: 'Цена, PLN',
    colChecked: 'Снято',
    unverifiedCount: 'из них непроверено: {n}',
    providersTitle: 'Сводка по провайдерам',
    providersCaption: 'Условия, опубликованные на страницах провайдеров.',
    colProvider: 'Провайдер',
    colUnlimited: 'Безлимит',
    colSpeed: 'Скорость',
    colActivation: 'Активация',
    colRefund: 'Возврат',
    yes: 'Есть',
    no: 'Нет',
    notStated: 'Не указано',
    pricesCaption: 'Цены на пакеты на 30 дней, снято {date}. Диапазон по провайдерам.',
    colPackage: 'Пакет',
    noticeTitle: 'Ограничение в стране',
    tariffsTitle: 'Таблица тарифов',
    filterVolume: 'Объём',
    filterCurrency: 'Валюта',
    all: 'Все',
    unlimited: 'Безлимит',
    shown: 'Показано {n} из {total}',
    filterEmpty: 'Под эти фильтры тарифов нет. Выберите «Все».',
    colVolume: 'Объём',
    colTerm: 'Срок',
    colPrice: 'Цена',
    colSource: 'Снято и источник',
    colGo: 'Переход',
    open: 'Открыть',
    affiliate: 'Партнёрская ссылка',
    providerSite: 'Сайт провайдера',
    unverified: 'Непроверено',
    gb: 'ГБ',
    day: 'день',
    days_: 'дней',
    conditionsTitle: 'Опубликованные условия провайдеров',
    speed: 'Скорость',
    activation: 'Активация',
    refund: 'Возврат',
    notFoundTitle: 'Страница не найдена',
    errorTitle: 'Данные временно недоступны',
    errorText: 'Не удалось загрузить данные. Обновите страницу чуть позже.',
    backHome: 'На главную',
    reload: 'Обновить страницу',
    offerName: '{provider}, {volume}, {term}',
  },
  en: {
    home: 'Home',
    skip: 'Skip to content',
    langNav: 'Language',
    breadcrumbs: 'Breadcrumbs',
    footer: 'eSIM plan directory. Prices are taken from provider pages in their original currencies, without conversion. Some links may be affiliate links; they are labelled, and the order of plans does not depend on commission.',
    loading: 'Loading',
    h1Home: 'How much data you need',
    method: 'Prices were taken from provider pages on {date} and are shown in their two original currencies, EUR and PLN, without conversion. Every price has a date and a source link. The site uses affiliate links; plan matching does not depend on them.',
    calcTitle: 'Data calculator',
    calcParams: 'Trip parameters',
    country: 'Country',
    days: 'Trip days, 1 to 90',
    daysLess: 'Fewer days',
    daysMore: 'More days',
    hoursPerDay: 'Hours per day by scenario',
    hoursLess: 'Fewer hours',
    hoursMore: 'More hours',
    need: 'About',
    range: 'Range ±{pct}%: {min} – {max} GB',
    package: 'Matching package',
    packageOne: 'One package covers the trip.',
    packageMany: 'One package does not cover the trip: you need {n} packages in a row, or an unlimited plan if one is listed.',
    allTariffs: 'All plans: {name}',
    norms: 'Usage norms: {url}, {date}. The estimate is approximate.',
    calcMatching: 'Plans for this amount: {name}',
    calcNeutral: 'Matching does not depend on affiliate programs',
    calcLoading: 'Calculating…',
    calcError: 'The calculation failed. Check your connection and try again.',
    calcRetry: 'Try again',
    calcZero: 'Enter hours of use for at least one scenario.',
    calcEmpty: 'There are no plans for this amount for this country in the site data.',
    calcInvalidDays: 'Days must be from 1 to 90.',
    calcInvalidHours: 'Hours per day must be from 0 to 24.',
    catalogTitle: 'Country catalog',
    catalogCaption: 'Price range across the country plans, in original currencies. The plan count includes unlimited plans.',
    colCountry: 'Country',
    colTariffs: 'Plans',
    colPriceEur: 'Price, EUR',
    colPricePln: 'Price, PLN',
    colChecked: 'Taken',
    unverifiedCount: 'unverified: {n}',
    providersTitle: 'Providers overview',
    providersCaption: 'Terms published on the provider pages.',
    colProvider: 'Provider',
    colUnlimited: 'Unlimited',
    colSpeed: 'Speed',
    colActivation: 'Activation',
    colRefund: 'Refund',
    yes: 'Yes',
    no: 'No',
    notStated: 'Not stated',
    pricesCaption: '30-day package prices, taken {date}. Range across providers.',
    colPackage: 'Package',
    noticeTitle: 'Restriction in the country',
    tariffsTitle: 'Plan table',
    filterVolume: 'Data',
    filterCurrency: 'Currency',
    all: 'All',
    unlimited: 'Unlimited',
    shown: 'Showing {n} of {total}',
    filterEmpty: 'No plans match these filters. Choose “All”.',
    colVolume: 'Data',
    colTerm: 'Term',
    colPrice: 'Price',
    colSource: 'Taken and source',
    colGo: 'Go',
    open: 'Open',
    affiliate: 'Affiliate link',
    providerSite: 'Provider site',
    unverified: 'Unverified',
    gb: 'GB',
    day: 'day',
    days_: 'days',
    conditionsTitle: 'Published provider terms',
    speed: 'Speed',
    activation: 'Activation',
    refund: 'Refund',
    notFoundTitle: 'Page not found',
    errorTitle: 'Data is temporarily unavailable',
    errorText: 'The data could not be loaded. Please refresh the page in a moment.',
    backHome: 'Back to home',
    reload: 'Reload the page',
    offerName: '{provider}, {volume}, {term}',
  },
};

/** Подставляет {name} из params в шаблон. */
export const fill = (template: string, params: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? ''));
