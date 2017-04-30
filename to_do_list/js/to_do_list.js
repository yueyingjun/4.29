angular.module("myapp",[]).controller("control",["$scope","$filter",function($scope,$filter){
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];// 源数据
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];//完成的数据

    $scope.currentId=0;
    $scope.currentCon=$scope.data[$scope.currentId];

    //添加事项
    $scope.add=function(){
        var obj={};
        obj.id=getMaxid($scope.data);
        obj.title="新建事项"+obj.id;
        obj.son=[];
        $scope.data.push(obj);

        $scope.currentId=getIndex($scope.data,obj.id);
        $scope.currentCon=$scope.data[$scope.currentId];

        localStorage.data=JSON.stringify($scope.data);
    };
    //获取最大id
    function getMaxid(arr){
        if(arr.length==0){
            return 1;
        }else {
            var temp = arr[0].id;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id > temp) {
                    temp = arr[i].id;
                }
            }
            return temp + 1;
        }
    };
    //获取下标
    function getIndex(arr,id){
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
                return i;
            }
        }
    };
    //删除事项
    $scope.removelist=function(id){
        angular.forEach($scope.data,function(obj,index){
            if(id==obj.id){
                $scope.data.splice(index,1);
                var index=getIndex(id);
                if(index==$scope.data.length-1){
                    $scope.currentId=index-1;
                    $scope.currentCon=$scope.data[$scope.currentId];
                }else{
                    $scope.currentId=$scope.data.length-1;
                    $scope.currentCon=$scope.data[$scope.currentId];
                }
            }
        })
        localStorage.data=JSON.stringify($scope.data);
    };
    /*列表获得焦点*/
    $scope.focus=function(id){
        var index=getIndex($scope.data,id);
        $scope.currentId=index;
        $scope.currentCon=$scope.data[$scope.currentId];

    }

    /*失去焦点*/
    $scope.blur=function(id){
        localStorage.data=JSON.stringify($scope.data);
    }

    /*添加条目*/
    $scope.addOpt=function(){
        var obj={};
        var id=getMaxid($scope.currentCon.son);
        obj.id=id;
        obj.title="新建条目"+obj.id;
        $scope.currentCon.son.push(obj);

        localStorage.data=JSON.stringify($scope.data);
    };

    /*删除条目*/
    $scope.delOpt=function(id){
        var index=getIndex($scope.currentCon.son,id);
        $scope.currentCon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    };
    /*条目完成*/
    $scope.doneFun=function(id){
        var index=getIndex($scope.currentCon.son,id);
        //1. 原数组删除
        var obj=$scope.currentCon.son.splice(index,1);
        //2. 要将删除的元素放到done数组里面;
        obj[0].id=getMaxid($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    };
    /*是否显示完成列表*/
    $scope.isshow=true;
    /*显示完成列表*/
    $scope.showdone=function(){
        $scope.isshow = false;
    };
    /*显示内容*/
    $scope.showCon=function(){
        $scope.isshow = true;
    };
    /*删除已完成*/
    $scope.removeDone=function(id){
        var index=getIndex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);
    };
    /*监控search*/
    $scope.search="";
    $scope.$watch("search",function(){
        var arr=$filter("filter")($scope.data,{title:$scope.search});
        $scope.currentId=0;
        $scope.currentCon=arr[$scope.currentId]
    });
}]);