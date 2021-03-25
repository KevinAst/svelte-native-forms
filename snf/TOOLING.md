# Tooling (Inner Project)

This documents the tooling of the **Inner** - **svelte-native-forms**
project _(i.e. the library published on [npm])_.
It is **seeded from [sveltejs/component-template]** _(the base for
building shareable Svelte components)_.

To understand why there are two projects (inner/outer), please refer
to the outer TOOLING [Two Projects in One] section.

**Please Note**:

<ul>

  I attempted to combine everything in a single project, by defining
  two distinct `rollup.config.js` files:

  - `rollup.config.js` ... for demo app (from [sveltejs/template])
  - `rollup.lib.config.js` ... for comp lib (from: [sveltejs/component-template])

  And adjusting the build script to reference `rollup.lib.config.js`:

  ```
  package.json
  ============
  ... 
  {
    "scripts": {
      ...
      "lib:build": "rollup -c rollup.lib.config.js",
      "prepublishOnly": "npm run lib:build"
    },
  }
  ```


  This should have worked, because both templates have the same
  dependencies.

  **However** I received the following error in building the library:

  ```
  $ npm run lib:build
    > rollup -c rollup.lib.config.js
      snf/src/index.js → dist/index.mjs, dist/index.js...
      [!] Error: Unexpected token (Note that you need plugins to import files that are not JavaScript)
      snf\src\DispErr.css (1:0)
      1: .error.svelte-8h9b00{font-size:80%;font-weight:bold;font-style:italic;color:#900}
         ^
  ```

  For some reason it doesn't like the CSS `<style>` in DispErr.svelte.
  **Unsure why this is happening**.  The only diff is the npm
  dependency versions (between the app and lib templates):

  ```
                                  NOT WORKING :-(
                                  GENERALLY NEWER
  dependency                      app (outer proj)    lib (inner proj)
  ==============================  ================    ================
  "@rollup/plugin-node-resolve":  "^11.0.0"           "^9.0.0",
  "rollup":                       "^2.3.4"            "^2.0.0",
  "rollup-plugin-svelte":         "^7.0.0"            "^6.0.0",
  "svelte":                       "^3.0.0"            "^3.0.0"
  ```

</ul>



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
=====
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
  snf/
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

The **svelte-native-forms** (published to NPM) is packaged using the
[sveltejs/component-template] _(the base for building shareable Svelte
components)_.

At the end of this process you should have:

- The ability to publish the **svelte-native-forms** library to NPM.

  ```
  $ npm publish
    + svelte-native-forms@v.v.v
  ```

- Impacted Dependencies:
  ```
  @rollup/plugin-node-resolve
  rollup
  rollup-plugin-svelte
  svelte
  ```

- Impacted Files:
  ```
  svelte-native-forms/
    snf/
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

**Install Template**:

Make a copy of the [sveltejs/component-template] using
[degit](https://github.com/Rich-Harris/degit) _(a Rich Harris tool
that copies git repositories)_


```
- Summary Instructions:

  $ cd c:/dev/svelte-native-forms/
  $ npx degit sveltejs/component-template snf
  $ cd c:/dev/svelte-native-forms/snf

  * update package.json fields (from outer project):
    package.json
    ============
    "name": "svelte-native-forms",
    "version": "0.1.0",
    "description": "minimalist form validation with powerful results",
    "homepage": "https://svelte-native-forms.js.org/",
    "repository": {
      "type": "git",
      "url": "https://github.com/KevinAst/svelte-native-forms.git"
    },
    "bugs": {
      "url": "https://github.com/KevinAst/svelte-native-forms/issues"
    },
    "keywords": [
      "svelte-native-forms",
      "svelte",
      "form",
      "validation",
      "utility",
      "geeku",
      "astx"
    ],
    "author": "Kevin J. Bridges <kevin@wiiBridges.com> (https://github.com/KevinAst)",
    "license": "MIT",

  * supplement additional "files" package.json
    "files": [
      "package.json",  <<< NEW
      "LICENSE.md",    <<< NEW ALSO ADD THE LICENSE.md
      "README.md",     <<< NEW
      "src",
      "dist"
    ],

  $ npm install
    added 22 packages from 58 contributors and audited 23 packages in 2.612s

  * add package-lock.json to .gitignore
    .gitignore
    ==========
    # not really interested in package-lock.json in repo
    /package-lock.json

  * replace README with our own
    README.md
    =========
    # svelte-native-forms
    *... minimalist form validation with powerful results*
    TODO: eventually a copy of outer project README (once our formal docs are fully up and running)

  * populate utility src (from seed project):
    - c:/dev/svelte-native-forms/snf/src

  * test build script
    $ npm run build
    - created:
      dist/
        index.js
        index.mjs

```

**NOTE**: You can now deploy **svelte-native-forms** using standard
npm command _(see outer TOOLING [Deploy Project] for details)_:

```
$ npm publish
  + svelte-native-forms@v.v.v
```


<!--- *** LINKS ***************************************************************** --->

[NPM Scripts]:                    #npm-scripts
[Dependencies]:                   #dependencies
[Project Resources]:              #project-resources
[Setup Svelte Comp Packaging]:    #setup-svelte-comp-packaging


[Two Projects in One]:            ../TOOLING.md#two-projects-in-one
[Deploy Project]:                 ../TOOLING.md#deploy-project
[npm]:                            https://www.npmjs.com/
[sveltejs/template]:              https://github.com/sveltejs/template
[sveltejs/component-template]:    https://github.com/sveltejs/component-template
