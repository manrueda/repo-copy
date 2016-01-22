# repo-copy
[![npm (scoped)](https://img.shields.io/npm/v/repo-copy.svg)](https://www.npmjs.com/package/repo-copy)
[![npm](https://img.shields.io/npm/l/repo-copy.svg)](https://www.npmjs.com/package/repo-copy)
Git repository copy/compressor.

The idea of this small tool is to make quick copies of a git repository.
Honoring the .gitignore file and supporting compression.

Could be used to move repositories to another directory or computer, even when there are no staged/commited changes.

## Usage

```
Usage: repo-copy [options] <repo path ...>

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -c, --copy        Copy repository
    -k, --compress    Compress repository
    -t, --gzip        Use tar and gzip to create the compressed file
    -z, --zip         Use zip to create the compressed file
    -o, --out [stat]  Output (repo.tar.gz or copyFolder/)


```
