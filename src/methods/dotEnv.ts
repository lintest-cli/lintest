import dotEnv, { DotenvParseOutput } from 'dotenv';

/**
 * dotEnv
 *
 * @param path {string}
 */
export default function (path: string): DotenvParseOutput | null {
  // Load .env variables and defines to process.env
  const { error, parsed } = dotEnv.config({
    path,
    encoding: 'utf8',
  });

  if (error) {
    console.error(error);
    process.exit(1);
  } else if (parsed && Object.keys(parsed).length) {
    return parsed;
  }

  return null;
}
