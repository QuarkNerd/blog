---
author: cgrant
title: "Using Snapshot and SimulatorStatusMagic to generate iOS screenshots"
featured-overlay-inverted: true
categories:
 - cgrant
tags: 
layout: default_post
---

I have recently been using a set of tools called [fastlane](http://fastlane.tools/), developed by [Felix Krause](http://www.krausefx.com/). [fastlane](http://fastlane.tools/) helps to automate the steps involved in building and deploying iOS applications to the App Store.

One of my favourite [fastlane](http://fastlane.tools/) tools is [snapshot](https://github.com/KrauseFx/snapshot). [snapshot](https://github.com/KrauseFx/snapshot) allows you to automate taking localised screenshots of your iOS app on every device. Without such a tool, taking multiple screenshots in every locale and on every device would take hours, if not days. This is not only very time consuming, but very boring too! I've recently set up [snapshot](https://github.com/KrauseFx/snapshot) so that it creates all of the screenshots required for the application I have been working on. This is great. It took a short while to set up, but once that was done, I am free to work on other things while the screenshots are being generated.  

One issue that I originally came across when setting up [snapshot](https://github.com/KrauseFx/snapshot) was the status bar. Because [snapshot](https://github.com/KrauseFx/snapshot) runs on the simulator, the status bar is not realistic and inconsistent. I wanted to display a perfect, consistent status bar on the screenshots that match Apple's [marketing materials](http://www.apple.com/ios/). This led me to [SimulatorStatusMagic](https://github.com/shinydevelopment/SimulatorStatusMagic). [SimulatorStatusMagic](https://github.com/shinydevelopment/SimulatorStatusMagic) is a tool developed by Shiny Development that modifies the iOS Simulator so that it has a perfect status bar. You can then launch your app and take perfect screenshots every time. The modifications made are designed to match the images you see on the Apple site and are as follows:

- 9:41 AM is displayed for the time.
- The battery is full and shows 100%.
- On iPhone: The carrier text is removed, 5 bars of cellular signal and full WiFi bars are displayed.
- On iPad: The carrier text is set to "iPad" and full WiFi bars are displayed.
