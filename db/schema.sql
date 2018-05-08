/* Schema to create the tables used in the database.
 * As the database is already set up, this shouldn't be used unless there's a migration etc. */
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `companyName` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `isLoggedIn` tinyint(1) NOT NULL DEFAULT '0',
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `tokens` (
  `token` varchar(255) NOT NULL DEFAULT '',
  `userId` int(11) unsigned NOT NULL,
  `expiry` datetime NOT NULL,
  `type` varchar(11) NOT NULL DEFAULT 'session',
  PRIMARY KEY (`token`),
  KEY `userid` (`userId`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `variables` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `min` int(11) NOT NULL DEFAULT '0',
  `max` int(11) NOT NULL DEFAULT '100',
  `step` float NOT NULL DEFAULT '1',
  `defaultVal` int(11) NOT NULL DEFAULT '0',
  `suffix` varchar(11) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `products` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL DEFAULT '',
  `description` varchar(1024) DEFAULT '',
  `price` int(11) unsigned NOT NULL DEFAULT '0',
  `category` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `customizations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `description` varchar(800) DEFAULT NULL,
  `volume` float unsigned NOT NULL,
  `colour` int(11) unsigned NOT NULL,
  `hoppiness` int(11) unsigned NOT NULL,
  `maltFlavour` int(11) unsigned NOT NULL,
  `imageType` int(4) NOT NULL DEFAULT '2',
  `customImage` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userId`),
  CONSTRAINT `customizations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `baskets` (
  `productId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `quantity` int(11) unsigned NOT NULL DEFAULT '1',
  `customizationId` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`productId`,`userId`),
  KEY `userId` (`userId`),
  KEY `customizationId` (`customizationId`),
  CONSTRAINT `baskets_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `baskets_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `baskets_ibfk_3` FOREIGN KEY (`customizationId`) REFERENCES `customizations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;