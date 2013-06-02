<?php

namespace Ikdoeict\Repository;

class DieticiansRepository extends \Knp\Repository {

	public function getTableName() {
            return 'dieticians';
	}
        
        public function findDietician($email, $password) {
            $password = (string) md5($password);
            return $this->db->fetchAssoc('SELECT d.* FROM dieticians AS d WHERE d.email = ? AND d.password = ?', array($email, $password));
	}
        
        public function addCustomer($customerInfo) {
            $customerInfo['password'] = (string) md5($customerInfo['password']);
            $this->db->insert('customers', $customerInfo);
            return $this->db->lastInsertId();
        }
        
        public function addCustomerData($customerData) {
            return $this->db->insert('customer_consultations', $customerData);
        }
        
        public function findCustomers($dieticianId) {
            return $this->db->fetchAll('SELECT c.*, DATE_FORMAT(c.date_added,"%d-%m-%Y") AS dateFormat FROM customers AS c WHERE c.dietician_id = ? AND c.archive = "N" ORDER BY c.name', array($dieticianId));
        }
        
        public function getDietistCustomer($dieticianId, $customerId) {
            return $this->db->fetchAssoc('SELECT c.*, DATE_FORMAT(c.date_added,"%d-%m-%Y") AS dateFormat, ROUND((CURDATE() - c.birthdate)/10000) AS age, DATE_FORMAT(c.birthdate,"%d-%m-%Y")AS birthdateFormat FROM customers AS c WHERE c.dietician_id = ? AND c.id = ? AND c.archive = "N"', array($dieticianId, $customerId));
        }
        
        public function getLastConsultation($customerId) {
            return $this->db->fetchAssoc('SELECT c.*, DATE_FORMAT(c.date,"%d-%m-%Y") AS dateFormat FROM customer_consultations AS c WHERE c.customer_id = ? ORDER BY c.date DESC limit 0,1', array($customerId));
        }
        
        public function getConsultations($customerId) {
            return $this->db->fetchAll('SELECT *, DATE_FORMAT(c.date,"%d-%m-%Y") AS dateFormat, ROUND(c.carbohydrates * 4) as carbcal, ROUND(c.fats * 9) as fatcal, ROUND(c.proteins * 4) as protcal FROM customer_consultations AS c WHERE c.customer_id = ? ORDER BY c.date DESC', array($customerId));
        }
        
        //Set customer as archived, when "deleted" by dietician
        public function deleteCustomer($customerId) {
            return $this->db->update('customers', array('archive' => 'Y'), array('id' => $customerId));
        }
        
        public function getNewMeals($dieticianId) {
            return $this->db->fetchAll('SELECT DATE_FORMAT(m.date,"%d-%m-%Y") as dateFormat, c.name AS customerName, m.customer_id AS customerId FROM meals as m
                                        INNER JOIN customers as c ON m.customer_id = c.id
                                        WHERE m.seen = "N"
                                        AND c.dietician_id = ? 
                                        GROUP BY dateFormat, customerName 
                                        ORDER BY m.date DESC', array($dieticianId));   
        }
        
        public function getAllFoodByCategories() {
            $c = $this->db->fetchAll('SELECT f.name, f.id FROM food_categories AS f');
            foreach ($c as $key => $i) {
                $categories[$key]['category'] = $i['name'];
                //$categories[$key]['food'] = array();
                $categories[$key]['food'] = $this->db->fetchAll('SELECT f.* FROM foods AS f WHERE category_id = ?', array($i['id']));
            }
            return $categories;
        }
        
        public function getAllFoodCategories() {
            $c = $this->db->fetchAll('SELECT f.name FROM food_categories AS f');
            foreach ($c as $key => $i) {
                $categories[$key] = $i['name'];
            }
            return $categories;
        }

}