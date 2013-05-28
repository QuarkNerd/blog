npm install -g uglify-js

uglifyjs scripts/jquery-1.9.1.js scripts/tweet.js scripts/disqus-comment-count.js less/twitter-bootstrap/js/bootstrap-transition.js less/twitter-bootstrap/js/bootstrap-carousel.js --mangle --compress > script.js