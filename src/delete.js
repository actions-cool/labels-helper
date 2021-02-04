const { readFileSync } = require('fs');
const { Octokit } = require('@octokit/rest');

const { dealStringToArr } = require('./util.js');

async function run() {
  const json = JSON.parse(readFileSync('./delete.json'));

  const targetOwner = json['target-owner'];
  const targetRepo = json['target-repo'];
  const token = json['token'];
  if (!token) {
    console.log('Need token!');
    return false;
  }
  const octokit = new Octokit({ auth: `token ${token}` });

  const ignore = dealStringToArr(json['ignore']);
  const include = json['include'];

  const per_page = 100;

  async function queryLabels(page = 1) {
    let { data } = await octokit.issues.listLabelsForRepo({
      owner: targetOwner,
      repo: targetRepo,
      per_page,
      page,
    });
    if (data.length >= per_page) {
      data = data.concat(await queryLabels(page + 1));
    }
    return data;
  }

  const labels = await queryLabels();

  for await (let { name } of labels) {
    /**
     * 检测包含，若为空会删除所有 谨记
     * The test contains, if it is empty, all will be deleted. Remember
     */
    const includeCheck = include ? name.includes(include) : true;
    const ignoreCheck = !ignore.includes(name);
    if (includeCheck && ignoreCheck) {
      await octokit.issues.deleteLabel({
        owner: targetOwner,
        repo: targetRepo,
        name,
      });
      console.log(`[${name}] deleted!`);
    }
  }
}

run();
