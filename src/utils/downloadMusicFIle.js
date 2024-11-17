const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

async function downloadYouTubeAudio(videoUrl) {
  try {
    const ytDlpPath = path.resolve(__dirname, "../../", "./yt-dlp.exe"); // Ensure the path is correct
    const getTitleCommand = `"${ytDlpPath}" --get-title "${videoUrl}"`;

    console.log("yt-dlp path:", ytDlpPath);
    console.log("Command to get title:", getTitleCommand);

    // Return a Promise for the execution of the command
    return new Promise((resolve, reject) => {
      exec(getTitleCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return reject(error); // Reject if there's an error
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return reject(new Error(stderr)); // Reject on stderr
        }

        const videoTitle = stdout.trim().replace(/[^a-zA-Z0-9]/g, "_");
        const outputFileName = `../../audio/${videoTitle}.mp3`;
        const outputPath = path.resolve(__dirname, outputFileName);

        // Ensure the output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
          console.log(`Created directory: ${outputDir}`);
        }

        console.log("Starting download...");
        const command = `"${ytDlpPath}" -x --audio-format mp3 -o "${outputPath}" "${videoUrl}"`;

        // Execute the command to download audio
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return reject(error); // Reject on error
          }
          if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return reject(new Error(stderr)); // Reject on stderr
          }

          console.log(
            `Audio downloaded successfully. File saved at: ${outputPath}`
          );
          resolve(outputPath); // Resolve with the path to the saved audio
        });
      });
    });
  } catch (e) {
    console.error("Error in downloadYouTubeAudio:", e);
  }
}

module.exports = downloadYouTubeAudio;
