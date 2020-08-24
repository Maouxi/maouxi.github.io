---
title: IsMyServerOnline
date: 15/04/2020
img_url: /assets/img/projects/ismyserveronline/
icons: [android]
skills: [Android, Kotlin, Azure Devops, Git]
---
Monitor yout servers status within an Android application.

| ![IsMyServerOnline - Home]({{page.img_url}}screenshot1.png) | ![IsMyServerOnline - Notifications]({{page.img_url}}screenshot2.png) | ![IsMyServerOnline - Server details]({{page.img_url}}screenshot3.png) | ![IsMyServerOnline - Settings]({{page.img_url}}screenshot4.png) | ![IsMyServerOnline - Server configuration]({{page.img_url}}screenshot5.png)

{::nomarkdown}
{% assign googleplay-icon = site.data.icons | where_exp: "i", "i.tag == 'googleplay'" | first %}
{% assign amazon-icon = site.data.icons | where_exp: "i", "i.tag == 'amazon'" | first %}
{:/}
 
| {::nomarkdown}<svg  role="img" viewBox="0 0 24 24" class="icon big">{{googleplay-icon.svg}}</svg>{:/} | {::nomarkdown}<svg role="img" viewBox="0 0 24 24" class="icon big">{{amazon-icon.svg}}</svg>{:/} |
| [Download on Google Play](https://play.google.com/store/apps/details?id=com.maoux.ismyserveronline){:target="_blank"} | [Download on Amazon AppStore](https://www.amazon.fr/My-Server-Online-Monitorez-serveurs/dp/B088193K9W/ref=sr_1_1?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=ismyserveronline&qid=1597831390&s=mobile-apps&sr=1-1){:target="_blank"} |

## Features

- Display a server status with last status.
- Display server detail page with full status history and a latency chart for the last 24h. 
- Displays a detailed message in case of error/timeout during connection. 
- Add servers / website via their IP address or web domain name.
- Supports HTTP and HTTPS protocols.
- Support TCP protocol with port specification.
- Support PING command.
- Configurable auto-refresh at specified interval, timeout, retry count and interval between retry, returned http code check, refresh on wifi only, refresh with a min signal quality. 
- Notification on server status change or when updated
- Light and Dark theme.

## Development

Develop in kotlin with intensive usage of [coroutine](https://developer.android.com/kotlin/coroutines){:target="_blank"}. Follow the MVVM architecture with [android architecture component](https://developer.android.com/topic/libraries/architecture/){:target="_blank"} (LiveData - ViewModel - Room) and use dependency injection with [Koin](https://insert-koin.io/){:target="_blank"}. 

The biggest challenge was to handle Android background tasks to refresh servers status. It use Android [worker](https://developer.android.com/reference/androidx/work/Worker){:target="_blank"} but it wasn't enougth so it also use the basic android [alarm manager](https://developer.android.com/reference/android/app/AlarmManager){:target="_blank"}.
I thinking about writting an article on how to achieve this correclty. 

I have also have some difficulties to get the mobile signal quality. I write an article about that [here](/blog/2020/08/android-signal-quality). 

## Devops

Fully integrate on [Azure Devops](https://azure.microsoft.com/fr-fr/services/devops/){:target="_blank"}. 

| ![IsMyServerOnline - Devops dashboard]({{page.img_url}}dashboard.png){:style="width: 800px"} |
| Azure devops IsMyServerOnline dashboard |

### Boards

Use Kanban (Todo, doing, done) to follow bugs and new features. 

| ![IsMyServerOnline - Devops kaban board]({{page.img_url}}board.png){:style="width: 800px"} |
| Azure devops IsMyServerOnline Kaban board |

### Repository

One git repository on Azure Devops. Usage of git flow. 

#### Pipelines

_Build_ 

One build pipeline write in yaml (to keep history on the git repository) that trigger on the develop and release/* branches. 
This pipeline: 
- Build the project 
- Create the release apk signed and unsigned
- Create the release app bundle (aab) signed and unsigned
- Execute unit test and instrumented test (on simulator)
- Execute the code coverage (with unit and instrumented tests using [Jacoco](https://www.jacoco.org/jacoco/){:target="_blank"})

| ![IsMyServerOnline - Devops build]({{page.img_url}}board.png){:style="width: 800px"} |
| Azure devops IsMyServerOnline build result |

_Release_

Two release pipeline. One for the Google PlayStore, one for the Amazon AppStore. 

The Amazon AppStore release use the [Amazon Devops Extensions](/projects/amazondevopsextensions) I made. It prepare the release and then publish it. It has only one manual task between the too steps, update the application description and changelog. 

The Google PlayStore release is fully automatized from the testing release to the production release. It use the metadata files hierarchy to update the PlayStore description. 

| ![IsMyServerOnline - Devops release playstore]({{page.img_url}}release.png){:style="width: 800px"} |
| Azure devops IsMyServerOnline release PlayStore |

