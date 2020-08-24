---
title: Tournesol
date: 03/07/2018
img_url: /assets/img/projects/tournesol/
icons: [android, angular, azure]
skills: [Android, Angular, .Net, Azure, Kotlin, TypeScript, RxJava, Azure Devops,  Git]
---

The tournesol application allow people to define who brings what to an event.

Why I choose tournesol name? I'm sur you don't care 😈

## Features

- Create/Join/Share an event
- Create new item to bring
- Assign an item to yourseld or to other participant
- Receive notification when the events items were updated
- No registration needed !

## Project organization

- A .NET Core REST API for clients apps.
- An Android app.
- An Angular web app for target all other client.

### Web app client

Build in angular, generated with Angular CLI. Hosted in Microsoft Azure.

{::nomarkdown} {% assign browser-icon = site.data.icons | where_exp: "i", "i.tag == 'browser'" | first %}{:/}

| ![Tournesol Web - Home]({{page.img_url}}web-screenshot1.png){:style="width:600px;"} |
| {::nomarkdown}<svg  role="img" viewBox="0 0 24 24" class="icon big">{{browser-icon.svg}}</svg>{:/} |
| [Access the Tournesol web app.](https://tournesol-webapp.azurewebsites.net/){:target="_blank"} |

### Android

{::nomarkdown} {% assign googleplay-icon = site.data.icons | where_exp: "i", "i.tag == 'googleplay'" | first %}{:/}

| ![Tournesol Mobile - Home]({{page.img_url}}screenshot1.png){:style="width:250px;"} |  | ![Tournesol Mobile - Event bring]({{page.img_url}}screenshot2.png){:style="width:250px;"} |  | ![Tournesol Mobile - Event to bring]({{page.img_url}}screenshot3.png){:style="width:250px;"} |

| {::nomarkdown}<svg  role="img" viewBox="0 0 24 24" class="icon big">{{googleplay-icon.svg}}</svg>{:/} |
| [Download on Google Play](https://play.google.com/store/apps/details?id=fr.me.maoux.tournesol){:target="_blank"} |

### Web API

Build with .Net Core Rest Api. Hosted with Microsoft Azure. 

The server main goal is to synchronize events created and edited on the differents platformes. All modifications ar timestamped, and when a synchronization occurs, the last one is right. 

It also send notification to user if they are concerned (only on Android). Because the app don't have registration, the notification id is used to reconize users.      