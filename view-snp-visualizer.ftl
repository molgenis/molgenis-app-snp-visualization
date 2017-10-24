<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SNP Visualisations</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <script src="https://use.fontawesome.com/4b6985a594.js"></script>
</head>
<body>
<div id="app"></div>
<script>
  window.__INITIAL_STATE__ = {
    baseUrl: '/menu/main/apps/${app.id}/',
    serverUrl: 'http://localhost:8080/',
    lng: 'en',
    fallbackLng: 'en'
  }

  // See https://webpack.github.io/docs/configuration.html
  __webpack_public_path__ = '/apps/${app.id}/'
</script>
<!-- built files will be auto injected -->
</body>
</html>
