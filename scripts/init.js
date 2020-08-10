const fs = require('fs');
const { exit } = require('process');
require('dotenv').config()

/**
 * This function sets up and saves the credentials.json
 * file needed for the Google Calendar API, based on
 * environment variables starting with "gc_".
 */
function createCredentialsFile() {
    credentials = {}
    Object.keys(process.env).forEach(element => {
        if (element.startsWith('gc_')) {
            credentials[element.substr(3)] = process.env[element];
        }
    })

    // ten fields are needed for the credentials.json file:
    // https://cloud.google.com/iam/docs/creating-managing-service-account-keys
    if (Object.keys(credentials).length != 10) {
        var errorMessage = 'Necessary environment variables not set. ' +
            'Are you missing some variables or is there a .env file at all??'
        console.error(errorMessage)
        exit(1)
    }

    // When reading the env vars, JavaScript escapes backslashes.
    // This is undone here - otherwise the file is not read correctly.
    var credentialsString = JSON.stringify(credentials).replace(/\\\\/g, '\\')

    fs.writeFileSync(process.cwd() + '/credentials.json', credentialsString);
}

createCredentialsFile()