# Price check eSIM: сверка с backend/seed_data.json

Дата проверки: 2026-11-03. Время в таблице — UTC (ISO-время, которое отдавал браузер при чтении страницы).
Снимались пакеты 5 ГБ и 10 ГБ на 30 дней. Цены взяты из таблицы пакетов на странице, без пересчёта по курсу.
Браузеры: встроенный (Airalo, Nomad, Saily, Yesim — основная часть) и Playwright (Yesim Таиланд/Египет/Сербия, Holafly, переключение валюты Airalo, повторное чтение Airalo Турции в PLN).
Адреса страниц взяты из `source_url` в seed; Yesim — `https://yesim.app/country/<slug>/` для всех 13 стран.

## 1. Таблица

| страна | провайдер | ГБ | дни | цена сейчас | зачёркнуто | валюта | цена в seed | совпало | URL | дата и время снятия |
|---|---|---|---|---|---|---|---|---|---|---|
| turkey | airalo | 5 | 30 | 41.00 | — | PLN | 41.00 | да | https://www.airalo.com/turkey-esim | 2026-11-03 08:55:57 |
| turkey | airalo | 10 | 30 | 63.00 | — | PLN | 63.00 | да | https://www.airalo.com/turkey-esim | 2026-11-03 08:55:57 |
| japan | airalo | 5 | 30 | 45.00 | — | PLN | 45.00 | да | https://www.airalo.com/japan-esim | 2026-11-03 08:44:41 |
| japan | airalo | 10 | 30 | 73.50 | — | PLN | 73.50 | да | https://www.airalo.com/japan-esim | 2026-11-03 08:44:41 |
| united-states | airalo | 5 | 30 | 55.00 | — | PLN | 55.00 | да | https://www.airalo.com/united-states-esim | 2026-11-03 08:45:08 |
| united-states | airalo | 10 | 30 | 91.50 | — | PLN | 91.50 | да | https://www.airalo.com/united-states-esim | 2026-11-03 08:45:08 |
| united-kingdom | airalo | 5 | 30 | 53.00 | — | PLN | 53.00 | да | https://www.airalo.com/united-kingdom-esim | 2026-11-03 08:44:48 |
| united-kingdom | airalo | 10 | 30 | 77.50 | — | PLN | 77.50 | да | https://www.airalo.com/united-kingdom-esim | 2026-11-03 08:44:48 |
| italy | airalo | 5 | 30 | 49.00 | — | PLN | 49.00 | да | https://www.airalo.com/italy-esim | 2026-11-03 08:44:55 |
| italy | airalo | 10 | 30 | 77.50 | — | PLN | 77.50 | да | https://www.airalo.com/italy-esim | 2026-11-03 08:44:55 |
| spain | airalo | 5 | 30 | 37.00 | — | PLN | 37.00 | да | https://www.airalo.com/spain-esim | 2026-11-03 08:45:15 |
| spain | airalo | 10 | 30 | 57.00 | — | PLN | 57.00 | да | https://www.airalo.com/spain-esim | 2026-11-03 08:45:15 |
| france | airalo | 5 | 30 | 45.00 | — | PLN | 45.00 | да | https://www.airalo.com/france-esim | 2026-11-03 08:45:23 |
| france | airalo | 10 | 30 | 69.50 | — | PLN | 69.50 | да | https://www.airalo.com/france-esim | 2026-11-03 08:45:23 |
| united-arab-emirates | airalo | 5 | 30 | 49.00 | — | PLN | 49.00 | да | https://www.airalo.com/united-arab-emirates-esim | 2026-11-03 08:45:34 |
| united-arab-emirates | airalo | 10 | 30 | 81.50 | — | PLN | 81.50 | да | https://www.airalo.com/united-arab-emirates-esim | 2026-11-03 08:45:34 |
| georgia | airalo | 5 | 30 | 69.50 | — | PLN | 69.50 | да | https://www.airalo.com/georgia-esim | 2026-11-03 08:45:42 |
| georgia | airalo | 10 | 30 | 116.00 | — | PLN | 116.00 | да | https://www.airalo.com/georgia-esim | 2026-11-03 08:45:42 |
| armenia | airalo | 5 | 30 | 102.00 | — | PLN | 102.00 | да | https://www.airalo.com/armenia-esim | 2026-11-03 08:45:48 |
| armenia | airalo | 10 | 30 | 158.50 | — | PLN | 158.50 | да | https://www.airalo.com/armenia-esim | 2026-11-03 08:45:48 |
| thailand | airalo | 5 | 30 | 32.50 | — | PLN | нет в seed | нет в seed | https://www.airalo.com/thailand-esim | 2026-11-03 08:46:01 |
| thailand | airalo | 10 | 30 | 45.00 | — | PLN | нет в seed | нет в seed | https://www.airalo.com/thailand-esim | 2026-11-03 08:46:01 |
| egypt | airalo | 5 | 30 | 81.50 | — | PLN | 81.50 | да | https://www.airalo.com/egypt-esim | 2026-11-03 08:46:10 |
| egypt | airalo | 10 | 30 | 134.50 | — | PLN | 134.50 | да | https://www.airalo.com/egypt-esim | 2026-11-03 08:46:10 |
| serbia | airalo | 5 | 30 | 45.00 | — | PLN | 45.00 | да | https://www.airalo.com/serbia-esim | 2026-11-03 08:46:16 |
| serbia | airalo | 10 | 30 | 73.50 | — | PLN | 73.50 | да | https://www.airalo.com/serbia-esim | 2026-11-03 08:46:16 |
| turkey | nomad | 5 | 30 | 8.06 | — | EUR | 8.06 | да | https://www.nomadesim.com/turkey-eSIM | 2026-11-03 08:46:33 |
| turkey | nomad | 10 | 30 | 11.64 | 13.43 | EUR | 11.64 | да | https://www.nomadesim.com/turkey-eSIM | 2026-11-03 08:46:33 |
| japan | nomad | 5 | 30 | 8.96 | — | EUR | 8.96 | да | https://www.nomadesim.com/japan-eSIM | 2026-11-03 08:46:39 |
| japan | nomad | 10 | 30 | 14.33 | 16.12 | EUR | 14.33 | да | https://www.nomadesim.com/japan-eSIM | 2026-11-03 08:46:39 |
| united-states | nomad | 5 | 30 | 8.06 | — | EUR | 8.06 | да | https://www.nomadesim.com/united-states-eSIM | 2026-11-03 08:46:44 |
| united-states | nomad | 10 | 30 | 11.64 | — | EUR | 11.64 | да | https://www.nomadesim.com/united-states-eSIM | 2026-11-03 08:46:44 |
| united-kingdom | nomad | 5 | 30 | 10.75 | — | EUR | 10.75 | да | https://www.nomadesim.com/united-kingdom-eSIM | 2026-11-03 08:47:13 |
| united-kingdom | nomad | 10 | 30 | 15.67 | — | EUR | 15.67 | да | https://www.nomadesim.com/united-kingdom-eSIM | 2026-11-03 08:47:13 |
| italy | nomad | 5 | 30 | 9.85 | — | EUR | 9.85 | да | https://www.nomadesim.com/italy-eSIM | 2026-11-03 08:47:18 |
| italy | nomad | 10 | 30 | 16.57 | — | EUR | 16.57 | да | https://www.nomadesim.com/italy-eSIM | 2026-11-03 08:47:18 |
| spain | nomad | 5 | 30 | 8.06 | — | EUR | 8.06 | да | https://www.nomadesim.com/spain-eSIM | 2026-11-03 08:47:31 |
| spain | nomad | 10 | 30 | 12.54 | — | EUR | 12.54 | да | https://www.nomadesim.com/spain-eSIM | 2026-11-03 08:47:31 |
| france | nomad | 5 | 30 | 8.06 | — | EUR | 8.06 | да | https://www.nomadesim.com/france-eSIM | 2026-11-03 08:47:36 |
| france | nomad | 10 | 30 | 12.54 | — | EUR | 12.54 | да | https://www.nomadesim.com/france-eSIM | 2026-11-03 08:47:36 |
| united-arab-emirates | nomad | 5 | 30 | 9.85 | — | EUR | 9.85 | да | https://www.nomadesim.com/united-arab-emirates-eSIM | 2026-11-03 08:47:42 |
| united-arab-emirates | nomad | 10 | 30 | 16.57 | — | EUR | 16.57 | да | https://www.nomadesim.com/united-arab-emirates-eSIM | 2026-11-03 08:47:42 |
| georgia | nomad | 5 | 30 | 15.23 | — | EUR | 15.23 | да | https://www.nomadesim.com/georgia-eSIM | 2026-11-03 08:47:52 |
| georgia | nomad | 10 | 30 | 29.55 | — | EUR | 29.55 | да | https://www.nomadesim.com/georgia-eSIM | 2026-11-03 08:47:52 |
| armenia | nomad | 5 | 30 | 21.49 | — | EUR | 21.49 | да | https://www.nomadesim.com/armenia-eSIM | 2026-11-03 08:47:57 |
| armenia | nomad | 10 | 30 | 24.18 | — | EUR | 24.18 | да | https://www.nomadesim.com/armenia-eSIM | 2026-11-03 08:47:57 |
| thailand | nomad | 5 | 30 | 7.16 | — | EUR | 7.16 | да | https://www.nomadesim.com/thailand-eSIM | 2026-11-03 08:48:03 |
| thailand | nomad | 10 | 30 | 8.96 | — | EUR | 8.96 | да | https://www.nomadesim.com/thailand-eSIM | 2026-11-03 08:48:03 |
| egypt | nomad | 5 | 30 | 16.12 | — | EUR | 16.12 | да | https://www.nomadesim.com/egypt-eSIM | 2026-11-03 08:48:13 |
| egypt | nomad | 10 | 30 | 25.08 | — | EUR | 25.08 | да | https://www.nomadesim.com/egypt-eSIM | 2026-11-03 08:48:13 |
| serbia | nomad | 5 | 30 | 8.96 | — | EUR | 8.96 | да | https://www.nomadesim.com/serbia-eSIM | 2026-11-03 08:48:19 |
| serbia | nomad | 10 | 30 | 13.43 | — | EUR | 13.43 | да | https://www.nomadesim.com/serbia-eSIM | 2026-11-03 08:48:19 |
| turkey | saily | 5 | 30 | 8.99 | — | EUR | 8.99 | да | https://saily.com/esim-turkey/ | 2026-11-03 08:48:31 |
| turkey | saily | 10 | 30 | 13.99 | — | EUR | 13.99 | да | https://saily.com/esim-turkey/ | 2026-11-03 08:48:31 |
| japan | saily | 5 | 30 | 9.99 | — | EUR | 9.99 | да | https://saily.com/esim-japan/ | 2026-11-03 08:48:36 |
| japan | saily | 10 | 30 | 15.99 | — | EUR | 15.99 | да | https://saily.com/esim-japan/ | 2026-11-03 08:48:36 |
| united-states | saily | 5 | 30 | 12.49 | — | EUR | 12.49 | да | https://saily.com/esim-united-states/ | 2026-11-03 08:48:40 |
| united-states | saily | 10 | 30 | 20.49 | — | EUR | 20.49 | да | https://saily.com/esim-united-states/ | 2026-11-03 08:48:40 |
| united-kingdom | saily | 5 | 30 | 11.49 | — | EUR | 11.49 | да | https://saily.com/esim-united-kingdom/ | 2026-11-03 08:48:50 |
| united-kingdom | saily | 10 | 30 | 16.99 | — | EUR | 16.99 | да | https://saily.com/esim-united-kingdom/ | 2026-11-03 08:48:50 |
| italy | saily | 5 | 30 | 11.49 | — | EUR | 11.49 | да | https://saily.com/esim-italy/ | 2026-11-03 08:48:55 |
| italy | saily | 10 | 30 | 18.49 | — | EUR | 18.49 | да | https://saily.com/esim-italy/ | 2026-11-03 08:48:55 |
| spain | saily | 5 | 30 | 8.99 | — | EUR | 8.99 | да | https://saily.com/esim-spain/ | 2026-11-03 08:49:00 |
| spain | saily | 10 | 30 | 13.99 | — | EUR | 13.99 | да | https://saily.com/esim-spain/ | 2026-11-03 08:49:00 |
| france | saily | 5 | 30 | 9.99 | — | EUR | 9.99 | да | https://saily.com/esim-france/ | 2026-11-03 08:49:09 |
| france | saily | 10 | 30 | 14.99 | — | EUR | 14.99 | да | https://saily.com/esim-france/ | 2026-11-03 08:49:09 |
| united-arab-emirates | saily | 5 | 30 | 10.49 | — | EUR | 10.49 | да | https://saily.com/esim-united-arab-emirates/ | 2026-11-03 08:49:13 |
| united-arab-emirates | saily | 10 | 30 | 17.99 | — | EUR | 17.99 | да | https://saily.com/esim-united-arab-emirates/ | 2026-11-03 08:49:13 |
| georgia | saily | 5 | 30 | 15.99 | — | EUR | 15.99 | да | https://saily.com/esim-georgia/ | 2026-11-03 08:49:18 |
| georgia | saily | 10 | 30 | 27.49 | — | EUR | 27.49 | да | https://saily.com/esim-georgia/ | 2026-11-03 08:49:18 |
| armenia | saily | 5 | 30 | 22.99 | — | EUR | 22.99 | да | https://saily.com/esim-armenia/ | 2026-11-03 08:49:28 |
| armenia | saily | 10 | 30 | 39.99 | — | EUR | 39.99 | да | https://saily.com/esim-armenia/ | 2026-11-03 08:49:28 |
| thailand | saily | 5 | 30 | 6.99 | — | EUR | 6.99 | да | https://saily.com/esim-thailand/ | 2026-11-03 08:49:32 |
| thailand | saily | 10 | 30 | 9.99 | — | EUR | 9.99 | да | https://saily.com/esim-thailand/ | 2026-11-03 08:49:32 |
| egypt | saily | 5 | 30 | 17.99 | — | EUR | 17.99 | да | https://saily.com/esim-egypt/ | 2026-11-03 08:49:37 |
| egypt | saily | 10 | 30 | 30.49 | — | EUR | 30.49 | да | https://saily.com/esim-egypt/ | 2026-11-03 08:49:37 |
| serbia | saily | 5 | 30 | 9.99 | — | EUR | 9.99 | да | https://saily.com/esim-serbia/ | 2026-11-03 08:49:42 |
| serbia | saily | 10 | 30 | 15.99 | — | EUR | 15.99 | да | https://saily.com/esim-serbia/ | 2026-11-03 08:49:42 |
| turkey | yesim | 5 | 30 | 9.00 | 10.00 | EUR | 9.00 | да | https://yesim.app/country/turkey/ | 2026-11-03 08:50:08 |
| turkey | yesim | 10 | 30 | 14.00 | 20.00 | EUR | 14.00 | да | https://yesim.app/country/turkey/ | 2026-11-03 08:50:08 |
| japan | yesim | 5 | 30 | 8.80 | 18.50 | EUR | 8.80 | да | https://yesim.app/country/japan/ | 2026-11-03 08:50:26 |
| japan | yesim | 10 | 30 | 16.00 | 37.00 | EUR | 16.00 | да | https://yesim.app/country/japan/ | 2026-11-03 08:50:26 |
| united-states | yesim | 5 | 30 | 9.00 | 15.50 | EUR | 9.00 | да | https://yesim.app/country/united-states/ | 2026-11-03 08:50:31 |
| united-states | yesim | 10 | 30 | 14.00 | 31.00 | EUR | 14.00 | да | https://yesim.app/country/united-states/ | 2026-11-03 08:50:31 |
| united-kingdom | yesim | 5 | 30 | 9.60 | 12.50 | EUR | нет в seed | нет в seed | https://yesim.app/country/united-kingdom/ | 2026-11-03 08:50:38 |
| united-kingdom | yesim | 10 | 30 | 16.00 | 25.00 | EUR | нет в seed | нет в seed | https://yesim.app/country/united-kingdom/ | 2026-11-03 08:50:38 |
| italy | yesim | 5 | 30 | 9.60 | 12.50 | EUR | нет в seed | нет в seed | https://yesim.app/country/italy/ | 2026-11-03 08:50:51 |
| italy | yesim | 10 | 30 | 16.00 | 25.00 | EUR | нет в seed | нет в seed | https://yesim.app/country/italy/ | 2026-11-03 08:50:51 |
| spain | yesim | 5 | 30 | 9.60 | 12.50 | EUR | нет в seed | нет в seed | https://yesim.app/country/spain/ | 2026-11-03 08:50:57 |
| spain | yesim | 10 | 30 | 16.00 | 25.00 | EUR | нет в seed | нет в seed | https://yesim.app/country/spain/ | 2026-11-03 08:50:57 |
| france | yesim | 5 | 30 | 9.60 | 12.50 | EUR | нет в seed | нет в seed | https://yesim.app/country/france/ | 2026-11-03 08:51:04 |
| france | yesim | 10 | 30 | 16.00 | 25.00 | EUR | нет в seed | нет в seed | https://yesim.app/country/france/ | 2026-11-03 08:51:04 |
| united-arab-emirates | yesim | 5 | 30 | 11.00 | 15.50 | EUR | 11.00 | да | https://yesim.app/country/united-arab-emirates/ | 2026-11-03 08:51:20 |
| united-arab-emirates | yesim | 10 | 30 | 19.00 | 31.00 | EUR | 19.00 | да | https://yesim.app/country/united-arab-emirates/ | 2026-11-03 08:51:20 |
| georgia | yesim | 5 | 30 | 9.60 | 12.50 | EUR | нет в seed | нет в seed | https://yesim.app/country/georgia/ | 2026-11-03 08:51:26 |
| georgia | yesim | 10 | 30 | 16.00 | 25.00 | EUR | нет в seed | нет в seed | https://yesim.app/country/georgia/ | 2026-11-03 08:51:26 |
| armenia | yesim | 5 | 30 | 9.60 | 12.50 | EUR | нет в seed | нет в seed | https://yesim.app/country/armenia/ | 2026-11-03 08:51:32 |
| armenia | yesim | 10 | 30 | 16.00 | 25.00 | EUR | нет в seed | нет в seed | https://yesim.app/country/armenia/ | 2026-11-03 08:51:32 |
| thailand | yesim | 5 | 30 | 7.00 | 13.00 | EUR | 7.00 | да | https://yesim.app/country/thailand/ | 2026-11-03 08:52:29 |
| thailand | yesim | 10 | 30 | 11.00 | 26.00 | EUR | 11.00 | да | https://yesim.app/country/thailand/ | 2026-11-03 08:52:29 |
| egypt | yesim | 5 | 30 | 11.00 | 14.50 | EUR | 11.00 | да | https://yesim.app/country/egypt/ | 2026-11-03 08:52:35 |
| egypt | yesim | 10 | 30 | 15.00 | 29.00 | EUR | 15.00 | да | https://yesim.app/country/egypt/ | 2026-11-03 08:52:35 |
| serbia | yesim | 5 | 30 | 9.60 | 12.50 | EUR | нет в seed | нет в seed | https://yesim.app/country/serbia/ | 2026-11-03 08:52:42 |
| serbia | yesim | 10 | 30 | 16.00 | 25.00 | EUR | нет в seed | нет в seed | https://yesim.app/country/serbia/ | 2026-11-03 08:52:42 |
| turkey | holafly | 5 | — | нет пакета | — | — | нет в seed | нет в seed | https://esim.holafly.com/ru/esim-turkey/ | 2026-11-03 08:52:55 |
| turkey | holafly | 10 | — | нет пакета | — | — | нет в seed | нет в seed | https://esim.holafly.com/ru/esim-turkey/ | 2026-11-03 08:52:55 |

