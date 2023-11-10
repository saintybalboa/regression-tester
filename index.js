#!/usr/bin/env node
import axios from 'axios';
import chalk from 'chalk';
import https from 'https';
import dotenv from 'dotenv';
import fs from 'fs/promises';

const baseUrl = process.argv[2];
const pathsFile = process.argv[3] || 'paths.json';
const useDevCert = process.argv[4] || false;

if (!baseUrl) {
  console.error('Usage: node script.js <base_url> [paths_json_file] [use_dev_cert]');
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
  const paths = await readPathsFromFile(pathsFile);
  let axiosConfig;

  if (useDevCert) {
    const cert = await fs.readFile(process.env.CERTIFICATE_PATH);
    const key = await fs.readFile(process.env.KEY_PATH);
    const agent = new https.Agent({
      cert,
      key,
      rejectUnauthorized: false,  // Disable certificate verification
    });

    axiosConfig = {
      httpsAgent: agent
    };
  }

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
