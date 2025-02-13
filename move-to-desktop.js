const fs = require("fs");
const path = require("path");
const os = require("os");

// Get Desktop Path
const desktopPath = path.join(os.homedir(), "Desktop");

// Define source and destination
const distFolder = path.join(__dirname, "dist");
const files = fs.readdirSync(distFolder);
const exeFile = files.find(file => file.endsWith(".exe"));

if (exeFile) {
  const sourcePath = path.join(distFolder, exeFile);
  const destinationPath = path.join(desktopPath, exeFile);

  // Move file to Desktop
  fs.rename(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error("❌ Failed to move .exe to Desktop:", err);
    } else {
      console.log("✅ .exe file successfully moved to Desktop:", destinationPath);
    }
  });
} else {
  console.log("⚠️ No .exe file found in dist/ folder.");
}
