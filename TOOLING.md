# Tooling

This document contains resources to help you in both the tooling and
development of the **svelte-native-forms** project.

## Two Projects in One

This project is a bit unusual in that it represents **"two projects in
one"**!

1. The **outer project** _(this one)_ serves two purposes: 
   **a:** the **interactive demo app** and
   **b:** the **formal documentation**
   _(both of which are published on [GitHub Pages])_.

   The tooling for this project is **documented here** and is **seeded
   from [sveltejs/template]** _(the project template for Svelte
   apps)_.

2. The **inner project** _(found in the `snf/` directory)_ is the **utility
   library** _(published on [npm])_.

   The tooling for this project is **documented in the inner
   [TOOLING.md](snf/TOOLING.md)** and is **seeded from
   [sveltejs/component-template]** _(the base for building shareable
   Svelte components)_.

The reason for this **"two projects in one"** approach is: first the
**integration aspect** _(obviously)_, but **more importantly** to take
advantage of the boiler plate tooling templates _(pretty much
unmodified)_!


# At a Glance

- [NPM Scripts]
- [Dependencies]
- [Project Resources]
- [Project Setup]
  - [Setup GitHub Project]
  - [Setup Svelte App Tooling]
  - [Setup Tailwind CSS]
  - [Setup tw-themes]
  - [Setup Absolute Imports]
  - [Setup Docs Tooling]
  - [Setup js.org sub-domain]
- [Deploy Project]
- [Setup New Feature Branch]

<!--- *** SECTION *************************************************************** --->
# NPM Scripts

This section provides a summary of the available **NPM Scripts**
_(organized by task)_:

