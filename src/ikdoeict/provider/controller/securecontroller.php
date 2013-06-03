<?php

namespace Ikdoeict\Provider\Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

//Secured controller, used in the website to get data to javascript files with AJAX calls, returns json objects
class SecureController implements ControllerProviderInterface {

        // '/secure' controller, functionality and paths
	public function connect(Application $app) {

		//@note $app['controllers_factory'] is a factory that returns a new instance of ControllerCollection when used.
		//@see http://silex.sensiolabs.org/doc/organizing_controllers.html
		$controllers = $app['controllers_factory'];

		// Bind sub-routes
                $controllers->get('/klanten/{customerId}/bmi', array($this, 'customerBmi'))->assert('customerId', '\d+');
                $controllers->get('/klanten/{customerId}/gewicht', array($this, 'customerWeight'))->assert('customerId', '\d+');
                $controllers->get('/food/{categoryId}', array($this, 'foodByCategory'))->assert('categoryId', '\d+');
                $controllers->post('/klanten/{customerId}/maaltijden', array($this, 'customerMeals'))->assert('customerId', '\d+');
                $controllers->post('/dietist/klanten/{customerId}/maaltijden', array($this, 'dieticianCustomerMeals'))->assert('customerId', '\d+');
                $controllers->get('/dietist/klanten/{customerId}/maaltijden/nieuw', array($this, 'getUnseenDatesOfDietician'))->assert('customerId', '\d+');
                $controllers->post('/dietist/klanten/{customerId}/bericht', array($this, 'makeNewMessageFromDietician'))->assert('customerId', '\d+');
		return $controllers;

	}

        //Get customer BMI progression
        //Returns json object
        public function customerBmi(Application $app, $customerId, Request $request) {
            if (!$app['session']->get('dietician') && !$app['session']->get('customer')) {
                return $app->json("Not allowed", 401);
            }
            
            $dietician = $app['session']->get('dietician');
            if ($dietician) {
                $customer = $app['dietician']->getDietistCustomer($dietician['id'], $customerId);
                if (!$customer) {
                    return $app->json("Not allowed", 401);
                }
            }

            $return = $app['secure']->getCustomerBmi($customerId);
            
            return $app->json($return, 200);
	}
        
        //Get customer weight progression
        //returns json object
        public function customerWeight(Application $app, $customerId, Request $request) {
            if (!$app['session']->get('dietician') && !$app['session']->get('customer')) {
                return $app->json("Not allowed", 401);
            }
            
            $dietician = $app['session']->get('dietician');
            if ($dietician) {
                $customer = $app['dietician']->getDietistCustomer($dietician['id'], $customerId);
                if (!$customer) {
                    return $app->json("Not allowed", 401);
                }
            }

            $return = $app['secure']->getCustomerWeight($customerId);
            
            return $app->json($return, 200);  
        }
        
        //Get all food by a categorie id
        //returns json object
        public function foodByCategory(Application $app, $categoryId, Request $request) {
            if (!$app['session']->get('customer')) {
                return $app->json("Not allowed", 401);
            }
            
            $return = $app['secure']->getFoodByCategory($categoryId);
            
            return $app->json($return, 200);
        }
        
        //Get all meals of a certain customer on a certain date (POST)
        //returns json object
        public function customerMeals(Application $app, $customerId, Request $request) {
            if (!$app['session']->get('customer')) {
                return $app->json("Not allowed", 401);
            }
            
            if (!isset($_POST['date'])) {
                return $app->json("Not allowed", 401);
            }
            
            $return = $app['secure']->getCustomerMeals($customerId, $_POST['date']);
            json_encode($return);
            foreach($return as $i => $meal) {
                $food = $app['secure']->getFoodByMeals($meal['id']);
                foreach($food as $y => $f) {
                    $return[$i]['food'][$y] = $f;
                }
            }
            
            return $app->json($return, 200);  
        }
        
