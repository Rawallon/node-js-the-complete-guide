const fs = require('fs');

exports.deleteFile = (filePath) => {
  fs.unlink(filePath.replace(/\\/g, '/'), (err) => {
    if (err) {
      throw err;
    }
  });
};
