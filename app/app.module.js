import angular from 'angular';
import 'angular-aria';
import 'angular-animate';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';

angular.module('app', ['ui.router', ngMaterial, uiRouter])
    .constant('appTitle', 'HYF Todos')
