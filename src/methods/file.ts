import path from 'path';
import fs from 'fs-extra';
import pretty from 'json-stringify-pretty-compact';

/**
 * getRealPath
 * gets project real path
 *
 * @returns {string}
 */
export function getRealPath (): string {
  return fs.realpathSync(process.cwd());
}

/**
 * rimraf
 * clear directory
 * baseDir 포함 모든 하위 파일 삭제 (rm -rf)
 *
 * @param baseDir {string} 삭제 할 기본 디렉토리 경로
 */
export function rimraf (baseDir: string): void {
  fs.removeSync(baseDir);
}

/**
 * emptyDir
 * clear files inside of the directory
 * baseDir 내 모든 하위 파일이나 파일 삭제되며 베이스 디렉토리는 재생성됨
 *
 * @param baseDir {string} 삭제 할 베이스 디렉토리 경로
 */
export function emptyDir (baseDir: string): void {
  fs.emptyDirSync(baseDir);
}

/**
 * mkdirs
 * make a directory
 *
 * @param dirName {string} 생성 할 디렉토리명
 */
export function mkdirs (dirName: string): void {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
}

/**
 * move
 * moves file or directory
 *
 * @param srcPath {string} 이동 할 원본 파일명 혹은 디렉토리명
 * @param tgtPath {string} 이동 대상 파일명 혹은 디렉토리명
 */
export function move (srcPath: string, tgtPath: string): void {
  fs.moveSync(srcPath, tgtPath, { overwrite: true });
}

/**
 * copy
 * copy files to target
 *
 * @param srcPath {string} 복사 할 원본 디렉토리/파일 경로
 * @param tgtPath {string} 복사 대상 디렉토리/파일 경로
 */
export function copy (srcPath: string, tgtPath: string): void {
  if (fs.existsSync(srcPath)) {
    fs.copySync(srcPath, tgtPath, { dereference: true });
  }
}

/**
 * copyDir
 * copy files to target with excepts
 *
 * @param srcPath {string} 복사할 원본 디렉토리/파일 경로
 * @param tgtPath {string} 복사될 대상 디렉토리/파일 경로
 * @param exceptFiles {string[]} 복사에서 제외 할 파일 목록
 * @returns {boolean}
 */
export function copyDir (srcPath: string, tgtPath: string, exceptFiles: string[] = []): boolean {
  if (fs.existsSync(srcPath)) {
    if (exceptFiles.length) {
      fs.copySync(srcPath, tgtPath, {
        dereference: true,
        filter: file => {
          // 제외될 파일 정의
          const fileName = file.slice(file.lastIndexOf('/') + 1);
          return exceptFiles.indexOf(fileName) === -1;
        },
      });
    } else {
      fs.copySync(srcPath, tgtPath, { dereference: true });
    }
    return true;
  }
  return false;
}

/**
 * isFileExist
 * check if file or directory is exist in path
 *
 * @param fileName {string} 파일명 혹은 디렉토리명
 * @returns {boolean}
 */
export function isFileExist (fileName: string): boolean {
  return fs.existsSync(fileName);
}

/**
 * readFile
 * read and return text file contents
 *
 * @param fileName {string} 읽어 올 파일명
 * @returns {string}
 */
export function read (fileName: string): string {
  return fs.existsSync(fileName) ? String(fs.readFileSync(fileName)) : '';
}

/**
 * write
 * write string to a file
 *
 * @param fileName {string} 저장 할 파일명
 * @param value {string} 문자열 데이터
 */
export function write (fileName: string, value: string): void {
  fs.writeFileSync(fileName, value);
}

/**
 * writePrettyJSON
 * write prettified JSON text to a file
 *
 * @param fileName {string} 저장 할 파일명
 * @param value {object} JSON 데이터
 */
export function writePrettyJSON (fileName: string, value: {}): void {
  fs.writeFileSync(fileName, pretty(value, { maxLength: 1 }));
}

/**
 * getDirectoryFiles
 * Get source file names in directory and callbacks each file
 *
 * @param dir {string} 초기 디렉토리
 * @param callback {function} 파일별 콜백 (디렉토리여부, relativePath, currentDirectory, currentFile)
 */
export function getDirectoryFiles (
  dir: string,
  callback: (isDir: boolean, relPath: string, currDir: string, file: string) => boolean | void,
): void {
  const searchList = (currDir: string): void => {
    fs.readdirSync(currDir).forEach(file => {
      const name = path.join(currDir, file);
      const relPath = name.replace(`${dir}/`, '');

      if (fs.statSync(name).isDirectory()) {
        if (callback(true, relPath, currDir, file) !== false) {
          // 해당 디렉토리 하위 탐색이 불필요할 시 콜백에서 false를 리턴
          searchList(name);
        }
      } else {
        callback(false, relPath, currDir, file);
      }
    });
  };
  searchList(dir);
}
