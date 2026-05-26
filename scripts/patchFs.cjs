'use strict';
// Windows: fs.readlink on regular files returns EISDIR instead of EINVAL.
// enhanced-resolve and @vercel/nft expect EINVAL for non-symlinks.
// Must be required before any webpack/next code loads (node -r ./scripts/patchFs.cjs).

function makeEINVAL(path) {
  const e = new Error("EINVAL: invalid argument, readlink '" + path + "'");
  e.code = 'EINVAL'; e.errno = -4071; e.syscall = 'readlink'; e.path = path;
  return e;
}

// Patch callback-style fs.readlink
const fs = require('fs');
const _rl = fs.readlink;
fs.readlink = function patchedReadlink(path, options, cb) {
  if (typeof options === 'function') { cb = options; options = undefined; }
  _rl.call(fs, path, options, function (err, link) {
    if (err && err.code === 'EISDIR') cb(makeEINVAL(path));
    else cb(err, link);
  });
};

// Patch promise-style fs.promises.readlink (used by @vercel/nft via collect-build-traces.js)
const fsp = require('fs/promises');
const _rlp = fsp.readlink;
fsp.readlink = async function patchedReadlinkAsync(path, options) {
  try {
    return await _rlp.call(fsp, path, options);
  } catch (err) {
    if (err && err.code === 'EISDIR') throw makeEINVAL(path);
    throw err;
  }
};
