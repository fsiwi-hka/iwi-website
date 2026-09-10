#!/bin/sh

gpg --quiet --batch --yes --decrypt --passphrase="$CREDENTIALS_PASSPHRASE" \
--output ./credentials.json ./credentials.json.gpg