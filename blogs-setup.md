User
====

Create a new normal user account called "blogbuild", set a good password, untick "user must change password at next logon" and ticket "password never expires".

Temporarily add it to the local admin group.  Log in to the server as that user.

Ruby
====

Download and run the Ruby 1.9.3 p545 installer from http://rubyinstaller.org/downloads, and tick the "Add Ruby executables to your PATH" box.

Ruby DevKit
===========

Download and run the Ruby DevKit installer from https://github.com/downloads/oneclick/rubyinstaller/DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe

Unpack to C:\Ruby-Devkit\.

Open a command prompt, navigate to C:\Ruby-Devkit\, run:

> ruby dk.rb init
> ruby dk.rb install".

Bundler
=======

Install the bundler gem by running "gem install bundler"

Git
===

Download and run the windows git installer from http://git-scm.com/.  Add the path to the git bin folder to the user PATH variable.

Set up Blogs Repository
=======================

Create directories for the blog build and clone the repo:

> mkdir C:\blog\blogbuild  
> mkdir C:\blog\blogbuild\log  
> git clone https://github.com/ScottLogic/blog.git C:\blog\blogbuild\blog 

Create an empty textfile named current.txt:
> touch C:\blog\blogbuild\current.txt

Install the git submodules:

> cd C:\blog\blogbuild\blog  
> git submodule init  
> git submodule update  

Install and update gem dependencies:

> bundle install  
> bundle update  

Modify the blogdeploy.bat file and correct the path on lines 4, 5 and 6 (do not include a trailing slash):

> set blogBuildDir=C:\blog\blogbuild  
> set backupDir=C:\inetpub\wwwroot-scottweb-blog\backups  
> set currentlyDeployed=C:\inetpub\wwwroot-scottweb-blog\current  

Git credentials.  

In order to be able to fetch from the repo, git needs to store username/pass info. 
A user on the scottlogic github has been created already. From inside the blog directory, enter the following
> git config credential.helper wincred  

Now attempt to reach the repo (e.g. run git fetch --dry-run) and enter the username/password when prompted.
If done correctly, the username/pass will be stored and reused for all subsequent requests.

Create scheduled task
=====================

Open Task Scheduler and select "Create Task"

Call it "blogbuild", select "Run whether user is logged on or not", run as "SERVER\blogbuild".

Under "Triggers" select "on a schedule", "one time", "repeat task every:" "6 minutes", "for a duation of "Indefinitely".

Under "Actions" select "new" and enter "C:\blog\blogbuild\blog\blogdeploy.bat".

Configure IIS
=============

Create the folders:

> C:\inetpub\wwwroot-scottweb-blog\  
> C:\inetpub\wwwroot-scottweb-blog\current  
> C:\inetpub\wwwroot-scottweb-blog\current  

In IIS Manager create a virtual directory under the scottweb site pointing "/blog" to "C:\inetpub\wwwroot-scottweb-blog\current".

