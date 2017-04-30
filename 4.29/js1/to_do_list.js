 angular.module("myapp",[]).controller("control",["$scope","$filter",function($scope,$filter){
     $scope.data=localStorage.data?JSON.parse(localStorage.data):[];//1.在页面中获取数据并转化成json数组
     $scope.done=localStorage.done?JSON.parse(localStorage.done):[];//1.在页面中获取数据并转化成json数组
        // 数据结构    [{id :1,title:aaa,son:[{id title }]}]

     // 当前选择的事项下标以及相对应的事项对象
     // 设置默认情况下显示的是待办事项中的第一个
     $scope.currentIndex=0;
     $scope.currentCon=$scope.data[$scope.currentIndex];

     //true的时候显示完成列表
     $scope.isshow=true;

        // 2.点击添加事件   添加 唯一的id  和标题
        $scope.addThing=function(){
            var obj={};
            obj.id=getMaxId($scope.data);
            obj.title="新建事项"+obj.id;
            obj.son=[];
            $scope.data.push(obj);
            // 4.想要左右相互关联  设置当前事项的下标
            $scope.currentIndex=getIndex($scope.data,obj.id);  //应为已经添加过了，所以直接获取下标即可  为什么要获取下标？？？？？
            $scope.currentCon=$scope.data[$scope.currentIndex];
            localStorage.data=JSON.stringify($scope.data);
        }

        // 3.删除事项
        $scope.delThing=function(id){
            for(var i=0;i< $scope.data.length;i++){
                if( $scope.data[i].id==id){
                    var index=getIndex($scope.data,id);
                    $scope.data.splice(index,1);
                    // 点击删除某个  显示最后一个
                    $scope.currentIndex=$scope.data.length-1;
                    $scope.currentCon=$scope.data[$scope.currentIndex];
                }
            }
            localStorage.data=JSON.stringify($scope.data);//？？？？ 为什么要相互转化
         }
         // 5、点那个待办事项，右侧显示谁
     $scope.focus=function(id){
         var index=getIndex($scope.data,id);
         $scope.currentIndex=index;
         $scope.currentCon=$scope.data[$scope.currentIndex];
     }
     $scope.blur=function(id){
         localStorage.data=JSON.stringify($scope.data);
     }
     // 6、添加列表清单   首先在添加待办事项的时候 每个里面都应该有son[]存放列表信息
         $scope.addList=function(){
             var obj={};
             obj.id=getMaxId($scope.currentCon.son);
             obj.title="任务清单"+obj.id;
             $scope.currentCon.son.push(obj);
             localStorage.data=JSON.stringify($scope.data);
         }
        // 7、删除列表清单
         $scope.delList=function(id){
            var index=getIndex($scope.currentCon.son,id);
             $scope.currentCon.son.splice(index,1);
             localStorage.data=JSON.stringify($scope.data);
         }

         // 8、任务完成
        $scope.doneList=function(id){
             var index=getIndex($scope.currentCon.son,id);
             var obj=$scope.currentCon.son.splice(index,1);   //在任务列表中清除的任务 splice返回的是一个数组
            obj[0].id=getMaxId($scope.done);
            $scope.done.push(obj[0]);  //删除的放到完成列表中
            localStorage.data=JSON.stringify($scope.data);
            localStorage.done=JSON.stringify($scope.done);
         }
        // 9、清除完成列表
        $scope.delDone=function(id){
            var index=getIndex($scope.done,id);
            $scope.done.splice(index,1);
            localStorage.done=JSON.stringify($scope.done);
        }

        // 10、显示已完成事项
     $scope.showDone=function(){
         $scope.isshow = false;
     }
     // 11、显示未完成事项
     $scope.showNodone=function(){
         $scope.isshow = true;
     }
     // 11、搜索  加filter依赖
     $scope.search="";
     $scope.$watch("search",function(){
         var arr=$filter("filter")($scope.data,{title:$scope.search});
         $scope.currentIndex=0;
         $scope.currentCon=arr[$scope.currentIndex];  //会筛选出好多个，只在右侧显示第一个

     })
     // 获取最大ID
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
                return temp+1;  //获取最大的id  +1就是添加后的id
            }
        }
        // 获取对应id的下标
     function getIndex(arr,id){
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
                return i;
            }
        }
     }
    }])

 // Error: [ngRepeat:dupes]
 // 这个出错提示，意思是指数组中有2个以上的相同项。
 // ngRpeat不允许collection中存在两个相同项。
 // 解决办法   item in data track by item.id