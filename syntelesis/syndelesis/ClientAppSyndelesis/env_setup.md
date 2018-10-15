# UPDATE CLI (if ever needed):

The steps to update your environment to the latest version containing the fix:

npm uninstall -g @angular/cli
npm cache clean
# if npm version is > 5 then use `npm cache verify` to avoid errors (or to avoid using --force)
npm install -g @angular/cli@latest

rm -rf node_modules dist # use rmdir /S/Q node_modules dist in Windows Command Prompt; use rm -r -fo node_modules,dist in Windows PowerShell
npm install --save-dev @angular/cli@latest
npm install

# PROJECT SET UP
$ ng new ClientAppSyndelesis
$ cd ClientAppSyndelesis
$  npm install --no-save @angular-devkit/core@0.0.29 ( this is ... extra...)
$ npm install --save @ngrx/store @ngrx/effects @ngrx/store-devtools @ngrx/router-store
$ npm install bootstrap

## Add Bootstrap styles to project
edit .angular-cli.json
add to:
 "styles": [
   "../node_modules/bootstrap/dist/css/bootstrap.min.css",  # relative to index.html (the same 								    # effect as if added to index.html 								    # a url ref to bootstrap)
   "styles.css"
 ]
