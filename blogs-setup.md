Setup
=====

To set up the publication of the Scott Logic blogs follow these instructions on a Windows web server.

User
====

Create a new normal user account called "blogbuild", set a good password, untick "user must change password at next logon" and tick "password never expires".

Temporarily add it to the local admin group.  Log in to the server as that user.

Ruby
====

Download and run the Ruby 1.9.3 p545 installer from http://rubyinstaller.org/downloads, and tick the "Add Ruby executables to your PATH" box.

Ruby DevKit
===========

Download and run the Ruby DevKit installer from https://github.com/downloads/oneclick/rubyinstaller/DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe.

Unpack to C:\Ruby-Devkit\.

Open a command prompt, navigate to C:\Ruby-Devkit\, run:

> ruby dk.rb init
> ruby dk.rb install

Bundler
=======

Install the bundler gem by running "gem install bundler"

Git
===

Download and run the windows git installer from http://git-scm.com/.  Add the path to the git bin folder to the user PATH variable.

Python
======
Install Python 2.7.2 from https://www.python.org/download/releases/2.7.2/ and ensure it is on the PATH.

Set up Blogs Repository
=======================

Create directories for the blog build and clone the repo, providing the "scottlogic-blog" username and password when prompted:

> mkdir C:\blog\
> mkdir C:\blog\backup
> mkdir C:\blog\current
> mkdir C:\blog\build
> mkdir C:\blog\log
> git clone https://github.com/ScottLogic/blog.git C:\blog\build

Create an empty textfile named current.txt:

> touch C:\blog\log\current.txt

Install the git submodules:

> cd C:\blog\build
> git submodule init
> git submodule update

Install and update gem dependencies:

> bundle install
> bundle update

Copy the file "C:\blog\build\blogdeploy.bat" file to C:\blog\ and check the path on line 4:

> set blogBuildDir=C:\blog

Git Credentials
===============

In order to be able to fetch from the repo, git needs to store username/pass info. 
A user on the scottlogic github has been created already. From inside the blog directory, enter the following

> git config credential.helper wincred

Now attempt to reach the repo (e.g. run git fetch --dry-run) and enter the username/password when prompted.  If done correctly, the username/pass will be stored and reused for all subsequent requests.

Create scheduled task
=====================

Open Task Scheduler and select "Create Task"

Call it "blogbuild", select "Run whether user is logged on or not", run as "SERVER\blogbuild".

Under "Triggers" select "on a schedule", "one time", "repeat task every:" "6 minutes", "for a duation of "Indefinitely".

Under "Actions" select "new" and enter "C:\blog\blogdeploy.bat".

Trigger a build
===============

The blogdeploy.bat script only builds if there are changes in git.  For the initial build bypass that restriction by commenting out line43 and lines 53-56, then manually trigger the scheduled task.

Configure IIS
=============

In IIS Manager create a virtual directory under the scottweb site pointing "/blog" to "C:\blog\current".

