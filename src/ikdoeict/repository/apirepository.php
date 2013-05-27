<?php

namespace Ikdoeict\Repository;

class APIRepository extends \Knp\Repository {

	public function getTableName() {
            return 'dieticians';
	}
        
        public function getCustomerBmi($customerId) {
            return $this->db->fetchAll('SELECT date, bmi FROM customer_data WHERE customer_id = ? ORDER BY date', array($customerId));
	}
        

}