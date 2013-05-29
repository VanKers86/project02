<?php

namespace Ikdoeict\Provider\Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class CustomerController implements ControllerProviderInterface {

	public function connect(Application $app) {

		//@note $app['controllers_factory'] is a factory that returns a new instance of ControllerCollection when used.
		//@see http://silex.sensiolabs.org/doc/organizing_controllers.html
		$controllers = $app['controllers_factory'];

		// Bind sub-routes
                $controllers->match('/', array($this, 'login'));
		$controllers->match('/login', array($this, 'login'));
                $controllers->match('/console', array($this, 'console'));
                $controllers->match('/logout', array($this, 'logout'));
                $controllers->match('/maaltijden', array($this, 'meals'));
                $controllers->match('/progressie', array($this, 'progression'));

		return $controllers;

	}

        public function login(Application $app, Request $request) {
            if ($app['session']->get('customer')) {
                return $app->redirect('console');
            }            
            $error;

            $form = $app['form.factory']->createBuilder('form')
                ->add('Email', 'text')
                ->add('Paswoord', 'text')
                ->getForm();

            if ($request->isMethod('POST')) {
                $form->bind($request);

                if ($form->isValid()) {
                    $formData = $form->getData();
                    $customer = $app['customer']->findCustomer($formData['Email'], $formData['Paswoord']);
                    if ($customer) {
                        $app['session']->set('customer', $customer);
                        $customerDietician = $app['customer']->findCustomerDietician($customer['id']);
                        $app['session']->set('customerDietician', $customerDietician);
                        return $app->redirect('console');
                    }
                    else {
                        $error = "Foutieve combinatie e-mailadres/wachtwoord";
                        return $app['twig']->render('customer/login.twig', array('form' => $form->createView(), 'error' => $error));
                    }
                }
            }

            return $app['twig']->render('customer/login.twig', array('form' => $form->createView()));
        }

        public function console(Application $app, Request $request) {
            if (!$app['session']->get('customer')) {
                return $app->redirect('/');
            }

            $customer = $app['session']->get('customer');
            $customerDietician = $app['session']->get('customerDietician');
            $lastConsultationDate = $app['customer']->getLastConsultationDate($customer['id']);
            
            return $app['twig']->render('customer/console.twig', array('customer' => $customer, 'customerDietician' => $customerDietician, 'lastConsultationDate' => $lastConsultationDate));
        }
        
        public function logout(Application $app, Request $request) {
            $app['session']->remove('customer');
            $app['session']->remove('customerDietician');
            return $app->redirect('/');
        }
        
        public function meals(Application $app, Request $request) {
            if (!$app['session']->get('customer')) {
                return $app->redirect('/');
            }

            $customer = $app['session']->get('customer');
            $customerDietician = $app['session']->get('customerDietician');
            $mealtypes = $app['customer']->getMealTypes();
            $foodcategories = $app['customer']->getFoodCategories();
            
            if ($request->isMethod('POST')) {
                if (isset($_POST['addMeal'])) {
                    $meal['customer_id'] = $customer['id'];
                    $meal['type_id'] = $_POST['type'];
                    $meal['date'] = $_POST['date'];
                    $mealId = $app['customer']->addNewMeal($meal);
                    $meal_food['meals_id'] = $mealId;
                    foreach($_POST['food'] as $key => $food) {
                        $meal_food['food_id'] = $app['customer']->getFoodId($food);
                        $meal_food['gram'] = $_POST['gram'][$key];
                        $app['customer']->addNewMealFood($meal_food);
                    }
                    return $app->redirect('/klant/maaltijden');
                }
            };
            
            
            return $app['twig']->render('customer/meals.twig', array('customer' => $customer, 
                                                                    'customerDietician' => $customerDietician, 
                                                                    'mealtypes' => $mealtypes,
                                                                    'foodcategories' => $foodcategories));
        }
        
        public function progression(Application $app, Request $request) {
            if (!$app['session']->get('customer')) {
                return $app->redirect('/');
            }

            $customer = $app['session']->get('customer');
            $customerDietician = $app['session']->get('customerDietician');
            
            return $app['twig']->render('customer/progression.twig', array('customer' => $customer, 'customerDietician' => $customerDietician));
        }        
}
        