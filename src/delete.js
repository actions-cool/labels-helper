const { readFileSync } = require('fs');
const { dealStringToArr } = require('./util.js');
const { queryLabels, deleteLabel } = require('./octokit');

async function run() {
  const json = JSON.parse(readFileSync('./delete.json'));

  const targetOwner = json['target-owner'];
  const targetRepo = json['target-repo'];
  const ignore = dealStringToArr(json['ignore']);
  const include = json['include'];

  const labels = await queryLabels(targetOwner, targetRepo);

  for await (let { name } of labels) {
    /**
     * 检测包含，若为空会删除所有 谨记
     * The test contains, if it is empty, all will be deleted. Remember
     */
    const includeCheck = include ? name.includes(include) : true;
    const ignoreCheck = !ignore.includes(name);
    if (includeCheck && ignoreCheck) {
      await deleteLabel(targetOwner, targetRepo, name);
    }
  }
}

run();
