# Scott Logic Blogs

## Authoring a blog post

### Getting a local copy to work with
To author a blog post, go to the [Scott Logic Blog Repository](https://github.com/ScottLogic/blog) and click on the Fork button on the right (see https://help.github.com/articles/fork-a-repo for more info on forking)

Github will give you your own copy of the blog repository to work with. Github should redirect you to the page with your own copy of the blog repository (e.g. the page says "John Smith / blog" at the top) - from this page, grab the clone URL from the box on the right of the page. **Make sure this is the clone url for your personal fork of the repo**

Clone the repo by typing the following, replacing the URL with the one you copied:
```
git clone http://github.com/USERNAME/blog.git
```

### Creating a blog post

### Testing
To test that your post works and looks as expected, push your changes to your Github repository, entering your username/password when prompted:
```
git push origin gh-pages
```

After pushing, GitHub will generate the site at https://USERNAME.github.io/blog/ which you can use to view your changes. If this is the first time pushing to your local copy, the GitHub site generation may take up to 10 minutes. Changes made in subsequent pushes should be visible almost immediately.
