
#!/bin/bash
set -x #echo on
rm -rf node_modules
rm -rf $TMPDIR/react*
watchman watch-del-all
yarn install
