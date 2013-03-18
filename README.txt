# Scott Logic Blogs

## How to build

### Local

You have various options for running a local copy of the blog.  In order from simplest to most convoluted:

#### Really simple

Get a copy of the code from SCM (either yourself or by asking the IT Admins) and put it somewhere on your H drive.  Ask the IT Admins to set up a Jekyll cronjob for you.  They will do this then show you where to look to see the output web pages.

#### Linux-y

From git bash -
* `ssh dev`
* `cd ~/public_html/`
** If you don't have a public_html folder, create one and give it global read and execute (traverse permissions) `mkdir ~/public_html; chmod a=rx ~/public_html`
* `git clone ssh://git.scottlogic.co.uk/scottlogic-website-blogs.git`
* `cd scottlogic-website-blogs`
* Edit _config.yml, change the following line `url: /Blog/` to `url: http://dev.scottlogic.co.uk/~USERNAME/scottlogic-website-blogs/_site-safe`.
* `jekyll`
** This takes a little while, when authoring you may find it more productive to just re-generate the latest post by using the `--limit_posts=1` command line switch.
* Visit http://dev.scottlogic.co.uk/~USERNAME/scottlogic-website-blogs/_site-safe in your browser.

#### Semi-Linux-y

As above, but check the code out to your Windows machine, install jekyll on Windows, run jekyll specifying H:\public_html\blog\ as the output folder.  As before content will be visible at http://dev.scottlogic.co.uk/~USERNAME/blog/.

#### Windows-y

As above but set up IIS locally and specify a local folder as the output folder.

### Dev

The dev instance of the website, at http://www.dev.scottlogic.co.uk/ has the blog system configured to build automatically from SCM.  Every five minutes the system will pull from git (master) and rebuild the blog content, serving it up from http://www.dev.scottlogic.co.uk/blog/.
