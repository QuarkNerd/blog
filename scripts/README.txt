npm install -g uglify-js

uglifyjs scripts/jquery-1.9.1.js scripts/jquery.jscroll-2.2.4.js scripts/tweet.js scripts/disqus-comment-count.js scripts/modernizr.custom.js less/twitter-bootstrap/js/bootstrap-transition.js less/twitter-bootstrap/js/bootstrap-carousel.js --mangle --compress > script.js