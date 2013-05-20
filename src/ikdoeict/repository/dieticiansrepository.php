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
            return $this->db->insert('customer_data', $customerData);
        }
        
        public function findCustomers($dieticianId) {
            return $this->db->fetchAll('SELECT c.*, DATE_FORMAT(c.date_added,"%d-%m-%Y") AS dateFormat FROM customers AS c WHERE c.dietician_id = ? AND c.archive = "N"', array($dieticianId));
        }
        
        public function getDietistCustomer($dieticianId, $customerId) {
            return $this->db->fetchAssoc('SELECT c.*, DATE_FORMAT(c.date_added,"%d-%m-%Y") AS dateFormat, ROUND((CURDATE() - c.birthdate)/10000) AS age, DATE_FORMAT(c.birthdate,"%d-%m-%Y")AS birthdateFormat FROM customers AS c WHERE c.dietician_id = ? AND c.id = ? AND c.archive = "N"', array($dieticianId, $customerId));
        }
        
        public function getActiveConsultation($customerId) {
            return $this->db->fetchAssoc('SELECT c.*, DATE_FORMAT(c.date,"%d-%m-%Y") AS dateFormat FROM customer_data AS c WHERE c.customer_id = ? ORDER BY c.date DESC limit 0,1', array($customerId));
        }
        
        public function getPreviousConsultations($customerId) {
            return $this->db->fetchAll('SELECT *, DATE_FORMAT(c.date,"%d-%m-%Y") AS dateFormat FROM customer_data AS c WHERE c.customer_id = ? ORDER BY c.date DESC limit 1,9999', array($customerId));
        }
        
        //Set customer as archived, when "deleted" by dietician
        public function deleteCustomer($customerId) {
            return $this->db->update('customers', array('archive' => 'Y'), array('id' => $customerId));
        }

}