import angular from 'angular';

const template = require('./home.template.html');

class HomeController {

    static get $inject() {
        return ['$rootScope', '$stateParams', 'appTitle'];
    }

    constructor($rootScope, $stateParams, appTitle) {

        this.$rootScope = $rootScope;
        this.appTitle = appTitle;
        this.selectedIndex = 0;

        if ($stateParams.tab) {
            this.selectedIndex = parseInt($stateParams.tab, 10);
        }
    }

    addItem(ev) {
        this.$rootScope.$broadcast(this.selectedIndex === 0 ? 'addTodo' : 'addUser', ev);
    }

}

angular.module('app')
    .component('hyfHome', {
        template,
        controller: HomeController
    });

