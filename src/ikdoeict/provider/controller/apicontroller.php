<?php

namespace Ikdoeict\Provider\Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

//Secured API, used in the website to get data to javascript files with AJAX calls
class ApiController implements ControllerProviderInterface {

	public function connect(Application $app) {

		//@note $app['controllers_factory'] is a factory that returns a new instance of ControllerCollection when used.
		//@see http://silex.sensiolabs.org/doc/organizing_controllers.html
		$controllers = $app['controllers_factory'];

		// Bind sub-routes
                $controllers->match('/klanten/{customerId}/bmi', array($this, 'customerBmi'))->assert('customerId', '\d+');
                
		return $controllers;

	}

        public function customerBmi(Application $app, $customerId, Request $request) {
            if (!$app['session']->get('dietician')) {
                return $app->json("Not allowed", 401);
            }
            
            $dietician = $app['session']->get('dietician');
            $customer = $app['dietician']->getDietistCustomer($dietician['id'], $customerId);
            if (!$customer) {
                return $app->json("Not allowed", 401);
            }

            $return = $app['api']->getCustomerBmi($customerId);
            
            return $app->json($return, 200);
	}
        
}