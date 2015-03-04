## Scott Logic Blogs

### Getting a local copy to work with
To author a blog post, go to the [Scott Logic Blog Repository](https://github.com/ScottLogic/blog) and click on the Fork button on the right (see [GitHub's help](https://help.github.com/articles/fork-a-repo) for more info on forking). N.B. this will trigger an email to the address associated with your GitHub account warning you about the CNAME being taken, just ignore it.

GitHub will give you your own copy of the blog repository to work with. GitHub should redirect you to the page with your own copy of the blog repository (e.g. the page says "John Smith / blog" at the top) - from this page, grab the clone URL from the box on the right of the page. 

**Make sure this is the clone url for your personal fork of the repo.**

Clone the repo by typing the following, replacing the URL with the one you copied:
```
git clone URL_FROM_ABOVE
```

### Creating a blog post

**If this if your first post please see [first post setup](https://github.com/scottlogic/blog#first-post-setup).**

Blog posts can be written in either HTML or markdown. Markdown is processed via Kramdown, with the the details of the (very simple) formatting found on [Kramdown website](http://kramdown.gettalong.org/index.html)

The post meta-data should be located at the top of each as follows:
```
---  
post meta-data  
---  
post contents, markdown/html  
```

##### Mandatory post meta-data
* **author** - This should be your author name, which will be your Scott Logic 'name', i.e. first-letter-of-forename and surname. This should match the author meta-data in ```_config.yml```.  
* **title** - The title of the blog post (quotes are not required).
* **layout** - This informs Jekyll of the page template to use for this file. If you don't know which layout to use, you should use ```default_post```.

##### Optional post meta-data
* **summary** - The index pages for the blog and author pages includes summaries of each blog post. You can use summary to provide a **summary** for your blog post, otherwise the first 50 words of the post itself are used. When writing your own summaries, please try to make them roughly 50 words in length.
* **tags** - An array of keywords that describe the blog post contents. Currently we do not have tag-clouds or any of that fluff, so there is no need to tag your posts. The only tag we actively use at the moment is 'featured', which indicates that an article should be included in the front-page carousel.
* **image** - The image used for this article if present in the carousel.
* **title-short** - An optional abbreviated title for articles that appear in the featured carousel.
* **summary-short** - An optional abbreviated summary for articles that appear in the featured carousel. This summary text is only displayed in 'large' carousel tiles.

### First post setup
Before your first post you will need to:  
* Create an author folder with the following file structure:
```
username  
|   atom.xml  
|   feed.xml  
|   index.html  
+---assets  
|   |   // Put images for posts here  
|   +---featured  
|          // Put images for featured articles here  
+---_posts
        // Put blog posts here
```
* ```index.html``` is your author page.  
* ```atom.xml``` takes the form:  
```
---  
author: username  
layout: atom_feed  
---  
```
* ```feed.xml``` takes the form:  
```
---  
author: username  
layout: rss_feed  
---  
```

* Edit the ```/_data/authors.yml``` file and add your username to ```active-authors``` and your details to ```authors```.  

### Testing
To test that your post works and looks as expected, push your changes to your GitHub repository, entering your username/password when prompted:
```
git push origin gh-pages
```
n.b. If you use 2-factor authentication, make sure you generate an application token to use instead of your password. https://help.github.com/articles/creating-an-access-token-for-command-line-use/

After pushing, GitHub will generate the site at https://USERNAME.github.io/blog/ which you can use to view your changes. If this is the first time pushing the blog repo, GitHub may take up to 10 minutes to generate the site. Changes made in subsequent pushes should be visible almost immediately.  

### Deploying to the Scott Logic website
To get your blog posts on the Scott Logic website, go to your personal GitHub fork of the repository (likely at https://github.com/USERNAME/blog) and click 'Pull Requests' on the right hand side, and then 'Create pull request'. This will create a request to pull your changes into the original blog repository, and automatically notify the blog team. Once they hit the OK button, it'll be pulled in and deployed to http://www.scottlogic.com/blog/.

### Featured Articles
Featured articles are selected at the discretion of Colin Eberhardt (bribes accepted). The general idea is to feature popular articles from the past ~6 months, or articles that we think are particularly interesting, important, or are from people who have just started contributing.  

### Comments and notifications
When you have posted your first blog post there are a few of other things you should consider doing:  

* Join the ```bloggers``` email distribution list. Raise an IT ticket to have yourself added to this list.  
* Sign up for Disqus so that you can interact with people who comment on your blog posts. Once you have created an account you need to be added to the ```Scott Logic Ltd``` site. Raise an IT ticket for this. Once you are added to the Scott Logic site you might want to change your notification settings so that you receive an email whenever someone comments on the site. 
* You might also want to receive email notifications whenever content or live build succeed or fail. Guess what? You'll need to raise an IT ticket for that!  
