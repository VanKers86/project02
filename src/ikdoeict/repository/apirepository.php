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
        
        public function getCustomerMeals($customerId, $date) {
            return $this->db->fetchAll('SELECT m.id, t.name as type FROM meals AS m
                                        INNER JOIN meal_types AS t on m.type_id = t.id
                                        WHERE m.customer_id = ? AND 
                                        date = ?', array($customerId, $date));
        }
        
        public function getFoodByMeals($mealsId) {
            return $this->db->fetchAll('SELECT m.gram as quantity, f.name as foodname, fc.name as foodcategory
                                        FROM meals_food AS m 
                                        INNER JOIN foods AS f on m.food_id = f.id
                                        INNER JOIN food_categories AS fc ON f.category_id = fc.id 
                                        WHERE m.meals_id = ?', array($mealsId));
        }

}