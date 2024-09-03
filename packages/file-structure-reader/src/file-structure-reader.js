import fs from 'node:fs';
import path from 'node:path';

/**
 * A class to collect and manage file paths within a directory.
 */
export class FileStructureReader {
  /**
   * Create a FileStructureReader. ***
   * @param {string} rootDir - The root directory to start collecting file paths from.
   */
  constructor(rootDir) {
    this.rootDir = path.resolve(rootDir);
    this.filePaths = [];
    this.filesByFolderMap = new Map();
    this.collectFilePaths(this.rootDir);
  }

  /**
   * Recursively collect file paths from the given directory.
   * @param {string} dir - The directory to collect file paths from.
   * @private
   */
  collectFilePaths(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.collectFilePaths(filePath);
      } else {
        const absolutePath = path.resolve(filePath);
        this.filePaths.push(absolutePath);

        const folderPath = path.dirname(absolutePath);
        if (!this.filesByFolderMap.has(folderPath)) {
          this.filesByFolderMap.set(folderPath, []);
        }
        this.filesByFolderMap.get(folderPath).push(absolutePath);
      }
    }
  }

  /**
   * Get all collected file paths.
   * @returns {string[]} An array of absolute file paths.
   */
  getAllFilePaths() {
    return this.filePaths;
  }

  /**
   * Get all files in a specific folder.
   * @param {string} folderPath - The folder path to get files from.
   * @returns {string[]} An array of absolute file paths in the specified folder.
   */
  filesByFolder(folderPath) {
    const absoluteFolderPath = path.resolve(folderPath);
    return this.filesByFolderMap.get(absoluteFolderPath) || [];
  }

  /**
   * Get all folders that contain files.
   * @returns {string[]} An array of absolute folder paths.
   */
  getFolders() {
    return Array.from(this.filesByFolderMap.keys());
  }
}
