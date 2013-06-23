<?php

// Bootstrap
require __DIR__ . DIRECTORY_SEPARATOR . 'bootstrap.php';

$app->error(function (Exception $e, $code) {
	if ($code == 404) {
		return '404 - Not Found! // ' . $e->getMessage();
	} else {
		return 'Something went wrong // ' . $e->getMessage();
	}
});

//$app->get('/', function(Silex\Application $app) {
//	return $app->redirect($app['request']->getBaseUrl() . '/');
//});

// Mount our ControllerProviders
$app->mount('/', new Ikdoeict\Provider\Controller\HomeController());
$app->mount('/dietist', new Ikdoeict\Provider\Controller\DieticianController());
$app->mount('/klant', new Ikdoeict\Provider\Controller\CustomerController());
$app->mount('/secure', new Ikdoeict\Provider\Controller\SecureController());