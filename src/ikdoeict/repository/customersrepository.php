<?php

namespace Ikdoeict\Repository;

class CustomersRepository extends \Knp\Repository {

	public function getTableName() {
            return 'customers';
	}
        
        public function findCustomer($email, $password) {
            $password = (string) md5($password);
            return $this->db->fetchAssoc('SELECT d.* FROM customers AS d WHERE d.email = ? AND d.password = ?', array($email, $password));
	}
        

}