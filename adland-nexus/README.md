# AdLand Nexus

AdLand Nexus is a polished, local-first desktop command center made by **AdLand Studio**.

## Included

- Dashboard with live local system snapshot
- Persistent tasks with priorities and completion state
- Local notes editor
- Reusable code / command snippets with clipboard copy
- Focus timer with Focus / Break modes
- Calculator and system utility panel
- Command palette (Ctrl+Shift+Space)
- Dark glass desktop UI with adjustable accent
- Electron security defaults: context isolation and no Node integration in the renderer

## Build

```bash
npm install
npm run build:desktop
npm run dist
```

Windows installers are produced under `release/`.