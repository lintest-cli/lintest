import dotEnv, { DotenvConfigOptions, DotenvParseOutput } from 'dotenv';

/**
 * dotEnv
 *
 * @param path {string}
 */
export default function (path: string): DotenvParseOutput | null {
  const options: DotenvConfigOptions = {
    path,
    encoding: 'utf8',
    debug: true,
  };

  // Load .env variables and defines to process.env
  const { error, parsed } = dotEnv.config(options);

  if (error) {
    console.error(error);
    process.exit(1);
  } else if (parsed && Object.keys(parsed).length) {
    return parsed;
  }

  return null;
}