```
DEVELOPMENT
===========
APP:
app:devServe ... launch dev server, with continuous build (watching for code changes)
                 http://localhost:5000/
                 NOTE: the internals of this script:
                       1. invokes the rollup bundler in a "watch" state (to: public/build)
                       2. implicitly invokes "npm start" to launch the server

DOCS:
docs:build   ... AI: ?? manually build the docs (into the _book/ dir)
                 1. start an internal web server pointing to _book/ dir
                 2. manually re-execute docs:build whenever docs/ change


APP
===
app:devServe ... launch dev server, with continuous build (watching for code changes)
                 http://localhost:5000/
                 NOTE: the internals of this script:
                       1. invokes the rollup bundler in a "watch" state (to: public/build)
                       2. implicitly invokes "npm start" to launch the server

start .......... start a static file server from the contents of public/
                 http://localhost:5000/
                 NOTE: This is implicitly invoked from app:devServe script
                       As a result, it CANNOT be renamed :-(
                 NOTE: You can invoke this explicitly to server the contents of
                       a production build (i.e. app:prodBuild)

app:deploy ..... deploy latest application to https://svelte-native-forms.js.org/app/
                 NOTE: This script FIRST builds the app from scratch
                       ... via preapp:deploy

app:prodBuild .. build production bundle (to: public/build)
                 NOTE: This is implicitly invoked from app:deploy

app:clean ...... AI: ?? clean the machine-generated public/build directory


DOCS
====
docs:build   ... AI: ?? manually build the docs (into the _book/ dir)
                 - NOTE: this build is executed as the first step in docs:publish
                 - FOR DOCS DEVELOPMENT:
                   1. start an internal web server pointing to _book/ dir
                   2. manually re-execute docs:build whenever docs/ change
                 - this is MUCH PREFERRED over docs:serve
                   * it is MUCH FASTER!
                   * docs:serve is very antiquated (a dead project)
                     * it is extremely slow
                     * it constantly stops when any file changes
                                    
docs:publish ... AI: ?? publish the latest docs to https://svelte-native-forms.js.org/docs/
                 NOTE: this script FIRST builds the docs from scratch
                       ... via predocs:publish

docs:clean   ... AI: ?? clean machine-generated docs/ directory

                 >>> ANTIQUATED (see notes on docs:build)
docs:serve ..... launch docs server, continuously watching for docs changes
                 NOTE: adding `--log=debug --debug` to this npm script CAN BE USEFUL


MISC
====
clean .......... AI: ?? cleans ALL machine-generated directories
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

Dependency                        | Type        | Usage                   | Refer To
--------------------------------- | ----------- | ----------------------- | ----------------
`@rollup/plugin-alias`            | **TOOLING** | Absolute Imports        | [Setup Absolute Imports]
`@rollup/plugin-commonjs`         | **TOOLING** | Svelte Bundler related  | [Setup Svelte App Tooling]
`@rollup/plugin-node-resolve`     | **TOOLING** | Svelte Bundler related  | [Setup Svelte App Tooling]
`autoprefixer`                    | **TOOLING** | Tailwind CSS Build      | [Setup Tailwind CSS]
`gh-pages`                        | **TOOLING** | Deployment              | [Setup Svelte App Tooling]
`rollup`                          | **TOOLING** | Svelte Bundler          | [Setup Svelte App Tooling]
`rollup-plugin-css-only`          | **TOOLING** | Svelte Bundler related  | [Setup Svelte App Tooling]
`rollup-plugin-livereload`        | **TOOLING** | Svelte Bundler related  | [Setup Svelte App Tooling]
`rollup-plugin-svelte`            | **TOOLING** | Svelte Bundler related  | [Setup Svelte App Tooling]
`rollup-plugin-terser`            | **TOOLING** | Svelte Bundler related  | [Setup Svelte App Tooling]
`sirv-cli`                        | **TOOLING** | A static file server    | [Setup Svelte App Tooling]
`svelte`                          | **TOOLING** | Svelte Compiler         | [Setup Svelte App Tooling]
`svelte-preprocess`               | **TOOLING** | Tailwind CSS Build      | [Setup Tailwind CSS]
`tailwindcss`                     | **TOOLING**<br>**APP**   | Tailwind CSS Build<br>and application code  | [Setup Tailwind CSS]<br>and app code: `src/...`
`tw-themes`                       | **TOOLING**<br>**APP**   | Tailwind Themes   <br>and application code  | [Setup tw-themes]   <br>and app code: `src/...`


<!--- *** SECTION *************************************************************** --->
# Project Resources

Wondering what some of the top-level file resources are?  Here is a
summary:

```
svelte-native-forms/
  .git/ ................ our local git repo
  .gitignore ........... git repo exclusions (typically machine generated)
  LICENSE.md ........... our MIT License
  node_modules/ ........ install location of dependent packages (maintained by npm)
  package.json ......... project meta data with dependencies
  package-lock.json .... exhaustive dependency list with installed "locked" versions (maintained by npm)
  public/ .............. the app deployment root (with generated build/) see: "Setup Svelte App Tooling"
  README.md ............ basic project docs
  rollup.config.js ..... the rollup bundler configuration (used by Svelte) see: "Setup Svelte App Tooling"
  snf/ ................. the inner project, hosting our util lib published on npm see: snf/TOOLING.md
  src/ ................. the app source code
    main.js ............ mainline entry point (redirect to Main.svelte)
    Main.svelte ........ general place to do setup/config (including Tailwind)
    App.svelte ......... our top-most App component (launched from Main.svelte)
    snip snip .......... many more!
  tailwind.config.js ... the tailwind css configuration file
  TOOLING.md ........... this document :-)

  ?? L8TR: (as needed)
  _book/ ............... machine generated docs (output of GitBook) see: "Setup Docs Tooling"
  docs/ ................ master source of GitBook project docs  see: "Setup Docs Tooling"
    *.md ............... various Markdown files making up our docs
```


<!--- *** SECTION *************************************************************** --->
# Project Setup

This section chronicles the original setup of the **svelte-native-forms**
project.

If you are forking this project, this detail is _unnecessary_, because
you simply `npm install` and then commence your development.

With that said, this section provides valuable insight on how the
project was originally setup and configured, and can be used in other
projects _(where you are starting from scratch)_!

**NOTE**: These sections roughly represent the chronology of when they
were carried out, however in some cases the order can be changed.

**Sub Sections**:
  - [Setup GitHub Project]
  - [Setup Svelte App Tooling]
  - [Setup Tailwind CSS]
  - [Setup tw-themes]
  - [Setup Absolute Imports]
  - [Setup Docs Tooling]
  - [Setup js.org sub-domain]



<!--- *** SUB-SECTION *************************************************************** --->
# Setup GitHub Project

There are many ways of initiating a new GitHub project. I'll leave the
details to you :-)

At the end of this process you should have:

- A new GitHub project
- A local git repository (for your development)
- Impacted Files:
  ```
    svelte-native-forms/
      .git/ ................ our local git repo
      .gitignore ........... git repo exclusions (typically machine generated)
      README.md ............ basic project docs
  ```

_My personal notes are "hidden" (in comment form) in this doc ..._

<!--- Comment out KJB Notes
**Setup GitHub Project** _(KJB Notes)_:

```
> REFERENCE: Project Check List:
  ... see: openSourcePublishing.txt
           c:/data/tech/dev/openSourcePublishing.txt
