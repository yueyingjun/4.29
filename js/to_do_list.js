angular.module("myapp",[])
.controller("ctrl",["$scope","$filter",function($scope,$filter){
	
    // 源数据    
    //没东西undefind   有东西转换成对象
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    
    //完成的数据
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];

    //是否显示完成列表
    $scope.isshow=true;

    //当前选择的事项
    $scope.currentIndex=0;
    $scope.currentCon=$scope.data[$scope.currentIndex];

    //监控search
    $scope.search="";
    $scope.$watch("search",function(){
        var arr=$filter("filter")($scope.data,{title:$scope.search});
        $scope.currentIndex=0;
        $scope.currentCon=arr[$scope.currentIndex]
    })

    //添加列表
    //1. 唯一id    2.  title
    $scope.add=function(){
    	//获取当前时间
    	var str="";
    	var date=new Date();
    	var year=date.getFullYear();
    	var month=date.getMonth()+1;
    	var day=date.getDate();
    	str=year+"-"+month+"-"+day+"-";
    	
    	//显示
        var obj={};
        obj.id=getMaxId($scope.data);
        obj.title=str+obj.id;
        obj.son=[];

        $scope.data.push(obj);
        $scope.currentIndex=getIndex($scope.data,obj.id);
        $scope.currentCon=$scope.data[$scope.currentIndex];
        localStorage.data=JSON.stringify($scope.data);
    }


    /*删除列表*/

    $scope.removeList=function(id){
       angular.forEach($scope.data,function(obj,index){
           if(id==obj.id){
               $scope.data.splice(index,1);
               var index=getIndex(id);
               if(index==$scope.data.length-1){
                   $scope.currentIndex=index-1;
                   $scope.currentCon=$scope.data[$scope.currentIndex];
               }else{
                   $scope.currentIndex=$scope.data.length-1;
                   $scope.currentCon=$scope.data[$scope.currentIndex];
               }
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

    /*添加条目*/

    $scope.addOpt=function(){
    	var str="";
    	var date=new Date();
    	var hour=date.getHours();
    	var minutes=date.getMinutes()+1;
    	var seconds=date.getSeconds();
    	str=hour+":"+minutes+":"+seconds+"-";
    	
    	
        var obj={};
        var id=getMaxId($scope.currentCon.son);
        obj.id=id;
        obj.title=str+obj.id;
        $scope.currentCon.son.push(obj);
        localStorage.data=JSON.stringify($scope.data);
    }

    /*删除条目*/

    $scope.delOpt=function(id){
        var index=getIndex($scope.currentCon.son,id);
        $scope.currentCon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    }

    /*条目完成*/
    $scope.doneFun=function(id){
        var index=getIndex($scope.currentCon.son,id);
        //1. 原数组删除
        var obj=$scope.currentCon.son.splice(index,1);
        //2. 要将删除的元素放到done数组里面;
        obj[0].id=getMaxId($scope.done);
         $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    }

    /*显示完成列表*/
    $scope.showdone=function(){
            $scope.isshow = false;
    }

    /*显示内容*/

    $scope.showCon=function(){
        $scope.isshow = true;
    }

    /*删除已完成*/
    $scope.removeDone=function(id){
        var index=getIndex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);
    }

    function getMaxId(arr){
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

    function getIndex(arr,id){
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
               return i;
            }
        }
    }
    /**
     * 单页面应用，对于数据的增删改查比较频繁的应用当中
     * 双向数据绑定
     * 在视图里有具体体现   在数据里面也有
     * 
     * ng-modle  只能用在表单上
     * 
     * 
     * 
     * */
}])