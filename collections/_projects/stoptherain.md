---
title: StopTheRain
date: 06/11/2026
img_url: /assets/img/projects/stoptherain/
icons: [flutter, firebase]
skills: [Flutter, Firebase, Dart, TypeScript, Git]
display: true
---
An app that stops the rain. Seriously.

One button: **STOP THE RAIN**. Press it, and the app "intervenes" with an answer that really depends on the current weather and the short-term forecast.

> 🚧 **Work in progress**: StopTheRain is being rebuilt from scratch for iOS and Android. The first version (2019) was a Flutter experiment and has been unpublished.

## The concept

- **It takes itself seriously.** No wink, no joke on the surface: the app _really_ stops the rain. The humour comes from the gap.
- **The secret: it's actually useful.** Every delay comes from the real forecast. When the app says "12 minutes", the rain really stops in about 12 minutes.
- **Emergency stop look.** A red mushroom button on a yellow base with hazard stripes, an industrial control panel on a dark background, and answers printed on an intervention ticket with a status stamp.

## Features

- **Real weather answers**: rain stopping soon, heavy rain, storm, snow, fog, heatwave, wind, next rain in 3 days… each one with its own lines, in French and English.
- **Intervention sequence**: a short mono-font "processing" sequence, video game sounds and haptics, then the answer streamed like an AI reply.
- **Characters**: Weather Customer Service, the on-call technician, the Office of Inclement Weather clerk, the mage of the clouds, Granny, the pirate captain… each with their own voice and secret lines.
- **A career in the weather service**: ranks from Intern to Director, a stamp book with bronze, silver and gold levels, weekly mission orders and daily rounds.
- **Rains stopped counter**: it goes up live when a rain you pressed for actually ends.
- **Share card** to show off your intervention.
- **No ads, every answer is free.** A one-time "Fair Weather Contract" removes the wait between two interventions, unlocks all characters and sends a "Mission accomplished" notification when the rain stops. You can also buy the technician a coffee ☕.

## Under the hood

- **App**: Flutter (iOS + Android), clean architecture in a Dart + Melos workspace.
- **Backend**: Firebase (Auth, Firestore, Cloud Functions in TypeScript, Hosting), hosted in the EU.
- **Weather**: OpenWeather One Call 3.0 (minute-by-minute forecast), called by the server only, with a cache per ~5 km cell and daily caps to keep the cost close to zero.
- **Phrase engine on the server**: weather classification, phrase picking and progression run in Cloud Functions, and the phrases are edited in a backoffice without releasing a new app version.
- **Accounts**: automatic anonymous sign-in, optional Sign in with Apple / Google to keep your progression.
- **Purchases**: RevenueCat, with a webhook as the source of truth for Premium.

## The 2019 version

The original StopTheRain was a one-button app made to try the Flutter framework: adjust how sensitive you are to the rain, then get a prediction of when it stops (or how long it stays sunny), with one prediction credit per hour.

|                                                                               |                                                                                     |                                                                               |
| ----------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: | :---------------------------------------------------------------------------- |
| ![StopTheRain - Home]({{page.img_url}}screenshot1.png){:style="width:220px;"} | ![StopTheRain - Prediction]({{page.img_url}}screenshot3.png){:style="width:275px;"} | ![StopTheRain - Menu]({{page.img_url}}screenshot2.png){:style="width:220px;"} |

Legal documents of the 2019 version:

[Privacy policy](/projects/stoptherain/stoptherain-privacy)

[Terms & conditions](/projects/stoptherain/stoptherain-terms)
