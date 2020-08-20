---
title: Amazon AppStore Extensions for Azure Devops
date: 16/08/2020
img_url: /assets/img/projects/amazondevopsextensions/
icons: [azuredevops]
skills: [TypeScript, Azure Devops, GiHub]
---

Tasks for Amazon AppStore submission api and make continuous delivery on Azure DevOps Services pipeline build or release.

[Access my VisualStudio marketplace](https://marketplace.visualstudio.com/publishers/MaxenceRaoux)

## Tasks

- __PrepareTask__: Authentication to the api and create or get the current update
- __EditTask__: Edit an update description
- __ReplaceApkTask__: Replace an apk into the current update
- __CommitTask__: Commit the update to the Amazon AppStore

## Screenshot

| ![Replace Task]({{page.img_url}}screenshot.png){:style="width:600px;"} |
| Azure Devops view of the Replace Apk Task |

## Devops

Projet source code and wiki are hosted on GitHub: [amazon-store-api-azure-devops-pipeline-extensions](https://github.com/Maouxi/amazon-store-api-azure-devops-pipeline-extensions)

Project boards and pipeline are hosted on Azure Devops: [AmazonDevOpsExtensions](https://dev.azure.com/maxenceraoux/AmazonDevOpsExtensions)