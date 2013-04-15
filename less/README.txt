During development, flip the debug flag in the _config.yml file and the less will be automagically regenerated.

To deploy -

install Node.js
npm install -g less
lessc --yui-compress less/main.less > style.css