//左侧点击效果
$(function () { $('#collapseTwo').collapse('show')});

angular.module("myApp",[]).controller("wdbctrl",["$scope","$filter",function ($scope,$filter) {
    //未完成数据
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    //已完成数据
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];
    //当前选择的事项
    $scope.nowIndex=0;
    $scope.nowCon=$scope.data[$scope.nowIndex];
    //监控search
    $scope.search="";
    $scope.$watch("search",function(){
        let arr=$filter("filter")($scope.data,{title:$scope.search});
        $scope.nowIndex=0;
        $scope.nowCon=arr[$scope.nowIndex]
    });
    //获取数组最大id
    function getMaxId(data) {
        let temp=0;
        angular.forEach(data,function (val,index) {
            if(temp<data[index].id){
                temp=data[index].id;
            }
        });
        return temp+1;
    }
    //获取下标
    function getIndex(data,id) {
        let temp;
        angular.forEach(data,function (val,index) {
            if(id==val.id){
                temp=index;
            }
        });
        return temp;
    }
    //添加列表
    $scope.addList=function () {
        let obj={};
        obj.id=getMaxId($scope.data);
        obj.title="新建事项"+obj.id;
        obj.son=[];
        $scope.data.push(obj);
        localStorage.data=JSON.stringify($scope.data);
        //当前选择的事项
        $scope.nowIndex=getIndex($scope.data,obj.id);
        $scope.nowCon=$scope.data[$scope.nowIndex];
    };
    //删除列表
    $scope.delList=function (id) {
        $scope.data.forEach(function (val,index) {
            if(id==val.id){
                $scope.data.splice(index,1);
                //当前选择的事项
                if(getIndex(id)==$scope.data.length-1){
                    $scope.nowIndex=getIndex(id)-1;
                    $scope.nowCon=$scope.data[$scope.nowIndex]
                }else{
                    $scope.nowIndex=$scope.data.length-1;
                    $scope.nowCon=$scope.data[$scope.nowIndex]
                }
            }
        });
        localStorage.data=JSON.stringify($scope.data)
    };
    //获得焦点
    $scope.focus=function (id) {
        //当前选择的事项
        $scope.nowIndex=getIndex($scope.data,id);
        $scope.nowCon=$scope.data[$scope.nowIndex]
    };
    //失去焦点
    $scope.blur=function (id) {
        localStorage.data=JSON.stringify($scope.data);
    };
    //添加栏目
    $scope.rightAdd=function () {
        let obj={};
        obj.id=getMaxId($scope.nowCon.son);
        obj.title="新建栏目"+obj.id;
        $scope.nowCon.son.push(obj);
        localStorage.data=JSON.stringify($scope.data);

    };
    //删除栏目
    $scope.rightDel=function(id){
        let index=getIndex($scope.nowCon.son,id);
        $scope.nowCon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    };
    //点击后完成
    $scope.over=function(id){
        let index=getIndex($scope.nowCon.son,id);
        let obj=$scope.nowCon.son.splice(index,1);
        obj[0].id=getMaxId($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    };

    //完成列表
    $scope.isshow=true;

    $scope.showdone=function(){
        $scope.isshow = false;
    };
    //显示内容
    $scope.showCon=function(){
        $scope.isshow = true;
    };
    //删除已完成
    $scope.removeDone=function(id){
        let index=getIndex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);
    };

}]);