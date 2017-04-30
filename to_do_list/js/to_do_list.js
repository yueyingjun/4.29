angular.module("myapp",[]).controller("ctrl",["$scope","$filter",function($scope,$filter){
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    //提交完的数据
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];

    //显示已完成的列表
    $scope.isshow=true;
    //当前选择的事项
    $scope.currentindex=0;
//			$scope.currentid=$scope.data.length-1;
    $scope.currentcon=$scope.data[$scope.currentindex];

//监控search


    $scope.search="";
    $scope.$watch("search",function(){
        var arr=$filter("filter")($scope.data,{title:$scope.search});
        $scope.currentindex=0;
        $scope.currentcon=arr[$scope.currentindex]


    })

    //添加列表   唯一id   title
    $scope.add=function(){
        var obj={};
        obj.id=getmaxid($scope.data);         //获得最大的下标，利用函数
//				console.log(obj.id);
        obj.title="新建事项"+obj.id;
        obj.son=[];

        $scope.data.push(obj);             //把新建的事项放在数组里
        $scope.currentIndex=getindex($scope.data,obj.id);
        $scope.currentcon=$scope.data[$scope.currentIndex];

        localStorage.data=JSON.stringify($scope.data);       //内存中保存，不至于刷新就消失

    }

    function getmaxindex(arr){     //获得最大值的函数
        if(arr.length==0){         //判断当前数组中有没有东西
            return 1;
        }else{
            var temp=arr[0].id;       //先存在一个地方
            for(var i=0;i<arr.length;i++){
                if(arr[i].id>temp){
                    temp=arr[i].id;
                }
            }
            return temp+1;
        }
    }

//			    删除最后一个,显示倒数第二个
//		    	删除中间的一个,显示最后一个
//				如果只有一个，而且删除，显示没有事项
    //删除
    $scope.removelist=function(id){
        angular.forEach($scope.data,function(obj,index){    //循环
            if(id==obj.id){

                var listindex=getindex($scope.data,id);
                if(listindex==$scope.data.length-1){
                    $scope.currentindex=listindex-1;
                    $scope.currentcon=$scope.data[$scope.currentindex];
                }else{
                    $scope.currentindex=$scope.data.length-1;
                    $scope.currentcon=$scope.data[$scope.currentindex];
                }
                $scope.data.splice(index,1);

            }
        })
        localStorage.data=JSON.stringify($scope.data);
    }


    //获得焦点
    $scope.focuss=function(id){
        var index=getindex($scope.data,id);
        $scope.currentindex=index;
        $scope.currentcon=$scope.data[$scope.currentindex];
    }

    function getmaxid(arr){     //获得最大值的函数
        if(arr.length==0){         //判断当前数组中有没有东西
            return 1;
        }else{
            var temp=arr[0].id;       //先存在一个地方
            for(var i=0;i<arr.length;i++){
                if(arr[i].id>temp){
                    temp=arr[i].id;
                }
            }
            return temp+1;
        }
    }

    function getindex(arr,id){
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
                return i;
            }
        }
    }

    //失去焦点
    $scope.blurs=function(id){
        localStorage.data=JSON.stringify($scope.data);

    }
    
    //切换
    $scope.showdone=function () {
        $scope.isshow = false;
    }
    $scope.showcon=function () {
        $scope.isshow = true;
    }
    //添加条目
    $scope.addopt=function () {
        var obj={};
        var id=getmaxid($scope.currentcon.son);
        obj.id=id;
        obj.title="新建条目"+obj.id;
        $scope.currentcon.son.push(obj);
        localStorage.data=JSON.stringify($scope.data);
    }
    //删除条目
    $scope.removeopt=function (id) {
        var index=getindex($scope.currentcon.son,id);
        $scope.currentcon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    }

    //提交条目
    $scope.doneopt=function (id) {
        var index=getindex($scope.currentcon.son,id);
        //1. 原数组删除
        var obj=$scope.currentcon.son.splice(index,1);
        //2. 要将删除的元素放到done数组里面;
        obj[0].id=getmaxid($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    }
    //删除提交后的条目
    $scope.removedone=function(id){
        var index=getindex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);

    }
    //修改完成的条目
    $scope.doneblur=function (id) {
        localStorage.done=JSON.stringify($scope.done);
    }

}])