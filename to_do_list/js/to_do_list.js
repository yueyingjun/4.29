angular.module("myapp",[]).controller("ctrl",["$scope","$filter",function($scope,$filter){
    //源数据
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    // console.log($scope.data);
    // 完成的数据
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];
    //是否显示完成列表
    $scope.isshow=true;
    //当前选择的事项
    $scope.currentIndex=0;
    $scope.currentCon=$scope.data[$scope.currentIndex];
    //监控
    $scope.seach="";
    $scope.$watch("seach",function(){
        var arr=$filter("filter")($scope.data,{title:$scope.seach});
        $scope.currentIndex=0;
        $scope.currentCon=arr[$scope.currentIndex];
    })
    //添加项目
    $scope.tianjia=function(){
        var obj={};
        obj.id=getid($scope.data);
        obj.title="新建项目"+obj.id;
        obj.son=[];
        $scope.data.push(obj);
        console.log(obj);
        $scope.currentIndex=getindex($scope.data,obj.id);
        // console.log( $scope.currentIndex);//获取的下标
        $scope.currentCon=$scope.data[$scope.currentIndex];
        // console.log($scope.currentCon)//下标对应的内容
        localStorage.data=JSON.stringify($scope.data);
        // console.log(localStorage.data)
    };
    /*显示完成列表*/
    $scope.showdone=function(){
        // console.log(1)
        $scope.isshow = false;

    }
    /*显示内容*/
    $scope.showCon=function(){
        $scope.isshow = true;
    }
    //删除事项
    $scope.removelists=function(id){
       angular.forEach($scope.data,function(obj,index){
           if(id==obj.id){
               if(index==$scope.data.length-1){//判断如果删除的是最后一个，让他的上一个显示
                   $scope.currentIndex=index-1;
                   $scope.currentCon=$scope.data[$scope.currentIndex];
                   // console.log($scope.currentCon)
               }else{
                   //其余的都让他的下一个显示
                   $scope.currentIndex=index;
                   // console.log($scope.currentIndex);

               }
               $scope.data.splice(index,1);
               $scope.currentCon=$scope.data[$scope.currentIndex];
           }
           // console.log(obj.id);
           // console.log(index);
       //
       })
        localStorage.data=JSON.stringify($scope.data);
    }
    //列表获取焦点
    $scope.focus=function(id){
        var index=getindex($scope.data,id);
        // console.log(index);
        $scope.currentIndex=index;
        $scope.currentCon=$scope.data[$scope.currentIndex];
    };
    /*失去焦点*/
    $scope.blur=function(id){
        localStorage.data=JSON.stringify($scope.data);
    }
    //添加栏目
    $scope.addOpt=function(){
        var obj={};
        console.log(obj);
        var id=getid($scope.currentCon.son);
        // console.log(getid($scope.currentCon.son));
        obj.id=id;
        // console.log(id);
        obj.title="新建条目"+obj.id;
        $scope.currentCon.son.push(obj);
        // console.log(obj);
        localStorage.data=JSON.stringify($scope.data);
    }
    // 删除栏目
    $scope.delOpt=function(id){
        var index=getindex($scope.currentCon.son,id);
        $scope.currentCon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    }
    //完成条目
    $scope.doneFun=function(id){
        var index=getindex($scope.currentCon.son,id);
        // console.log(index);
        // 删除原数组
        var obj=$scope.currentCon.son.splice(index,1);
        // console.log(obj);
        //要将删除的元素放到done数组里面;
        obj[0].id=getid($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    }
    //删除完成
    $scope.removeDone=function(id){
        var index=getindex($scope.done,id);//获取完成的下标
        $scope.done.splice(index,1);//删除
        localStorage.data=JSON.stringify($scope.data);//重新保存一下
    };
    //获取id
    function getid(arr){
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
    //获取当前下标
    function getindex(arr,id){
        // console.log(arr);
        for(var i=0;i<arr.length;i++){
            // console.log(id);
            if(arr[i].id==id){
                // console.log(arr[i].id);
                return i;

            }
            // console.log(i)
        }
    }
}]);