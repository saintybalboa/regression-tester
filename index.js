#!/usr/bin/env node
import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import * as Commander from 'commander';
import { getCerts, getAxiosConfig } from './helpers.js';

const program = new Commander.Command();

program
  .option('-u, --url [baseUrl]', 'Base URL of the server')
  .option('-p, --paths [pathsFile]', 'Path to the JSON file containing the list of endpoints', 'paths.json')
  .option('-c, --use-client-cert [useClientCert]', 'Use development certificate')
  .option('-h, --headers [headers]', 'Custom request headers as a JSON string')
  .parse(process.argv);

const { url: baseUrl, paths: pathsFile, useClientCert, headers } = program.opts();

if (!baseUrl) {
  console.error('Usage: node script.js -u <base_url> [-p paths_json_file] [-c use_dev_cert]');
  process.exit(1);
}

dotenv.config();

async function readPathsFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading paths file: ${error.message}`);
    process.exit(1);
  }
}

async function verifyEndpoints() {
  const { cert, key } = useClientCert ? await getCerts() : {};
  const sslOpts = { cert, key, rejectUnauthorized: false }; // rejectUnauthorized: false is needed for self-signed certificates
  const axiosConfig = getAxiosConfig({ headers, sslOpts });
  const paths = await readPathsFromFile(pathsFile);

  for (const path of paths) {
    const url = baseUrl + path;

    try {
      const response = await axios.get(url, axiosConfig);

      if (response.status === 200) {
        console.log(chalk.green(`${url} - 200`));
      } else {
        console.error(chalk.red(`${url} - ${response.status}`));
      }
    } catch (error) {
      console.error(chalk.red(`${url} - ${error.message}`));
    }
  }
}

verifyEndpoints();
