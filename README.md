## Getting Started

### Step 0: Clone Example Repo

Enter one of the following commands into your terminal.

```
git clone https://github.com/Threekit/Examples-Temporary.git
cd examples
npm install
```

```
git clone https://github.com/Threekit/Examples-Temporary.git
cd examples
yarn
```

### Step 1: Create Auth Token

Go to [Demo Token Generator](https://token-gen.demo.threekit.com/demos-public) and create a token for your local environment. `localhost:3000` is the default domain.

<img src="https://i.imgur.com/06chXMS.gif" height="300px" />

### Step 2: Update Tokens

Using the Auth Token you just created, enter the following command into your terminal (replace the xxx-xx-xxx w/your token). This will replace all of the dummy tokens in Threekit/Examples with an active demo token.

```
npm run token xxx-xx-xxx
```

```
yarn token xxx-xx-xxx
```

### Step 3: Happy Building!

You're all set.

```
npm run dev
```

```
yarn dev
```
