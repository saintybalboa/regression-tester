# Regression tester

A Node.js script that checks the status codes of multiple endpoints given a base URL.

## Prerequisites

- Paths JSON file containing the list of endpoints (default: `paths.json`)

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/saintybalboa/regression-tester.git
   cd regression-tester
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. [Optional] Create a `.env` file in the project root with the following content if the server uses a self-signed certificate:

   ```env
   CERTIFICATE_PATH=/path/to/your/development/cert.crt
   KEY_PATH=/path/to/your/development/cert.key
   ```

   Replace `/path/to/your/development/certificate.pem` and `/path/to/your/development/key.pem` with the actual paths to your development certificate and key files.

4. Run the script:

   ```bash
   node index.js -u <base_url> -p [paths_json_file] -c [use_dev_certificate] -h [headers_json_string]
   ```

   Replace `<base_url>` with the base URL of your server and `[paths_json_file]` with the optional path to your JSON file containing the list of endpoints. If not specified, the script will use `paths.json` by default.

   **Examples:**

   - Using default paths JSON file:

      ```bash
      node index.js -u https://github.com
      ```

   - Using custom paths JSON file:

      ```bash
      node index.js -u https://github.com -p custom-paths.json
      ```

   - Using custom paths JSON file and client certificate:

      ```bash
      node index.js -u https://github.com -p custom-paths.json -c true
      ```

   - Using custom paths JSON file, client certificate and custom headers:

      ```bash
      node index.js -u https://github.com -p custom-paths.json -c true -h '{"ctx-service-env": "test"}'

5. **Output**

   The script will iterate over specified paths and check the status code for each endpoint. It will display the results in the console with colored output:

   - Successful requests (status code 200) will be displayed in green.
   - Failed requests will be displayed in red, along with the error message.

## Important Note

- Ensure that the development certificate is correctly configured on your server.
- Use this script responsibly and only on servers you have permission to access.
