var myFont;
var table;
//var sizemin = 0;
//var sizemax = 0;
var upricemin = 0;
var upricemax = 0;
//var sizeleft;
//var sizeright;
var upriceup;
var upricedown;
var margx1 = 80;
var margx2 = 40;
var margx3 = 240;
var margx4 = 40;
var margy1 = 60; 
var margy2 = 60;
var margy3 = 40
var padx = 40;
var pady = 40;

var upricewidth
//var sizewidth

var likey
//var priceheight

var boxx = 100;
var boxy = 250;
var distx = 40;


var q = 0;
var haziko1;
var haziko2;

var hazikok = [];
var todraw = 0;
var avguprice = 0;
    
function preload() {
    table = loadTable("lakasok 12v4.csv","csv","header");
    //myFont = loadFont("../common/DinBold.ttf");
    //fontot kiválasztani
}

function setup() {

    createCanvas(displayWidth, displayHeight);
    background(80);
    

    // textFont(myFont);
    // textSize(24);
    
    //defining area to draw records to
    upricewidth = displayWidth - padx * 2 - margx1 - margx2 - margx3 - margx4;
    likey = (displayHeight - margy1 - margy2 - margy3- boxy);
    
    //looking up min and max unit price
    var rows = table.getRows();

    upricemin = 9999999;
    upricemax = 0;
    
  for (var r = 0; r < rows.length; r++) {
    var uprice = rows[r].getNum("unitprice");
 
    if (uprice < upricemin) {
        upricemin = uprice
    }    
    if (uprice > upricemax) {
        upricemax = uprice
    }
        print(upricemin);
        print(upricemax);
  }
  
  var upricediff = upricemax-upricemin;

    print(upricediff);
    upriceleft = margx1 + padx;
    upriceright = displayWidth -padx - margx2 - margx3 - margx4;
    likeup = margy1;
    likedown = margy1 + likey;
    
    for (var r = 0; r < rows.length; r++) {
    var lakasrec = {
        name : "",
        size : 0,
        price : 0,
        uprice : 0,
        url : "",
        ID : 0,
        distr : 0,
        loc : 0,
        prop : 0,
        cond : 0,
        extr : 0,
        liked : 0,
        parking : 0,
        view : 0,
        garden : 0,
        x : 0,
        y : 0,
        h : 0,
        w : 15,
    }
    lakasrec.name = rows[r].getString("name");
    lakasrec.size = rows[r].getNum("size");
    lakasrec.price = rows[r].getNum("price");
    lakasrec.uprice = rows[r].getNum("unitprice")
    lakasrec.url = rows[r].getString("url");
    lakasrec.ID = rows[r].getNum("ID");
    lakasrec.distr = rows[r].getNum("district");
    lakasrec.loc = rows[r].getNum("location")
    lakasrec.prop = rows[r].getNum("property")
    lakasrec.cond = rows[r].getNum("condition");
    lakasrec.extr = rows[r].getNum("extras");
    lakasrec.liked = rows[r].getNum("liked");
    lakasrec.parking = rows[r].getNum("parking");
    lakasrec.view = rows[r].getNum("view");
    lakasrec.garden = rows[r].getNum("garden");
    
    avguprice = avguprice + lakasrec.uprice;
    
    lakasrec.x = map(lakasrec.uprice, upricemin, upricemax, upriceleft, upriceright);
    lakasrec.y = map(lakasrec.loc + lakasrec.prop + lakasrec.cond + lakasrec.extr, 0, 12, margy1 + likey, margy1);
    lakasrec.h = map(lakasrec.loc + lakasrec.cond + lakasrec.prop + lakasrec.extr, 0, 12, 0, likey);
    
    //print(lakasrec.x);
    //print(lakasrec.y);
    //print(lakasrec.h);
         

    hazikok[r] = new haziko(lakasrec.x, lakasrec.y, lakasrec.w, lakasrec.h,lakasrec.name,lakasrec.uprice);
    }
    
    // draws a line at average unit price
    avguprice = avguprice / rows.length;
    avgx = map(avguprice, upricemin, upricemax, upriceleft, upriceright);
    line(avgx, margy1 - 15,avgx, margy1 + likey + 15);
    //hazikok.push(new haziko());
   
   // haziko1 = new haziko(lakasrec.x, lakasrec.y, lakasrec.w, lakasrec.h);
    //haziko2 = new haziko(200,200,10,120);
   
        
   // }

    

}

function draw() {
    if (todraw == 0){
   //draws horizontal axis for unit prices
    var baseline = {
        x1 : 0,
        y1 : 0,
        x2 : 0,
        y2 : 0,
    }

    baseline.x1 = margx1;
    baseline.y1 = margy1 + likey;
    baseline.x2 = displayWidth - margx2-margx3-margx4;
    baseline.y2 = baseline.y1;
    stroke(220);
    //vonalvastagság
    line(baseline.x1,baseline.y1,baseline.x2,baseline.y2);
    
    //draws arrow tip on above line (tip length = lakasrec.w *1,5)
    noStroke();
    fill(200);
    triangle(baseline.x2,baseline.y2 + 1, baseline.x2 + 1.5 * 15, baseline.y2 + 1, baseline.x2, baseline.y2 - 15 / 2);
    
    //draws horizontal dotted axises for preference values
    
    for (var x = 0; x < (baseline.x2 - margx1)/ 15; x++) {
    for (var i = 0; i < 4 ; i++) {
        var x1 = margx1 + x * 15;
        var y1 = margy1+ i * likey /4;
        stroke(220);
        point(x1, y1);   
        line (margx1 - 20, y1,margx1, y1);
    }
        
        
    }
    
    //line (pref_axis.x1 = x1(i))
    

    
    //haziko1.show();
   for (var i=0; i< hazikok.length; i++) {
        hazikok[i].show();
   }
   
    //haziko1.show();
    //haziko2.show();
    todraw = 1;
    
}
}

class haziko{
    constructor(x,y,w,l,name,uprice){
        this.pointx=x;
        this.pointy=y;
        this.width=w;
        this.length=l;
        this.name=name;
        this.uprice=uprice;
    }
    show(){
        //stroke(120);
        noStroke();
        fill (180, 180, 180, 70);
        rect (this.pointx,this.pointy,this.width,this.length);
        triangle (this.pointx,this.pointy,this.pointx + this.width / 2, this.pointy - this.width/2, this.pointx + this.width, this.pointy);
        stroke (30);
        line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
        //text (this.name,this.pointx,margy1+likey+20);
        //text (this.uprice,this.pointx,margy1+likey+50);
    }
}
    
    

        

    

             
    