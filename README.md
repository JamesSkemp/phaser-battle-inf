# Phaser Battle INF
This project is an attempt to recreate the basics of Battle INF, but with Phaser for the interface.

- [Battle INF v1 on GitHub](https://github.com/zephren/battle-inf)
- [Battle INF v1 with bug fixes](https://github.com/JamesSkemp/battle-inf)
	- [Playable version](https://jamesskemp.github.io/battle-inf/v1/)

This is based upon the [Starter Project for Phaser 3 with Visual Studio Code, TypeScript, and NodeJS](https://github.com/JamesSkemp/phaser-starter-templates).

## How to Build the Site
To build this project you'll need [Node.js](https://nodejs.org) installed.

Next run `npm install` in the root directory to install the various dependencies.

Run `gulp` after modifying code to populate the **dist** directory with the final site contents.

If you'd like to run a simple web server, install http-server via `npm install http-server -g`, which can then be run from the dist directory by running `http-server`.

## Upgrading Phaser
To upgrade Phaser 3 run `npm upgrade phaser` (passing `--save` if you wish to update the package.json).

Phaser TypeScript definitions can currently be found at https://github.com/photonstorm/phaser3-docs/tree/master/typescript
