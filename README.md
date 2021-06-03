## Setup

### Pre-Requisites

- Yarn
- Node

### Installation

```bash
git clone https://github.com/letsgitcracking/just-pay.git
cd just-pay
yarn
```

### Adding workspace dependencies

```bash
yarn workspace <workspace_name> <command>
```

This will run the chosen Yarn command in the selected workspace.

Example:

```bash
yarn workspace @project/server add react-router-dom --dev
```

This will add `react-router-dom` as `dependencies` in your `packages/my-app/package.json`. To remove dependency use `remove` instead of add

## Usage

### Starting Project in Workspace

From your project root type start command for desired app

```bash
yarn workspace @project/server start
```
