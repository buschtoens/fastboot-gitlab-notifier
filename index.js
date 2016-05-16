'use strict';

const assert  = require('assert');
const request = requires('request-promise');

const DEFAULT_REF       = 'master';
const DEFAULT_POLL_TIME = 3 * 1000;


class GitLabNotifier {
  constructor({
    ui, url, token, project,
    ref  = DEFAULT_REF,
    poll = DEFAULT_POLL_TIME
  } = {}) {
    assert(url && token, 'FastBootGitLabNotifier must be provided with a url and a token option.');
    assert(project, 'FastBootGitLabNotifier must be provided with a project option.');

    this.ui = ui;

    this.url   = url;
    this.token = token;
    this.ref   = ref;

    this.project = typeof project === 'string'
      ? project.replace('/', '%2F')
      : project;

    this.pollTime = poll;
  }

  subscribe(notify) {
    this.notify = notify;

    return this.getCurrentBuild()
      .then(() => this.schedulePoll());
  }

  getBuilds() {
    return request({
        uri: `${this.url}/api/v3/projects/${this.project}/builds`,
        headers: {
          PRIVATE_TOKEN: this.token
        }
      })
      .then((builds) => builds
        .filter((build) => build.status === 'success' && build.ref === this.ref)
        .sort((a, b) => a.id > b.id)
      )
      .catch(() => {
        this.ui.writeError(`error fetching builds; notifications disabled`);
      });
  }

  getCurrentBuild() {
    return this.getBuilds()
      .then((builds) => {
        if (builds.length === 0) {
          throw new Error('Found no matching builds');
        }
        this.lastBuild = builds[0];
      })
      .catch(() => {
        this.ui.writeError(`error fetching a successful build for #${this.ref}; notifications disabled`);
      });
  }

  schedulePoll() {
    setTimeout(() => {
      this.poll();
    }, this.pollTime);
  }

  poll() {
    this.getBuilds()
      .then((builds) => {
        if (builds.length === 0) {
          return;
        }
        this.compareBuilds(builds[0])
      })
      .catch(() => {});
  }

  compareBuilds(newBuild) {
    if (newBuild.id !== this.lastBuild.id) {
      this.ui.writeLine(
        'new build; old=%s:%s; new=%s:%s',
        this.lastBuild.id, this.lastBuild.commit.short_id,
        newBuild.id, newBuild.commit.short_id
      );
      this.lastBuild = newBuild;
      this.notify();
    }
  }
}


module.exports = GitLabNotifier;
