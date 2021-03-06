// Powered by Ionic
/**
 * @author Joaquin Campero <juacocampero@gmail.com>
 */

var db = null;

angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.services', 'app.utils'])

        .run(function ($ionicPlatform, $cordovaSQLite, $localStorage, Session) {
            $ionicPlatform.ready(function () {
                console.log($localStorage.getObject('user'));
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleLightContent();
                }

                if (window.cordova) {
                    try {
                        db = $cordovaSQLite.openDB('central.db');
                    } catch (er) {
                        console.log(er.message);
                    }
                } else {
                    db = window.openDatabase("centralDeOfertas.db", "1.0", "Central de Ofertas", -1);
                }

                Session.checkConnection();

                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS `sales` (`id` INTEGER PRIMARY KEY,`title` VARCHAR(100) NULL,`type` VARCHAR(100) NULL,`category_id` INTEGER NULL,`brand_id` INTEGER NULL,`chain_id` INTEGER NULL,`manufacturer_id` INTEGER NULL,`filename` VARCHAR(100) NULL,`value` VARCHAR(20) NULL,`value_final` VARCHAR(20) NULL,`date_from` DATETIME NULL,`data_to` DATETIME NULL, `chain` VARCHAR (100) NULL)')
                        .then(function (res) {
//                            console.log('sales table created', res);
                        }, function (error) {
//                            console.error(error);
                        });
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS `brands` (`id` INTEGER NOT NULL PRIMARY KEY,`name` VARCHAR(100) NOT NULL)')
                        .then(function (res) {
//                            console.log('brands table created', res);
                        }, function (error) {
//                            console.error(error);
                        });
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS `chains` (`id` INTEGER NOT NULL PRIMARY KEY,`name` VARCHAR(100) NOT NULL)')
                        .then(function (res) {
//                            console.log('chains table created', res);
                        }, function (error) {
//                            console.error(error);
                        });
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS `categories` (`id` INTEGER NOT NULL PRIMARY KEY UNIQUE,`name` VARCHAR(100) NOT NULL)')
                        .then(function (res) {
//                            console.log('categories table created', res);
                        }, function (error) {
//                            console.error(error);
                        });
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS `favorites` (`id` INTEGER AUTO INCREMENT PRIMARY KEY,`sale_id` INTERGER NULL)')
                        .then(function (res) {
//                            console.log('favorites table created', res);
                        }, function (error) {
//                            console.error(error);
                        });
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'LoaderCtrl'
                    })
                    .state('app.home', {
                        url: '/home',
                        views: {
                            'mainContent': {
                                templateUrl: 'templates/home.html',
                            }
                        }
                    })
                    .state('app.favorites', {
                        url: '/favorites',
                        views: {
                            'mainContent': {
                                templateUrl: 'templates/favorites.html',
                                controller: 'FavoritesCtrl'
                            }
                        }
                    })
                    .state('app.contact', {
                        url: '/contact',
                        views: {
                            'mainContent': {
                                templateUrl: 'templates/contact.html',
                                controller: 'ContactCtrl'
                            }
                        }
                    })
                    .state('app.tabs', {
                        url: '/tabs',
                        abstract: true,
                        views: {
                            'mainContent': {
                                templateUrl: 'templates/tabs.html'
                            }
                        }
                    })
                    .state('app.tabs.categories', {
                        url: '/categories',
                        views: {
                            'tab-categories': {
                                templateUrl: 'templates/tab-categories.html',
                                controller: 'CategoriesCtrl'
                            }
                        }
                    })
                    .state('app.tabs.category-list', {
                        url: '/categories/:id',
                        views: {
                            'tab-categories': {
                                templateUrl: 'templates/categorie-list.html',
                                controller: 'CategoryListCtrl'
                            }
                        }
                    })
                    .state('app.tabs.chains', {
                        url: '/chains',
                        views: {
                            'tab-chains': {
                                templateUrl: 'templates/tab-chains.html',
                                controller: 'ChainsCtrl'
                            }
                        }
                    })
                    .state('app.tabs.chains-list', {
                        url: '/chains/:id',
                        views: {
                            'tab-chains': {
                                templateUrl: 'templates/categorie-list.html',
                                controller: 'ChainListCtrl'
                            }
                        }
                    })
                    .state('app.tabs.brands', {
                        url: '/brands',
                        views: {
                            'tab-brands': {
                                templateUrl: 'templates/tab-brands.html',
                                controller: 'BrandsCtrl'
                            }
                        }
                    })
                    .state('app.tabs.brands-list', {
                        url: '/brands/:id',
                        views: {
                            'tab-brands': {
                                templateUrl: 'templates/categorie-list.html',
                                controller: 'BrandListCtrl'
                            }
                        }
                    });
            $urlRouterProvider.otherwise('/app/home');

        })

        .filter('checkImgExtension', function () {
            return function (text) {
                var str = text;
                if (text != null && text.search(/.png/i) === -1) {
                    str = text + '.png';
                }
                return str;
            };
        })
        .filter('getBrandName', function (Brands) {
            return function (id) {
                var brand = Brands.get(id);
                return brand ? brand.name : 'Sin marca';
            };
        });