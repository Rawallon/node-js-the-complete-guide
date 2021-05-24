const fs = require('fs');
const path = require('path');

exports.deleteFile = (filePath) => {
  const fullDir = path.join(process.cwd(), filePath.replace(/\\/g, '/'));
  fs.unlink(fullDir, (err) => {
    if (err) {
      throw err;
    }
  });
};
