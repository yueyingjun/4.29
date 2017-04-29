/**
 * Created by Administrator on 2017/4/29.
 */
angular.module("note",[])
        .controller("ctrl",["$scope","$filter",function ($scope,$filter) {
            $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
            $scope.finish=localStorage.finish?JSON.parse(localStorage.finish):[];
            $scope.cIndex=0;
            $scope.Current=$scope.data[$scope.cIndex];
            $scope.show=true;
            $scope.add=function () {
                var obj={};
                obj.id=getMax($scope.data);
                obj.title="新建文档"+obj.id;
                obj.son=[];
                $scope.data.push(obj);
                if($scope.data.length==1){
                    $scope.cIndex=0;
                    $scope.Current=$scope.data[$scope.cIndex];
                }
                localStorage.data=JSON.stringify($scope.data);
            }
            $scope.del=function (id) {
                $scope.data.splice(getIndex($scope.data,id),1);
                var index=getIndex($scope.data,id);
                if($scope.data.length-1==index){
                        $scope.cIndex=index-1;
                        $scope.Current=$scope.data[$scope.cIndex];
                }else{
                        $scope.cIndex=$scope.data.length-1;
                        $scope.Current=$scope.data[$scope.cIndex];
                }

                localStorage.data=JSON.stringify($scope.data);
            }

            $scope.focus=function (id) {
                var index=getIndex($scope.data,id);
               $scope.cIndex=index;
               $scope.Current=$scope.data[$scope.cIndex];
            }
            $scope.blur=function (id) {
                localStorage.data=JSON.stringify($scope.data);
            }
            $scope.addtiao=function () {
                var obj={};
                var id=getMax($scope.Current.son);
                obj.id=id;
                obj.title="新建事件"+id;
                $scope.Current.son.push(obj);
                localStorage.data=JSON.stringify($scope.data);
            }
            $scope.deltiao=function (id) {
                var index=getIndex($scope.Current.son,id);
                $scope.Current.son.splice(index,1);
                localStorage.data=JSON.stringify($scope.data);
            }
            $scope.delall=function (id) {
                var index=getIndex($scope.finish,id);
                $scope.finish.splice(index,1);
                localStorage.finish=JSON.stringify($scope.finish);
            }
            $scope.into=function (id) {
                var index=getIndex($scope.Current.son,id);
                var arr=$scope.Current.son.splice(index,1)[0];
                var id=getMax($scope.finish);
                arr.id=id;
                $scope.finish.push(arr);
                localStorage.data=JSON.stringify($scope.data);
                localStorage.finish=JSON.stringify($scope.finish);
            }
            $scope.finishall=function () {
                $scope.show=false;
            }
            $scope.con=function () {
                $scope.show=true;
            }
            $scope.changetwo=function (id) {
                localStorage.data=JSON.stringify($scope.data);
            }
            $scope.search="";
            $scope.$watch("search",function(){
                var arr=$filter("filter")($scope.data,{title:$scope.search});
                $scope.Current=arr[$scope.cIndex];
                $scope.cIndex=0;
               console.log(arr);


            })






            function getIndex(arr,id) {
                if(arr.length==0){
                    return 0;
                }else{
/*                    angular.forEach(arr,function (obj,index) {
                            if(obj.id==id){
                                return index;
                            }
                    })*/
                    for(var i=0;i<arr.length;i++){
                        if(arr[i].id==id){
                            return i;
                        }
                    }
                }
            }
            function getMax(arr) {
                var template=0;
                if(arr.length==0){
                    return 1;
                }else{
                    angular.forEach(arr,function (obj,index) {
                        if(obj.id>=template){
                            template=obj.id;
                        }
                    })
                    return template+1;
                }

            }


        }])