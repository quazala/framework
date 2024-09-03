import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { FileStructureReader } from '../src/file-structure-reader';

describe('FileStructureReader', () => {
  let tempDir;
  let collector;

  beforeAll(() => {
    // Create a temporary directory structure for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'file-paths-collector-'));

    fs.mkdirSync(path.join(tempDir, 'folder1'));
    fs.mkdirSync(path.join(tempDir, 'folder2'));
    fs.writeFileSync(path.join(tempDir, 'file1.txt'), 'content');
    fs.writeFileSync(path.join(tempDir, 'folder1', 'file2.txt'), 'content');
    fs.writeFileSync(path.join(tempDir, 'folder2', 'file3.txt'), 'content');

    collector = new FileStructureReader(tempDir);
  });

  afterAll(() => {
    // Clean up the temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('getAllFilePaths returns all file paths', () => {
    const allPaths = collector.getAllFilePaths();
    expect(allPaths).toHaveLength(3);
    expect(allPaths).toContain(path.join(tempDir, 'file1.txt'));
    expect(allPaths).toContain(path.join(tempDir, 'folder1', 'file2.txt'));
    expect(allPaths).toContain(path.join(tempDir, 'folder2', 'file3.txt'));
  });

  test('filesByFolder returns correct files for each folder', () => {
    expect(collector.filesByFolder(tempDir)).toContain(path.join(tempDir, 'file1.txt'));
    expect(collector.filesByFolder(path.join(tempDir, 'folder1'))).toContain(path.join(tempDir, 'folder1', 'file2.txt'));
    expect(collector.filesByFolder(path.join(tempDir, 'folder2'))).toContain(path.join(tempDir, 'folder2', 'file3.txt'));
  });

  test('getFolders returns all folders containing files', () => {
    const folders = collector.getFolders();
    expect(folders).toHaveLength(3);
    expect(folders).toContain(tempDir);
    expect(folders).toContain(path.join(tempDir, 'folder1'));
    expect(folders).toContain(path.join(tempDir, 'folder2'));
  });

  test('all paths are absolute', () => {
    const allPaths = collector.getAllFilePaths();
    for (const filePath of allPaths) {
      expect(path.isAbsolute(filePath)).toBe(true);
    }
  });
});
