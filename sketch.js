var myFont;
var table;
var upricemin = 0;
var upricemax = 0;
var upriceup;
var upricedown;
var margx1 = 90;
var margx2 = 40;
var margx3 = 240;
var margx4 = 40;
var margy1 = 60; 
var margy2 = 60;
var margy3 = 40;
var padx = 40;
var pady = 40;
var upricewidth
var likey
var distx = 40;
var q = 0;
var haziko1;
var haziko2;
var hazikok = [];
var buttons = [];
var todraw = 0;
var avguprice = 0;
var selectedidx = -1;
var boxx_ = 100;
var boxy_ = 250;
var mTexture;
var boxtop;
var boxbott;
var boxy;
var boxleft;
var boxright;
var boxx;
var bspx;
var bx;
var bspy;
var by;
var valtozo;   
var icon1;
var icon2;
var icon3;
var icon4, icon5, icon6, icon7, icon8;
var prev_mouseX = -1, prev_mouseY = -1, prev_selectedidx= -1;
var toRedraw = 1;

function preload() {
    table = loadTable("lakasok12v4.csv","csv","header");
    myFont = loadFont("Arcon-Regular.otf");
    icon1 = loadImage('images/like_c.png');
    icon2 = loadImage('images/parking_d.png');
    icon3 = loadImage('images/view_d.png');
    icon4 = loadImage('images/garden_d.png');
    icon5 = loadImage('images/like_l.png');
    icon6 = loadImage('images/parking_l.png');
    icon7 = loadImage('images/view_l.png');
    icon8 = loadImage('images/garden_l.png');  
}

