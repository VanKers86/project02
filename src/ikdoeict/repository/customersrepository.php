<?php

namespace Ikdoeict\Repository;

class CustomersRepository extends \Knp\Repository {

	public function getTableName() {
            return 'customers';
	}
        
        //Check if customer with email and password combination exists
        public function findCustomer($email, $password) {
            $password = (string) md5($password);
            return $this->db->fetchAssoc('SELECT d.* FROM customers AS d WHERE d.email = ? AND d.password = ? and d.archive = "N"', array($email, $password));
	}
        
        //Find the dietician of this customer by the id of the customer
        public function findCustomerDietician($customerId) {
            return $this->db->fetchAssoc('SELECT d.name, d.email, d.photo, d.id FROM dieticians as d INNER JOIN customers AS c ON d.id = c.dietician_id WHERE c.id = ?', array($customerId));
        }

        //Get the last consultation date of a customer
        public function getLastConsultationDate($customerId) {
            return $this->db->fetchColumn('SELECT DATE_FORMAT(c.date,"%d-%m-%Y") AS dateFormat FROM customer_consultations AS c WHERE c.customer_id = ? ORDER BY c.date DESC limit 0,1', array($customerId));
        }
        
        //Get all meal types
        public function getMealTypes() {
            return $this->db->fetchAll('SELECT * FROM meal_types');
        }
        
        //Get all food categories
        public function getFoodCategories() {
            return $this->db->fetchAll('SELECT * FROM food_categories');
        }
        
        //Add a new meal entry
        public function addNewMeal($meal) {
            $meal['consultation_id'] = $this->getConsultationOfMeal($meal);
            $this->db->insert('meals', $meal);
            return $this->db->lastInsertId();
        }
        
        //Get the consultation values of the meal
        public function getConsultationOfMeal($meal) {
            return $this->db->fetchColumn('SELECT c.id FROM customer_consultations AS c WHERE c.customer_id = ? AND c.date < ? ORDER BY c.date DESC limit 0,1', array($meal['customer_id'], $meal['date'] . ' 23:59:59'));
        }
        
        //Get food id by its name
        public function getFoodId($food) {
            return $this->db->fetchColumn('SELECT c.id FROM foods AS c WHERE c.name = ?', array($food));
        }
        
        //Add new meal_food entry
        public function addNewMealFood($food) {
            return $this->db->insert('meals_food', $food);
        }
        
        //Get all the communication between the customer and his dietician
        public function getUnseenCommunication($dieticianId, $customerId) {
            return $this->db->fetchAll('SELECT c.*, DATE_FORMAT(c.datetime,"%d-%m-%Y %H:%i") AS dateFormat FROM communication as c 
                                        WHERE (from_dietician_id = ? OR to_dietician_id = ?)
                                        AND (from_customer_id = ? OR to_customer_id = ?)
                                        ORDER BY c.datetime DESC', array($dieticianId, $dieticianId, $customerId, $customerId));
        }        
        
}