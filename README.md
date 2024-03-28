<!-- omit in toc -->
# WebRTC Hangouts App

Client (demo): [webrtc.miloszgilga.pl](https://webrtc.miloszgilga.pl) <br>
Server (demo): [api.webrtc.miloszgilga.pl](https://api.webrtc.miloszgilga.pl) <br>
Trello board: [https://trello.com/b/vOwic0HM/siim-projekt](https://trello.com/b/vOwic0HM/siim-projekt)

## Table of content

- [Table of content](#table-of-content)
- [Requirements](#requirements)
- [Clone and install](#clone-and-install)
- [Setting linter](#setting-linter)
- [Code continuity](#code-continuity)

<a name="requirements"></a>

## Requirements

- node v20.X (check version via `node -v`, for multiple versions use nvm [info](https://github.com/nvm-sh/nvm/blob/master/README.md))
- npm v10.X
- Visual Studio Code

<a name="clone-and-install"></a>

## Clone and install

1. Clone monorepo via:
```bash
$ git clone https://github.com/milosz08/webrtc-hangouts-app.git
```

2. After downloaded, open in Visual Studio Code and install extensions from settings.json file.

3. If you don't have yet yarn, install via:
```bash
$ npm i -g yarn
```

4. Go to root project directory and install all dependencies via:
```bash
$ yarn install
```

5. Run client and server via:
```bash
$ yarn run dev:all
```
Client local url: [http://localhost:6061](http://localhost:6061) <br>
Server local url: [http://localhost:6062](http://localhost:6062)

6. Or run separately via:
```bash
$ yarn run dev:<module>
```
where `<module>` is `client` or `server`.

## Setting linter
1. In Visual Studio Code press Ctrl+Shift+P and type `Restart ESLint server`.
2. Then, press Ctrl+J and open output -> Eslint. If you have any errors after invoke ESlint daemon,
   try reload window (Ctrl+Shift+P, type `Reload window`) or rerun entire Visual Studio Code app.
3. Once ESlint server is running, toggle default formatter to Right Click -> Format Document With -> Configure
   default formatted and choose ESlint (in any .js file).

## Code continuity

1. Husky will prevent you for pushing code with errors (protip: if `git commit` command throw exception,
   check error log).
2. Default `master` branch is locked and protected (any push at this branch invoking CI/CD
   build pipeline for client and server), so you cannot push commits directly at this branch.
3. For any task from board, you should create separated branch:
```bash
git checkout -b <branchname>
```
1. Once the task is completed, mark pull request as "ready to review" via Github UI.
2. When task is done and reviewed, I will merge with `master` branch. Provided changes will be automatically
   deployed to server.