> REFERENCE: GitHub Repo:
  ... see: GitHub.txt ... Create a Repository on GitHub (i.e. a project)
           c:/data/tech/dev/GitHub.txt

> ********************************************************************************
- create github repository: svelte-native-forms
  * New Project:
    - Create a Repository on GitHub (i.e. a project)
      * from github page (https://github.com/KevinAst)
      * click + (by user name)
      * New Repository
      * repository name: svelte-native-forms
      * description:     Your view into External Systems
      * Initialize this repository with a README
      * Add MIT License
      * click: Create repository
      * when project complete (very short time)
      * if you have exposed only a few of your github projects,
        expose this one (as needed) by pinning the project
      * click: Clone or download
               - Open in Desktop
                 * opens in my installed local GitHub Desktop
                 * select my local project directory: c:/dev/      
               - this clones your repository to your local computer
               - skip this step if you’re importing an existing repository
      * now available on my local computer
        - local file system:
          c:/dev/svelte-native-forms> 
        - Github repository:
          https://github.com/KevinAst/svelte-native-forms.git
      * adjust following files:
        > AUTOMATICALLY DONE:
          .git/
          LICENSE ... NOTE: rename to LICENSE.md
          README.md ... add basic notes WITH a work-in-progress indicator
      * check in / sync
        ... readme/license updates
      * verify README content on GitHub
      * add following topics (to github pages)
        ... astx geeku svelte-native-forms
        ... NOT: pwa

 > ********************************************************************************
 - create branch: initial-tooling
```
KJB Notes --->



<!--- *** SUB-SECTION *************************************************************** --->
# Setup Svelte App Tooling

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
    public/ .............. the Svelte app deployment root (with generated build/) [see: "Setup Svelte App Tooling"]
    rollup.config.js ..... the rollup bundler configuration (used by Svelte) [see: "Setup Svelte App Tooling"]
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



<!--- *** SUB-SECTION *************************************************************** --->
# Setup Tailwind CSS

The **svelte-native-forms** demo app styles it's components based on
[Tailwind CSS].

This utility requires a build process that:

  1. Enables tailwind in general _(the `@tailwind` directives found in
     `src/Main.svelte`)_.

  2. Enable tailwind advanced directives _(`@apply`, `@layer`, etc.)_.

  3. Purging unneeded styles _(for production builds)_. The number of
     tailwind css classes are massive (over 1.5 meg).  A "production"
     build can prune this large resource to only what is used by a
     given application.  This is employed for "production" builds
     only, because it would be too time consuming to apply this for
     every development change.

Enabling and configuring the tailwind-portion of the build can be a
bit confusing, due to the large number of frameworks.  These
instructions are specific to [Svelte].

At the end of this process you should have:

- [Tailwind CSS] fully integrated in our [Svelte] app

- Impacted Dependencies:
  ```
  svelte-preprocess - A Svelte preprocessor with sensible defaults and support for: 
                      PostCSS, SCSS, Less, Stylus, CoffeeScript, TypeScript, Pug and much more.
                      ... Svelte's own parser understands only JavaScript, CSS and its HTML-like
                          syntax. To make it possible to write components in other languages,
                          such as TypeScript or SCSS, Svelte provides the preprocess API, which
                          allows to easily transform the content of your markup and your
                          style/script tags.

  tailwindcss       - A PostCSS plugin for tailwind
                      ... A utility-first CSS framework for rapidly building custom user interfaces.
                      ... this is what we are here for
  
  autoprefixer      - A PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values
                      from "Can I Use"
                      ... like: -webkit- (Chrome, Android, iOS, Safari),
                                -moz- (FireFox),
                                -ms- (IE),
                                -o- (Opera)
  
  NOT CURRENTLY INSTALLED/USED: ---------------------------------------------------------------
  
  postcss-nesting   - A PostCSS Nesting plugin, letting you nest style rules inside each other, 
                      following the CSS Nesting specification. ... KJB: hmmmm
                        /* THIS: */
                        a, b {
                          color: red;
                         
                          & c, & d {
                            color: white;
                          }
                        }
                        /* BECOMES: */
                        a, b {
                          color: red;
                        }
                        a c, a d, b c, b d {
                          color: white;
                        }
  
  @tailwindcss/ui   - OPTIONAL tailwind ui plugin <<< NO README ... 50K downloads / week
                      * KJB: I think this is a package of tailwind defs for pre-packaged components
                             MAY BE a PURCHASED PRODUCT (found a site for that)
                             ... https://tailwindui.com/
  ```

- Impacted Files:
  ```
  svelte-native-forms/
    tailwind.config.js ... the tailwind configuration file
    rollup.config.js ..... modified in support of tailwind
    src/
      main.js ............ mainline entry point (redirect to Main.svelte)
      Main.svelte ........ general place to do setup/config (including Tailwind)
      App.svelte ......... our top-most App component (launched from Main.svelte)
  ```

**Instructions**:

- [Official Install Docs](https://tailwindcss.com/docs/installation) ... _not svelte specific_
- [How to Set Up Svelte with Tailwind CSS](https://dev.to/swyx/how-to-set-up-svelte-with-tailwind-css-4fg5) ... _what I followed_
- [Svelte & Tailwind Css, minimal install](https://dev.to/paul42/svelte-tailwind-css-minimal-install-ia2) ... _hmmm_


**Installation Summary**:

- NOTE: Tailwind build process requires Node.js 12.13.0 or higher.

- install dependencies:
  ```
  $ npm install --save-dev svelte-preprocess tailwindcss autoprefixer
    + autoprefixer@10.2.4
    + tailwindcss@2.0.3
    + svelte-preprocess@4.6.9
  ```
- add `tailwind.config.js` at root:
  ```js
  tailwind.config.js
  ==================
                                                // KJB: same as in rollup.config.js
  const production = !process.env.ROLLUP_WATCH; // or some other env var like NODE_ENV
  export default {
    future: { // for tailwind 2.0 compatibility
      purgeLayersByDefault: true, 
      removeDeprecatedGapUtilities: true,
    },
    plugins: [
      // for tailwind UI users only
      // require('@tailwindcss/ui'), KJB: not using @tailwindcss/ui (can't find info on this)
      // other plugins here
    ],
    purge: {
      content: [
        "./src/**/*.svelte",
        // may also want to include base index.html
      ], 
      enabled: production // disable purge in dev
    },
  };
  ```

- setup rollup.config.js WITH svelte-preprocess MANAGING tailwindcss and autoprefixer
  ```diff
  rollup.config.js
  ================
    ...
  + import sveltePreprocess from 'svelte-preprocess'; // KJB: supporting tailwindCSS
    ...
    plugins: [
      svelte({
        ...
  +     // KJB: supporting tailwindCSS
  +     preprocess: sveltePreprocess({
  +       // https://github.com/kaisermann/svelte-preprocess/#user-content-options
  +       sourceMap: !production,
  +       postcss: {
  +         plugins: [
  +           require("tailwindcss"), 
  +           require("autoprefixer"),
  +         //require("postcss-nesting"),
  +         ],
  +       },
  +     }),
        ...
      }),
    ],
    ...
  ```

- configure Tailwind in our Svelte App

  ```js
  src/main.js <<< have it direct to Main.svelte
  ===========
  import Main from './Main.svelte';
  
  const main = new Main({
    target: document.body,
  });
  
  export default main;
  ```

  ```html
  src/Main.svelte <<< general place to do setup/config (including Tailwind)
  ===============
  <script>
   import App from './App.svelte'
  </script>
  
  <!-- launch our App -->
  <App/>
  
  <!-- setup Tailwind CSS (NOTE: do NOT believe lang="postcss" is needed) -->
  <style global lang="postcss">
  
   /* only apply purgecss on utilities, per Tailwind docs */
   /* purgecss start ignore */
   @tailwind base;
   @tailwind components;
   /* purgecss end ignore */
  
   @tailwind utilities;
  </style>
  ```

  ```html
  src/App.js <<< our top-level App component
  ==========
  app specific (whatever is needed for our app)
  ```

- Disable the global.css _(from the svelte template)_ so as to NOT
  interfere with tailwind css.  Simply remove it from `index.html`.
  ```diff
  public/index.html
  =================
  - <link rel='stylesheet' href='global.css'>
  ```

- **TEST:**
  ```html
  <p class="bg-red-500">Styled with tailwind ... should be red!</p>
  ```

- **NOTE:** when changing `Main.svelte` the build is **slow**
  _(upwards of 20 sec)_ ... **because** of the processing of the
  `@tailwind` directives.  This overhead is also incurred at the build
  startup.  **Fortunately**, this file rarely changes.


- **NOTE:** A prior rendition of these instructions involved
  additional npm scripts to run postcss-cli, but Chris Dhanaraj
  realized that this was NOT needed, since Svelte already had a way
  to inject CSS and svelte-preprocess that runs on every Svelte
  file.

- **UNRESOLVED:**
  FOR PURGING: Svelte has a `class:` binding syntax that isn't supported by
  Tailwind out of the box. There is an open discussion for this.

  - [Open Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/1731)
    Currently Tailwind’s default purge doesn’t match Svelte’s class: directive.
    <div class:bg-red-500={true} />
    SO: bg-red-500 will be removed in prod:

_My personal Detailed Notes are "hidden" (in comment form) in this doc ..._

<!--- Comment out KJB Notes
**Details**:
```
- don't understand various <script> qualifiers

  <style global lang="postcss"> ... 
                                ... INTERESTING: global promotes global directives (all components regardless of DOM hierarchy)
  
  <style> ... INTERESTING: I can utilize tailwind function in a <style> tag that is NOT qualified with lang="postcss"

- bundled css output size
  * my public/build/bundle.css is 3 MEG (3,221,102) <<< on a DEV build
  *                               5 K   (    5,046) <<< on a PROD build <<< KOOL
```
--->




<!--- *** SUB-SECTION *************************************************************** --->
# Setup tw-themes

Our application color themes are provided through [tw-themes].

At the end of this process you should have:

- Application access to the TwThemes object (where color themes can be activated)

- Impacted Dependencies:
  ```
  tw-themes
  ```

- Impacted Files:
  ```
  svelte-native-forms/
    rollup.config.js
    tailwind.config.js
  ```

**Original Instructions**:
- [tw-themes] _(see **Install** and **Getting Started** sections)_


**Summary**:

- Install Dependencies:

  ```
  $ npm install --save-dev tw-themes
    + tw-themes@0.1.1
  ```

- The key aspect is we create an application module _(see
  `src/layout/colorTheme.js`)_ that promotes the `TwThemes` object,
  from which the remainder of the API is gleaned.

- From a **tooling perspective**, we must inform tailwind of our
  **Context Colors**, by referencing this `TwThemes` object in
  `tailwind.config.js`, through the following snippet:

  ```js
  tailwind.config.js
  ==================
  import TwThemes from './src/layout/colorTheme';

  export default {

    ... snip snip

    // define our abstract Context Colors
    theme: {
      extend: {
        colors: TwThemes.colorConfig(),
      },
    },

    ... snip snip
  };
  ```

  **ISSUE:**

  There is an **issue** here in that we are importing application code
  in this configuration file, which means it must support **ES
  Modules**.

  Currently, tailwind does NOT support ES Modules in it's
  configuration file.

  **FIX:**

  To work around this, our `rollup.config.js` resolves this
  configuration file, and passes it directly to the tailwindcss
  plugin function:

  ```js
  rollup.config.js
  ================
  import tailwindcss    from 'tailwindcss';          // NEW: in support of ES Modules
  import tailwindConfig from './tailwind.config.js'; //      (found in tailwind.config.js)
  ... snip snip
  export default {
    ... snip snip
    plugins: [
      svelte({
        ... snip snip
        preprocess: sveltePreprocess({
          ... snip snip
          postcss: {
            plugins: [
              ... snip snip
           // require("tailwindcss"),      // ... NEW: normal usage
              tailwindcss(tailwindConfig), // ... NEW: in support of ES Modules (in tailwind.config.js)
  ```



<!--- *** SUB-SECTION *************************************************************** --->
# Setup Absolute Imports

We setup a 'svelte-native-forms' absolute import to make it appear
that our demo code is importing the installed package, even though it
is aliased to this code base.

**NOTE**: There is a know bug in the [alias rollup
plugin](https://www.npmjs.com/package/@rollup/plugin-alias), detailed
[here](https://github.com/rollup/plugins/issues/296) and
[here](https://stackoverflow.com/questions/61756633/svelte-compiler-generating-multiple-javascript-class-definitions).
This bug is only relevant when you use a mix of both absolute and
relative imports on a module that maintains state.  When this happens
there are two modules, and their state is duplicated :-( Currently, we
restrict the usage of absolute imports to the simulated
'svelte-native-forms' package.  Please be aware of this known bug,
should you choose to expand the usage of absolute imports.

To alleviate the pain of relative path imports (for example):

```js
import TreeView  from "../../../../util/comp/TreeView.svelte";
```

We enable absolute imports, where tilde (`~/`) is the src root
(`src/`):

```js
import TreeView  from "~/util/comp/TreeView.svelte";
```


**Notes**:

- When using defined aliases, **you must supply the extensions**
  _(`.js`, `.svelte`, etc.)_

- You cannot prefix with `src/` out of the box _(without this
  alias utility)_.

- Currently our unit tests may not import any code that uses alias imports
  ... _because jest **does NOT** utilize rollup_

- You can define as many aliases as you like

- You can even employ regexp _(see [alias
  docs](https://www.npmjs.com/package/@rollup/plugin-alias) for
  details)_


**Links**:
- [Absolute Paths in Svelte](https://dev.to/sjafferi/absolute-paths-in-svelte-488c)
- [npm: @rollup/plugin-alias](https://www.npmjs.com/package/@rollup/plugin-alias)

At the end of this process you should have:

- The ability to utilize absolute imports.

- Impacted Dependencies:
  ```
  @rollup/plugin-alias
  ```

- Impacted Files:
  ```
  svelte-native-forms/
    rollup.config.js ... modified to include alias configuration (Absolute Imports)
  ```


**Installation Details**:

- Install required dependencies (@rollup/plugin-alias):
  ```
  $ npm install --save-dev @rollup/plugin-alias
    + @rollup/plugin-alias@3.1.2
      added 2 packages from 2 contributors and audited 206 packages in 1.963s
  ```

- Configure `rollup.config.js` _(in support of **Absolute Imports**)_

  * For details, see embedded comments (`Absolute Imports`) in `rollup.config.js`

  * **rollup.config.js** _sample_
    ```js
    import alias from '@rollup/plugin-alias';  // KJB: in support of: Absolute Imports

    export default {
      ...
      plugins: [
        ...
        // KJB: Absolute Imports
        alias({
          entries: [
            // allow:      import {formChecker}  from "svelte-native-forms";
            // instead of: import {formChecker}  from "../../snf/src";
            { find: 'svelte-native-forms', replacement: 'snf/src/index.js' },
          ]
        })
      ]
    };
    ```

<!--- *** SUB-SECTION *************************************************************** --->
# Setup Docs Tooling

TODO: ?? details to follow



<!--- *** SUB-SECTION *************************************************************** --->
# Setup js.org sub-domain

To accommodate a more professional URL, [js.org] supports a
sub-domain registration process.

At the end of this process you should have:

- A github pages `js.org` sub-domain: 
  * FROM: https://kevinast.github.io/svelte-native-forms/
  * TO:   https://svelte-native-forms.js.org/

To accomplish this, simply follow the instructions on [js.org].  Here
is my summary _(more notes hidden here in comment form)_:

- First setup a preliminary set of docs that are deployable to
  [GitHub Pages].  `js.org` requires "reasonable content" before
  they will approve your request.  Alternatively you can create
  some temporary content that shows your intent.


- Create a CNAME file at gh-pages root.  In our case the gh-pages root
  is the parent of both our published resources (`docs` and `app`).
  You want to publish a temporary resource directly in the gh-pages
  root.

  **tempLoc/CNAME**
  ```
  svelte-native-forms.js.org
  ```

  * Deploy this temporary resource to the [GitHub Pages] root:

    ```
    $ npx gh-pages --dist tempLoc
    ```

    NOTE: Once this is done, you will not be able to browse your gh-pages
          till js.org processes your PR (below).

- Fork the `js.org` project and issue a PR to introduce our sub-domain
  * new entry in: 

    **cnames_active.js**
    ```
    "svelte-native-forms": "kevinast.github.io/svelte-native-forms",
    ```

- Monitor PR acceptance (will take 24 hrs).

- Once complete the sub-domain should be active

<!--- Comment out KJB Notes

****************
* setup js.org * ... can be done FIRST OR LAST
****************

  - either setup a preliminary set of docs -or- put a dummy page in place
    ... needed to be accepted by js.org

    * following temporary html file:
      - NOTE: has to be "reasonable content"
              - per their README, their focus is on granting subdomain requests to
                projects with a clear relation to the JavaScript ecosystem and
                community (NOT personal pages, blogs, etc.).
              - Projects such as NPM packages, libraries, tools that have a clear
                direct relation to JavaScript, will be accepted when requesting a
                JS.ORG subdomain.
              - KJB: My experience is that by a) placing limited content in, and b) referencing other project docs and your README
                     IT WILL BE ACCEPTED

      _docs/index.html
      ================
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>svelte-native-forms</title>
        </head>
        <body>
          <h1>svelte-native-forms</h1>
      
          <p><i>... minimalist form validation with powerful results</i></p>
          <p>
            Validating forms has notoriously been a painful development
            experience. Implementing client side validation in a user friendly way
            is a tedious and arduous process • you want to validate fields only at
            the appropriate time (when the user has had the chance to enter the
            data) • you want to present validation errors in a pleasing way • you
            may need to apply custom validation (specific to your application
            domain) • etc.
          </p>
      
          <p>
            Even with the introduction of HTML5's Form Validation, it is still
            overly complex, and doesn't address many common scenarios (mentioned
            above). Without the proper approach, form validation can be one of the
            most difficult tasks in web development.
          </p>
      
          <p>
            This sub-domain is currently work-in-progress and will
            eventually hold BOTH the formal documentation and the deployed app
            <i>(similar to other projects under my control: e.g. <a href="http://feature-u.js.org/">http://feature-u.js.org/</a>)</i>
          </p>
      
          <p>
            For now you may wish to take a look at the initial <a href="https://github.com/KevinAst/svelte-native-forms/blob/main/README.md">Design Docs</a>.
          </p>
      
        </body>
      </html>

    * deploy file to gh-pages
      $ npx gh-pages --dist _docs

    * test site
      ... https://KevinAst.github.io/svelte-native-forms

  - setup the js.org sub-domain alias: https://svelte-native-forms.js.org/
    ... see: c:/data/tech/dev/GitHub.txt (configure the js.org subdomain) ... prob a bit stale
    * KEY:  js.org offers sub-domain that points to GitHub Pages
    * NICE: https://svelte-native-forms.js.org/
            https://kevinast.github.io/svelte-native-forms

    * setup CNAME file at root and deploy to gh-pages
        CNAME
        =====
        svelte-native-forms.js.org

       - issue a PR that adds my sub-domain to js.org
         * all done from the web
         * IF NEED BE (in lue of syncing old repo - which is a major deal), simply delete your copy of an old dns.js.org fork
           - from your github dns.js.org fork
           - click settings
           - at bottom click delete repository
         * from the github js-org/dns.js.org project
           ... https://github.com/js-org/js.org     <<< FYI: used to be dns.js.org
         * click the FORK button
           ... this adds the dns.js.org to MY github
           ... https://github.com/KevinAst/js.org    <<< FYI: used to be dns.js.org
             * via the web, edit the cnames_active.js file
             * add your entry:
                   "svelte-native-forms": "kevinast.github.io/svelte-native-forms",
             * check in commit:
               >>> KEY: use this description (they will change it to this if you don't):
               ... NOT: adding svelte-native-forms sub-domain
               ... YES: svelte-native-forms.js.org
             * issue New Pull Request
             * back in the dns.js.org, monitor your Pull Request
               ... https://github.com/js-org/js.org/pulls
                   https://github.com/js-org/js.org/pull/5555
               ... should take effect within 24 hrs
               - confirm: web site NO LONGER SERVES till they enact this
                 https://kevinast.github.io/svelte-native-forms/
               - wait for sub-domain to go live (24 hrs)
                 * FIRST they will approve it
                 * THEN they will apply the domain
                 * ONCE ACCEPTED & MERGED 
                 * WORKS: should be able to now see the url:
                   ... https://svelte-native-forms.js.org/

KJB Notes --->




<!--- *** SECTION *************************************************************** --->
# Deploy Project

AI: ?? This may not yet be complete, but it is close (should include details of inner/outer projects)


This section chronicles the steps in deploying **svelte-native-forms**
to NPM, and publishing the **docs** and **demo app**.

**Feature Branch**:

Typically all development is done in a **feature branch**.  If you are
about to deploy, presumably your branch is complete and documented.

1. finalize version -and- history notes:

   - for the new version, use [semantic standards](http://semver.org/)

   - update version in:
     * `package.json` (both inner and outer projects)
     * `docs/toc.md` (version is referenced at top)
     * `docs/history.md` (within the "running" notes)

   - review/finalize all documentation impacted by change
     * also insure README.md does NOT need to change
       - NOTE: don't forget, the README is duplicated in the inner
         project _(sync as necessary)_!

   - optionally: save a link-neutral version of change history comments (to use in git tagging)
     * pull from history.md _(normalizing any reference links)_
     * ALTERNATE: simply reference the documentation history section (in the git tag)

       EX: https://svelte-native-forms.js.org/history.html#v0_1_0

**main Branch**:

1. issue PR (pull request) and merge to main branch

2. sync main to local machine (where the deployment will occur)

3. verify version is correct in:
   * `package.json` (both inner and outer projects)
   * `docs/toc.md`
   * `docs/history.md`

4. now, everything should be checked in to main and ready to publish

5. tag the release (in github)
   * verify the history page github links are correct (now that the tag exists)

6. publish **svelte-native-forms** to npm **_(THIS IS IT!)_**:

   ```
    $ cd snf/snf # go into inner project (where our library is)
    $ npm publish
      + svelte-native-forms@v.v.v
   ```

   verify publish was successful
   - receive email from npm
   - npm package: https://www.npmjs.com/package/svelte-native-forms
   - unpkg.com:   https://unpkg.com/svelte-native-forms/

7. publish **svelte-native-forms** documentation:

   ```
   $ npm run docs:publish
   ```
  
   verify publish docs was successful
   - https://svelte-native-forms.js.org/docs
     * see new version
     * see correct history


8. deploy **svelte-native-forms** demo app:

   ```
   $ npm run app:deploy
   ```
  
   verify deployed app was successful
   - https://svelte-native-forms.js.org/app
     * see new version


9. optionally test the new package in an external project (by installing it)


<!--- *** SECTION *************************************************************** --->
# Setup New Feature Branch

AI: ?? This may not yet be complete, but it is close (should include details of inner/outer projects)

This section documents the steps to setup a new **feature branch**
(where all development is typically done):

1. create a new branch (typically spawned from the "main" branch).

   **EX**: `next7`

2. devise "best guess" as to the next version number _(may be
   premature, but this can subsequently change)_.

   Reflect this in: 
   * `package.json` (both inner and outer projects)
   * `docs/toc.md` (version is referenced at top)
   * `docs/history.md` (within the "running" notes)

3. setup new running Revision History (in `docs/history.md`)

   This provides a place where we can incrementally maintain "running"
   revision notes.




<!--- *** LINKS ***************************************************************** --->

[NPM Scripts]:                    #npm-scripts
[Dependencies]:                   #dependencies
[Project Resources]:              #project-resources
[Project Setup]:                  #project-setup
  [Setup GitHub Project]:         #setup-github-project
  [Setup Svelte App Tooling]:     #setup-svelte-app-tooling
  [Setup Tailwind CSS]:           #setup-tailwind-css
  [Setup tw-themes]:              #setup-tw-themes
  [Setup Absolute Imports]:       #setup-absolute-imports
  [Setup Docs Tooling]:           #setup-docs-tooling
  [Setup js.org sub-domain]:      #setup-jsorg-sub-domain
[Deploy Project]:                 #deploy-project
[Setup New Feature Branch]:       #setup-new-feature-branch

[GitHub Pages]:                   https://pages.github.com/
[js.org]:                         https://js.org/
[npm]:                            https://www.npmjs.com/
[Svelte]:                         https://svelte.dev/
[sveltejs/template]:              https://github.com/sveltejs/template
[sveltejs/component-template]:    https://github.com/sveltejs/component-template
[Tailwind CSS]:                   https://tailwindcss.com/
[tw-themes]:                      https://tw-themes.js.org/
