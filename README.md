# syfo-oppfolgingsplan-frontend

## Run locally during development

Se [eSyfo-Wiki - Next bygg og kjør](https://github.com/navikt/esyfo-dev-tools/wiki/nextjs-build-run).

Når dev-server kjører kan du gå til en av "start-sidene":
- [http://localhost:3000/syk/oppfolgingsplan/123](http://localhost:3000/syk/oppfolgingsplan/123) for arbeidsgiver
- [http://localhost:3000/syk/oppfolgingsplan/sykmeldt](http://localhost:3000/syk/oppfolgingsplan/sykmeldt) for sykmeldt/personbruker

## Checks you can run before pushing

`mise ci`

These are also run in CI pipeline by Github Actions, and will stop the build and deploy if they fail. It can therefore be convenient to run them locally first.

## Testing

The project uses Vitest for unit and component testing.

Run `npm run test` to run Vitest, which will find and run all unit test files in the project. You can have it running in the terminal while editing code, and the affected tests will automatically rerun when saving files.

For VS Code the [Vitest extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) is nice.

See more documentation in `Testing.md`.
