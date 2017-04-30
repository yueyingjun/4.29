
angular.module("myapp",[]).controller("ctrl",["$scope","$filter",function($scope,$filter){

    // 源数据
    // parse()     用于从一个字符串中解析出json对象
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    // 完成的数据
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];

    // 是否显示完成列表
    $scope.isshow=true;

    //当前选择的事项
    $scope.currentindex=0;
    $scope.currentcon=$scope.data[$scope.currentindex];

    //监控search
    $scope.search="";
    $scope.$watch("search",function(){
        var arr=$filter("filter")($scope.data,{title:$scope.search});
        $scope.currentindex=0;
        $scope.currentcon=arr[$scope.currentindex];
    })


    //添加列表
    //1. 唯一id    2.  title
    $scope.add=function(){
        var obj={};
        obj.id=getmaxid($scope.data);
        obj.title="新建事项-"+obj.id;
        obj.son=[];
        $scope.data.push(obj);
        $scope.currentindex=getindex($scope.data,obj.id);
        $scope.currentcon=$scope.data[$scope.currentindex];
        // stringify() 用于从一个对象解析出字符串
        localStorage.data=JSON.stringify($scope.data);
    }


    /*删除列表*/

    $scope.removelist=function(id){
        angular.forEach($scope.data,function(obj,index){
            if(id==obj.id){
                $scope.data.splice(index,1);
                var index=getindex(id);
                if(index==$scope.data.length-1){
                    $scope.currentindex=index-1;
                    $scope.currentcon=$scope.data[$scope.currentindex];
                }else{
                    $scope.currentindex=$scope.data.length-1;
                    $scope.currentcon=$scope.data[$scope.currentindex];
                }
            }
        })
        // stringify() 用于从一个对象解析出字符串
        localStorage.data=JSON.stringify($scope.data);
    }

    /*列表获得焦点*/

    $scope.focus=function(id){
        var index=getindex($scope.data,id);
        $scope.currentindex=index;
        $scope.currentcon=$scope.data[$scope.currentindex];
    }

    /*失去焦点*/

    $scope.blur=function(id){
        localStorage.data=JSON.stringify($scope.data);
    }

    /*添加条目*/

    $scope.addopt=function(){
        var obj={};
        var id=getmaxid($scope.currentcon.son);
        obj.id=id;
        obj.title="新建条目-"+obj.id;
        $scope.currentcon.son.push(obj);
        localStorage.data=JSON.stringify($scope.data);
    }

    /*删除条目*/

    $scope.delopt=function(id){
        var index=getindex($scope.currentcon.son,id);
        $scope.currentcon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    }

    /*条目完成*/
    $scope.donefun=function(id){
        var index=getindex($scope.currentcon.son,id);
        //1. 原数组删除
        var obj=$scope.currentcon.son.splice(index,1);
        //2. 要将删除的元素放到done数组里面;
        obj[0].id=getmaxid($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    }

    /*显示完成列表*/

    // ng-show 指令在表达式为 true 时显示指定的 HTML 元素，否则隐藏指定的 HTML 元素。
    $scope.showdone=function(){
        $scope.isshow = false;
    }

    /*显示内容*/
    $scope.showcon=function(){
        $scope.isshow = true;
    }

    /*删除已完成*/
    $scope.removedone=function(id){
        var index=getindex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);
    }

    // 获取最大ID值
    function getmaxid(arr){
        if(arr.length==0){
            return 1;
        }else{
            var temp=arr[0].id;
            for(var i=0;i<arr.length;i++){
                if(arr[i].id>temp){
                    temp=arr[i].id;
                }
            }
            return temp+1;
        }
    }

    // 获取下标
    function getindex(arr,id){
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
                return i;
            }
        }
    }
}])