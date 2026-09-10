# Deployment

The deployment of the website to production is done via FTP using
**GitHub Actions**. (You can find the workflow file at
[.github/workflows/main.yml](./../.github/workflows/main.yml)).

## Triggers

The deployment is triggered every time a push to master occurs. This is usually
done with a Merge Request. Also, we have a timer trigger to build the site every
day at 4:00 am. This keeps our calendar events up-to-date.

## Build Step

### Preparations Concerning Sensitive Data

For our [calender events](./calendar-events.md), we use a service account. The
credentials of this service account have to remain secret, but are needed during
build time. To solve this problem, we use an approach proposed by GitHub itself:
[GPG encrypton of sensitive files](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#limits-for-secrets).
The file containing the credentials is encrypted and placed in the repository
root (see [credentials.json.gpg](./../credentials.json.gpg)). During a build,
the [decrypt_credentials.sh](./../scripts/decrypt_credentials.sh) script is run.
It uses a passphrase (injected as a environment variable) to decrypt the file.
It is then available for the Next.JS build.

### Building and Exporting the Website

The site is built using the following command:

```bash
npm build
```

This in turn runs two Next.JS commands:

```bash
next build
next export
```

After these build steps, the page is present in the `out` directory.

### Deploy Step

The second step imports the artifact produced by the build step and deploys the
entire folder via FTP. Existing files are overwritten.

The necessary credentials for the deployment are injected as environment
variables.

[Back to documentation index](./readme.md)