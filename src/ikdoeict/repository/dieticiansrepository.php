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
            return $this->db->fetchAll('SELECT c.* FROM customers AS c WHERE c.dietician_id = ?', array($dieticianId));
        }
        
        public function getDietistCustomer($dieticianId, $customerId) {
            return $this->db->fetchAssoc('SELECT c.* FROM customers AS c WHERE c.dietician_id = ? AND c.id = ?', array($dieticianId, $customerId));
        }

}