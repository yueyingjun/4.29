/**
 * Created by lenovo on 2017/4/29.
 */

angular.module("todolist",[]).controller("ctrl",["$scope","$filter",function($scope,$filter){

    // 数据存放结构
    //     [{name:"zhangsan",age:"200",son:[]},{name:"lisi",age:"300"}];

    /*
     ng-repeat="item in data track by item.id"   track by 的意思是让循环按照我们自己设置的id值去循环而不是生成的id值

         ng-module=item.title

         add: ng-click="add()";

    */

    // 获取数据
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];

    // 判断当前的项目
    $scope.currentIndex=getCurrentIndex();
    function getCurrentIndex(){
        if($scope.data.length){
            return $scope.data[0].id;
        }else{
            return 0;
        }
    }
    $scope.currentTitle=$scope.currentIndex?$scope.data[0].title:"";

    // 判断右边显示的列表   false表示显示已完成列表
    $scope.isshow=true;

    // 显示已完成列表
    $scope.showdone=function(){
        $scope.isshow=false;
        console.log($scope.done);
    };

    // 失去焦点
    $scope.blur=function(){
        localStorage.data=JSON.stringify($scope.data);
    };

    // 添加列表的方法
    $scope.add=function(){
        /*
        1. 添加唯一的id
        2. 添加标题

        */

        var obj={};
        obj.id=getMaxIndex($scope.data);
        obj.title="新的事项"+obj.id;
        $scope.data.push(obj);
        localStorage.data=JSON.stringify($scope.data);
        $scope.currentIndexFun(obj.id);
    };

    $scope.$watch("data",function(){
        console.log(222);
    });

    // 判断最大下标
    function getMaxIndex(arr){
        if(arr.length<1){
            return 1;
        }else{
            var temp=1;
            angular.forEach(arr,function(obj,index){
                if(obj.id>temp){
                    temp=obj.id;
                }
            })

            return temp+1;
        }
    }

    // 删除列表

    $scope.removeList=function(id){
        angular.forEach($scope.data,function(obj,index){
            if(obj.id==id){
                $scope.data.splice(index,1);

                if($scope.data[index+1]){
                    $scope.currentIndex=$scope.data[index+1].id;
                    $scope.currentTitle=$scope.data[index+1].title;
                }else{
                    $scope.currentIndex=$scope.data[index-1].id;
                    $scope.currentTitle=$scope.data[index-1].title;
                }


                return ;

            }
        });

        //
        localStorage.data=JSON.stringify($scope.data);
    };


    // 改变当前id的方法
    $scope.currentIndexFun=function(id){
        if(!id){
            return false;
        }
        $scope.isshow=true;
        $scope.nowOpts=getNowOpts($scope.currentIndex);
        angular.forEach($scope.data,function(obj,index){
            if(obj.id==id){
                $scope.currentIndex=obj.id;
                $scope.currentTitle=obj.title;


                return ;
            }
        })
    };


    /*
    *
    * 条目
    * */


    // 当前事项id下的条目
    $scope.nowOpts=getNowOpts($scope.currentIndex);

    // 获取当前事项id下的条目
    function getNowOpts(id){
        if(!id){
            return [];
        }
        var son=[];
        angular.forEach($scope.data,function(obj,index){
            if(obj.id==id){
                son=obj.son;
            }
        });
        return son;
    }

    // 添加条目
    $scope.addOpt=function(id){
        if(!id){
            return false;
        }
        angular.forEach($scope.data,function(obj,index){
            if(obj.id==id){
                var newobj={};
                if(obj.son==undefined){
                    obj.son=[];
                }
                if(obj.son.length<1){
                    newobj.id=1;
                }else{
                    newobj.id=obj.son[obj.son.length-1].id+1;
                }

                newobj.title="代办事项"+newobj.id;
                $scope.data[index].son.push(newobj);
                localStorage.data=JSON.stringify($scope.data);

                return ;
            }
        });
        $scope.nowOpts=getNowOpts($scope.currentIndex);
    };

    // 删除条目
    $scope.removeOptList=function(id,sonPid){
        var removeOpt={};

        angular.forEach($scope.data,function(obj,index){
            if(obj.id==sonPid){
                angular.forEach(obj.son,function(obj2,index2){
                    if(obj2.id==id){
                        removeOpt=obj.son.splice(index2,1);
                        $scope.data[index].son=obj.son;
                        localStorage.data=JSON.stringify($scope.data);
                        $scope.nowOpts=getNowOpts($scope.currentIndex);
                        return;
                    }
                });
                return;
            }
        });
        return removeOpt;

    };

    // 添加已完成条目
    $scope.addDone=function(id,sonPid){
        $scope.done.push($scope.removeOptList(id,sonPid)[0]);
        localStorage.done=JSON.stringify($scope.done);
    };

    $scope.removeDoneList=function(id){
        angular.forEach($scope.done,function(obj,index){
            if(obj.id==id){
                $scope.done.splice(index,1);

                localStorage.done=JSON.stringify($scope.done);

                return ;
            }
        });
    };


    // 搜索
    $scope.search="";

    $scope.$watch("search",function(news,old){

        if(news!=old){
            var arr=$filter("filter")($scope.data,{title:$scope.search});


                if(arr.length<1){
                    $scope.currentIndex=0;
                }else{
                    $scope.currentIndex=arr[0].id;
                    $scope.currentTitle=arr[0].title;

                    $scope.nowOpts=getNowOpts($scope.currentIndex);

                }
        }


    });


    // 获取已完成条目

    /*
    1. 从原数组删除
    2. 删除后的元素放入done数组里面

    data数组存放未完成事项
    done数组存放已完成事项
    */

}]);

