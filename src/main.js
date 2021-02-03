const axios = require('axios');
const core = require('@actions/core');
const { readFileSync } = require('fs');

async function run(){
  try {
    const json = JSON.parse(readFileSync('./inputs.json'));

    const getOwner = core.getInput('get-owner') || json['get-owner'];
    const getRepo = core.getInput('get-repo') || json['get-repo'];
    const targetOwner = core.getInput('target-owner') || json['target-owner'];
    const targetRepo = core.getInput('target-repo') || json['target-repo'];
    const token = core.getInput('token') || json['token'];

    const path = core.getInput('path') || json['path'];
    const ignore = core.getInput('ignore') || json['ignore'];
    const format = core.getInput('format') || json['format'];
    const color = core.getInput('color') || json['color'];
    
    const URL = `https://api.github.com/repos/${getOwner}/${getRepo}/contents/${path}`;
    const res = await axios.get(URL);
    const names = res.data;
    for (let i = 0; i < names.length; i++) {
      
    }


  } catch (error) {
    core.setFailed(error.message);
  }
}

function getReandomColor() {
  const colors = [
    '60acfc',
    '32d3eb',
    '5bc49f',
    'feb64d',
    '9287e7',
    '3db3ea',
    '43cec7',
    'd4ec59',
    'f7816d',
    'd660a8',
    '636fde',
    '42c5ea',
    '62d5b2',
    'fbda43',
    'f66e6c',
    'b55bbd',
    '668ed6',
    'B60205',
    'E99695',
    'D93F0B',
    'F9D0C4',
    'FBCA04',
    'FEF2C0',
    '0E8A16',
    'C2E0C6',
    '006B75',
    'BFDADC',
    '1D76DB',
    'BFD4F2',
    '0052CC',
    'BFD4F2',
    '5319E7',
    'D4C5F9',
  ];
  return sampleSize(colors, 1)[0];
}

run();
