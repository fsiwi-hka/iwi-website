# Deployment

The deployment of the website to production is not yet final. Possible options
include:

* Building a container (e. g. based on NGINX) and serving it on a hoster that
  supports container deployment
* Building the website in CI and transferring the results to a webhoster via
  FTP. (Updating needs to be addressed: The Next.js files will always have
  different IDs, therefore will not be overwritten and clutter up the server.)
* Serving the page as a GitHub or GitLab page if possible, with a custom domain
  on top.

All these options need to be evaluated. IF you want to give it a try, go for it!
