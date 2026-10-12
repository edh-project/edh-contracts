import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

const here=dirname(fileURLToPath(import.meta.url));
const root=dirname(here);
const dirs=['schemas','knowledge/schemas','events','lifecycle','bridge','comparison'];

async function jsonFiles(dir){
  const base=join(root,dir);
  try { return (await readdir(base)).filter(x=>x.endsWith('.json')).map(x=>join(base,x)); }
  catch { return []; }
}
const files=(await Promise.all(dirs.map(jsonFiles))).flat();
if(files.length<10) throw new Error('expected at least 10 contract JSON files, got '+files.length);

const docs=new Map();
for(const p of files){
  const j=JSON.parse(await readFile(p,'utf8'));
  if(j.$schema!=='https://json-schema.org/draft/2020-12/schema') throw new Error(p+' missing draft 2020-12');
  if(!j.$id) throw new Error(p+' missing $id');
  docs.set(p,j);
}

const find=suffix=>[...docs.entries()].find(([p])=>p.endsWith(suffix))?.[1];
const checkpoint=find('/lifecycle/checkpoint.schema.json');
const types=x=>Array.isArray(x?.type)?x.type:[x?.type].filter(Boolean);
if(!types(checkpoint?.properties?.plan_id).includes('null')) throw new Error('plan_id must allow null');
if(!types(checkpoint?.properties?.task_id).includes('null')) throw new Error('task_id must allow null');
if(Array.isArray(checkpoint?.properties?.status?.enum)) throw new Error('status must not be a closed enum');
if(checkpoint?.additionalProperties===false) throw new Error('checkpoint must remain extensible');

const dashboard=find('/bridge/dashboard-state.schema.json');
for(const k of ['observer','project_tasks','rdc','prepared_dispatch','executor_policy']){
  if(!dashboard?.required?.includes(k)) throw new Error('dashboard missing '+k);
}
const admission=find('/bridge/task-admission-command.schema.json');
if(!Array.isArray(admission?.oneOf)||admission.oneOf.length!==2) throw new Error('task admission variants missing');

const comparison=find('/comparison/comparison-record.schema.json');
if(!comparison) throw new Error('comparison record schema missing');
if(comparison?.properties?.runs?.minItems!==2 || comparison?.properties?.runs?.maxItems!==2) throw new Error('comparison must contain exactly two sibling runs');
const executorEnum=comparison?.$defs?.run?.properties?.executor?.enum||[];
if(JSON.stringify(executorEnum)!==JSON.stringify(['EDH','RDC'])) throw new Error('comparison executors must be EDH and RDC');
const qualityEnum=comparison?.$defs?.quality?.enum||[];
for(const q of ['reported','derived','observed','estimated','unavailable','not_observed','not_applicable']){
  if(!qualityEnum.includes(q)) throw new Error('comparison metric quality missing '+q);
}
const fixture=JSON.parse(await readFile(join(root,'fixtures','comparison-record.min.json'),'utf8'));
if(fixture.runs?.length!==2) throw new Error('comparison fixture must have two runs');
if(JSON.stringify(fixture.runs.map(x=>x.executor))!==JSON.stringify(['EDH','RDC'])) throw new Error('comparison fixture executor order mismatch');

console.log(JSON.stringify({ok:true,contracts:files.length,checkpoint_semantics:'permissive',bridge_envelope:true,comparison_record:true},null,2));
