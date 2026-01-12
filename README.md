# syfo-oppfolgingsplan-frontend

## Run locally during development

Run the development server with

```bash
npm run dev
```

Then go to
- [http://localhost:3000/syk/oppfolgingsplan/123](http://localhost:3000/syk/oppfolgingsplan/123) to see start page for arbeidsgiver.
- [http://localhost:3000/syk/oppfolgingsplan/sykmeldt](http://localhost:3000/syk/oppfolgingsplan/sykmeldt) to see start page for sykmeldt/personbruker.

## Checks you can run before pushing

- `npm run build` to verify that the full project builds. If there are Typescript errors, this will fail.
- `npm run test` to run tests.
- `npm run lint` to run eslint.

These are also run in CI pipeline by Github Actions, and will stop the build and deploy if they fail. It can therefore be convenient to run them locally first.

## Testing

The project uses Vitest for unit and component testing.

Run ```npm run test``` to run Vitest, which will find and run all unit test files in the project. You can have it running in the terminal while editing code, and the affected tests will automatically rerun when saving files.

For VS Code the [Vitest extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) is nice.

See more documentation in `Testing.md`.