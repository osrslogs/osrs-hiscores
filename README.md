# OSRS Hiscores

[![build status][build-badge]][build]
[![code coverage][coverage-badge]][coverage]
[![MIT license][license-badge]][license]
[![npm version][version-badge]][version]
[![semantic-release][release-badge]][release]

A Promise based Old School RuneScape hiscores API wrapper.

## Installation

```
$ npm install osrs-hiscores
```

## Usage

### getStats

| Parameter | Required | Note                                        |
| --------- | -------- | ------------------------------------------- |
| Player    | Yes      | The player name to lookup                   |
| Mode      | No       | The [mode](###Modes) (defaults to `normal`) |

```ts
import Hiscores from 'osrs-hiscores';

const hiscores = new Hiscores();

hiscores
  .getStats('zezima')
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

### getSkillPage

| Parameter | Required | Note                                         |
| --------- | -------- | -------------------------------------------- |
| Skill     | Yes      | The [skill](###Skills) to lookup             |
| Mode      | No       | The [mode](###Modes) (defaults to `normal`)  |
| Page      | No       | The page number to request (defaults to `0`) |

```ts
import Hiscores from 'osrs-hiscores';

const hiscores = new Hiscores();

hiscores.getSkillPage('runecraft');
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

### getActivityPage

| Parameter | Required | Note                                         |
| --------- | -------- | -------------------------------------------- |
| Activity  | Yes      | The [activity](###Activities) to lookup      |
| Mode      | No       | The [mode](###Modes) (defaults to `normal`)  |
| Page      | No       | The page number to request (defaults to `0`) |

```ts
import Hiscores from 'osrs-hiscores';

const hiscores = new Hiscores();

hiscores.getActivityPage('lastManStanding');
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

## Types

### Modes

### Activities

### Skills

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
