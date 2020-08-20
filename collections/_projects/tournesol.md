---
title: Tournesol
date: 19/08/2020
img_url: /assets/img/projects/tournesol/
icons: [android, angular, azure]
skills: [Android, Angular, .Net, Azure, Kotlin, TypeScript, RxJava, Azure Devops,  Git]
---

The tournesol application allow people to define who brings what to an event.
Why I choose tournesol name? I'm sur you don't care 😈

## Project organisation

A .NET Core REST API for clients apps on the Tournesol.API repo.
An Android app on the Tournesol.Android repo.
An Angular web app for target all other client on the Tournesol.Web repo.

## Front

[Tournesol web app](https://tournesol-webapp.azurewebsites.net/)

## Android

{::nomarkdown} {% assign googleplay-icon = site.data.icons | where_exp: "i", "i.tag == 'googleplay'" | first %}{:/}

| ![Tournesol - Home]({{page.img_url}}screenshot1.png) | ![Tournesol - Event bring]({{page.img_url}}screenshot2.png) | ![Tournesol - Event to bring]({{page.img_url}}screenshot3.png) |

| {::nomarkdown}<svg  role="img" viewBox="0 0 24 24" class="icon big">{{googleplay-icon.svg}}</svg>{:/} |
| [Download on Google Play](https://play.google.com/store/apps/details?id=com.maoux.tournesol){:target="_blank"} |


## Backend

Host in azure develop with .Net core web api