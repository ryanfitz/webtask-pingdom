
# Webtask ping

This webtask will attempt to request a given url and report back if the url
is UP or DOWN. If the url is DOWN an alert message will be published to AWS SNS.

## Example

```
  $ curl https://webtask.it.auth0.com/api/run/wt-ryan_fitz1-gmail_com-0/ping?webtask_no_cache=1&url=http://auth0.com
```

## Cron

Setup a webtask cron job to handling monitoring websites and apis.

```
  $ wt cron schedule -n pingcron -s KEY_ID=AKID -s SECRET_ACCESS_KEY=SECRET "0 */2 * * * *" https://raw.githubusercontent.com/ryanfitz/webtask-pingdom/master/ping.js
```