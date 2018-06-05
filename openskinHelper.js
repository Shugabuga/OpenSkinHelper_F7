// OpenSkinHelper_F7 v0.2.1 (c) HeyItsShuga. Licensed under MIT.

// Make sure you set instances of "app" to your F7 object name!

window.onload = () => {
  OpenSkinHelper.init();
  if(window.localStorage.getItem("savedSkin")) {
    console.log("%c[OpenSkin-Helper] %c Applying last used skin...", "color:#358311", "color: gray");
    OpenSkin.getStr(window.localStorage.getItem("savedSkin"),true);
  }
}

function OpenSkinHelper() {

  this.popup = function() {
    console.log("%c[OpenSkin-Helper] %c Opening skin picker pop-up...", "color:#358311", "color: gray");
    app.preloader.show();

    if(JSON.parse(window.localStorage.getItem("allSkins")).length == 0) {
        OpenSkinHelper.createPopup();
    } else {
        var request = [], i;
        var skinInfo = [], i;
        for(var i = 0; i < JSON.parse(window.localStorage.getItem("allSkins")).length; i++) {
          (function(x){
            try {
                if(openskinDLProxy == "") {
                    var usePunc = "?";
                } else {
                    var usePunc = "&";
                }
                request[x] = new XMLHttpRequest();
                var reURL = JSON.parse(window.localStorage.getItem("allSkins"))[i];
                url = openskinDLProxy + reURL + usePunc + "index=" + x;
                request[x].open("GET", url, true);
                request[x].onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                      try{
                        var json = JSON.parse(this.responseText);
                        console.log("%c[OpenSkin-Helper] %c Getting skin information for " + json.name + " [" + x + "] ...", "color:#358311", "color: gray");
                        rURL = this.responseURL.substring((this.responseURL.indexOf("?dl=")+4),(this.responseURL.indexOf(usePunc + "index=")-0));
                        skinInfo.push({
                            name: json.name.patch(),
                            author: json.author.patch(),
                            logo: json.logo.patch(),
                            url: encodeURI(rURL.patch()),
                            extraClass: ''
                        });
                        if(skinInfo.length == JSON.parse(window.localStorage.getItem("allSkins")).length) {
                            OpenSkinHelper.createPopup(skinInfo);
                        }
                      } catch(err) {
                        console.warn("Error: Unknown skin at position" + x);
                        rURL = this.responseURL.substring((this.responseURL.indexOf("?dl=")+4),(this.responseURL.indexOf(usePunc + "index=")-0));
                        skinInfo.push({
                            name: "Unknown Skin",
                            author: JSON.parse(window.localStorage.getItem("allSkins"))[x],
                            logo: "https://shuga.co/OpenSkinDefault.png",
                            url: rURL.patch(),
                            extraClass: 'disabled'
                        });
                        if(skinInfo.length == JSON.parse(window.localStorage.getItem("allSkins")).length) {
                            OpenSkinHelper.createPopup(skinInfo);
                        }
                      }
                    }
                }
                request[x].send();
            } catch(err) {
                console.error("Error: Something bad happened at position" + x + ": " + err);
            }
            // OpenSkinHelper.createPopup(skinInfo);
          })(i);
        }
      }
  }

  this.list = function() {
    return JSON.parse(document.localStorage.getItem("allSkins"));
  }

  this.createPopup = function(arr) {
    app.popup.create({
      content: `
    <div class="popup">
      <div style="overflow:hidden" class="page-content" data-name="openskin">
        <div class="navbar">
          <div class="navbar-inner sliding">
            <div class="left">
              <a href="#" class="tint link popup-close">
                <i class="icon material-icons md-only">close</i>
                <span class="ios-only">Close</span>
              </a>
            </div>
            <div class="title">Skins</div>
            <div class="right">
              <a onclick="OpenSkinHelper.addPopup()" href="#" class="tint link">
                <i class="icon f7-icons ios-only">add</i>
                <i class="icon material-icons md-only">add</i>
              </a>
            </div>
          </div>
        </div>
            <div style="overflow:scroll;height:100%">
                <div class="block-title">Current Skin</div>
                <div class="list">
                  <ul>
                    <li>
                      <div class="item-content">
                        <div class="item-media"><img id="skinIcon" src="" style="border-radius:5px;width:65px;height:65px"></div>
                        <div class="item-inner">
                          <div class="item-title">
                             <x id="skinName" style="font-size:21px">Default</x>
                             <div style="font-size:16px class="item-footer card-footer-inner-text">By <x id="skinAuthor">OpenSkin</x></div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="block-title">My Skins</div>
                <div class="list skin-list">
                </div><br><br>
            </div>
        </div>
      </div>`,
      // Events
      on: {
        opened: function (popup) {
          console.log("%c[OpenSkin-Helper] %c Opened skin picker pop-up.", "color:#358311", "color: gray");
          var virtualList = app.virtualList.create({
              el: '.skin-list',
              items: arr,
              itemTemplate:
                `<li style="cursor:pointer" class="swipeout">
                      <div onclick="OpenSkinHelper.apply('{{url}}')" class="swipeout-content {{extraClass}}">
                        <div class="item-content">
                          <div class="item-media"><img src="{{logo}}" style="border-radius:5px;width:50px;height:50px"></div>
                          <div class="item-inner">

                            <div class="item-title">
                              {{name}}
                              <div style="font-size:12px">By {{author}}</div>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div class="swipeout-actions-right">
                        <a href="#" onclick="OpenSkinHelper.remove('{{url}}')" class="swipeout-delete">Delete</a>
                      </div>
                    </li>`,
              // Item height
              height: app.theme === 'ios' ? 63 : 73,
            });
          OpenSkinHelper.updatePopup();
        },
      }
    }).open();
    app.preloader.hide();
  }

  this.toast = function(icon, msg) {
    try {
        var toastIcon = app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">' + icon + '</i>' : '<i class="material-icons">' + icon + '</i>',
        text: msg,
        position: 'center',
        closeTimeout: 2000,
        }).open(); 
    } catch(e) {}
  }

  this.updatePopup = function() {
    skin = OpenSkin.skin();
    document.querySelector("#skinName").innerHTML = skin.name.patch();
    document.querySelector("#skinAuthor").innerHTML = skin.author.patch();
    document.querySelector("#skinIcon").src = skin.logo.patch();
  }

  this.apply = function(url,hideToast) {
    url = openskinDLProxy + url; // cross-origin stuff
    OpenSkin.get(url,true);
    window.setTimeout(()=>{
      window.localStorage.setItem("savedSkin", JSON.stringify(OpenSkin.skin()));
      try {
          OpenSkinHelper.updatePopup();
      } catch(e) {}
      if(hideToast != true) {
        this.toast("check","Skin Applied.");
      }
    },1234);
  }

  this.append = ({
        name: "SKIN_TEMP",
        author: "SKIN_TEMP",
        logo: "SKIN_TEMP",
        url: "SKIN_TEMP"
    });

  this.add = function(url) {
    if(!window.localStorage.getItem("allSkins")) {
      this.init;
    }
    url = encodeURI(openskinDLProxy + url); // cross-origin stuff
    var current = JSON.parse(window.localStorage.getItem("allSkins"));
    current.push(url);
    window.localStorage.setItem("allSkins",JSON.stringify(current));
    this.toast("check","Skin Added.");

    request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            try {
              var json = JSON.parse(this.responseText);
              console.log("%c[OpenSkin-Helper] %c Getting skin information for " + json.name + "...", "color:#358311", "color: gray");
              OpenSkinHelper.append = ({
                  name: json.name.patch(),
                  author: json.author.patch(),
                  logo: json.logo.patch(),
                  url: encodeURI(url.patch())
              });
              app.virtualList.get(".skin-list").appendItem(OpenSkinHelper.append);
            } catch(err) {
              OpenSkinHelper.remove(this.responseURL);
            }
        }
    }
    request.send();
  }

  this.addPopup = function() {
    app.dialog.prompt('Enter the URL for the skin you want to add:', 'Add Skin', function (url) {
        if(!(!url || url == "")) {
            if((url.indexOf("https://") == 0) || (url.indexOf("http://") == 0) || (url.indexOf("//") == 0)) {
                OpenSkinHelper.add(url);
            } else {
                url = "https://" + url;
                OpenSkinHelper.add(url);
            }
        }
      });
  }

  this.remove = function(url) {
    if(!window.localStorage.getItem("allSkins")) {
      this.init;
    }
    // Thanks Magnetar!
    var dir = JSON.parse(localStorage.getItem("allSkins"));
    for (var i = 0; i < dir.length; i++) {
      if (dir[i] == url) {
        dir.splice(i, 1);
        localStorage.setItem("allSkins", JSON.stringify(dir));
      }
    }
    this.toast("check","Skin Removed.");
  }

  this.init = function(url) {
    if(!window.localStorage.getItem("allSkins")) {
      console.log("%c[OpenSkin-Helper] %c Initializing default skin...", "color:#358311", "color: gray");
      window.localStorage.setItem("allSkins",'["' + openskinDefault + '"]');
            console.log("%c[OpenSkin-Helper] %c Setting default skin...", "color:#358311", "color: gray");
      this.apply(JSON.parse(window.localStorage.getItem("allSkins"))[0],true);
      return true;
    } else {
      return false;
    }
  }
}

// Mitigate XSS (Thanks to Mag again!)

String.prototype.patch = function() {
  return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "").replace(/\\/g, "").replace(/`/g, "");
}

var OpenSkinHelper = new OpenSkinHelper();
