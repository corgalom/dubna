angular.module('dubna', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('mainCtrl', function($scope, $cordovaSQLite, $ionicPlatform, $ionicModal){
    $scope.schedule = [];
    $scope.dir='F';
    $scope.showTable=false;
    $scope.rasplabel = "Расписание";
    $scope.label='В Дубну';
    $scope.titlelabel = 'Москва-Дубна';
    $scope.getDb = function(){
        var now = new Date;
        $scope.hours = now.getHours();
        $scope.mins = now.getMinutes();
        $scope.day = now.getDay();
        var db = $cordovaSQLite.openDB({ name: "schedule.db" }); //for mobile
        //var db = window.openDatabase("schedule.db", "1.0", "Schedule", -1); //for desktop
        $cordovaSQLite.execute(db, "SELECT * FROM `Transport` ORDER BY time",[]).then(function(data){
                        schedule = [];
                        totschedule = [];
                       for (var i = 0; i < data.rows.length; i++) {
                        var parts = data.rows.item(i).time.split(':');
                        schedule[i] = data.rows.item(i);
                        totschedule.push(prepDataTable(data.rows.item(i)));
                        if (validDay($scope.day,data.rows.item(i).weekdays)){
                            schedule[i].delay = calcDiff($scope.hours, $scope.mins, parts[0], parts[1]);
                            schedule[i].arrival = calcArrival(parts[0], parts[1], data.rows.item(i).tit);
                            if (schedule[i].delay){
                                spl = schedule[i].delay.split(':');
                                hrs=spl[0];
                                mins=parseInt(spl[1]);
                                if (hrs=='0'&&mins>=10) schedule[i].style="balanced";
                                else if (hrs=='0'&&mins<10) schedule[i].style="assertive";
                            }
                        } 
                       }
                    $scope.schedule = schedule;
                    $scope.totschedule = totschedule;
                   }, function (err) {
            //хардкодинг это круто! я не могу найти оправданий этому ужасу:
            var query = "CREATE TABLE IF NOT EXISTS `Transport` (`id` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, `time` TEXT NOT NULL, `weekdays` TEXT NOT NULL, `type` TEXT NOT NULL, `tit` INTEGER NOT NULL, `direction` TEXT NOT NULL, `price` INTEGER);";
            var verquery = "CREATE TABLE `Version` (`Version` INTEGER NOT NULL UNIQUE, PRIMARY KEY(Version));"
            var verinsquery = "INSERT INTO `Version` VALUES ('1');"
            var querycol = ["INSERT INTO `Transport` VALUES ('1','04:46','all','train','146','R','245');", "INSERT INTO `Transport` VALUES ('2','05:47','all','train','157','R','245');", "INSERT INTO `Transport` VALUES ('3','07:00','all','express','115','R','300');", "INSERT INTO `Transport` VALUES ('4','07:46','all','train','142','R','245');", "INSERT INTO `Transport` VALUES ('5','11:47','hd','train','149','R','245');", "INSERT INTO `Transport` VALUES ('6','13:04','hd','express','111','R','300');", "INSERT INTO `Transport` VALUES ('7','14:55','all','train','145','R','245');", "INSERT INTO `Transport` VALUES ('8','16:50','all','train','146','R','245');", "INSERT INTO `Transport` VALUES ('9','19:19','all','train','148','R','245');", "INSERT INTO `Transport` VALUES ('10','20:37','all','express','118','R','300');", "INSERT INTO `Transport` VALUES ('11','21:39','all','train','166','R','245');", "INSERT INTO `Transport` VALUES ('12','10:55','all','train','150','R','245');", "INSERT INTO `Transport` VALUES ('13','04:42','all','train','141','F','245');", "INSERT INTO `Transport` VALUES ('14','07:46','all','train','137','F','245');", "INSERT INTO `Transport` VALUES ('15','08:26','hd','train','147','F','245');", "INSERT INTO `Transport` VALUES ('16','09:28','wd','train','145','F','245');", "INSERT INTO `Transport` VALUES ('17','09:55','hd','express','114','F','300');", "INSERT INTO `Transport` VALUES ('18','10:42','hd','train','141','F','245');", "INSERT INTO `Transport` VALUES ('19','13:47','all','train','144','F','245');", "INSERT INTO `Transport` VALUES ('20','15:42','all','train','145','F','245');", "INSERT INTO `Transport` VALUES ('21','17:30','all','express','110','F','300');", "INSERT INTO `Transport` VALUES ('22','18:10','all','train','144','F','245');", "INSERT INTO `Transport` VALUES ('23','19:09','wd','train','158','F','245');", "INSERT INTO `Transport` VALUES ('24','18:56','hd','train','156','F','245');", "INSERT INTO `Transport` VALUES ('25','20:42','all','train','148','F','245');", "INSERT INTO `Transport` VALUES ('26','21:55','all','express','108','F','300');", "INSERT INTO `Transport` VALUES ('27','23:45','all','train','135','F','245');", "INSERT INTO `Transport` VALUES ('28','04:15','all','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('29','05:15','sd','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('30','06:45','all','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('31','07:45','sd','bus','140','R','290');", "INSERT INTO `Transport` VALUES ('32','09:15','all','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('33','10:45','all','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('34','12:15','sd','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('35','13:15','all','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('36','16:15','all','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('37','18:45','all','bus','120','R','290');", "INSERT INTO `Transport` VALUES ('38','09:00','all','bus','120','F','290');", "INSERT INTO `Transport` VALUES ('39','11:30','all','bus','120','F','290');", "INSERT INTO `Transport` VALUES ('40','12:45','sd','bus','120','F','290');", "INSERT INTO `Transport` VALUES ('41','13:30','sd','bus','120','F','290');", "INSERT INTO `Transport` VALUES ('42','14:30','all','bus','120','F','290');", "INSERT INTO `Transport` VALUES ('43','15:30','sd','bus','120','F','290');", "INSERT INTO `Transport` VALUES ('44','16:30','all','bus','120','F','290');", "INSERT INTO `Transport` VALUES ('45','18:00','all','bus','140','F','290');", "INSERT INTO `Transport` VALUES ('46','20:10','all','bus','130','F','290');", "INSERT INTO `Transport` VALUES ('47','23:00','all','bus','120','F','290');", "INSERT INTO `Transport` VALUES ('48','07:30','all','kbus','120','F','290');", "INSERT INTO `Transport` VALUES ('49','10:30','all','kbus','120','F','290');", "INSERT INTO `Transport` VALUES ('50','12:00','sd','kbus','120','F','290');", "INSERT INTO `Transport` VALUES ('51','19:30','all','kbus','140','F','290');", "INSERT INTO `Transport` VALUES ('52','21:00','all','kbus','120','F','290');", "INSERT INTO `Transport` VALUES ('53','12:30','sunday','kbus','120','F','290');", "INSERT INTO `Transport` VALUES ('54','13:30','sunday','kbus','120','F','290');", "INSERT INTO `Transport` VALUES ('55','15:30','sunday','kbus','120','F','290');"
];
            $cordovaSQLite.execute(db, query,[]);
            $cordovaSQLite.execute(db, verquery,[]);
            $cordovaSQLite.execute(db, verinsquery,[]);
            for (var i = 0; i<querycol.length; i++){
                $cordovaSQLite.execute(db, querycol[i],[]);
            }
                                                                                     
        });
        $scope.$broadcast('scroll.refreshComplete');
    }
    $ionicPlatform.ready(function() {
  $scope.getDb();
});
    
    var calcArrival = function(hrs, mins, tit){
        addHrs = Math.floor(tit/60);
        addMins = tit%60;
        resHrs = parseInt(hrs)+parseInt(addHrs);
        resMins = parseInt(mins) + parseInt(addMins);
        if (resMins>=60){
            resMins = resMins-60;
            resHrs++;
        }
        if (resMins.toString().length<2){
            resMins='0'+resMins;}
        if (resHrs>=24){
            resHrs=resHrs-24;
        }
        return resHrs+':'+resMins;
        
    }
   var calcDiff = function(hn,mn,he,me){
    var hour = he-hn;
    var min = me-mn;
    if (hour>=0){
        if (min>=0){
            return hour+':'+norm(min);
        }else{
            hour--;
            min=min+60;
            if (hour>=0){
            return hour+':'+norm(min);}
        }
        
    }
};
    var prepDataTable = function(item){
        prepared = {};
        prepared.time = item.time;
        if (item.direction=='F'){
            prepared.direction='В Дубну';
        }else prepared.direction='В Москву';
        if (item.weekdays=='all'){
            prepared.weekdays='Все дни';
        }else if(item.weekdays=='wd'){
            prepared.weekdays='Раб. дни';
        }else if(item.weekdays=='hd'){
            prepared.weekdays='Вых. дни';
        }else if(item.weekdays=='sd'){
            prepared.weekdays='Пн.-Сб.';
        }else if(item.weekdays=='sunday'){
            prepared.weekdays='Вскр.';
        }
        if (item.type=='bus'){
            prepared.type='РАТА';
        }else if(item.type=='kbus'){
            prepared.type='Кимры';
        }else if(item.type=='train'){
            prepared.type='Поезд';
        }else if(item.type=='express'){
            prepared.type='Экспресс';
        }
        prepared.tit = item.tit;
        prepared.price = item.price;
        return prepared;
};
    
    var validDay = function(day,rule){
        if (rule=='all'){
            return true}
        else if (rule=='wd'&&day<6){
            return true}
        else if (rule=='hd'&&day>5){
            return true}
        else if (rule=='sd'&&day<7){
            return true}
        else if (rule=='sunday'&&day==7){
            return true}
        else return false;
    }
    
    var norm = function(minute){
     if (minute.toString().length==1){
         return '0'+minute;
     }else{
         return minute}
    }
    
    $scope.changeDir = function(){
     if ($scope.dir=='F'){
         $scope.dir='R';
         $scope.label='В Москву';
         $scope.titlelabel = 'Дубна-Москва';
     }else{ 
         $scope.dir='F';
         $scope.label='В Дубну';
         $scope.titlelabel = 'Москва-Дубна';
     }
    }
    $scope.switchSch = function(){
        if ($scope.showTable){
            $scope.showTable = false;
            $scope.rasplabel = "Расписание";
        }
        else{
            $scope.showTable = true;
            $scope.rasplabel = "Рейсы";
        }
    }
    
    $scope.showHelp = function(){
        $scope.modal.show();
    }
    
$ionicModal.fromTemplateUrl('page/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
    
$ionicModal.fromTemplateUrl('page/trip.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.trip = modal;
  });    
    
  $scope.openModal = function() {
    $scope.modal.show();
  };
    $scope.openTrip = function() {
    $scope.trip.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
    $scope.closeTrip = function() {
    $scope.trip.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    $scope.trip.remove();
  });
$scope.showTrip = function(trip){
    curtrip={};
    curtrip.time = trip.time;
    if (trip.direction=='F'){
        curtrip.direction='Москва-Большая Волга';
    }else curtrip.direction='Большая Волга-Москва';
    if (trip.weekdays=='all'){
        curtrip.weekdays='Все дни';
    }else if(trip.weekdays=='wd'){
        curtrip.weekdays='Рабочие дни';
    }else if(trip.weekdays=='hd'){
        curtrip.weekdays='Выходные дни';
    }else if(trip.weekdays=='sd'){
        curtrip.weekdays='Пн.-Сб.';
    }else if(trip.weekdays=='sunday'){
        curtrip.weekdays='По воскресеньям';
    }
    if (trip.type=='bus'){
        curtrip.type='Автобус РАТА';
    }else if(trip.type=='kbus'){
        curtrip.type='Автобус Москва-Кимры';
    }else if(trip.type=='train'){
        curtrip.type='Электричка';
    }else if(trip.type=='express'){
        curtrip.type='Ж/д экспресс';
    }
    curtrip.tit = trip.tit;
    curtrip.price = trip.price;
    $scope.currentTrip = curtrip;
    $scope.trip.show();

}
    
});


