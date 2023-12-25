const { exec } = require("child_process");

const executePy = (filepath) => {

  return new Promise((resolve, reject) => {
    exec(
      `python ${filepath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else {
          resolve(stdout);
        }
      }
    );
  }).catch(error => {
    console.error('Promise rejection:', error);
  });
};

// Global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Handle or log the error here
});

module.exports = {
    executePy,
};



