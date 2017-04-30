angular.module("myapp",[])
    .controller("control",["$scope","$filter",function ($scope,$filter) {
        //用户添加的数据 将字符串转化成json对象
        $scope.data=localStorage.data?JSON.parse(localStorage.data):[];

        //条目数据
        $scope.done=localStorage.done?JSON.parse(localStorage.done):[];

        //添加列表：1.唯一id 2.title 3.son条目，二维
        $scope.add=function () {
            var obj={};
            obj.id=getMaxId($scope.data);
            obj.title="新建事项"+obj.id;
            obj.son=[];
            
            $scope.data.push(obj);
            $scope.currentIndex=getIndex($scope.data,obj.id);
            $scope.currentCon=$scope.data[$scope.currentIndex];

            localStorage.data=JSON.stringify($scope.data);
            //把字符串转化成json
        }

        //获取最大的id，实现自增
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
        
        //获取下标 通过已知的数组和id，获取到id在数组中的下标
        function getIndex(arr,id) {
            for(var i=0;i<arr.length;i++){
                if(arr[i].id==id){
                    return i;
                }
            }
        }
        
        //右边默认显示第一个=0：
        $scope.currentIndex=$scope.data.length-1;
        //显示最后一个
        $scope.currentCon=$scope.data[$scope.currentIndex];

        //添加列表的标题聚焦,让右边相应的内容变化
        $scope.focus=function (id) {
            var index=getIndex($scope.data,id);
            $scope.currentIndex=index;
            $scope.currentCon=$scope.data[$scope.currentIndex];
        }

        // 列表标题失焦，保存
        $scope.blur=function (id) {
            localStorage.data=JSON.stringify($scope.data);
        }

        //删除列表 需要考虑删除后右边显示哪条
        $scope.removeList=function (id) {
            angular.forEach($scope.data,function(obj,index){
                if(id==obj.id){
                    var index=getIndex($scope.data,id);
                    if(index==$scope.data.length-1){

                        //如果删除的是最后一个的话，让倒数第二个显示在右边
                        $scope.currentIndex=index-1;
                    }else{
                        //其余的都让下一个显示
                        $scope.currentIndex=index;
                    }
                    $scope.data.splice(index,1);
                    $scope.currentCon=$scope.data[$scope.currentIndex];
                }
            })
            localStorage.data=JSON.stringify($scope.data);
        }

        //添加条目
        $scope.addOpt=function () {
            var obj={};
            //$scope.currentCon.son数据是双向的，这里也可以获取到
            obj.id=getMaxId($scope.currentCon.son);
            obj.title=$scope.currentCon.title+"-条目"+obj.id;

            $scope.currentCon.son.push(obj);
            localStorage.data=JSON.stringify($scope.data);
        }
        
        //删除条目
        $scope.delOpt=function (id) {
            var index=getIndex($scope.currentCon.son,id);
            $scope.currentCon.son.splice(index,1);
            localStorage.data=JSON.stringify($scope.data);
        }

        //条目已做 从未做里删除，添加到已做里
        $scope.doneFun=function (id) {
            var index=getIndex($scope.currentCon.son,id);

            var obj=$scope.currentCon.son.splice(index,1);
            //spice返回的是一个数组，所以需要处理格式，另外id可能会冲突，需要处理
            obj[0].id=getMaxId($scope.done);
            $scope.done.push(obj[0]);

            localStorage.data=JSON.stringify($scope.data);
            localStorage.done=JSON.stringify($scope.done);
        }

        $scope.isshow=true;
        //点击显示已办事项
        $scope.showDone=function(){
            console.log(1);
            $scope.isshow=false;
        }

        //点击显示未办事项
        $scope.showData=function(){
            $scope.isshow=true;
        }

        //删除已做条目
        $scope.removeDone=function(id){
            var index=getIndex($scope.done,id);
            $scope.done.splice(index,1);
            localStorage.done=JSON.stringify($scope.done);
        }

        //删除所有已做
        $scope.delAll=function(){
            $scope.done=[];
            localStorage.done=JSON.stringify($scope.done);

        }
        
        //搜索
        $scope.search="";
        $scope.$watch("search",function(){
            //让右边视图改变
            var arr=$filter("filter")($scope.data,{title:$scope.search});
            //console.log(arr);//结果组成的数组[obj.obj]
            //console.log($scope.currentIndex)//0  可以有多条结果，默认显示第一条
            $scope.currentIndex=0;
            $scope.currentCon=arr[$scope.currentIndex];
        })




    }])
