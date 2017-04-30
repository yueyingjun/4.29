// angular.module("myapp",[]).controller('constrol',["$scope",function($scope){
//     $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
//     $scope.add=function(){
//         var add=localStorage.getItem("myapp");
//         var obj={};
//         var title="新建事项"+item.id;
//         $scope.myapp.push({obj:id},{obj:title});
//         $scope.data=localStorage.JSON.stringify(obj);
//     }
//     $scope.remove=function(id){
//         if(id=obj.id){
//             $scope.data.splice(index,1);
//         }else{
//             $scope.data.splice(index.length-1);
//         }
//     }
//     //当前的事项
//     $scope.currentd=0;
//     $scope.currentCon=$scope.data[$scope.currentd];
//
// }])
var myapp=angular.module("myapp",[]);
myapp.controller("kongzhi",["$scope","$filter",function ($scope,$filter) {

    // 源数据
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    //完成的数据
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];
    //是否显示完成列表
    $scope.r_f=1;
    // 获取右边
    $scope.currentIndex=0;
    $scope.currentCon=$scope.data[$scope.currentIndex];
    // 添加新事项
    $scope.addev=function () {
        var obj={};
        obj.id=getMaxIndex($scope.data);
        obj.title="新的事项"+obj.id;
        obj.son=[];
        $scope.data.push(obj);
        $scope.currentIndex=getIndex($scope.data,obj.id);
        $scope.currentCon=$scope.data[$scope.currentIndex];
        localStorage.data=JSON.stringify($scope.data);
    }

    // 删除事项
    $scope.delev=function (delid) {
        angular.forEach($scope.data,function(obj,index){
            if(obj.id==delid){
                $scope.data.splice(index,1);
                var index=getIndex(id);
                if(index==$scope.data.length-1){
                    $scope.currentIndex=index-1;
                    $scope.currentCon=$scope.data[$scope.currentIndex];
                }else{
                    $scope.currentIndex=$scope.data.length-1;
                    $scope.currentCon=$scope.data[$scope.currentIndex];
                }
                // if($scope.data[index+1]){
                //     $scope.currentIndex=$scope.data[index+1].id;
                //     $scope.currentTitle=$scope.data[index+1].title;
                // }else{
                //     $scope.currentIndex=$scope.data[index-1].id;
                //     $scope.currentTitle=$scope.data[index-1].title;
                // }
            }
        })
        localStorage.data=JSON.stringify($scope.data);
    }
    /*列表获得焦点*/
    $scope.focus=function(id){
        var index=getIndex($scope.data,id);
        $scope.currentIndex=index;
        $scope.currentCon=$scope.data[$scope.currentIndex];
    }
    /*失去焦点*/
    $scope.blur=function(id){
        localStorage.data=JSON.stringify($scope.data);
    }

    // 添加条目
    $scope.addtiaomu=function (pid) {
        var obj={};
        var id=getMaxIndex($scope.currentCon.son);
        console.log(id)
        obj.id=id;
        obj.pid=pid;
        obj.title="新建条目"+obj.id;
        $scope.currentCon.son.push(obj);
        localStorage.data=JSON.stringify($scope.data);
    }
    /*删除条目*/
    $scope.deltiaomu=function(sonid){
        var index=getIndex($scope.currentCon.son,sonid);
        $scope.currentCon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    }
    /*条目失去焦点*/
    $scope.blurtiaomu=function(sonid){
        localStorage.data=JSON.stringify($scope.data);
    }
    /*条目完成*/
    $scope.wancheng=function(id){
        var index=getIndex($scope.currentCon.son,id);
        //1. 原数组删除
        var obj=$scope.currentCon.son.splice(index,1);
        //2. 要将删除的元素放到done数组里面;
        obj[0].id=getMaxIndex($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    }
    /*显示完成列表*/
    $scope.wanchengshixiang=function(){
        $scope.r_f=0;
    }
    /*显示内容*/
    $scope.daibanshixiang=function(){
        $scope.r_f=1;
    }
    /*删除已完成*/
    $scope.delwancheng=function(id){
        var index=getIndex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);
    }
    //监控search
    $scope.search="";
    $scope.$watch("search",function(){
        var arr=$filter("filter")($scope.data,{title:$scope.search});
        $scope.currentIndex=0;
        $scope.currentCon=arr[$scope.currentIndex]
    })


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
    function getIndex(arr,id){
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
                return i;
            }
        }
    }
}])