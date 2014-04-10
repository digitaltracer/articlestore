var articleApp = angular.module('article',['ngRoute', 'ui.bootstrap','ngSanitize']);

articleApp.controller('hPosts',function($scope,$http,$modal){
    $http.get('/api/posts')
        .success(function(data){
            $scope.Posts = data;
        })
        .error(function(data){
            console.log('Error getting posts '+data);
        });
    var eee = {
        awesome:'niklaus',
        loyal:'elijah'
    };

    /*$http({method: 'POST',
        url: '/api/update/root@root.com',
        data: $.param(eee),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data) {
            //console.log($scope.testdata);
            console.log('--data---'+data.a);
        }).error(function() {
            $scope.errorMessage = "Failure";
        });
*/
    /*$http.post('/api/update/root@root.com',$scope.testdata)
        .success(function(data){
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });*/




    $scope.showArticle = function(articleId){
        $http.get('/api/getpost/'+articleId)
            .success(function(data) {
                //console.log(data[0].description);
                $scope.headline = data[0].headline;
                $scope.description = data[0].description;
                $scope.articleDate = data[0].date;
                $scope._id = data[0]._id;
                //console.log($scope.description);
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: '/partials/modalContainer',
                    controller: ModalInstanceCtrl,
                    resolve: {} // empty storage
                };


                $scope.opts.resolve.item = function() {
                    return angular.copy({
                        headline: $scope.headline,
                        description: $scope.description,
                        date: $scope.articleDate,
                        _id:$scope._id
                    }); // pass name to Dialog
                }

                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function() {
                    //on ok button press
                }, function() {
                    //on cancel button press
                    console.log("Modal Closed");
                });
            })
            .error(function(data) {
                console.log('Error getting posts ' + data);
            });
    };



});

var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item,$http) {

    $scope.item = item;

    $scope.highlight = function() {
        var range, html;
        if (window.getSelection && window.getSelection().getRangeAt) {
            range = window.getSelection().getRangeAt(0);
            var parent = range.commonAncestorContainer;
            if(parent.nodeType != 1){
                var parentEl = parent.parentNode;
                var parentClass = parentEl.className;
                //console.log(parentEl.innerHTML);
            }
            console.log(item);
            var el = document.createElement("b");
            el.className = 'high';
            //el.appendChild(document.createTextNode(range));
            el.innerHTML = range;
            range.deleteContents();
            //range.selectNode(document.getElementsByTagName("b").item(0));
            range.insertNode(el);
            var body = document.getElementById('articleModalBody').innerHTML;
            //console.log(body);

            //var frag = document.createDocumentFragment();
            //frag.appendChild(el);
            //range.insertNode(frag);
            //console.log('frag ===> '+frag)
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            html = (node.nodeType == 3) ? node.data : node.outerHTML;
            range.pasteHTML(html);
        }
    };

    $scope.saveChanges = function(item){
        var body = document.getElementById('articleModalBody').innerHTML;
        //console.log(body);
        var articleMod = {_id:item._id,
        headline:item.headline,
        date:item.date,
        description:body
        };
        //console.log(item.headline);
        //item.description = body;
        $http({method: 'POST',
            url: '/api/update/userPost',
            data: $.param(articleMod),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
                //console.log($scope.testdata);
                //console.log('--data---'+data.a);
            }).error(function() {
                $scope.errorMessage = "Failure";
            });
        $modalInstance.close();
    };

    //$scope.saveChanges.$inject = ['$http'];


    //console.log($scope.item);

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}