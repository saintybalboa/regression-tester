import fs from 'fs/promises';
import https from 'https';

const getCerts = async () => {
  const cert = await fs.readFile(process.env.CERTIFICATE_PATH);
  const key = await fs.readFile(process.env.KEY_PATH);

  return { cert, key };
}

const getAxiosConfig = ({ headers, sslOpts }) => {
  const httpsAgent = sslOpts && new https.Agent(sslOpts);

  return  {
    httpsAgent,
    headers
  };
};

export { getAxiosConfig, getCerts };
