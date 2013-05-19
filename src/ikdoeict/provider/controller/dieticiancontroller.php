<?php

namespace Ikdoeict\Provider\Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class DieticianController implements ControllerProviderInterface {

	public function connect(Application $app) {

		//@note $app['controllers_factory'] is a factory that returns a new instance of ControllerCollection when used.
		//@see http://silex.sensiolabs.org/doc/organizing_controllers.html
		$controllers = $app['controllers_factory'];

		// Bind sub-routes
                $controllers->match('/', array($this, 'login'));
		$controllers->match('/login', array($this, 'login'));
                $controllers->match('/console', array($this, 'console'));
                $controllers->match('/logout', array($this, 'logout'));
                $controllers->match('/klanten', array($this, 'customers'));
                $controllers->match('/klanten/nieuw', array($this, 'addCustomer'));
                $controllers->match('/klanten/{customerId}', array($this, 'customerDetail'))->assert('customerId', '\d+');
                $controllers->match('/klanten/{customerId}/consultatie', array($this, 'customerConsultation'))->assert('customerId', '\d+');
                
		return $controllers;

	}

        public function login(Application $app, Request $request) {
            if ($app['session']->get('dietician')) {
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
                    $dietician = $app['dietician']->findDietician($formData['Email'], $formData['Paswoord']);
                    if ($dietician) {
                        $app['session']->set('dietician', $dietician);
                        return $app->redirect('console');
                    }
                    else {
                        $error = "Foutieve combinatie e-mailadres/wachtwoord";
                        return $app['twig']->render('dietician/login.twig', array('form' => $form->createView(), 'error' => $error));
                    }
                }
            }

            return $app['twig']->render('dietician/login.twig', array('form' => $form->createView()));
        }

        public function console(Application $app, Request $request) {
            if (!$app['session']->get('dietician')) {
                return $app->redirect('/');
            }

            $dietician = $app['session']->get('dietician');
            
            return $app['twig']->render('dietician/console.twig', array('dietician' => $dietician));
        }
        
        public function customers(Application $app, Request $request) {
            if (!$app['session']->get('dietician')) {
                return $app->redirect('/');
            }
            $dietician = $app['session']->get('dietician');
            $customers = $app['dietician']->findCustomers($dietician['id']);
            
            return $app['twig']->render('dietician/customers.twig', array('dietician' => $dietician, 'customers' => $customers));            
        }
        
        public function addCustomer(Application $app, Request $request) {
            if (!$app['session']->get('dietician')) {
                return $app->redirect('/');
            }
            $dietician = $app['session']->get('dietician');
            
            $days = array();
            for ($i = 1; $i <= 31; $i++) {
                if ($i < 10) {
                    $days[(int) '0' . $i] = $i;
                }
                else {
                    $days[$i] = $i;
                }
            }
           
            $months = array(
                '01' => 'januari', 
                '02' => 'februari', 
                '03' => 'maart', 
                '04' => 'april', 
                '05' => 'mei', 
                '06' => 'juni', 
                '07' => 'juli', 
                '08' => 'augustus', 
                '09' => 'september', 
                '10' => 'oktober', 
                '11' => 'november', 
                '12' => 'december'
            );
            
            $years = array();
            for ($i = 1995; $i >= 1905; $i--) {
                $years[] = $i;
            }

            if ($request->isMethod('POST')) {
                $customerInfo['name'] = htmlentities($_POST['name']);
                $customerInfo['email'] = htmlentities($_POST['email']);
                $customerInfo['dietician_id'] = $dietician['id'];
                $customerInfo['gender'] = $_POST['gender'];
                $customerInfo['birthdate'] = $_POST['year'] . '-' . $_POST['month'] . '-' . $_POST['day'];
                $customerInfo['password'] = $this->RandomPass();
                $customerInfo['date_added'] = date("Y-m-d H:i:s");
                $customerId = $app['dietician']->addCustomer($customerInfo);
                $customerData['customer_id'] = $customerId;
                $customerData['weight'] = $_POST['weight'];
                $customerData['height'] = $_POST['height'];
                switch ($_POST['pal']) {
                    case 1:
                        $pal = 'Licht';
                        break;
                    case 2:
                        $pal = 'Middelmatig';
                        break;
                    case 3:
                        $pal = 'Zwaar';
                        break;
                }
                $customerData['PAL'] = $pal;
                $customerData['bmi'] = $_POST['bmi'];
                $customerData['kcal'] = $_POST['kcal'];
                $customerData['carbohydrates'] = $_POST['carbs'];
                $customerData['sugars'] = $_POST['sugars'];
                $customerData['proteins'] = $_POST['proteins'];
                $customerData['fats'] = $_POST['fats'];
                $customerData['cholesterol'] = $_POST['cholesterol'];
                $customerData['fibres'] = $_POST['fibres'];
                $customerData['sodium'] = $_POST['sodium'];
                $customerData['comments'] = htmlentities($_POST['comments']);
                $customerData['bmi'] = $_POST['bmi'];
                $customerData['date'] = date("Y-m-d H:i:s");
                $app['dietician']->addCustomerData($customerData);
                
                $message = \Swift_Message::newInstance()
                    ->setSubject('Dieetopvolging.be - Uw inloggegevens')
                    ->setFrom(array($dietician['email']))
                    ->setTo(array($_POST['email']))
                    ->setBody($app['twig']->render('dietician/mails/newCustomer.twig', array('customer' => $customerInfo, 'dietician' => $dietician), 'text/html'));

                $app['mailer']->send($message);
                
                return $app->redirect('/dietist/klanten');
            }
            
            return $app['twig']->render('dietician/addCustomer.twig', array('dietician' => $dietician, 'days' => $days, 'months' => $months, 'years' => $years));
        }
        
        public function customerDetail(Application $app, $customerId) {
            if (!$app['session']->get('dietician')) {
                return $app->redirect('/');
            }
            $dietician = $app['session']->get('dietician');
            $customer = $app['dietician']->getDietistCustomer($dietician['id'], $customerId);
            if (!$customer) {
                return $app->redirect('/dietist/console');
            }
            
            $activeConsultation = $app['dietician']->getActiveConsultation($customerId);
            $previousConsultations = $app['dietician']->getPreviousConsultations($customerId);
            

            return $app['twig']->render('dietician/viewCustomer.twig', array('dietician' => $dietician, 
                                                                            'customer' => $customer, 
                                                                            'activeConsultation' => $activeConsultation,
                                                                            'previousConsultations' => $previousConsultations
                    ));
	}
        
        public function logout(Application $app, Request $request) {
            $app['session']->remove('dietician');
            return $app->redirect('/');
        }
        
        public function RandomPass($length = null) {

            $length = $length < 6 ? 6 : $length;

            for ($a = 0; $a < $length; $a++) {
                @$pass .= chr(rand(65, 90));
            }

            return $pass;

        }
        
        public function customerConsultation(Application $app, $customerId) {
            if (!$app['session']->get('dietician')) {
                return $app->redirect('/');
            }
            $dietician = $app['session']->get('dietician');
            $customer = $app['dietician']->getDietistCustomer($dietician['id'], $customerId);
            if (!$customer) {
                return $app->redirect('/dietist/console');
            }

            return $app['twig']->render('dietician/customerConsultation.twig', array('dietician' => $dietician, 'customer' => $customer));
	}        

}