function setup() {

    createCanvas(displayWidth, displayHeight);
    background(80);
    textFont(myFont);

    // this part is drawing everything once into the mTexture object
    mTexture = createGraphics( displayWidth, displayHeight );
    mTexture.background(80);
    
    //font 
    mTexture.textFont(myFont);
    
    //defining area to draw records to
    upricewidth = displayWidth - padx * 2 - margx1 - margx2 - margx3 - margx4;
    likey = (displayHeight - margy1 - margy2 - margy3- boxy_);
    
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
        //print(upricemin);
        //print(upricemax);
  }
  var upricediff = upricemax-upricemin;
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

    hazikok.push(new haziko(r, lakasrec.x, lakasrec.y, lakasrec.w, lakasrec.h,lakasrec.name,lakasrec.uprice, lakasrec.ID,lakasrec.size, lakasrec.price, lakasrec.distr, lakasrec.loc, lakasrec.prop, lakasrec.cond, lakasrec.extr, lakasrec.liked, lakasrec.parking, lakasrec.view, lakasrec.garden, lakasrec.url));
    }
    
    // draws a line at average unit price
    avguprice = avguprice / rows.length;
    avgx = map(avguprice, upricemin, upricemax, upriceleft, upriceright);
    mTexture.stroke(160);
    mTexture.line(avgx, margy1 - 15,avgx, margy1 + likey + 15);
    //text - average unit price
    mTexture.noStroke();
    mTexture.fill(160);
    mTexture.textSize(18);
    mTexture.text("átlagos egységár (HUF/m2)",avgx + 8, margy1 - 4);

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
    mTexture.stroke(220);
    mTexture.line(baseline.x1,baseline.y1,baseline.x2,baseline.y2);

    //draws arrow tip on above line (tip length = lakasrec.w *1,5)
    mTexture.noStroke();
    mTexture.fill(200);
    mTexture.triangle(baseline.x2,baseline.y2 + 1, baseline.x2 + 1.5 * 15, baseline.y2 + 1, baseline.x2, baseline.y2 - 15 / 2);
    
    //text - egységár HUF / m2
    mTexture.text("HUF/m2",baseline.x2 +30, baseline.y2 + 1);
    //draws horizontal dotted axises for preference values
    for (var x = 0; x < (baseline.x2 - margx1)/ 15; x++) {
    for (var i = 0; i < 4 ; i++) {
        var x1 = margx1 + x * 15;
        var y1 = margy1+ i * likey /4;
        mTexture.stroke(220);
        mTexture.point(x1, y1);   
        mTexture.line (margx1 - 20, y1,margx1, y1);
    }        
    }
    //text to describe how much a record was liked
    var string = ["nagyon","eléggé","azért", "kicsit"];
    for (var i = 0; i<4; i++) {
        var y1 = margy1 + i * likey /4;
        mTexture.noStroke();
        mTexture.fill(220);
        mTexture.textAlign(RIGHT);
        mTexture.text(string[i], margx1 - 24, y1 - 17 );
        mTexture.text("tetszik", margx1 - 24, y1);
    }
    //placing of buttons
    var names = ["kedvenc","jó garázs","panoráma","kertes"];
    var icons = [icon5,icon6,icon7,icon8];
    for (var i = 0; i<4; i++){
        
        buttons.push(new button( displayWidth - margx4 - 2 * margx3 / 3,margy1 + i * likey / 4 + likey / 8, names[i],icons[i]));
        buttons[i].show();
       /* var y = margy1 + i * likey / 4 + likey / 8;
        mTexture.stroke(220);
        mTexture.noFill();
        mTexture.ellipse(displayWidth - margx4 - 2 * margx3 / 3, y, 30,30);*/
    }
    
    //adatlap steady images
    var boxtop = margy1 + margy2 + likey;
    var boxbott = margy3;
    var boxy = displayHeight - boxtop - boxbott;
    var boxleft = margx1;
    var boxright = margx2 + margx3 + margx4;
    var boxx = displayWidth - boxleft - boxright;
    var bspx = 15;
    var bx = (boxx - bspx * 4)/ 3;
    var bspy = 5;
    var by = (boxy - bspy * 6) / 5;
    var valtozo = 90;
    
    //adatlap background rectangle
    mTexture.noStroke();
    mTexture.fill(220,220,220,130);
    //mTexture.rect(80,430,880,800);
    mTexture.rect(boxleft, boxtop, boxx, boxy, 15);
    
   /*for (var i=0; i< hazikok.length; i++) {
        //hazikok[i].show();
   } */
    refresh();
}
function holvagyok(x,y) 
//defines which exact record polygon is selected - mouse is over it
{
    var dist = 9999;
    var idx = -1;
    for (var r = 0; r < hazikok.length; r++){
        if ( (x >= hazikok[r].pointx && x <= (hazikok[r].pointx + hazikok[r].width))
              &&
             (y >= hazikok[r].pointy && y <= (hazikok[r].pointy + hazikok[r].length))
              &&
             (hazikok[r].highlighted == 1)
           ) {
            var d = abs(x - hazikok[r].pointx - hazikok[r].width / 2);
            if ( d < dist) {
                dist = d;
                idx = r;
            }
        }
    } 

    selectedidx = idx;
}
/*function mousePressed() {
    holvagyok(mouseX,mouseY);
    image( mTexture, 0,0 );
    if (selectedidx != -1){    
        hazikok[selectedidx].showCanvas();
        textSize(16);
        textAlign(LEFT);
        text(hazikok[selectedidx].name,hazikok[selectedidx].pointx + hazikok[selectedidx].width, hazikok[selectedidx].pointy + hazikok[selectedidx].length + 20);
    }
       
}
*/
function adatlap(i) 
//defines how the datasheet of the selected record should look like
{
    
    var boxtop = margy1 + margy2 + likey;
    var boxbott = margy3;
    var boxy = displayHeight - boxtop - boxbott;
    var boxleft = margx1;
    var boxright = margx2 + margx3 + margx4;
    var boxx = displayWidth - boxleft - boxright;
    var bspx = 15;
    var bx = (boxx - bspx * 4)/ 3;
    var bspy = 5;
    var by = (boxy - bspy * 6) / 5;
    var valtozo = 90;
    
    //adatlap background rectangle
    noStroke();
    fill(220,220,220,180);
    rect(boxleft, boxtop, boxx, boxy,15);
    
    noStroke();
    fill(20);
    text(hazikok[i].name,boxleft + bspx, boxtop + bspy + by);
    textAlign(RIGHT);
    stroke (60);
    line(boxleft + bspx, boxtop + bspy + by + bspy /2, boxright - bspx, boxtop + bspy + by + bspy /2);
    fill(40);
    noStroke();
    textSize(14);
    textAlign(LEFT);
    text("MÉRET (m2):", boxleft + bspx, boxtop + bspy * 2 + by * 2);
    text(hazikok[i].size, boxleft + bspx + valtozo, boxtop + bspy *2 + by *2 );
    text("ÁR (MHUF):",boxleft + bspx, boxtop + bspy *3 +by *3 );
    text(hazikok[i].price, boxleft + bspx + valtozo, boxtop + bspy *3 +by *3 );
    text("KERÜLET:",boxleft + bspx, boxtop + bspy *4 +by *4 );
    text(hazikok[i].district, boxleft + bspx + valtozo, boxtop + bspy *4 +by *4 );
    //text("LINK:",boxleft + bspx, boxtop + bspy *5 +by *5 );
    //text(hazikok[i].url, boxleft + bspx + valtozo, boxtop + bspy *5 +by *5 );
    //kiszámoltatni a leghosszabb stringet és annak a méretét beadni a 80 px helyett
    
    //showing icons on adatlap
    if (hazikok[i].liked == 1) {
        image(icon1, boxleft + 3 * bspx + 2 * bx, boxtop + bspy + 10);       
    }
    if (hazikok[i].parking == 1) {
        image(icon2, boxleft + 6 * bspx + 2 * bx, boxtop + bspy + 10);
    }
    if (hazikok[i].view == 1) {
        image(icon3, boxleft + 9 * bspx + 2 * bx, boxtop + bspy + 10);
    }
    if (hazikok[i].garden == 1) {
        image(icon4, boxleft + 12 * bspx + 2* bx, boxtop + bspy + 10);
    } 
    /*console.log(bspx);
    for (var i=0; i< 4; i++) {
         var ybx =  by * (1 +i);
         rect(boxleft + bx, boxtop + ybx, boxleft + bx + bspx, boxtop + ybx + bspx + bspy);
    }*/
    //showing loc,prop,cond,ext values
    var loclength = map(hazikok[i].locaton, 0,4,0,bx);
    var proplength = map(hazikok[i].property, 0,4,0,bx);
    var condlength = map(hazikok[i].condition, 0,4,0,bx);
    var extlength = map(hazikok[i].extras, 0,4,0,bx);
    
    for (var i= 0; i<4; i++) {
        fill(245,255);
        noStroke();
        rect(boxleft + bx + bspx * 2, (boxtop + bspy * (i + 1) + by * (i + 1) - 20 ), bx, 20);
        
    }
    fill(0,120,160,200);
    rect(boxleft + bx + bspx *2, (boxtop + bspy *1 + by * 1) - 20, loclength, 20);
    rect(boxleft + bx + bspx *2, (boxtop + bspy *2 + by * 2) - 20, proplength, 20);
    rect(boxleft + bx + bspx *2, (boxtop + bspy *3 + by * 3) - 20, condlength, 20);
    rect(boxleft + bx + bspx *2, (boxtop + bspy *4 + by * 4) - 20, extlength, 20);
    fill(40,255);
    textAlign(RIGHT);
    text(">>>", boxleft + bx *2 + bspx *2, boxtop + bspy * 1 + by * 1 - 23);
    textAlign(LEFT);
    text(">", boxleft + bx + bspx *2 + 5, boxtop + bspy * 1 + by * 1 - 23);
    text("környék", boxleft + bx + bspx *2 + 5, boxtop + bspy * 1 + by * 1 +14);
    text("környék", boxleft + bx + bspx *2 + 5, boxtop + bspy * 1 + by * 1 +14);
    text("ingatlan", boxleft + bx + bspx *2 + 5, boxtop + bspy * 2 + by * 2 +14);
    text("állapot", boxleft + bx + bspx *2 + 5, boxtop + bspy * 3 + by * 3 +14);
    text("extrák", boxleft + bx + bspx *2 + 5, boxtop + bspy * 4 + by * 4 +14);
}

