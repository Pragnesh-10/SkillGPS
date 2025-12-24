import fs from 'fs';
import path from 'path';
import { getRecommendations } from '../src/utils/recommendationEngine.js';

// Config
const OUT_DIR = path.resolve(process.cwd(), 'data');
const OUT_FILE = path.join(OUT_DIR, 'bootstrap.jsonl');
const SAMPLE_SIZE = process.env.SAMPLE_SIZE ? parseInt(process.env.SAMPLE_SIZE, 10) : 50000; // default 50k

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const interestsKeys = ['numbers', 'building', 'design', 'explaining', 'logic'];
const wsOptions = {
  environment: ['Solo', 'Team'],
  structure: ['Structured', 'Flexible'],
  roleType: ['Desk Job', 'Dynamic']
};
const intentOptions = {
  afterEdu: ['job', 'higherStudies'],
  workplace: ['startup', 'corporate'],
  nature: ['research', 'applied']
};
const confidenceValues = [1, 3, 5, 7, 9];

// Simple deterministic RNG (LCG)
let seed = 42;
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function sampleBoolean() { return rand() > 0.5; }
function sampleFrom(arr) { return arr[Math.floor(rand() * arr.length)]; }
function sampleConfidence() { return confidenceValues[Math.floor(rand() * confidenceValues.length)]; }

const outStream = fs.createWriteStream(OUT_FILE, { flags: 'w' });

console.log(`Generating ${SAMPLE_SIZE} samples to ${OUT_FILE}`);

for (let i = 0; i < SAMPLE_SIZE; i++) {
  const interests = {};
  interestsKeys.forEach(k => { interests[k] = sampleBoolean(); });

  const workStyle = {
    environment: sampleFrom(wsOptions.environment),
    structure: sampleFrom(wsOptions.structure),
    roleType: sampleFrom(wsOptions.roleType)
  };

  const intent = {
    afterEdu: sampleFrom(intentOptions.afterEdu),
    workplace: sampleFrom(intentOptions.workplace),
    nature: sampleFrom(intentOptions.nature)
  };

  const confidence = {
    math: sampleConfidence(),
    coding: sampleConfidence(),
    communication: sampleConfidence()
  };

  const sample = { interests, workStyle, intent, confidence };

  // Use existing rule-based engine to provide a label (top-1)
  const top = getRecommendations(sample)[0];

  const output = { ...sample, label: top };

  outStream.write(JSON.stringify(output) + "\n");
}

outStream.end(() => console.log('Generation complete.'));
