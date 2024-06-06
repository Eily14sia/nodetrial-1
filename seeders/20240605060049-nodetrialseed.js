module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Drop tables without foreign key constraints first
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS `users`;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS `userinfo`;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS `acc_type`;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS `logmaster`;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS `public.sequelize_meta`;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS `site`;');

      // Create the tables
      // Acc_Type Table
      await queryInterface.sequelize.query(`
        CREATE TABLE \`acc_type\` (
          \`id_type\` int(11) NOT NULL AUTO_INCREMENT,
          \`type_name\` varchar(255) NOT NULL,
          \`description\` varchar(255) NOT NULL,
          \`isActive\` tinyint(1) NOT NULL,
          \`created_at\` datetime DEFAULT current_timestamp(),
          \`updated_at\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
          \`created_by\` int(11) DEFAULT NULL,
          \`updated_by\` int(11) DEFAULT NULL,
          \`deleted_at\` datetime DEFAULT NULL,
          PRIMARY KEY (\`id_type\`),
          UNIQUE KEY \`type_name\` (\`type_name\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
      `);

      // Insert data into Acc_Type table
      await queryInterface.sequelize.query(`
        INSERT INTO \`acc_type\` VALUES 
        (1,'LGU','test',1,'2024-06-05 11:17:10','2024-06-05 11:17:10',NULL,NULL,NULL),
        (2,'Tour','test2',1,'2024-06-05 11:17:10','2024-06-05 11:17:10',NULL,NULL,NULL);
        (3,'Profession','test3',1,'2024-06-06 11:17:10','2024-06-06 11:17:10',NULL,NULL,NULL);
      `);

      // UserInfo Table
      await queryInterface.sequelize.query(`
        CREATE TABLE \`userinfo\` (
          \`user_id\` int(11) NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) DEFAULT NULL,
          \`description\` varchar(255) DEFAULT NULL,
          \`acc_type_id\` int(11) DEFAULT NULL,
          \`isDemo\` tinyint(1) DEFAULT NULL,
          \`isActive\` tinyint(1) DEFAULT NULL,
          \`site_id\` int(10) NOT NULL,
          \`logo\` varchar(255) NOT NULL,
          \`created_at\` datetime DEFAULT current_timestamp(),
          \`updated_at\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
          \`created_by\` int(11) DEFAULT NULL,
          \`updated_by\` int(11) DEFAULT NULL,
          \`deleted_at\` datetime DEFAULT NULL,
          PRIMARY KEY (\`user_id\`),
          KEY \`acc_type\` (\`acc_type_id\`),
          CONSTRAINT \`userinfo_ibfk_1\` FOREIGN KEY (\`acc_type_id\`) REFERENCES \`acc_type\` (\`id_type\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
      `);

      // Insert data into UserInfo table
      await queryInterface.sequelize.query(`
        INSERT INTO \`userinfo\` VALUES 
        (4,'New','user',2,1,1,1,'','2024-06-05 11:16:23','2024-06-05 11:16:23',NULL,NULL,NULL),
        (6,'New','user',2,1,1,1,'','2024-06-05 11:16:23','2024-06-05 11:16:23',NULL,NULL,NULL),
        (7,'New','user',2,1,1,1,'','2024-06-05 11:16:23','2024-06-05 11:16:23',NULL,NULL,NULL),
        (8,'New','user',2,1,1,1,'','2024-06-05 11:16:23','2024-06-05 11:16:23',NULL,NULL,NULL);
      `);

      // Users Table
      await queryInterface.sequelize.query(`
        CREATE TABLE \`users\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`username\` varchar(255) NOT NULL,
          \`password\` varchar(255) NOT NULL,
          \`role_id\` int(10) NOT NULL,
          \`isActive\` tinyint(1) DEFAULT NULL,
          \`email\` varchar(255) NOT NULL,
          \`created_at\` datetime NOT NULL DEFAULT current_timestamp(),
          \`updated_at\` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
          \`created_by\` int(11) DEFAULT NULL,
          \`updated_by\` int(11) DEFAULT NULL,
          \`deleted_at\` datetime DEFAULT NULL,
          \`last_login\` datetime DEFAULT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
      `);

      // Insert data into Users table
      await queryInterface.sequelize.query(`
        INSERT INTO \`users\` VALUES 
        (4,'User1','$2b$10$slexw2cnG4U0diTzPuDlW.sv3ShEMbamEi.Wuh2fu2AL58Sn.UGPq',1, 1,'user1@gmail.com','2024-06-04 14:24:24','2024-06-05 10:20:16',NULL,NULL,NULL,NULL),
        (6,'NewUser2','$2b$10$YQga30DGerF1npGK9bCx5OKMRPMss05k70xVWm5wU7sFRD4CKq5g2',1, 1,'','2024-06-04 15:09:49','2024-06-05 10:17:06',NULL,NULL,NULL,NULL),
        (7,'NewUser2','$2b$10$E.ChTaAgSW8L7vVixN4Kdu2ymuTZL8xlf7hMscZkrVQUwwToFeB5e',0, 1,'','2024-06-05 09:55:10','2024-06-05 09:55:10',NULL,NULL,NULL,NULL),
        (8,'User2','$2b$10$dWCJdd5sml1J.2uZ/p4Bnet.UCBLYPB0LUr0YtW7YycDE32w8uwKq',1,0,'','2024-06-05 02:47:59','2024-06-05 02:47:59',NULL,NULL,NULL,NULL);
        `);

        // LogMaster Table
      await queryInterface.sequelize.query(`
      CREATE TABLE \`logmaster\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`tablename\` varchar(255) NOT NULL,
        \`requested_data\` varchar(255) NOT NULL,
        \`change_data\` varchar(255) NOT NULL,
        \`isActive\` tinyint(1) DEFAULT 1,
        \`is_status_change\` tinyint(1) DEFAULT 0,
        \`created_at\` datetime DEFAULT current_timestamp(),
        \`updated_at\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        \`created_by\` int(11) DEFAULT NULL,
        \`updated_by\` int(11) DEFAULT NULL,
        \`deleted_at\` datetime DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Insert data into LogMaster table
    await queryInterface.sequelize.query(`
      INSERT INTO \`logmaster\` VALUES (1,'Table','Requested data','Change data',1,0,'2024-06-05 14:15:09','2024-06-05 14:15:09',NULL,NULL,NULL);
    `);

    // Sequelize_Meta Table
    await queryInterface.sequelize.query(`
      CREATE TABLE \`public.sequelize_meta\` (
        \`name\` varchar(255) NOT NULL,
        PRIMARY KEY (\`name\`),
        UNIQUE KEY \`name\` (\`name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
    `);

    // Insert data into Sequelize_Meta table
    await queryInterface.sequelize.query(`
      INSERT INTO \`public.sequelize_meta\` VALUES ('20240605040616-nodetrial.js');
    `);

    // Site Table
    await queryInterface.sequelize.query(`
      CREATE TABLE \`site\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`url\` varchar(255) NOT NULL,
        \`domain\` varchar(255) NOT NULL,
        \`ip\` varchar(45) NOT NULL,
        \`isActive\` tinyint(1) DEFAULT 1,
        \`created_at\` datetime DEFAULT current_timestamp(),
        \`updated_at\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        \`created_by\` int(11) DEFAULT NULL,
        \`updated_by\` int(11) DEFAULT NULL,
        \`deleted_at\` datetime DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Insert data into Site table
    await queryInterface.sequelize.query(`
      INSERT INTO \`site\` VALUES 
      (1,'Site1','https://example.com','example.com','127.0.0.1',1,'2024-06-05 14:15:09','2024-06-05 14:15:09',NULL,NULL,NULL);
    `);

    console.log('Seed data successfully inserted.');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
},

down: async (queryInterface, Sequelize) => {
  // Implement logic to undo the seeding if necessary
}
};
