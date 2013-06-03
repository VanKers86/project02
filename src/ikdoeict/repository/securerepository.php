<?php

namespace Ikdoeict\Repository;

class SecureRepository extends \Knp\Repository {

	public function getTableName() {
            return 'dieticians';
	}
        
        //Get customer BMI progression over time
        public function getCustomerBmi($customerId) {
            return $this->db->fetchAll('SELECT date, bmi FROM customer_consultations WHERE customer_id = ? ORDER BY date', array($customerId));
	}
 
        //Get customer weight progression over time
        public function getCustomerWeight($customerId) {
            return $this->db->fetchAll('SELECT date, weight FROM customer_consultations WHERE customer_id = ? ORDER BY date', array($customerId));
	}        
        
        //Get food names by category id
        public function getFoodByCategory($categoryId) {
            return $this->db->fetchAll('SELECT f.name FROM foods AS f WHERE f.category_id = ?', array($categoryId));
        }
        
        //Get all customer meals of a customer on a certain date
        public function getCustomerMeals($customerId, $date) {
            return $this->db->fetchAll('SELECT m.id, t.name as type FROM meals AS m
                                        INNER JOIN meal_types AS t on m.type_id = t.id
                                        WHERE m.customer_id = ? AND 
                                        date = ?', array($customerId, $date));
        }
        
        //Get food entries of a meal by the meal id
        public function getFoodByMeals($mealsId) {
            return $this->db->fetchAll('SELECT m.gram as quantity, f.name as foodname, fc.name as foodcategory
                                        FROM meals_food AS m 
                                        INNER JOIN foods AS f on m.food_id = f.id
                                        INNER JOIN food_categories AS fc ON f.category_id = fc.id 
                                        WHERE m.meals_id = ?', array($mealsId));
        }
        
        //Get consultation values of a meal by the meal id
        public function getConsultationOfMeal($mealId) {
            return $this->db->fetchAssoc('SELECT c.kcal, c.carbohydrates, c.sugars, c.fats, c.proteins, c.cholesterol, c.fibres, c.sodium FROM customer_consultations AS c 
                                          INNER JOIN meals AS m ON m.consultation_id = c.id
                                          WHERE m.id = ?', array($mealId));
        }
        
        //Get detailed food details of a meal by the meal id
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
        
        //Set meal entry as seen = 'Y'
        public function setMealsDateAsSeen($date, $customerId) {
            return $this->db->executeUpdate('UPDATE meals SET seen = "Y" WHERE date = ? AND customer_id = ?', array($date, $customerId));
        }
        
        //Get all dates on which a meal entry is unseen by the dietician
        public function getUnseenDates($customerId, $dieticianId) {
            return $this->db->fetchAll('SELECT DATE_FORMAT(m.date,"%d-%m-%Y") as dateFormat FROM meals as m
                                        INNER JOIN customers as c ON m.customer_id = c.id
                                        WHERE m.seen = "N"
                                        AND m.customer_id = ?
                                        AND c.dietician_id = ? 
                                        GROUP BY dateFormat 
                                        ORDER BY m.date DESC', array($customerId, $dieticianId));   
        }        

        //Add new message entry in the communication table
        public function makeNewMessage($msgArray) {
            return $this->db->insert('communication', $msgArray);
        }
        
        //Find the dietician of a customer by the customer id
        public function findCustomerDietician($customerId) {
            return $this->db->fetchColumn('SELECT d.id FROM dieticians as d INNER JOIN customers AS c ON d.id = c.dietician_id WHERE c.id = ?', array($customerId));
        }
        
        //Get the number of unseen messages of a customer to its dietician
        public function getUnseenMessages($dieticianId, $customerId) {
            return $this->db->fetchColumn('SELECT count(c.id) as unseen FROM communication AS c
                                        WHERE to_dietician_id = ?
                                        AND from_customer_id = ?
                                        AND dietician_seen = "N"', array($dieticianId, $customerId));
        }
        
        public function updateUnseenMessages($dieticianId, $customerId) {
            return $this->db->executeUpdate('UPDATE communication SET dietician_seen = "Y" 
                                             WHERE to_dietician_id = ? AND 
                                             from_customer_id = ?', array($dieticianId, $customerId));
        }
}