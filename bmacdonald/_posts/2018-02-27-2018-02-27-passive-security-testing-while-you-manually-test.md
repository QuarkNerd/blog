---
published: true
author: bmacdonald
layout: default_post
title: 2018-02-27-passive-security-testing-while-you-manually-test
tags: security testing zap
categories:
  - testing
summary: Passive Security Testing of websites while you manually test them
image: ''
---
## Automatic website Security Testing while you manually test

As a Software Tester, I spend a lot of time running manual tests on websites. I recently discovered a really simple way to include Security Testing into your Manual Testing workflow  - the bonus is that it requires very little setup, no prior knowledge of security testing, and happens passively in the background while you are performing your manual tests.

### Tools required
- Owasp Zap - [https://github.com/zaproxy/zaproxy/wiki/Downloads](https://github.com/zaproxy/zaproxy/wiki/Downloads)
- Owasp Juice Shop - [https://github.com/bkimminich/juice-shop](https://github.com/bkimminich/juice-shop)

**Owasp Zap** is an open source Security Testing tool. This tool is used by experienced Penetration Testers and is packed with a range of useful tools. For this blog post, we’re going to use the simple, yet extremely useful, [Passive Scanner](https://github.com/zaproxy/zap-core-help/wiki/HelpStartConceptsPscan). We will configure Zap to act as a proxy between your browser and the server which will allow Zap to  scan all HTTP request and response messages.

**Owasp Juice Shop** is your own private, intentionally insecure web application which makes it great for practicing Security Testing on without getting into trouble. This is an optional requirement - if you already have a local website running on your machine that you want to test on, then use that instead.

### Preparation
1. Install Zap (requires Java).
2. Configure your browser to use Zap as a proxy.
3. Install the Zap root CA certificate into your browser's list of trusted root certificates.

### Workflow
1. Open Zap - this will launch the proxy server and passive scanner.
2. Open your browser.
3. Navigate to the website you want to test.
4. Start the manual execution of your tests.
5. Stop the manual execution of your tests.
6. Go to Zap and look in the _Alerts_ tab.

### Results
The _Alerts_ tab will display all of the issues that the passive scanner detected while you were running your manual tests. 
![alerts]({{site.baseurl}}/bmacdonald/assets/Alert.jpg)
The alerts will be displayed in a tree structure grouped by Alert Type, and will show the number found along with the URL they occurred on. You can click on these to get advice from Zap on how to address them, and then discuss your findings within your team.

### Extend
There is a lot more you can do with this approach: 
- run your automated UI tests with the passive scanner on
- mobile application testing by proxying a device through your machine and Zap
- and many more. 

You can also explore the many options within Zap which we will do in future posts. 
