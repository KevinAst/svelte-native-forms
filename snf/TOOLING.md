# Tooling (Inner Project)

This documents the tooling of the **Inner** - **svelte-native-forms**
project _(i.e. the library published on [npm])_.
It is **seeded from [sveltejs/component-template]** _(the base for
building shareable Svelte components)_.
To understand why there are two projects (inner/outer), please refer
to the outer TOOLING [Two Projects in One] section.

# At a Glance

- [NPM Scripts]
- [Dependencies]
- [Project Resources]
- [Setup Svelte Comp Packaging]


<!--- *** SECTION *************************************************************** --->
# NPM Scripts

This section provides a summary of the available **NPM Scripts**:

```
LIB
===
build .......... build production bundle to: dist/ (index.js, index.mjs)
                 NOTE: This is implicitly invoked from "npm publish" 
                       via prepublishOnly

                 NOTE: to deploy library:
                 $ npm publish
                   ... will auto build lib/ directory
                       via: "prepare": "npm run lib:build" 
                   ... and deploy to NPM
```


<!--- *** SECTION *************************************************************** --->
# Dependencies

This section provides some insight regarding the various dependencies
found in **svelte-native-forms**.

The dependency list can become quite large for a mature project.  In
looking at `package.json`, the inevitable questions are:

- What is this dependency

- Why is it needed

- Is it a dependency for project tooling or application code?

  This last bullet is especially poignant because all Svelte project
  dependencies are `devDependencies`, due to the fact that all run-time
  resources are bundled together by the Svelte compiler.

The following table itemizes the **svelte-native-forms** dependencies,
referencing when/where they were introduced/configured.

Dependency                        | Type        | Usage          | Refer To
--------------------------------- | ----------- | -------------- | -----------------------------
`@rollup/plugin-node-resolve`     | **TOOLING** | Lib Packaging  | [Setup Svelte Comp Packaging]
`rollup`                          | **TOOLING** | Lib Packaging  | [Setup Svelte Comp Packaging]
`rollup-plugin-svelte`            | **TOOLING** | Lib Packaging  | [Setup Svelte Comp Packaging]
`svelte`                          | **TOOLING** | Lib Packaging  | [Setup Svelte Comp Packaging]



<!--- *** SECTION *************************************************************** --->
# Project Resources

Wondering what some of the top-level file resources are?  Here is a
summary:

```
svelte-native-forms/
  .gitignore ........... git repo exclusions (typically machine generated)
  dist/ ................ machine generated library (to deploy) see: "Setup Svelte Comp Packaging"
  LICENSE.md ........... our MIT License
  node_modules/ ........ dependent packages (maintained by npm)
  package.json ......... project meta data with dependencies
  package-lock.json .... exhaustive dependency list with installed "locked" versions (maintained by npm)
  README.md ............ basic project docs
  rollup.config.js ..... the rollup bundler configuration see: "Setup Svelte Comp Packaging"
  src/ ................. the library source code
  TOOLING.md ........... this document :-)
```


<!--- *** SUB-SECTION *************************************************************** --->
# Setup Svelte Comp Packaging

??$$ RETROFIT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

**svelte-native-forms** uses a Svelte App for it's **Demo App**.

This setup assumes you are "starting from scratch", setting up the
Svelte tooling _(the compiler, etc.)_, with the basic application code
template.

At the end of this process you should have:

- A running Svelte app _(a very basic template starting point)_

- The ability to deploy the demo app (to github pages)

  ```
  $ npm run app:deploy
  ```

  The **svelte-native-forms** demo app is deployed on [GitHub Pages]
  (along with the documentation).


- Impacted Dependencies:
  ```
  @rollup/plugin-commonjs
  @rollup/plugin-node-resolve
  gh-pages
  rollup
  rollup-plugin-css-only
  rollup-plugin-livereload
  rollup-plugin-svelte
  rollup-plugin-terser
  sirv-cli
  svelte
  ```

- Impacted Files:
  ```
  svelte-native-forms/
    node_modules/ ........ install location of dependent packages (maintained by npm)
    package.json ......... project meta data with dependencies
    package-lock.json .... exhaustive dependency list with installed "locked" versions (maintained by npm)
    public/ .............. the Svelte app deployment root (with generated build/) [see: "Setup Svelte Comp Packaging"]
    rollup.config.js ..... the rollup bundler configuration (used by Svelte) [see: "Setup Svelte Comp Packaging"]
    src/ ................. the app source code (the basic template starting point)
  ```


**Install Template**:

