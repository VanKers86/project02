<?php

namespace Ikdoeict\Repository;

class APIRepository extends \Knp\Repository {

	public function getTableName() {
            return 'dieticians';
	}
        
        public function getCustomerBmi($customerId) {
            return $this->db->fetchAll('SELECT date, bmi FROM customer_data WHERE customer_id = ? ORDER BY date', array($customerId));
	}
 
        public function getCustomerWeight($customerId) {
            return $this->db->fetchAll('SELECT date, weight FROM customer_data WHERE customer_id = ? ORDER BY date', array($customerId));
	}        
        
        public function getFoodByCategory($categoryId) {
            return $this->db->fetchAll('SELECT f.name FROM foods AS f WHERE f.category_id = ?', array($categoryId));
        }

}