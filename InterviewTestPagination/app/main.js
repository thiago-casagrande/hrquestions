(function (angular) {
    "use strict";

    angular
        .module("todoApp")
        .directive("todoPaginatedList", [todoPaginatedList])
        .directive("pagination", [pagination]);

    /**
     * Directive definition function of 'todoPaginatedList'.
     * 
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: {}, // example empty isolate scope
            controller: ["$scope", "$http", controller],
            link: link
        };

        function controller($scope, $http) { // example controller creating the scope bindings
            $scope.todos = [];
            $scope.carregando = false;

            $scope.pagination = {
                pagina: 1,
                itensPorPagina: 20,
                totalItens: 55,
                totalPaginas: Math.ceil(55 / 20),
                ordenarPor: 'createdDate'
            };

            $scope.ordemCrescente = false;

            $scope.ordenar = function (campo) {

                $scope.mostrarIndicador = true;

                if ($scope.pagination.ordenarPor === campo) {
                    $scope.ordemCrescente = !$scope.ordemCrescente;
                } else {
                    $scope.pagination.ordenarPor = campo;
                    $scope.ordemCrescente = true;
                }

                $scope.pagination.pagina = 1;
            };

            $scope.$watchGroup(['pagination.pagina',
                'pagination.itensPorPagina',
                'pagination.ordenarPor',
                'ordemCrescente'
            ], function () {
                $scope.carregando = true;
                var skip = 0;
                var take = $scope.pagination.itensPorPagina;

                if ($scope.pagination.itensPorPagina === 'all') {
                    $scope.pagination.totalPaginas = 1;
                } else {
                    $scope.pagination.totalPaginas =
                        Math.ceil($scope.pagination.totalItens / $scope.pagination.itensPorPagina);
                }

                if ($scope.pagination.itensPorPagina === 'all') {
                    take = $scope.pagination.totalItens;
                } else {
                    skip = ($scope.pagination.pagina - 1) * $scope.pagination.itensPorPagina;
                }

                $http.get("api/Todo/Todos?skip=" + skip +
                    "&take=" + take +
                    "&ordenarPor=" + ($scope.pagination.ordenarPor || "createdDate") +
                    "&ordemCrescente=" + $scope.ordemCrescente)
                    .then(response => {
                        $scope.todos = response.data;
                        $scope.carregando = false;
                    });
            });
        }
            function link(scope, element, attrs) { }

            return directive;
        }

        /**
         * Directive definition function of 'pagination' directive.
         * 
         * TODO: make it a reusable component (i.e. usable by any list of objects not just the Models.Todo model)
         * TODO: correctly parametrize scope (inherited? isolated? which properties?)
         * TODO: create appropriate functions (link? controller?) and scope bindings
         * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
         * 
         * @returns {} directive definition object
         */
        function pagination() {
            var directive = {
                restrict: "E", // example setup as an element only
                templateUrl: "app/templates/pagination.html",
                scope: {
                    pagination: '='
                }, // example empty isolate scope
                controller: ["$scope", controller],
                link: link
            };

            function controller($scope) { 

                    $scope.validarPagina = function () {
                        if (isNaN($scope.pagination.pagina) || $scope.pagination.pagina < 1) {
                            $scope.pagination.pagina = 1;
                        }

                        if ($scope.pagination.pagina > $scope.pagination.totalPaginas) {
                            $scope.pagination.pagina = $scope.pagination.totalPaginas;
                        }
                    };

                }
            function link(scope, element, attrs) { }

            return directive;
        }

    }) (angular);