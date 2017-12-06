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
var margx3 = 100;
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
    
function preload() {
    table = loadTable("lakasok 12v4.csv","csv","header");
    //myFont = loadFont("../common/DinBold.ttf");
    //fontot kiválasztani
}

function setup() {

    createCanvas(displayWidth, displayHeight);
    background(235);
    

    // textFont(myFont);
    // textSize(24);
    
    //defining area to draw records to
    upricewidth = displayWidth - padx * 2 - margx1 - margx2 - margx3 - margx4;
    likey = (displayHeight - margy1 - margy2 - margy3- boxy);
    
    //looking up min and max unit price
    var rows = table.getRows();

    upricemin = 999;
    upricemax = 0;
    
  for (var r = 0; r < rows.length; r++) {
    var uprice = rows[r].getNum("unitprice");
 
    if (uprice < upricemin) {
        upricemin = uprice
    }    
    if (uprice > upricemax) {
        upricemax = uprice
    }
      //print(uprice);
  }
  
  var upricediff = upricemax-upricemin;

    //print(upricediff);
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
        w : 20,
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
    
    
    lakasrec.x = map(lakasrec.uprice, upricemin, upricemax, upriceleft, upriceright);
    lakasrec.y = map(lakasrec.loc + lakasrec.prop + lakasrec.cond + lakasrec.extr, 0, 16, margy1 + likey, margy1);
    lakasrec.h = map(lakasrec.loc + lakasrec.cond + lakasrec.prop + lakasrec.extr, 0, 16, 0, likey);
    
    print(lakasrec.x);
    print(lakasrec.y);
    print(lakasrec.h);
         
    //var x = 10 + r*30;
    
    //hazikok[r] = new haziko(x, 50, 20, 80);
    //hazikok[r] = new haziko(lakasrec.x, lakasrec.y, lakasrec.w, lakasrec.h);   
    }
    //hazikok.push(new haziko());
   
   // haziko1 = new haziko(lakasrec.x, lakasrec.y, lakasrec.w, lakasrec.h);
    haziko2 = new haziko(200,200,10,120);
   
        
   // }

    

}

function draw() {
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
    stroke(80);
    //vonalvastagság
    line(baseline.x1,baseline.y1,baseline.x2,baseline.y2);
    
    //draws arrow tip on above line
    //fill(80);
    //forgat-rajzol-forgat ld nyilak példa
    
    //draws horizontal axises for preference values
    
/*    for (var i = 0; i < 4 ; i++) {
        line(margx1 + padx, margy + i * likey / 4, margx1 + padx + upricewidth, margy + i * likey)
    }
    
    //line (pref_axis.x1 = x1(i))
    */

    
    //haziko1.show();
   /*for (var i=0; i< 4; i++) {
        haziko[i].show();
   }
   
    //haziko1.show();*/
    haziko2.show();
    
    
}

class haziko{
    constructor(x,y,l,w){
        this.pointx=x;
        this.pointy=y;
        this.length=l;
        this.width=w;
    }
    show(){
        stroke(80);
        fill (100,100);
        rect (this.pointx,this.pointy,this.length,this.width);
        text ("naugye.",this.pointx+30,this.pointy);
    }
}
    
    

        

    

             
    