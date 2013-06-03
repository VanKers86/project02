<?php

namespace Ikdoeict\Repository;

class DieticiansRepository extends \Knp\Repository {

	public function getTableName() {
            return 'dieticians';
	}
        
        //Check if dietician exists by the combination of email and password
        public function findDietician($email, $password) {
            $password = (string) md5($password);
            return $this->db->fetchAssoc('SELECT d.* FROM dieticians AS d WHERE d.email = ? AND d.password = ?', array($email, $password));
	}
        
        //Add a new customer entry
        public function addCustomer($customerInfo) {
            $customerInfo['password'] = (string) md5($customerInfo['password']);
            $this->db->insert('customers', $customerInfo);
            return $this->db->lastInsertId();
        }
        
        //add new consultation entry for a customer
        public function addCustomerData($customerData) {
            return $this->db->insert('customer_consultations', $customerData);
        }
        
        //find all customers of a dietician by dietician id
        public function findCustomers($dieticianId) {
            return $this->db->fetchAll('SELECT c.*, DATE_FORMAT(c.date_added,"%d-%m-%Y") AS dateFormat FROM customers AS c WHERE c.dietician_id = ? AND c.archive = "N" ORDER BY c.name', array($dieticianId));
        }
        
        //Get all information from a certain customer ($customerId) of a dietician ($dieticianId)
        public function getDietistCustomer($dieticianId, $customerId) {
            return $this->db->fetchAssoc('SELECT c.*, DATE_FORMAT(c.date_added,"%d-%m-%Y") AS dateFormat, ROUND((CURDATE() - c.birthdate)/10000) AS age, DATE_FORMAT(c.birthdate,"%d-%m-%Y")AS birthdateFormat FROM customers AS c WHERE c.dietician_id = ? AND c.id = ? AND c.archive = "N"', array($dieticianId, $customerId));
        }
        
        //Get last consultation of a certain customer by its id
        public function getLastConsultation($customerId) {
            return $this->db->fetchAssoc('SELECT c.*, DATE_FORMAT(c.date,"%d-%m-%Y") AS dateFormat FROM customer_consultations AS c WHERE c.customer_id = ? ORDER BY c.date DESC limit 0,1', array($customerId));
        }
        
        //Get all consultations of a certain customer by its id
        public function getConsultations($customerId) {
            return $this->db->fetchAll('SELECT *, DATE_FORMAT(c.date,"%d-%m-%Y") AS dateFormat, ROUND(c.carbohydrates * 4) as carbcal, ROUND(c.fats * 9) as fatcal, ROUND(c.proteins * 4) as protcal FROM customer_consultations AS c WHERE c.customer_id = ? ORDER BY c.date DESC', array($customerId));
        }
        
        //Set customer as archived, when "deleted" by dietician
        public function deleteCustomer($customerId) {
            return $this->db->update('customers', array('archive' => 'Y'), array('id' => $customerId));
        }
        
        //Get unseen meals of a dietician
        public function getNewMeals($dieticianId) {
            return $this->db->fetchAll('SELECT DATE_FORMAT(m.date,"%d-%m-%Y") as dateFormat, c.name AS customerName, m.customer_id AS customerId FROM meals as m
                                        INNER JOIN customers as c ON m.customer_id = c.id
                                        WHERE m.seen = "N"
                                        AND c.dietician_id = ? 
                                        GROUP BY dateFormat, customerName 
                                        ORDER BY m.date DESC', array($dieticianId));   
        }
        
        //Get all food ordered by categories
        public function getAllFoodByCategories() {
            $c = $this->db->fetchAll('SELECT f.name, f.id FROM food_categories AS f');
            foreach ($c as $key => $i) {
                $categories[$key]['category'] = $i['name'];
                //$categories[$key]['food'] = array();
                $categories[$key]['food'] = $this->db->fetchAll('SELECT f.* FROM foods AS f WHERE category_id = ?', array($i['id']));
            }
            return $categories;
        }
        
        //Get all food categories
        public function getAllFoodCategories() {
            return $this->db->fetchAll('SELECT f.name, f.id FROM food_categories AS f');
        }
        
        //add new entry in the foods table
        public function addNewFood($food) {
            return $this->db->insert('foods', $food);
        }
        
        //Get all the communication between the customer and his dietician, that the dietician hasnt seen yet
        public function getUnseenCommunication($dieticianId, $customerId) {
            return $this->db->fetchAll('SELECT c.*, DATE_FORMAT(c.datetime,"%d-%m-%Y %H:%i") AS dateFormat FROM communication as c 
                                        WHERE (from_dietician_id = ? OR to_dietician_id = ?)
                                        AND (from_customer_id = ? OR to_customer_id = ?)
                                        ORDER BY c.datetime DESC', array($dieticianId, $dieticianId, $customerId, $customerId));
        }

}