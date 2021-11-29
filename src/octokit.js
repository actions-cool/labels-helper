const { Octokit } = require('@octokit/rest');
const { readFileSync } = require('fs');

const json = JSON.parse(readFileSync('./create.json'));

const token = json['token'];
if (!token) {
  console.log('Need token!');
  return false;
}
const octokit = new Octokit({ auth: `token ${token}` });

async function queryLabels(owner, repo, page = 1) {
  let { data: labels } = await octokit.issues.listLabelsForRepo({
    owner,
    repo,
    per_page: 100,
    page,
  });
  if (labels.length >= 100) {
    labels = labels.concat(await queryLabels(owner, repo, page + 1));
  }
  return labels;
}

async function createLabel(owner, repo, name, color, description) {
  try {
    await octokit.issues.createLabel({
      owner,
      repo,
      name,
      color,
      description,
    });
    console.log(`[${name}] created!`);
  } catch (e) {
    console.log(`[${name}] error:`);
    console.log(e.message);
  }
}

async function deleteLabel(owner, repo, name) {
  await octokit.issues.deleteLabel({
    owner,
    repo,
    name,
  });
  console.log(`[${name}] deleted!`);
}

module.exports = {
  queryLabels,
  createLabel,
  deleteLabel,
};
