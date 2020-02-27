const sidebars = require('./sidebars');

const metadata = {};
Object.keys(sidebars).forEach(key => {
  metadata[key] = sidebars[key];
  metadata[key].forEach(category => {
    delete category['description'];
    (category.items || []).forEach(sub => {
      delete sub['label'];
    });
  });
});
module.exports = metadata;