## 2. Расхождения с seed

Расхождений по цене 5 ГБ и 10 ГБ нет: все 88 строк, для которых в seed есть такой же пакет, совпали по цене и по зачёркнутой цене.

Есть одно расхождение по содержанию, не по цене:

- **Airalo, Таиланд (`thailand-esim`).** В seed стоит только безлимит на 30 дней за 199,00 PLN (`is_verified: false`, пометка «фиксированные пакеты 5 и 10 ГБ не отобразились»). На странице при фильтре «Fixed data» (снято 2026-11-03 08:46:01 UTC) видны пакеты 5 ГБ за 32,50 zł и 10 ГБ за 45,00 zł на 30 дней. Безлимит 199,00 zł в этом снимке не сверялся.

Для сведения (это не расхождение, а отсутствие в seed):

- Yesim по 7 странам, которых нет в seed: united-kingdom, italy, spain, france, georgia, armenia, serbia (по 5 ГБ — 9,60 EUR, зачёркнуто 12,50 EUR; по 10 ГБ — 16,00 EUR, зачёркнуто 25,00 EUR).
- Yesim для united-kingdom, italy, spain, france, georgia, armenia и serbia показывает одну и ту же таблицу цен. Названия страны на страницах верные, поэтому это записано как есть; причину я не проверял.
- Holafly в seed есть только для Турции, и там только безлимит на 1 день за 17,00 PLN. На странице совпадает: 1 день — 17,00 zł. Пакетов 5 и 10 ГБ у Holafly нет (см. раздел 3).

