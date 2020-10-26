# Moov Paygate Interface

![React-PayGate](https://.gif)

This is a demo frontend for Moov's PayGate, using React and Material UI.  Last tested with v0.8.0-rc1 of PayGate.



## Installation / Running

_for dev_

First, get a running instance of PayGate v0.8.0-rc1:

```sh
git clone https://github.com/tgunnoe/react-paygate

# change into the new directory
docker-compose up -d


# install app
npm install

npm start # will run the app

# Visit the app at http://localhost:3000
```

_for test_

```
npm run test
```

_for Production_

```sh
npm run build

cd build

# start a static server serving ./build dir, eg node serve/http-server or serve in express using express.static
serve -s build
```
## License

MIT
