import chalk from 'chalk';
import spawn from 'cross-spawn';
import { paths } from '../configures/paths';

declare type IArgs = Array<string | undefined>;

export const rootPackageJson = require(paths.ownPackageJson);

/**
 * run
 * 커맨드 동기화 실행
 *
 * @param cmd {string} 커맨드라인 명령어
 * @param args {IArgs} 커맨드라인 파라미터
 * @param callback {function} 실행 후 성공시 콜백 처리
 * @param hasOutput {boolean} stdout 파이프전달 (실행결과 콘솔 아웃풋 출력여부)
 * @returns {boolean}
 */
export function run (
  cmd: string,
  args: IArgs,
  callback?: (message: string) => void,
  hasOutput: boolean = true,
): boolean {
  const params: string[] = args.filter(Boolean) as string[];
  const result = spawn.sync(cmd, params, { stdio: hasOutput ? 'inherit' : 'pipe', encoding: 'utf-8' });

  if (result.status === 0) {
    // 실행 성공
    if (callback) {
      callback(String(result.stdout || '').trim());
    }
    return true;
  } else {
    // 실행 실패
    if (result.signal) {
      // 실행 중지 요청시
      if (result.signal === 'SIGKILL') {
        console.error('Process was done by kill signal.\n');
      } else if (result.signal === 'SIGTERM') {
        console.error('Process was done by terminate signal.\n');
      }
      process.exit(1);
    } else if (result.error) {
      // 오류 발생시
      console.log(chalk.red(result.error.message));
      console.log(chalk.red(result.error.stack));
    } else {
      // 프로세스 종료시 (result.status > 0)
      // console.log(chalk.red(`Unable to execute command "${cmd} ${args.join(' ')}"!`))
    }
  }

  return false;
}

/**
 * get
 * 커맨드 동기화 실행 및 결과 문자열 리턴
 *
 * @param cmd {string} 커맨드라인 명령어
 * @param args {Array<string | undefined>} 커맨드라인 파라미터
 * @returns {string}
 */
export function get (cmd: string, args: IArgs): string {
  let result = '';
  run(cmd, args, (output: string) => { result = output; }, false);
  return result;
}

/**
 * displayTitle
 * 앱 타이틀 표시
 */
export function displayTitle (): void {
  console.log(`${chalk.whiteBright.bgMagenta(' Lintest ')} ${chalk.gray(`version ${rootPackageJson.version}`)}`);
  console.log('Integrated lint and test environment project.');
  console.log(`This is personal public version (Use ${chalk.cyan('@lintest/cli')} for enterprise only)`);
}