## 3. Недоступно и нет пакета

**Недоступно** (403, ошибка загрузки): нет. Все 53 страницы открылись, включая Saily Турция и Saily Таиланд: 403 не было.

**Нет пакета**:

- Holafly, Турция, 5 ГБ и 10 ГБ на 30 дней: на странице только безлимитные тарифы по дням (1 день — 17,00 zł, также 3–30 дней), фиксированных пакетов нет. Страница: https://esim.holafly.com/ru/esim-turkey/ (2026-11-03 08:52:55 UTC).

**Не проверялось**: Holafly по остальным 12 странам. В seed у них нет `source_url`, поэтому по ним не снимались цены.

## 4. Итог

Всего строк проверено: 106. Это 13 стран × 4 провайдера (Airalo, Nomad, Saily, Yesim) × 2 пакета = 104, плюс Holafly Турция 5 ГБ и 10 ГБ = 2. Holafly по остальным странам не проверялся, см. раздел 3.

| провайдер | строк | совпало | не совпало | нет в seed |
|---|---|---|---|---|
| Airalo | 26 | 24 | 0 | 2 (Таиланд) |
| Nomad | 26 | 26 | 0 | 0 |
| Saily | 26 | 26 | 0 | 0 |
| Yesim | 26 | 12 | 0 | 14 (7 стран) |
| Holafly | 2 | 0 | 0 | 2 (нет пакета) |
| **Итого** | **106** | **88** | **0** | **18** |

