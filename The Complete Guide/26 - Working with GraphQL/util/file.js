const path = require('path');
const fs = require('fs');

const clearImage = (filePath) => {
  if (!filePath) return;
  filePath = path.join(__dirname, '..', filePath.replace('\\', '/'));
  fs.unlink(filePath, (err) => console.error(err));
};

exports.clearImage = clearImage;
