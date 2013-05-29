<?php

namespace Ikdoeict\Repository;

class CustomersRepository extends \Knp\Repository {

	public function getTableName() {
            return 'customers';
	}
        
        public function findCustomer($email, $password) {
            $password = (string) md5($password);
            return $this->db->fetchAssoc('SELECT d.* FROM customers AS d WHERE d.email = ? AND d.password = ? and d.archive = "N"', array($email, $password));
	}
        
        public function findCustomerDietician($customerId) {
            return $this->db->fetchAssoc('SELECT d.name, d.email, d.photo FROM dieticians as d INNER JOIN customers AS c ON d.id = c.dietician_id WHERE c.id = ?', array($customerId));
        }

        public function getLastConsultationDate($customerId) {
            return $this->db->fetchColumn('SELECT DATE_FORMAT(c.date,"%d-%m-%Y") AS dateFormat FROM customer_data AS c WHERE c.customer_id = ? ORDER BY c.date DESC limit 0,1', array($customerId));
        }
        
        public function getMealTypes() {
            return $this->db->fetchAll('SELECT * FROM meal_types');
        }
        
        public function getFoodCategories() {
            return $this->db->fetchAll('SELECT * FROM food_categories');
        }
        
}