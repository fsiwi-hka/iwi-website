import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const baseDir = path.join(
    process.cwd(),
    "public/assets/downloads/sitzungsprotokolle"
  );

  try {
    const folders = fs
      .readdirSync(baseDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .sort((a, b) => b.name.localeCompare(a.name)); // descending by folder names

    const result = folders.flatMap((folder) => {
      const folderPath = path.join(baseDir, folder.name);
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.toLowerCase().endsWith(".pdf"))
        .sort((a, b) => a.localeCompare(b));

      if (files.length === 0) return [];

      const folderName = folder.name;
      const folderDisplayName = folderName
        .replace(/^\d+_/, "")   // remove number and underscore
        .replace(/_/g, " ")     // underscores → spaces
        .replace(/-/g, "/");    // hyphens → Slash

      return [
        {
          Ordnername: folderName,
          folderDisplayName,
          Inhalt: files,
        },
      ];
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error reading the folder structure:", error);
    res
      .status(500)
      .json({ error: "Error reading the downloads folder structure" });
  }
}