## Примечания по отдельным проверкам

- **Airalo, переключение валюты на EUR:** работает. В меню «Currency» выбирается «Euro (EUR) €». Проверено на странице Турции: 30 дней, 5 ГБ — 9,50 €, 10 ГБ — 14,50 € (снято 2026-11-03 08:55:29 UTC). Для остальных стран EUR не снималась, в таблице PLN. Турция в PLN перечитана 2026-11-03 08:55:57 UTC: 41,00 zł и 63,00 zł.
- **Holafly, переключение валюты на EUR:** не получилось. В меню «RU - PLN (zł)» есть «EUR(€)», но после выбора итог остался 17,00 zł (проверено 2026-11-03 08:53:49 и 08:54:04 UTC). Цены в таблице PLN.
- **Nomad, две цены на пакете:** на Турции (10 ГБ) и Японии (10 ГБ) на пакете две цены. Зачёркнута первая, она показана в CSS как `line-through`: 13,43 EUR (Турция) и 16,12 EUR (Япония). Актуальная цена вторая: 11,64 EUR и 14,33 EUR. Проверено по DOM (2026-11-03 08:47:02 и 08:47:07 UTC).
- **Saily Турция и Таиланд:** 403 не было, страницы открылись. Цены совпали с seed.
- **Yesim:** на всех страницах зачёркнутая цена подтверждена по DOM (`line-through`), она записана в колонке «зачёркнуто».
- **Airalo Грузия:** на странице нет переключателя «Fixed data», 5 и 10 ГБ взяты из списка по умолчанию (30 дней), он содержит фиксированные пакеты.
- **Nomad Великобритания:** есть отдельный пакет «Data + Calls + SMS» на 5 ГБ за 11,64 EUR. В таблице записан пакет только с данными: 5 ГБ за 10,75 EUR.
