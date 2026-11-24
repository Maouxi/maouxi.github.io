---
title: Tournesol
date: 05/01/2024
img_url: /assets/img/projects/tournesol/
icons: [flutter, firebase]
skills: [Flutter, Firebase, Dart, TypeScript, Azure Devops, Git]
display: true
---

Never forget anything at an event again

A picnic, a birthday, a ski weekend: Tournesol lets you share the list of things to bring with every participant. Everyone says what they bring, no duplicates, nothing missing.

|                                                  |                                                  |                                                                |                                                    |
| :----------------------------------------------: | :----------------------------------------------: | :------------------------------------------------------------: | :------------------------------------------------: |
| ![Tournesol - Events]({{page.img_url}}home.webp) | ![Tournesol - Event]({{page.img_url}}event.webp) | ![Tournesol - Who brings what]({{page.img_url}}eventitem.webp) | ![Tournesol - Recipe]({{page.img_url}}recipe.webp) |

{::nomarkdown}
{% assign googleplay-icon = site.data.icons | where_exp: "i", "i.tag == 'googleplay'" | first %}
{% assign appstore-icon = site.data.icons | where_exp: "i", "i.tag == 'appstore'" | first %}
{% assign web-icon = site.data.icons | where_exp: "i", "i.tag == 'web'" | first %}
{:/}

|     {::nomarkdown}<svg  role="img" viewBox="0 0 24 24" class="icon big">{{googleplay-icon.svg}}</svg>{:/}      | {::nomarkdown}<svg role="img" viewBox="0 0 24 24" class="icon big">{{appstore-icon.svg}}</svg>{:/} | {::nomarkdown}<svg role="img" viewBox="0 0 24 24" class="icon big">{{web-icon.svg}}</svg>{:/} |
| :------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------: |
| [Download on Google Play](https://play.google.com/store/apps/details?id=com.maoux.tournesol){:target="_blank"} | [Download on AppStore](https://apps.apple.com/us/app/my-tournesol/id6475875443){:target="_blank"}  |                  [Web app](https://tournesol-app.web.app/){:target="_blank"}                  |

## Who brings what

- Create an event and share it with the participants.
- Each participant says what they bring, with the quantity.
- A progress bar shows what is already covered and what is still missing.
- Assign an item to someone else when you organize for the group.

## Meals and ingredients

- Recipes are sets of ingredients you add to an event, like "Raclette for 4".
- Quantities adjust to the number of participants.
- Templates let you reuse a whole event, like your yearly ski weekend.

## For everyone, everywhere

- iOS, Android and a web app: participants don't even need to install anything.
- Invited to an event? Continue without an account to see who brings what.
- Create an account to keep your events and recipes on all your devices.
- Notifications when the event list changes.

## Free to start

- Free: everything you need to get started.
- Premium, monthly, annual or lifetime: unlimited events, templates, recipes and participants, and quantities adjusted by participant count.

## Under the hood

- **App**: Flutter (iOS, Android and web) in a Dart + Melos workspace.
- **Backend**: Firebase (Auth, Firestore, Cloud Functions in TypeScript, Hosting).
- **Purchases**: RevenueCat, with a webhook as the source of truth for Premium.

Tournesol started in 2018 as an Android app, an Angular web app and a .NET Core API hosted on Azure, before being rebuilt in Flutter and Firebase.

## Question or support request

[Contact the support](mailto:tournesol-app@outlook.com)

## Legal

[Privacy policy](/projects/tournesol/tournesol-privacy)

[Terms & conditions](/projects/tournesol/tournesol-terms)
