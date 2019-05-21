## Scott Logic Blogs

See the confluence page for user instructions: https://scottlogic.atlassian.net/wiki/spaces/INT/pages/219054172/Blog+Publishing

## Run local copy of blog (for blog devs only)

__NOTE__: Instructions are work in progress.

The blog consists of static HTML pages with content generated using Jekyll markdown.

### Linux:

1. sudo apt-get install ruby2.3 ruby2.3-dev build-essential dh-autoreconf
2. sudo gem update
3. sudo gem install jekyll bundler
4. Run 'jekyll -v' to check whether Jekyll is working
5. bundle config path vendor/bundle
6. gem install bundler
7. sudo apt-get install libxslt-dev libxml2-dev zlib1g-dev
8. sudo gem install nokogiri
9. bundle install
10. bundle exec jekyll serve
11. Uncomment the lines in \_config.yml
12. Access on http://localhost:4000

To minify JS, run:
```
npm run scripts
```


To minify SCSS, run:
```
npm run style
```