function refresh(){

    image( mTexture, 0,0 );
        for (var i = 0; i< hazikok.length; i++){
             hazikok[i].showCanvas();
        }
    if (selectedidx != -1){    
        textSize(16);
        noStroke();
        fill(220);
        textAlign(LEFT);
        text(hazikok[selectedidx].name,hazikok[selectedidx].pointx + hazikok[selectedidx].width, hazikok[selectedidx].pointy + hazikok[selectedidx].length + 30);
        text(nfc(hazikok[selectedidx].uprice,0),hazikok[selectedidx].pointx + hazikok[selectedidx].width, hazikok[selectedidx].pointy + hazikok[selectedidx].length + 50);
        var w = textWidth(nfc(hazikok[selectedidx].uprice,0)) + 3;
        text("HUF/m2",hazikok[selectedidx].pointx + hazikok[selectedidx].width + w, hazikok[selectedidx].pointy + hazikok[selectedidx].length + 50);
        adatlap(selectedidx);
    }
    for (var i = 0; i < buttons.length; i++){
        buttons[i].show();
    }
}
/*function link(url) {
    window.location.href = "<a href="http://www.google.com" target="_blank" rel="nofollow">http://www.google.com</a>";
  //winName && open(url, winName, options) || (location = url);
}*/

function mousePressed(){
    for (var i = 0; i < buttons.length; i++){
        if (dist(buttons[i].buttonX, buttons[i].buttonY, mouseX, mouseY) < buttons[i].radius) {
            buttons[i].pressed = 1 - buttons[i].pressed;
            for (var j = 0; j < hazikok.length; j++){
               if (
                   (buttons[0].pressed == 0 || hazikok[j].liked == 1 )
                   &&
                   (buttons[1].pressed == 0 || hazikok[j].parking == 1 )
                   &&
                   (buttons[2].pressed == 0 || hazikok[j].view == 1 )
                   &&
                   (buttons[3].pressed == 0 || hazikok[j].garden == 1 )
                   ) {
                   hazikok[j].highlighted = 1;
                } else {
                   hazikok[j].highlighted = 0;   
                }
            }
            refresh();

            }
        }
    }

    


