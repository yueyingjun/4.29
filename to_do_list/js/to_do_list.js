var app=angular.module("myApp",[]);
app.controller("control",["$scope","$filter",function ($scope,$filter) {
    /*事项元数据*/
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];

    /*已完成条目数据*/
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];


    /*右侧显示*/
    /*设置默认显示*/
    $scope.currentIndex=0;
    $scope.currentCon=$scope.data[ $scope.currentIndex];

    /*添加事项*/
    $scope.add=function () {
        var obj={};
        obj.id=$scope.getMaxId($scope.data);
        obj.title="新建事项"+obj.id;
        obj.son=[];
        $scope.data.push(obj);
        localStorage.data=JSON.stringify($scope.data);

        var index=$scope.getIndex($scope.data,obj.id);
        $scope.currentIndex=index;
        $scope.currentCon=$scope.data[$scope.currentIndex];

    }

    /*删除事项*/
    $scope.del=function (id) {
        var index=$scope.getIndex($scope.data,id);

        $scope.data.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
        if(index===$scope.data.length){
            index=index-1;
        }
        $scope.currentIndex=index;
        $scope.currentCon=$scope.data[$scope.currentIndex];
    }

    /*获取新添加事项的id*/
    $scope.getMaxId=function (arr) {
        if(arr.length===0){
            return 1;
        }else {
            var temp=arr[0].id;
            angular.forEach(arr,function (obj,index) {
                if(obj.id>temp){
                    temp=obj.id
                }
            })
            return temp+1;
        }
    }
    /*获取事项的index*/
    $scope.getIndex=function (arr,id) {
        var num;
        angular.forEach(arr,function (obj,index) {
            if(obj.id===id){
                num=index;
            }
        })
        return num;
    }

    /*聚焦事件*/
    $scope.focus=function (id){
        $scope.currentIndex=$scope.getIndex($scope.data,id);
        $scope.currentCon=$scope.data[$scope.currentIndex];
    }
    /*失焦事件*/
    $scope.blur=function () {
        localStorage.data=JSON.stringify($scope.data);
    }

    /*添加条目*/
    $scope.addOpt=function () {
        var obj={};
        obj.id=$scope.getMaxId($scope.currentCon.son);
        obj.title="新建条目"+obj.id;
        $scope.currentCon.son.push(obj);
        localStorage.data=JSON.stringify($scope.data);
    }
    /*条目的blur事件*/
    $scope.optBlur=function () {
        localStorage.data=JSON.stringify($scope.data);
    }
    /*删除条目*/
    $scope.delOpt=function (id) {
        var index=$scope.getIndex($scope.currentCon.son,id);
        $scope.currentCon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    }

    /*条目完成*/
    $scope.addDone=function (id) {
        var index=$scope.getIndex($scope.currentCon.son,id);
        var obj=$scope.currentCon.son.splice(index,1);
        obj[0].id=$scope.getMaxId($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    }

    /*删除完成的事项(条目)*/
    $scope.delDone=function (id) {
        var index=$scope.getIndex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);
    }

    /*页面显示*/
    $scope.show=true;
    /*显示未完成事项*/
    $scope.showCon=function () {
        $scope.show=true;
    }
    /*显示已完成事项*/
    $scope.showDone=function () {
        $scope.show=false;
    }

    /*搜索事项*/
    $scope.search="";
    $scope.$watch("search",function () {
        var arr =$filter("filter")($scope.data,{title:$scope.search});
        $scope.currentIndex=0;
        $scope.currentCon=arr[ $scope.currentIndex];
    })

}])
