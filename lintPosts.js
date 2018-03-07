const globby = require("globby");
const matter = require("gray-matter");
const yaml = require("js-yaml");
const fs = require("fs");

const flatMap = (arr, mapFunc) =>
  arr.reduce((prev, x) => prev.concat(mapFunc(x)), []);

const categoriesYaml = yaml.safeLoad(
  fs.readFileSync("_data/categories.yml", "utf8")
);

const categories = flatMap(
  // remove 'Latest Articles' which is a pseudoe-category
  categoriesYaml.filter(c => c.url.startsWith("/category/")),
  // merge category title into sub-categories
  c => [c.title].concat(c.subcategories ? c.subcategories : [])
).map(c => c.toLowerCase());

let fail = false;

// lint each blog post
globby(["*/_posts/**/*.{md,html}"]).then(paths => {
  paths.forEach(path => {
    try {
      const blogPost = fs.readFileSync(path, "utf8");
      const frontMatter = matter(blogPost);

      if (!frontMatter.data.categories || frontMatter.data.categories.length !== 1) {
        console.error("The post " + path + " does not have one category");
        fail = true;
        return;
      }

      const category = frontMatter.data.categories[0].toLowerCase();
      if (!categories.includes(category)) {
        console.error(
          "The post " + path + " does not have a recognised category"
        );
        fail = true;
      }
    } catch (e) {
      console.error(path, e);
    }
  });

  if (fail) {
    process.exit(1);
  } else {
    console.log(paths.length + " files passed the linting check");
  }
});
