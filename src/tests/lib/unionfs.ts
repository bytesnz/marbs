import { patchFs } from 'fs-monkey';
import { Volume } from 'memfs';
import { ufs } from 'unionfs';
import * as fs from 'fs';

export const vol = new Volume();

const fs2 = Object.assign({}, fs);

ufs.use(fs2).use(vol);

patchFs(ufs);
