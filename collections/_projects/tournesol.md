---
title: Tournesol
date: 20/08/2020
img_url: /assets/img/projects/tournesol/
icons: [android, angular, azure]
skills: [Android, Angular, .Net, Azure, Kotlin, TypeScript, RxJava, Azure Devops,  Git]
---

The tournesol application allow people to define who brings what to an event.

Why I choose tournesol name? I'm sur you don't care 😈

## Project organization

- A .NET Core REST API for clients apps.
- An Android app.
- An Angular web app for target all other client.

### Web app client

Build in angular, generated with Angular CLI. Hosted in Microsoft Azure.

| ![Tournesol Web - Home]({{page.img_url}}web-screenshot1.png){:style="width:600px;"} |
| [Access the Tournesol web app.](https://tournesol-webapp.azurewebsites.net/){:target="_blank"} |

### Android

{::nomarkdown} {% assign googleplay-icon = site.data.icons | where_exp: "i", "i.tag == 'googleplay'" | first %}{:/}

| ![Tournesol Mobile - Home]({{page.img_url}}screenshot1.png){:style="width:250px;"} |  | ![Tournesol Mobile - Event bring]({{page.img_url}}screenshot2.png){:style="width:250px;"} |  | ![Tournesol Mobile - Event to bring]({{page.img_url}}screenshot3.png){:style="width:250px;"} |

| {::nomarkdown}<svg  role="img" viewBox="0 0 24 24" class="icon big">{{googleplay-icon.svg}}</svg>{:/} |
| [Download on Google Play](https://play.google.com/store/apps/details?id=com.maoux.tournesol){:target="_blank"} |

### Web API

Build with .Net Core Rest Api. Hosted with Microsoft Azure. 