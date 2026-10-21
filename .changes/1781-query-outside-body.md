### Fixed

- **`@reticlehq/realm-browser` — page content outside `<body>` was invisible to `find` and `text` checks.** Unscoped queries searched only within `document.body`, so text living in other elements (for example an overlay injected as a sibling of `<body>`) could not be found even though it was on the page. `find` and `text` now search from `<html>`, still excluding `<head>` internals like `<title>` and `<style>`. Closes [#1781](https://github.com/reticlehq/reticle/issues/1781).