function draw() {

    if (prev_mouseX != pmouseX || prev_mouseY != pmouseY){
        holvagyok(pmouseX,pmouseY);
        if (prev_selectedidx != selectedidx) {
            refresh();   
        }
        prev_selectedidx = selectedidx;
    }
    prev_mouseX = pmouseX;
    prev_mouseY = pmouseY;
    
     /*if (todraw == 0){
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
    
}*/
}

class haziko{
    constructor(pidx,x,y,w,l,name,uprice,ID,size,price,distr,loc,prop,cond,ext,liked,parking,view,garden,url){
        this.pointx=x;
        this.pointy=y;
        this.width=w;
        this.length=l;
        this.name=name;
        this.uprice=uprice;
        this.ID = ID;
        this.size = size;
        this.price = price;
        this.district = distr;
        this.locaton = loc;
        this.property = prop;
        this.condition = cond;
        this.extras = ext;
        this.liked = liked;
        this.parking = parking,
        this.view = view;
        this.garden = garden;
        this.url = url;
        this.brightness = 50;
        this.alpha = 100;
        this.selected = 0;
        this.highlighted = 1;
        this.myidx = pidx;
    }
    /*clicked(x,y){
        var d = dist(x,y,this.pointx,this.pointy)
        if (d < this.width * 2){
        this.brightness = 220;
        this.alpha = 255;
        this.show();
        console.log(this.ID);
        }
   }   
   */
    show(){
        //stroke(120);
        mTexture.noStroke();
        mTexture.fill (this.brightness, this.alpha);    
        mTexture.rect (this.pointx,this.pointy,this.width,this.length);
        mTexture.triangle (this.pointx,this.pointy,this.pointx + this.width / 2, this.pointy - this.width/2, this.pointx + this.width, this.pointy);
        mTexture.stroke (30);
        mTexture.line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
        //shows unit prices on axis
        
        //text (this.name,this.pointx,margy1+likey+20);
        //text (this.uprice,this.pointx,margy1+likey+50);
    }

    showCanvas(){
        //stroke(120);
        noStroke();
        if (this.myidx != selectedidx) {
            if(this.highlighted == 1){
                fill(0,120,160,200);
                stroke (30);
                line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
            }else{
                fill(this.brightness, this.alpha);
                stroke (30);
                line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
            }  
        }
        else{
            if(this.highlighted == 1){
                fill(245,245);
                stroke (245);
                line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
            }else{
                fill(220,255);
                stroke (30);
                line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
            }
        }
        noStroke();
        rect (this.pointx,this.pointy,this.width,this.length);
        triangle (this.pointx,this.pointy,this.pointx + this.width / 2, this.pointy - this.width/2, this.pointx + this.width, this.pointy);
        //stroke (30);
        //line (this.pointx + this.width /2, this.pointy + this.length +1, this.pointx + this.width / 2, this.pointy + this.length + 15 );
        //text (this.name,this.pointx,margy1+likey+20);
        //text (this.uprice,this.pointx,margy1+likey+50);
    }
}

class button {
    constructor(x,y,name,img){
        this.buttonX = x;
        this.buttonY = y;
        this.pressed = 0;
        this.radius = 30;
        this.name = name;
        this.img = img;
    }
    show(){
        push();
        if (this.pressed == 0) {
            
            tint(255,120);
            image(this.img,this.buttonX - this.radius + 5,this.buttonY - this.radius + 5);
         
        
        } else {
            image(this.img,this.buttonX - this.radius + 5,this.buttonY - this.radius + 5);

            //noStroke();
            //fill(200,200);
        }
        pop();
        noFill();
        stroke(220);
        ellipse(this.buttonX,this.buttonY,this.radius *2,this.radius * 2);
        noStroke();
        fill(220,245);
        textSize(18);
        textAlign(RIGHT);
        text(this.name, this.buttonX - this.radius - 7, this.buttonY + 7);
    }
}
/*class url {
    constructor(x,y,string){
        this.linkX = x;
        this.linkY = y;
        this.url = string;
        this.active = 0;
    }
    show(){

        if (this.active == 0) {
            noStroke();
            fill(255,120);
            rect(this.linkX,this.linkY,this.linkX + 50, this.linkY +25);
            fill(80);
            text(this.url, this.linkX +8, this.linkY + 16);
            
        } else {
            image(this.img,this.buttonX - this.radius + 5,this.buttonY - this.radius + 5);

            //noStroke();
            //fill(200,200);
        }
    }
}*/
    
    

        

    

             
    