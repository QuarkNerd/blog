var yaml = require('js-yaml');
var fs = require('fs'), path = require('path');


var posts = enumerateDirectory('../_posts').map(parse).filter(function(post) { return post.header; });

posts.forEach(function (post) {
    if (post.header && post.header.categories) {
        post.header.categories.forEach(function (c) {
            if (!post.header.tags) {
                post.header.tags = [];
            }
            post.header.tags.push(c);
        });
        var author = post.header.author.toLowerCase().split(' ');
        post.header.author = author[0][0] + author[1];
        post.header.categories = [post.header.author]
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
