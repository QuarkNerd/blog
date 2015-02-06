Make sure you initialise the less/twitter-bootstrap submodule.

git submodule init
git submodule update

During development, flip the debug flag in the _config.yml file and the less will be automagically regenerated.

To deploy -

install Node.js
npm install -g less@1.3.3
lessc --yui-compress less/main.less > style.css
