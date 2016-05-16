## FastBoot GitLab Notifier

[![Latest NPM release][npm-badge]][npm-badge-url]
[![Dependency Status][dependency-badge]][dependency-badge-url]
[![TravisCI Build Status][travis-badge]][travis-badge-url]
[![Code Climate][codeclimate-badge]][codeclimate-badge-url]

[npm-badge]: https://img.shields.io/npm/v/fastboot-gitlab-notifier.svg
[npm-badge-url]: https://www.npmjs.com/package/fastboot-gitlab-notifier
[dependency-badge]: https://img.shields.io/david/buschtoens/fastboot-gitlab-notifier.svg
[dependency-badge-url]: https://david-dm.org/buschtoens/fastboot-gitlab-notifier
[travis-badge]: https://img.shields.io/travis/buschtoens/fastboot-gitlab-notifier/master.svg?label=TravisCI
[travis-badge-url]: https://travis-ci.org/buschtoens/fastboot-gitlab-notifier
[codeclimate-badge]: https://img.shields.io/codeclimate/github/buschtoens/fastboot-gitlab-notifier.svg
[codeclimate-badge-url]: https://codeclimate.com/github/buschtoens/fastboot-gitlab-notifier

This notifier for the [FastBoot App Server][app-server] works with GitLab Builds
to poll for new successful builds for a specified ref / branch.

[app-server]: https://github.com/ember-fastboot/fastboot-app-server

To use the notifier, configure it with your GitLab API token and your repo:

```js
const FastBootAppServer = require('fastboot-app-server');
const GitLabNotifier    = require('fastboot-gitlab-notifier');

let notifier = new GitLabNotifier({
  url:   'http://gitlab.example.com',
  token: '0123456789abcdefghij'

  project: 'buschtoens/fastboot-test-app', // or numeric project id
  ref:     'master'                        // optional, defaults to 'master'

  poll: 3 * 1000 // optional polling interval, defaults to 3 * 1000
});

let server = new FastBootAppServer({
  notifier: notifier
});
```

When the notifier starts, it will poll the API for the specified repository and
ref. Once a new successful build is found, it will tell the FastBoot App Server
to fetch the latest version of the app.

If you like this, you may also be interested in the companion
[fastboot-gitlab-downloader](https://github.com/buschtoens/fastboot-gitlab-downloader),
which downloads the most recent build artifact for the specified ref.

You might also like [fastboot-gitlab-app-server](https://github.com/buschtoens/fastboot-gitlab-app-server), a pre-made and optionally dockerized FastBoot App Server that uses the GitLab
notifier and downloader.
