# DeFi app

![Image](https://i.imgur.com/F7tpKU5.png)

For direct download, check the [Releases](https://github.com/DeFiCh/app/releases) for latest downloadable binaries for Windows, Mac and Linux.

## Scripts

`npm run init` initialize and install npm dependency for electron and webapp

## Setup binary

Fetch and extract binary file

Mac: `sh ./pre-build-mac.sh`
Linux: `sh ./pre-build-linux.sh`
Windows: `sh ./pre-build-win.sh`

### Run Electron desktop app with webapp

`npm start`

### Run Electron desktop app with webapp in dev mode

`npm run start:dev`

### Run webapp

`npm run start:react`

### Build react app

`npm run build:react`

### Build electron app for native platform

`npm run build`

### Build electron app for all platform

`npm run build:all`

## Electron configuration

Electron config is in [electron-app/index.ts](electron-app/index.ts)

## License

The DeFi Blockchain App is released under the terms of the MIT license. For more
information see https://opensource.org/licenses/MIT.

QR scanner shutter audio `webapp/src/assets/audio/shutter.mp3` is licensed by [Soundsnap](https://www.soundsnap.com). Commercial redistribution of the audio is prohibited. For full Soundsnap license, visit [https://www.soundsnap.com/licence](https://www.soundsnap.com/licence).
