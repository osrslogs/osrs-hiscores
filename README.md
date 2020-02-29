# OSRS Hiscores

[![build status][build-badge]][build]
[![code coverage][coverage-badge]][coverage]
[![MIT license][license-badge]][license]
[![npm version][version-badge]][version]
[![semantic-release][release-badge]][release]

A Promise based [Old School RuneScape](https://oldschool.runescape.com) hiscores API.

**OSRS Hiscores** goal is to streamline the process of programmatically
interacting with the Old School RuneScape hiscores. This is done by having
excellent configuration to support a wide range of use-cases and using [JSON](https://en.wikipedia.org/wiki/JSON) friendly objects as return types.

We provide simple methods for:

- Lookup: Individual player
- Lookup: Skill table page
- Lookup: Activity table page
- Parse: Display name format

[TypeScript](https://www.typescriptlang.org) is fully supported with definitions and custom types.

## Installation

```
$ npm install osrs-hiscores
```

## Usage

### Import

Currently ES6 import is being used by default. This means if you are using CommonJS
you need to import using the following syntax:

```js
const Hiscores = require('osrs-hiscores').default;
```

### Configuration

We support _optional_ custom configuration for the HTTP requests being performed by the library. Default values will be used if no config is provided when initializing the `Hiscores` object.

```ts
const config = {
  // `userAgent` specifies which user agent to send in the header of the request
  userAgent: 'osrs-hiscores',

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request is aborted.
  timeout: 1000, // default is `0` (no timeout)

  // `proxy` defines the hostname and port of the proxy server.
  // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
  // supplies credentials. This will set an `Proxy-Authorization` header.
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'bobross',
      password: 'happy11accidents',
    },
  },
};
```

### getStats

Performs a hiscore lookup of the player name.

Note: This method can not be used from a browser due to `Cross-Origin Resource Sharing` being disabled on the Old School RuneScape hiscores API.

| Parameter | Required | Note                                                   |
| --------- | -------- | ------------------------------------------------------ |
| Player    | Yes      | The player name to lookup                              |
| Mode      | No       | The [mode](docs/TYPES.md#Modes) (defaults to `normal`) |

#### Usage

```ts
import Hiscores from 'osrs-hiscores';

const hiscores = new Hiscores({ timeout: 6000 }); // provide config if needed

hiscores
  .getStats('zezima')
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

#### Response

```js
{
  skills: {
    overall: { rank: 1234, level: 1234, experience: 1234 },
    attack: { rank: 1234, level: 1234, experience: 1234 },
    ...
  },
  clues: {
    all: { rank: 453, score: 12345 },
    beginner: { rank: 52356, score: 2 },
    ...
  },
  bosses: {
    kingBlackDragon: { rank: 1, score: 11 },
    theatreOfBlood: { rank: 654, score: 86 },
    ...
  },
  bountyHunter: {
    hunter: { rank: 567, score: 3456 },
    rogue: { rank: -1, score: -1 }
  },
  leaguePoints: { rank: 4321, score: 2 },
  lastManStanding: { rank: 234, score: 235 }
}
```

### getSkillPage

Performs a skill page lookup.

| Parameter | Required | Note                                                   |
| --------- | -------- | ------------------------------------------------------ |
| Skill     | Yes      | The [skill](docs/TYPES.md#Skills) to lookup            |
| Mode      | No       | The [mode](docs/TYPES.md#Modes) (defaults to `normal`) |
| Page      | No       | The page number to request (defaults to `0`)           |

#### Usage

```ts
import Hiscores from 'osrs-hiscores';

const hiscores = new Hiscores(); // provide config if needed

hiscores
  .getSkillPage('runecraft')
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

#### Response

A list representing the page table of the requested skill.

```js
[
  { rank: 1, level: 4321, experience: 4321, name: "zezima" },
  { rank: 2, level: 1234, experience: 1234, name: "lynx titan" },
  ...
]
```

Note: The `dead` property is only included if `mode` is `hardcore`.

### getActivityPage

Performs an activity page lookup.

| Parameter | Required | Note                                                   |
| --------- | -------- | ------------------------------------------------------ |
| Activity  | Yes      | The [activity](docs/TYPES.md#Activities) to lookup     |
| Mode      | No       | The [mode](docs/TYPES.md#Modes) (defaults to `normal`) |
| Page      | No       | The page number to request (defaults to `0`)           |

#### Usage

```ts
import Hiscores from 'osrs-hiscores';

const hiscores = new Hiscores(); // provide config if needed

hiscores
  .getActivityPage('lastManStanding', 'hardcore')
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

#### Response

A list representing the page table of the requested skill.

```js
[
  { rank: 1, score: 4321, name: "bob", dead: true },
  { rank: 2, score: 1234, name: "ross", dead: false },
  ...
]
```

Note: The `dead` property is only included if `mode` is `hardcore`.

### getDisplayName

Performs a lookup to find the formatted display name of the player.

| Parameter | Required | Note                                                   |
| --------- | -------- | ------------------------------------------------------ |
| Player    | Yes      | The player name to lookup                              |
| Mode      | No       | The [mode](docs/TYPES.md#Modes) (defaults to `normal`) |

#### Usage

```ts
import Hiscores from 'osrs-hiscores';

const hiscores = new Hiscores(); // provide config if needed

hiscores
  .getDisplayName('zezima')
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

#### Response

```js
{
  format: 'Zezima';
}
```

## Types

See the [TYPES](docs/TYPES.md) file for details.

## Contributing

See the [CONTRIBUTING](CONTRIBUTING.md) file for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- badges -->

[build-badge]: https://img.shields.io/github/workflow/status/osrslogs/osrs-hiscores/CI/master
[build]: https://github.com/osrslogs/osrs-hiscores/actions?query=branch%3Amaster
[coverage-badge]: https://img.shields.io/codecov/c/github/osrslogs/osrs-hiscores/master
[coverage]: https://codecov.io/github/osrslogs/osrs-hiscores/branch/master
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: LICENSE
[version-badge]: https://img.shields.io/npm/v/osrs-hiscores
[version]: https://www.npmjs.com/package/osrs-hiscores
[release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[release]: https://github.com/semantic-release/semantic-release
