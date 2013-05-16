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

		return $controllers;

	}

        public function login(Application $app, Request $request) {
            $data = array(
                'Email' => '',
                'Paswoord' => '',
            );


            $form = $app['form.factory']->createBuilder('form', $data)
                ->add('Email', 'email')
                ->add('Paswoord', 'password')
                ->getForm();

            if ($request->isMethod('POST')) {
                $form->bind($request);

                if ($form->isValid()) {
                    $form = $form->getData();
                    
                    // do something with the data
  
                    //return $app->redirect('blog');
                }
            }

            return $app['twig']->render('customer/login.twig', array('form' => $form->createView()));
        }


}