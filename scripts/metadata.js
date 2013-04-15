var yaml = require('js-yaml');
var fs = require('fs'), path = require('path');


var posts = enumerateDirectory('../_posts').map(parse).filter(function(post) { return post.header.layout; });

posts.forEach(function (post) {
    if (post.header.layout) {
        post.header.layout = 'default_post'
    }
})
posts.forEach(dump);

function enumerateDirectory(directory) {
    return fs.readdirSync(directory)
        .map(function (filename) {
            return path.join(directory, filename);
        });
}

function parse(path) {
    var content = fs.readFileSync(path, 'utf8');
    var lines = content.split('\n');
    for (var i = 1; i < lines.length; i++) {
        if (lines[i].trim() == '---') {
            break;
        }
    }
    var header = lines.slice(0, i).join('\n'),
        body = lines.slice(i).join('\n');
    return {
        path: path,
        content: body,
        header: yaml.load(header)
    }
}

function dump(post) {
    fs.writeFileSync(post.path, '---\n' + yaml.dump(post.header) + post.content);
}
