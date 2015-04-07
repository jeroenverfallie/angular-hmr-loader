var ANGULAR_MODULE;
var MODULE_CACHE;

var COMPILEPROVIDER;

var _cache = {};
var templateCache = {};
var controllerCache = {};
var PRIORITY = {};
var directiveCache = {};


var save = function(n, obj, exists) {

    if (obj.template) {
        templateCache[n] = obj.template;
    }

    if (obj.controller) {
        controllerCache[n] = obj.controller;
    }


    if (exists) {
        var elm = angular.element(document.querySelector('.ng-scope'));
        if (elm) {
            $state = elm.injector().get('$state');

            $state.transitionTo($state.current, $state.params, {
                reload: true,
                inherit: false,
                notify: true
            });
        }
    }
};


var transform = function(n, obj) {

    if (obj.template) {
        obj.template = function() {
            return templateCache[n];
        };
    }

    if (obj.controller) {
        obj.controller = function($injector, $scope) {
            return $injector.invoke(controllerCache[n], this, {
                '$scope': $scope
            });
        };
    }

    // obj = directiveCache[n];
    // obj.priority = PRIORITY[n]++;
    // //obj.terminal = true;


    return obj;
};

var directive = function(n, d) {
    var obj = d();
    var exists = MODULE_CACHE[n];

    // directiveCache[n] = obj;

    save.bind(this)(n, obj, exists);

    if (!exists) {
        ANGULAR_MODULE.directive(n, function() {
            return transform(n, obj);
        });
        MODULE_CACHE[n] = true;
    } //else {
    //     COMPILEPROVIDER.directive(n, function() {
    //         return transform(n, obj);
    //     });
    // }
    
    return {
        directive: directive
    };

};


module.exports = (function() {
    return {
        module: function(identifier) {
            ANGULAR_MODULE = angular.module(identifier);
            if (!_cache[identifier]) {
                // ANGULAR_MODULE.config(function($compileProvider) {
                //     COMPILEPROVIDER = $compileProvider;
                // });

                _cache[identifier] = {};
            } else {
                _cache[identifier] = _cache[identifier];
            }


            MODULE_CACHE = _cache[identifier];

            return {
                directive: directive
            };
        }
    }
})();