        //Get all meals of a certain customer on a certain date (POST)
        //This method is used on the dietician controller, it needs more data to return
        //returns json object
        public function dieticianCustomerMeals(Application $app, $customerId, Request $request) {
            $dietician = $app['session']->get('dietician');
            if (!$dietician) {
                return $app->json("Not allowed", 401);
            }

            $customer = $app['dietician']->getDietistCustomer($dietician['id'], $customerId);
            if (!$customer) {
                return $app->json("Not allowed", 401);
            }
            
            if (!isset($_POST['date'])) {
                return $app->json("Not allowed", 401);
            }
            
            $return['meals'] = array();
            $return['meals'] = $app['secure']->getCustomerMeals($customerId, $_POST['date']);
            $return['max'] = $app['secure']->getConsultationOfMeal($return['meals'][0]['id']);
            $return['total'] = array();

            $totalKcal = 0;
            $totalCarbohydrates = 0;
            $totalSugars = 0;
            $totalFats = 0;
            $totalProteins = 0;
            $totalCholesterol = 0;
            $totalFibres = 0;
            $totalSodium = 0;
            foreach($return['meals'] as $i => $meal) {
                $food = $app['secure']->getDetailedFoodByMeals($meal['id']);
                $return['meals'][$i]['total'] = array();
                $kcal = 0;
                $carbohydrates = 0;
                $sugars = 0;
                $fats = 0;
                $proteins = 0;
                $cholesterol = 0;
                $fibres = 0;
                $sodium = 0;
                foreach($food as $y => $f) {
                    $return['meals'][$i]['food'][$y] = $f;
                    $kcal += $f['kcal'];
                    $return['meals'][$i]['total']['kcal'] = $kcal;
                    $carbohydrates += $f['carbohydrates'];
                    $return['meals'][$i]['total']['carbohydrates'] = $carbohydrates;
                    $sugars += $f['sugars'];
                    $return['meals'][$i]['total']['sugars'] = $sugars;
                    $fats += $f['fats'];
                    $return['meals'][$i]['total']['fats'] = $fats;                    
                    $proteins += $f['proteins'];
                    $return['meals'][$i]['total']['proteins'] = $proteins;  
                    $cholesterol += $f['cholesterol'];
                    $return['meals'][$i]['total']['cholesterol'] = $cholesterol;  
                    $fibres += $f['fibres'];
                    $return['meals'][$i]['total']['fibres'] = $fibres;  
                    $sodium += $f['sodium'];
                    $return['meals'][$i]['total']['sodium'] = $sodium;  
                }
                $totalKcal += $kcal;
                $return['total']['kcal'] = $totalKcal;
                $totalCarbohydrates += $carbohydrates;
                $return['total']['carbohydrates'] = $totalCarbohydrates;
                $totalSugars += $sugars;
                $return['total']['sugars'] = $totalSugars;
                $totalFats += $fats;
                $return['total']['fats'] = $totalFats;                
                $totalProteins += $proteins;
                $return['total']['proteins'] = $totalProteins; 
                $totalCholesterol += $cholesterol;
                $return['total']['cholesterol'] = $totalCholesterol; 
                $totalFibres += $fibres;
                $return['total']['fibres'] = $totalFibres; 
                $totalSodium += $sodium;
                $return['total']['sodium'] = $totalSodium; 
            }
            
            //update meals of this date as seen
            $app['secure']->setMealsDateAsSeen($_POST['date'], $customerId);
            
            return $app->json($return, 200);  
        
        }
        
        //Get all unseen dates of a dietician's customer where meals have been added
        //returns json object
        public function getUnseenDatesOfDietician(Application $app, $customerId, Request $request) {
            $dietician = $app['session']->get('dietician');
            if (!$dietician) {
                return $app->json("Not allowed", 401);
            }

            $customer = $app['dietician']->getDietistCustomer($dietician['id'], $customerId);
            if (!$customer) {
                return $app->json("Not allowed", 401);
            }
            
            $unseenDates = $app['secure']->getUnseenDates($customerId, $dietician['id']);
            
            return $app->json($unseenDates, 200);        

        }
 
        //Make a new communication message from dietician to a customer
        //returns json object
        public function makeNewMessageFromDietician(Application $app, $customerId, Request $request) {
            $dietician = $app['session']->get('dietician');
            if (!$dietician) {
                return $app->json("Not allowed", 401);
            }

            $customer = $app['dietician']->getDietistCustomer($dietician['id'], $customerId);
            if (!$customer) {
                return $app->json("Not allowed", 401);
            }
            
            $msgArray['from_dietician_id'] = $dietician['id'];
            $msgArray['to_customer_id'] = $customerId;
            $msgArray['datetime'] = date("Y-m-d H:i:s");
            $msgArray['text'] = htmlentities($_POST['msg']);
            $insert = $app['secure']->makeNewDieticianMessage($msgArray);
            
            return $app->json($insert, 200);        

        }        
        
}