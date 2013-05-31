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
        
        public function getConsultationOfMeal($mealId) {
            return $this->db->fetchAssoc('SELECT c.kcal, c.carbohydrates, c.sugars, c.fats, c.proteins, c.cholesterol, c.fibres, c.sodium FROM customer_data AS c 
                                          INNER JOIN meals AS m ON m.consultation_id = c.id
                                          WHERE m.id = ?', array($mealId));
        }
        
        public function getDetailedFoodByMeals($mealsId) {
            return $this->db->fetchAll('SELECT m.gram as quantity, f.name as foodname, fc.name as foodcategory,
                                        ROUND((m.gram / 100 * f.calories), 1) as kcal,
                                        ROUND((m.gram / 100 * f.carbohydrates), 1) as carbohydrates,
                                        ROUND((m.gram / 100 * f.sugars), 1) as sugars,
                                        ROUND((m.gram / 100 * f.fats), 1) as fats,
                                        ROUND((m.gram / 100 * f.proteins), 1) as proteins,
                                        ROUND((m.gram / 100 * f.cholesterol), 1) as cholesterol,
                                        ROUND((m.gram / 100 * f.fibres), 1) as fibres,
                                        ROUND((m.gram / 100 * f.sodium), 1) as sodium
                                        FROM meals_food AS m 
                                        INNER JOIN foods AS f on m.food_id = f.id
                                        INNER JOIN food_categories AS fc ON f.category_id = fc.id 
                                        WHERE m.meals_id = ?', array($mealsId));
        }

}