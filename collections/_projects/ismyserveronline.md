---
title: IsMyServerOnline
date: 24/11/2026
img_url: /assets/img/projects/ismyserveronline/
icons: [android, firebase]
skills: [Android, Kotlin, Firebase, Git]
display: true
---
Know the moment your server goes down.

IMSO checks your servers and websites in the background and alerts you by push or email when something changes. Uptime, ping, SSL and domain expiry, all from your Android phone.

|                                                                    |                                                                       |                                                                        |                                                                |                                                                  |                                                                     |
| :----------------------------------------------------------------: | :-------------------------------------------------------------------: | :--------------------------------------------------------------------: | :------------------------------------------------------------: | :--------------------------------------------------------------: | :-----------------------------------------------------------------: |
| ![IsMyServerOnline - My servers]({{page.img_url}}screenshot1.webp) | ![IsMyServerOnline - Notifications]({{page.img_url}}screenshot2.webp) | ![IsMyServerOnline - Server details]({{page.img_url}}screenshot3.webp) | ![IsMyServerOnline - Widget]({{page.img_url}}screenshot4.webp) | ![IsMyServerOnline - Settings]({{page.img_url}}screenshot5.webp) | ![IsMyServerOnline - Edit server]({{page.img_url}}screenshot6.webp) |

{::nomarkdown}
{% assign googleplay-icon = site.data.icons | where_exp: "i", "i.tag == 'googleplay'" | first %}
{% assign web-icon = site.data.icons | where_exp: "i", "i.tag == 'web'" | first %}
{:/}

|         {::nomarkdown}<svg  role="img" viewBox="0 0 24 24" class="icon big">{{googleplay-icon.svg}}</svg>{:/}         | {::nomarkdown}<svg role="img" viewBox="0 0 24 24" class="icon big">{{web-icon.svg}}</svg>{:/} |
| :-------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------: |
| [Download on Google Play](https://play.google.com/store/apps/details?id=com.maoux.ismyserveronline){:target="_blank"} |                 [Website](https://ismyserveronline.web.app){:target="_blank"}                 |

## Add a server, IMSO watches it for you

- Websites over HTTP and HTTPS, with HTTP code and response content checks.
- Servers on any TCP or UDP port.
- Machines with ping and ping6, with configurable TTL and packet size.
- Checks run from your phone: monitor your NAS or Raspberry Pi on your local network too.

## Understand what happened

- Uptime statistics, full status history and a latency graph for each server.
- A clear error message when a check fails: timeout, connection refused, invalid code…
- See when the SSL certificate and the domain name expire, with a WHOIS summary.

## Know as soon as something goes down

- Background checks at the interval you choose, from every minute to once a day.
- A push notification or an email on every check, or only when a status changes.
- Check only on Wi-Fi or mobile data, or above a minimum signal quality.
- Your servers on the home screen with widgets.

## Free to monitor

- Free: unlimited servers, push notifications, history and widgets. No ads, no sign-up.
- PRO, monthly or lifetime: email alerts, SSL and domain expiry reminders, folders, 30-day latency graph and full history export.

## Development

Developed in Kotlin with intensive usage of [coroutines](https://developer.android.com/kotlin/coroutines){:target="_blank"}. Follows the MVVM architecture with [Android Architecture Components](https://developer.android.com/topic/libraries/architecture/){:target="_blank"} (LiveData - ViewModel - Room) and uses dependency injection with [Koin](https://insert-koin.io/){:target="_blank"}. Email alerts are sent by a Firebase Cloud Function, and purchases use Google Play Billing.

The biggest challenge was to handle Android background tasks to refresh servers status. It uses Android [WorkManager](https://developer.android.com/reference/androidx/work/Worker){:target="_blank"}, but it wasn't enough, so it also uses the Android [AlarmManager](https://developer.android.com/reference/android/app/AlarmManager){:target="_blank"}.

I also had some difficulties to get the mobile signal quality. I wrote an article about that [here](/blog/2020/08/android-signal-quality).

## Question or support request

[Contact the support](mailto:ismyserveronline-app@outlook.com)

## Legal

[Privacy policy](https://ismyserveronline.web.app/privacy){:target="_blank"}

[Terms & conditions](https://ismyserveronline.web.app/terms){:target="_blank"}
