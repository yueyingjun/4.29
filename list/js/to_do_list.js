angular.module("lyApp",[])
    .controller("ctrl",["$scope","$filter",function ($scope,$filter) {
        $scope.data=localStorage.data?JSON.parse(localStorage.data):[];  //源数据
        $scope. done=localStorage.done?JSON.parse(localStorage.done):[];  //完成的数据
        // $scope.data=new Database();
        // console.log(data);
        //当前选择的数据
        $scope.currentIndex=0;
        $scope.currentCon=$scope.data[$scope.currentIndex];
        //监控search
        $scope.search="";
        $scope.$watch("search",function(){
            var arr=$filter("filter")($scope.data,{title:$scope.search});
            $scope.currentIndex=0;
            $scope.currentCon=arr[$scope.currentIndex];
        })
        //添加列表
            //1.唯一id； 2.title
        $scope.add=function () {
            var obj={};
            obj.id=getMaxIndex($scope.data);
            obj.title="新建事项"+obj.id;
            obj.son=[];
            $scope.data.push(obj);
            $scope.currentIndex=getIndex($scope.data,obj.id); //获取添加后的id。赋给当前下标
            $scope.currentCon=$scope.data[$scope.currentIndex];
            localStorage.data=JSON.stringify($scope.data);
        };
        //获取下标的最大值
        function getMaxIndex(arr) {
            if(arr.length==0){
                return 1;
            }else{
                var temp=arr[0].id;
                for(var i=0; i<arr.length; i++){
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
        //获取子信息的数目
        // $scope.len=0;
        if($scope.data.length!==0){
            $scope.len="";
            angular.forEach($scope.data,function (obj,index) {
                $scope.len+=$scope.data[index].son.length+"+";
            });
            $scope.len=eval($scope.len.slice(0,-1));
            // console.log($scope.len);
        }else if($scope.data.length==0){
           $scope.len=0; 
        }

        // //删除
        $scope.removeList=function (id) {
            angular.forEach($scope.data,function (obj,index) {
                if(id==obj.id){
                    $scope.data.splice(index,1);                   
                    var index=getIndex(id); //获取当前下标
                    console.log(obj.son.length);
                    $scope.len-=obj.son.length;
                    if(index==$scope.data.length-1){    //如果删除的是最后一个
                        $scope.currentIndex=index-1;    //显示前一个
                        $scope.currentCon=$scope.data[$scope.currentIndex];
                    }else{
                        $scope.currentIndex=$scope.data.length-1;  //显示最后一个
                        $scope.currentCon=$scope.data[$scope.currentIndex];
                    }
                }  
            });
            
            localStorage.data=JSON.stringify($scope.data);
        };

        /*列表获得焦点*/
        $scope.focus=function (id) {
            var index=getIndex($scope.data,id);
            $scope.currentIndex=index;
            $scope.currentCon=$scope.data[$scope.currentIndex];
        };
        //列表失去焦点
        $scope.blur=function(id){
            localStorage.data=JSON.stringify($scope.data);
        };

        //添加子信息
        $scope.addOpt=function () {
            $scope.len++;
            var obj={};
            var id=getMaxIndex($scope.currentCon.son);
            obj.id=id;
            obj.title="新建信息"+obj.id;
            $scope.currentCon.son.push(obj);
            localStorage.data=JSON.stringify($scope.data);
        };
        //删除子信息
        $scope.delOpt=function(id){
            $scope.len--;
            var index=getIndex($scope.currentCon.son,id);
            $scope.currentCon.son.splice(index,1);
            localStorage.data=JSON.stringify($scope.data);
        };
        //子信息完成
        $scope.doneFun=function (id) {
            var index=getIndex($scope.currentCon.son,id);
            //在原数组中删除
            var obj=$scope.currentCon.son.splice(index,1);
            //添加到已完成信息里面
            obj[0].id=getMaxIndex($scope.done);
            obj[0].pare=$scope.currentCon.title;
            $scope.done.push(obj[0]);
            localStorage.data=JSON.stringify($scope.data);
            localStorage.done=JSON.stringify($scope.done);
        };

        $scope.isshow=true;
        /*显示完成列表*/
        $scope.showDone=function(){
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
        }
    }]);