Make a copy of the [Svelte Template Repo](https://github.com/sveltejs/template)
using [degit](https://github.com/Rich-Harris/degit) _(a Rich Harris tool that copies git repositories)_

_Original Instructions_:
- [Getting started with Svelte](https://svelte.dev/blog/the-easiest-way-to-get-started#2_Use_degit)
  _(from the Svelte site - the horses mouth)_
- [Getting Started with Svelte 3](https://www.digitalocean.com/community/tutorials/getting-started-with-svelte-3)
  _(pretty much same instructions)_
- [Svelte Template Repo](https://github.com/sveltejs/template)


```
- Summary Instructions:
  $ cd c:/dev
  $ npx degit sveltejs/template svelte-native-forms
  $ cd svelte-native-forms
  $ npm install
  $ npm run dev

  * Update package.json with any additional fields you may desire
    (description, homepage, repository, keywords, license, etc.)

  * Move sirv-cli FROM: dependencies TO: devDependencies (in package.json)
    ... unsure why template registers this as dependencies

- Summary of npm scripts:

                     >>> renamed FROM: dev
  * app:devServe ... launch dev server, with continuous build (watching for code changes)
                     http://localhost:5000/
                     NOTE: the internals of this script:
                           1. invokes the rollup bundler in a "watch" state (to: public/build)
                           2. implicitly invokes "npm start" to launch the server

  * start .......... start a static file server from the contents of public/
                     http://localhost:5000/
                     NOTE: This is implicitly invoked from app:devServe script
                           As a result, it CANNOT be renamed :-(
                     NOTE: You can invoke this explicitly to server the contents of
                           a production build (i.e. app:prodBuild)

  * app:deploy ..... deploy latest application to https://svelte-native-forms.js.org/app/
                     NOTE: This script FIRST builds the app from scratch
                           ... via preapp:deploy

                     >>> renamed FROM: build
  * app:prodBuild .. build production bundle (to: public/build)
                     NOTE: This is implicitly invoked from app:deploy

  * app:clean ...... AI: ?? clean the machine-generated public/build directory
```

**Install gh-pages**:

**NOTE**: Some of these dependencies overlap with other setup (Install
only what is missing):

All deployment scripts use the `gh-pages` utility, that simplifies publishing resources
to [GitHub Pages].  Install as follows:

```
$ npm install --save-dev gh-pages
```

**Relative App Resources**

Because our app is deployed to a sub-directory of github pages, all
startup html resource references should be relative.  Simply change
`public/index.html` as follows:

```diff
public/index.html
=================
-   <link rel='icon' type='/image/png' href='/favicon.png'>
+   <link rel='icon' type='/image/png' href='favicon.png'>

-   <link rel='stylesheet' href='/global.css'>
+   <link rel='stylesheet' href='global.css'>

-   <link rel='stylesheet' href='/build/bundle.css'>
+   <link rel='stylesheet' href='build/bundle.css'>

-   <script defer src='/build/bundle.js'></script>
+   <script defer src='build/bundle.js'></script>
```

**Add `app:deploy` Script**

Add the following scripts to `package.json`:

```
package.json
============
{
  ...
  "scripts": {
    "preapp:deploy": "npm run app:prodBuild",
    "app:deploy": "gh-pages --dist public --dest app",
    ... snip snip
  }  
}
```


_My personal Detailed Notes are "hidden" (in comment form) in this doc ..._

<!--- Comment out KJB Notes
**Details**:
```
- create a new project
  $ cd c:/dev
  # copy template to your project root
  $ npx degit sveltejs/template svelte-native-forms

- setup the new project
  $ cd svelte-native-forms
  * edit package.json
    "name": "svelte-native-forms",
    "version": "0.1.0",
  $ npm install
    added 74 packages from 130 contributors and audited 104 packages in 4.591s

    KJB NOTE: Svelte is the latest V3 (specified in template pkg: "svelte": "^3.0.0")
              Installed Svelte IS: 3.20.1

- configure static resources
  * public/index.html
    - change Title: svelte-native-forms
    - change resource resolution FROM absolute TO relative, making it deployable in a relative directory
  * change the public/favicon.png to be svelte-native-forms specific
    - define the various svelte-native-forms icons
      public/
        svelte-native-forms.png            ... our favicon
        svelte-native-forms-logo.png       ... our logo
        svelte-native-forms-logo-eyes.jpg  ... prying eyes
    - update index.html
      * reference svelte-native-forms.png
    - delete template favicon.png

- configure VSCode
  * setup VSCode workspace file (and edit):
    c:/dev/svelte-native-forms.code-workspace 
  * launch this workspace
  * ONE TIME: NOW load the VSCode "svelte" extension

- run the dev app
  $ npm run dev
  > NAVIGATE TO http://localhost:5000/

- you can now change code, and it is rebuilt

- ONE TIME: setup Svelte Dev Tools
  * install from chrome web store
  * KJB: has some visibility of props and state within the DOM
         * doesn't appear to have var names associated with each (they are like array indices ... hmmmm)

- FOR PRODUCTION BUILDS
  # build optimized lib
  $ npm run build
    ... creates:
        public/
          build/ <<< creates this new
            bundle.css
            bundle.css.map
            bundle.js
            bundle.js.map
  # can now run this production build
    ... uses sirv that includes your dependencies ... hmmm 
  $ npm run start
```
KJB Notes --->




<!--- *** LINKS ***************************************************************** --->

[NPM Scripts]:                    #npm-scripts
[Dependencies]:                   #dependencies
[Project Resources]:              #project-resources
[Setup Svelte Comp Packaging]:    #setup-svelte-comp-packaging


[Two Projects in One]:            ../TOOLING.md#two-projects-in-one
[npm]:                            https://www.npmjs.com/
[sveltejs/component-template]:    https://github.com/sveltejs/component-template
