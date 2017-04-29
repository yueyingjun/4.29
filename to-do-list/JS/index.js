/**
 * Created by 蚁族的奋斗 on 2017/4/29.
 * 第一步：首先添加到本地存储里面数据，然后获取$scope.data获取到数据后就可以对其进行循环了。这里需要
 *          注意的是本地存储的时候想，系统会自动里面的数据加上一个类似id的东西,我们要把它去掉，按照           我们自己的id     循环的时候加track by item.id
 * 第二步: 要和右边同步起来这就用到了我们之前定义的$scope.currentCon，再用表达式{{}}}解析皆可以了；           设置的是默认显示最后一个
 * 第三步：删除列表 注意的是要对善春的是最后一个的话做特殊的判断。
 * 第四部：第2步显示的是最后一个，通过聚焦和失焦实时获取聚焦的数据到右边显示。
 * 第五步：点击新建右边子栏目
 * 第六步：删除右边子栏目  失去焦点的时候存值，和之前一样
 * 第七步：在本地存储里面建立个存储完成数据的地方。右边点击添加到完成数据里面。
 * 第八步：给已完成设置完成的数量，和点击完成展示  点击左边栏目展示条目              通过  ng-show="isshow==false"  判断真假来决定是否显示
 * 第九步：删除完成的数据。
 * 第十步：搜索。3个地方同时更新
 */
var app=angular.module("myapp",[]);
app.controller("ctrl",["$scope","$filter",function($scope,$filter){
    //1 原始数据  一开始是[];当里面存上东西的时候，这里就有数据了 ，紧接着就可以对这里进行循环了。
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    //7完成的数据   [{"id":1,"title":"新建条目1"},{"id":2,"title":"新建条目1"}]
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];
    console.log($scope.data)
    //9是否显示完成列表
    $scope.isshow=true;
    //2当前选择的事项 初始化这两个值，一开始默认的获取的数组的第一个对象的内容。这里必须得定义，因为在右边要实时获取 这个值。
    $scope.currentIndex=0;
    $scope.currentCon=$scope.data[$scope.currentIndex];
    //3 点击往里面存东西  我们就是希望存成下面这种样式的
// [{"id":7,"title":"新建事项7","son":[{"id":1,"title":"新建条目1"},{"id":2,"title":"新建条目2"}]}]
    $scope.add=function(){
        var obj={};
        obj.id=getMaxId($scope.data);
        obj.title="新建事项"+obj.id;
        obj.son=[];
        $scope.data.push(obj);
        //根据id获取到下标，在根据下标获取到内容。
        $scope.currentIndex=getIndex($scope.data,obj.id);
        $scope.currentCon=$scope.data[$scope.currentIndex];
        //本地存储上数据以后，data就有数据了，紧接着就可以对其进行循环。
        localStorage.data=JSON.stringify($scope.data);
    }
    /*4 删除列表*/
    $scope.removeList=function(id){
        angular.forEach($scope.data,function(obj,index){
            if(id==obj.id){
                $scope.data.splice(index,1);
                var index=getIndex(id);
                //当删除最后一个的时候，右边不变，所以要进行判断
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
    /*4列表获得焦点
    *
    * */
    $scope.focus=function(id){
        var index=getIndex($scope.data,id);
        $scope.currentIndex=index;
        $scope.currentCon=$scope.data[$scope.currentIndex];

    }
    /*4失去焦点*/
    $scope.blur=function(id){
        localStorage.data=JSON.stringify($scope.data);
    }

    /*5添加条目*/
    $scope.addOpt=function(){
        var obj={};
        var id=getMaxId($scope.currentCon.son);
        obj.id=id;
        obj.title="新建条目"+obj.id;
        $scope.currentCon.son.push(obj);
        localStorage.data=JSON.stringify($scope.data);
    }
    /*6删除条目*/
    $scope.delOpt=function(id){
        var index=getIndex($scope.currentCon.son,id);
        $scope.currentCon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    }
    /*7条目完成后点击添加到完成事项里面*/
    $scope.doneFun=function(id){
        var index=getIndex($scope.currentCon.son,id);
        //1. 原数组删除 截取出来的obj是这个样子的 [{"id":3,"title":"新建条目3"}] 和pop不一样的，带着[]
        var obj=$scope.currentCon.son.splice(index,1);
        console.log(obj)
        //2. 要将删除的元素放到done数组里面;
        obj[0].id=getMaxId($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    }
    /*8显示完成列表*/
    console.log($scope.isshow )
    $scope.showdone=function(){
        $scope.isshow = false;
        console.log($scope.isshow )
    }
    /*9删除已完成的东西*/
    $scope.removeDone=function(id){
        var index=getIndex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);

    }
    //10 搜索  监控search  然后对右边的标题栏就进行两个更改 ，其他的两个地方第通过 ng扩展的过滤。这是代码的过滤
    $scope.search="";
    $scope.$watch("search",function(){
        var arr=$filter("filter")($scope.data,{title:$scope.search});
        $scope.currentIndex=0;
        $scope.currentCon=arr[$scope.currentIndex];

    })
    /*显示内容*/
    $scope.showCon=function(){
        $scope.isshow = true;
        console.log($scope.isshow )
    }
    //1为了新建的id不和以前的一样，所以要调用这个 函数，id直接是里面紧接着最大的，以此类推。
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
    //1根据id获取到我们需要的下标，数组有了下标就可以 获取 到内容。
    function getIndex(arr,id){
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
                return i;
            }
        }


    }
}])