# Scott Logic Blogs

## How to build

### Local

You have various options for running a local copy of the blog.  In order from simplest to most convoluted:

#### Really simple

Get a copy of the code from SCM (either yourself or by asking the IT Admins) and put it somewhere on your H drive.  Ask the IT Admins to set up a Jekyll cronjob for you.  They will do this then show you where to look to see the output web pages.

#### Linux-y

SSH to dev.scottlogic.co.uk and check out a copy of the code, to somewhere like ~/dev/scottlogic-website-blogs.  Do writing things.  Run "jekyll".  This will build the code to ~/public_html/blog/.  That will then be visible at http://dev.scottlogic.co.uk/~USERNAME/blog/.  If you want the code to be output to a different folder then specify it as the first command line argument to jekyll (or RTFM).

#### Semi-Linux-y

As above, but check the code out to your Windows machine, install jekyll on Windows, run jekyll specifying H:\public_html\blog\ as the output folder.  As before content will be visible at http://dev.scottlogic.co.uk/~USERNAME/blog/.

#### Windows-y

As above but set up IIS locally and specify a local folder as the output folder.

### Dev

The dev instance of the website, at http://www.dev.scottlogic.co.uk/ has the blog system configured to build automatically from SCM.  Every five minutes the system will pull from git (master) and rebuild the blog content, serving it up from http://www.dev.scottlogic.co.uk/blog/.