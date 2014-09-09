// Resharper bout to make a scrawny white kid go hulkmode
// ReSharper disable UnusedParameter
var Ajax = (function() {
    return {
        Post : function(url, data, success) {
            $.ajax({
                type : 'post',
                url : url,
                data : data,
                cache : false,
                contentType : 'application/json',
                success : success,
                error : function(res) {
                    toastr.error("Something went wrong, please try again.");
                }
            });
        },
        UpdateView : function(url, data, success) {
            this.Post(url, data, function(res) {
                Ajax.UpdateViewHtml(res, success);
            });
        },
        UpdateViewHtml : function(html, callBack) {
            $("#mainContent").fadeOut("slow", function() {
                $("#mainContent").html(html);
                callBack();
            });
        }
    };
})();

var Extensions = (function() {
    return {
        Group : function(data, groupSeed) {
            var rows = [], current = [];
            rows.push(current);
            for (var i = 0; i < data.length; i += 1) {
                current.push(data[i]);
                if (((i + 1) % groupSeed) === 0) {
                    current = [];
                    rows.push(current);
                }
            }
            return rows;
        },
        GetData : function(data, filters) {
            data.filters = filters();
            return JSON.stringify(data);
        },
        passwordError : function() {
            $(".password").addClass('error');
            setTimeout(function() {
                $(".password").removeClass('error');
            }, 1000);
        },
        validatePassword : function(pass, confPass, onValid) {
            if (pass != confPass) {
                toastr.error("Password don't match.", "Uh oh");
                this.passwordError();
                return;
            }
            onValid();
        },
        upperCase : function(string) {
            if (!string)
                return "";
            if (string.length <= 0)
                return "";
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    };
})();

var IO = (function() {
  var socket = io.connect('http://localhost:8000');
  socket.on('messageCount', function(data) { 
      Application.GetUser().ReloadMessages();
  });
})();
var Dialog = (function() {
    vex.defaultOptions.className = 'vex-theme-os';
    function loginDialog(onLogin) {
        vex.dialog.open({
            message : 'Enter your username and password:',
            input : '' + '<input name="username" type="text" placeholder="Username" required />' + '<input name="password" type="password" placeholder="Password" required />' + '',
            buttons : [$.extend({}, vex.dialog.buttons.YES, {
                text : 'Login'
            }), $.extend({}, vex.dialog.buttons.NO, {
                text : 'Nevermind'
            })],
            callback : function(data) {
                if (data) {
                    Ajax.Post("/Account/Login", JSON.stringify({
                        UserName : data.username,
                        Password : data.password
                    }), function(res) {
                        Application.GetUser().setUser(res);
                        onLogin(res);
                    });
                }
            }
        });
    }

    return {
        Open : function(dialogType, onCmd) {
            switch (dialogType) {
            case "login":
                loginDialog(onCmd);
            }
        }
    };
})();
/*div
 input#searchBox(style="width:160px" type="text" placeholder="Search!")
 label
 Categories
 div.styled-select(style="width:170px")
 select#categoryFilter(data-bind="options: Categories, value: Category, optionsText: 'Title', optionsCaption: 'Category...'")
 */
var JKFilters = (function() {
    var myOpentip;
    $(document).ready(function(){  
        myOpentip = new Opentip("#searchTip");
    });
    function filterHtmlHelper() {
        this.GetTextInput = function(id, style, placeHolder) {
            return '<input id="' + id + '" style="' + style + '" type="text" placeholder="' + placeHolder + '"/>';
        };
        this.GetSelect = function(id, dataBind, style) {
            var html = '<div class="styled-select" style="' + style + '">';
            return '<select id="' + id + '" data-bind="' + dataBind + '"></select>';
        };
        this.GetLabel = function(txt) {
            return '<label>' + txt + '</label>';
        };
    }; 
    
    function defaultFilter() {
        this.Run = function(model, callBack) { 
            this.setToolTip();
            this.setHeader();
            this.populateData(model, function(res) {
                callBack(res);
            });
        };

        this.setToolTip = function() {  
            myOpentip.setContent("<p>This is your hub for filtering down the different results and postings within Barter Faire, check here often as it will be constantly updating to assist you with finding exactly what it is you're looking for!.</p>");
        };
        this.setHeader = function() {
            
        };
        this.getHtml = function() {
            return '<p>Choose a state to begin searching for postings in your area!</p>';
        };
        this.populateData = function(callBack) {

        };
    }

    function postFilter() {
        this.Run = function(model, callBack) {
            this.setToolTip();
            this.setHeader();
            this.populateData(model, function(res) {
                callBack(res);
            });
        };

        this.setToolTip = function() {
            myOpentip.setContent("<p>This is your hub for filtering down results.</p>");
        };
        this.populateData = function(model, callBack) {
            this.LoadCategories(function(res) { 
                model.Categories(res);
                callBack(res);
            });
        };
        this.setHeader = function() {

        };
        this.getHtml = function() {
            var helper = new filterHtmlHelper();
            var html = helper.GetTextInput('searchBox', 'width:160px', "Search!");
            html += helper.GetLabel('Categories');
            html += helper.GetSelect('categoryFilter', "options: Categories, value: Category, optionsText: 'Title', optionsCaption: 'Category...'", "width:170px");
            return html;
        };

        this.LoadCategories = function(callBack) {
            Ajax.Post("/FilterData/Category", null, function(res) {
                callBack(res);
            });
        };
         
        this.Listen = function(func) {
            var timeout;
            var callBack = func;

            $("#searchBox").die();
            $("#categoryFilter").die();
            $("#searchBox").live('keyup', function() {
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function() {
                    callBack();
                }, 500);
            });
            $("#categoryFilter").live('change', function() {
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function() {
                    callBack();
                }, 500);
            });
        };
    };

    return {
        GetFilter : function(type) {            
            switch(type) {
            case 'post':
            case 'location':
                return new postFilter();
            default:
                return new defaultFilter();
            }
        }
    };
})();

function Filters() {
    this.Categories = ko.observableArray([]);
    this.Category = ko.observable('');
    var self = this;
    this.SetFilter = function(filterType, listen) {
        var filter = JKFilters.GetFilter(filterType);
        $("#filters").html(filter.getHtml());
        filter.Run(self, function(res) {
            filter.Listen(listen);
        });
    };
    
    this.GetCatId = function() {
        if (this.Category && this.Category()) {
            return this.Category().Id;
        }
        return null;
    };
};

function User() {
    this.id = ko.observable('');
    this.name = ko.observable('');
    this.email = ko.observable('');
    this.messages = ko.observableArray([]);
    this.locationDefault = ko.observable(-1);
    this.messageCount = ko.observable(-1);
    var self = this;
    this.mailImg = ko.computed(function() {
        console.log(self.messages());
        return self.messages().length > 0 ? '/Images/mailRecvd.png' : '/Images/mail.png';
    });
    
    this.ReloadMessages = function() {
         Ajax.Post('/message/getmessages', JSON.stringify({userId : self.id}), function(result) {
                if(result) {
                    this.messages(result);
                    return;
                }
                this.messages([]);
        });
    };
    this.setUser = function(res) {
        if (!res)
            return;
        self.name(Extensions.upperCase(res.UserName));
        self.email(res.Email);
        self.id(res.Id);
    };

    this.logIn = function(name, id, locationDefault) {
        self.id(id);
        self.name(Extensions.upperCase(name));
        self.locationDefault(locationDefault);
    };
    this.logOut = function() {
        self.id(-1);
        self.name('');
        Ajax.Post("/Account/LogOff", null, function(res) {
            Application.Transition("home");
        });
    };
    this.viewMessages = function() {
        Application.Transition("viewMessages", this.id());
    };
    this.manageAccount = function() {
        Application.Transition("manageAccount", this.id());
    };
    this.isOnline = ko.computed(function() {
        return self.id() && self.id() != -1;
    });
    this.getLocationDefault = function() {
        return self.locationDefault;
    };
    this.setLocationDefault = function(locDef) {
        self.locationDefault = locDef;
    };
}

/***
 *     ____ ____ ____ ____ ____ ____
 *    ||M |||O |||D |||E |||L |||s ||
 *    ||__|||__|||__|||__|||__|||__||
 *    |/__\|/__\|/__\|/__\|/__\|/__\|
 */

function PostCreate() {
    this.Locations = ko.observableArray([]);
    this.Categories = ko.observableArray([]);
    this.Title = ko.observable('');
    this.Body = ko.observable('');
    this.Location = ko.observable('');
    this.Category = ko.observable('');
    this.images = [];
    this.stateId = Application.FetchModel('state').StateId;
    this.postId = -1;
    var self = this;
    this.message = '';
    this.AddImages = function() {

    };
    
    function finish() {
        toastr.success(self.message, "Success!");
        Application.Transition("post_detail", self.postId);
    } 

    this.Populate = function() {
        Ajax.Post('/Post/GetCreationData', JSON.stringify({
            state : self.stateId
        }), function(result) {
            self.Locations(result.Locations);
            self.Categories(result.Categories);
        });
        $("#dropzone").dropzone({
            url : '/File/UploadFiles',
            paramName : "files", // The name that will be used to transfer the file
            maxFilesize : 102, // MB
            parallelUploads : 10,
            autoProcessQueue : false,
            uploadMultiple : true,
            sending : function(xr, fd, fd1) {
                fd1.append("postId", self.postId);
            },
            accept : function(file, done) {
                self.images.push(file.name);
                return done();
            }
        });
        var dz = Dropzone.forElement("#dropzone");
        dz.on("complete", function() {
            if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                finish();
            }
        });
    };

    function create(onFail) {
        if (!Application.GetUser().isOnline()) {
            onFail();
            return;
        }
        Ajax.Post('/Post/CreatePost', JSON.stringify({
            Title : self.Title(),
            Body : self.Body(),
            LocationId : self.Location()._id,
            categoryId : self.Category()._id,
            imageFiles : self.images
        }), function(result) {
            if (result.success) {
                self.postId = result.id;
                self.message = result.message;
                var dz = Dropzone.forElement("#dropzone");
                if (dz.files.length > 0) {
                    dz.processQueue();
                    return;
                } else {
                    finish();
                }
            } else {
                onFail();
            }
        });
    }


    this.Submit = function() {
        create(function() {
            Dialog.Open('login', function(res) {
                if (res.Success) {
                    create(function() {
                    });
                } else {

                }
            });
            self.images = [];
        });
    };
}

function PostDetail(postId) {
    this.id = postId;
    this.Title = ko.observable('');
    this.Body = ko.observable('');
    this.Location = ko.observable('');
    this.Category = ko.observable('');
    this.imagePaths = ko.observableArray([]);
    var self = this;
    this.sendMessage = function() {
        Application.Transition('sendMessage', self.id);  
    };
    this.Populate = function() {
        Ajax.Post('/Post/GetPost', JSON.stringify({
            postId : this.id
        }), function(result) {
            self.Title(result.Title);
            self.Body(result.Body);
            self.Location(result.Location);
            self.Category(result.Category);
            self.imagePaths(result.Images);
            $('.banner').unslider({
                speed : 500, //  The speed to animate each slide (in milliseconds)
                delay : 3000, //  The delay between slide animations (in milliseconds)
                complete : function() {
                }, //  A function that gets called after every slide animation
                keys : true, //  Enable keyboard (left, right) arrow shortcuts
                dots : true, //  Display dot navigation
                fluid : true //  Support responsive design. May break non-responsive designs
            });
            var unslider = $('.banner').unslider();
            $('.unslider-arrow').click(function() {
                var fn = this.className.split(' ')[2];
                unslider.data('unslider')[fn]();
            });
        });
    };
}

function PostModel(locationId) {
    this.id = locationId;
    this.stateName = ko.observable();
    var self = this;
    this.Posts = ko.observableArray([]);
    this.grouped = ko.computed(function() {
        return Extensions.Group(self.Posts(), 12);
    }, this);
    this.getFilters = function() {
        return [{
            Field : "Title",
            Value : $("#searchBox").val(),
            Type : "post"
        }, {
            Field : "categoryId",
            Value : Application.GetFilters().GetCatId(),
            Type : "post"
        }];
    };
    this.ViewPost = function(vm, ev) {
        Application.Transition("post_detail", vm._id);
    };
    this.loadPosts = function() {
        Ajax.Post('/Post/GetPosts', Extensions.GetData({
            locationId : self.id
        }, self.getFilters), function(result) {
            self.Posts(result);
        });
    };
    this.Populate = function() {
        self.loadPosts();
    };
}

function StateModel() {
    this.States = ko.observableArray([]);
    this.Message = ko.observable('');
    this.StateId = -1;
    var self = this;
    this.getFilters = function() {
        return [{
            Field : "Title",
            Value : $("#searchBox").val(),
            Type : "state"
        }];
    };

    this.LoadLocations = function(vm, evt) {
        self.StateId = vm._id;
        Application.Transition("location", self.StateId);
    };

    this.grouped = ko.computed(function() {
        return Extensions.Group(self.States(), 10);
    }, this);

    this.loadStates = function() {
        Ajax.Post('/State/GetAllStates', Extensions.GetData({}, self.getFilters), function(result) {
            self.States(result);
        });
    };
    this.Populate = function() {
        self.loadStates();
    };
}

function LocationModel(id) {
    this.id = id;
    this.locationId = -1;
    this.state = ko.observable('');
    this.Locations = ko.observableArray([]);
    var self = this;
    this.getFilters = function() {
        return [{
            Field : "Title",
            Value : $("#searchBox").val(),
            Type : "location"
        }, {
            Field : "categoryId",
            Value : Application.GetFilters().GetCatId(),
            Type : "location"
        }];
    };
    this.LoadPosts = function(vm, evt) {
        if (Application.GetUser().isOnline() && Application.GetUser().locationDefault == -1) {
            toastr.dialog("Would you like to make this your default?", "Default Location?", function() {
                alert("LETS DO IT");
            });
        }
        this.locationId = vm._id;
        Application.Transition("post", vm._id);
    };
    this.grouped = ko.computed(function() {
        return Extensions.Group(self.Locations(), 9);
    }, this);

    this.loadLocations = function() {
        Ajax.Post('/Location/GetLocationByState', Extensions.GetData({
            id : self.id
        }, self.getFilters), function(result) {
            self.state(result.state);
            self.Locations(result.locations);
        });
    };

    this.Populate = function() {
        self.loadLocations();
    };
}
function MessageView(id) {
    this.Title = ko.observable('');
    this.Body = ko.observable('');
    var self = this;
    this.Populate = function() {
        Ajax.Post('/message/messagedata', JSON.stringify({id : id}), function(res){
            self.Title(res.Title);
            self.Body(res.Body);
        });
    };
    this.back = function() {
        
    };
    this.reply = function() {
        
    };
}
function Message(id) {
    this.Title = ko.observable('');
    this.Body = ko.observable('');
    this.id = id;
    var self = this; 
    function create(onFail) {
        if (!Application.GetUser().isOnline()) {
            onFail();
            return;
        }
        Ajax.Post('/message/newmessage',  JSON.stringify({ Title : self.Title(), Body : self.Body(), postId : self.id, active : true, userId : Application.GetUser().id }),
        function(res) {
            if(res.success) {
                toastr.success("Message sent! Please make sure to watch your inbox for the sellers reply!", "Success!");
                Application.Transition('home');
            }
            else {
                toastr.error("Something went wrong, please try to resend shortly", "Uh Oh...");
            }
       });
    }
    this.Submit = function() {
            create(function() { Dialog.Open('login', function(res) {
                if (res.Success) {
                    create(function() {});
                } else {
 
                }
            });
        });    
    };
    
    this.Populate = function() {
        
    };
}

function MessageList(id) {
    this.userId = id;
    this.messages = ko.observableArray([]);
    
    this.getFilters = function() {
        return [{}];
    };
    var self = this;
    
    setInterval(function(){
        self.loadMessages();
    }, 30000);
    
    this.loadMessages = function() {
        Ajax.Post('/message/getmessages', JSON.stringify({userId : self.userId}),
        function(result) {
            if(result) {
                Application.GetUser().messages(result);
                self.messages(result);
                console.log(Application.GetUser().messages());
            }
        });
    };
    
    this.ViewMessage = function(vm, ev) {
        Application.Transition("message_view", vm._id);
    };
    
    this.Populate = function () {
        self.loadMessages();
    };
}

function Login() {
    this.userName = ko.observable('');
    this.passWord = ko.observable('');
    this.LoginClick = function(vm, evt) {
        Ajax.Post("/Account/Login", JSON.stringify({
            UserName : this.userName(),
            Password : this.passWord()
        }), function(res) {
            if (res.Success) {
                toastr.success("Welcome back, hope you find something cool.", "You're in!");
                Application.GetUser().setUser(res);
                Application.Transition("home");
            } else {
                toastr.error("Having trouble logging in, are you sure the username/password is correct?", "Error");
                Extensions.passwordError();
            }
        });
    };

    this.Populate = function() {
    };
}

function Register(id) {
    this.userName = ko.observable('');
    this.passWord = ko.observable('');
    this.confirmPassWord = ko.observable('');
    this.email = ko.observable('');
    this.id = id;
    var self = this;
    this.RegisterClick = function(vm, evt) {
        Extensions.validatePassword(self.passWord(), this.confirmPassWord(), function() {
            Ajax.Post("/Account/NewRegister", JSON.stringify({
                UserName : self.userName(),
                Password : self.passWord(),
                Email : self.email(),
                ConfirmPassword : self.confirmPassWord()
            }), function(res) {
                if (res.Success) {
                    toastr.success("Hooray! You're a new member of the community now!", "You're in!");
                    Application.GetUser().setUser(res);
                    Application.Transition('home');
                } else {
                    toastr.error(res.Error, "Error on registration, please try again shortly");
                }
            });
        });
    };

    this.Populate = function() {
        var user = Application.GetUser();
        self.userName(user.name());
        self.email(user.email());
    };

    this.Edit = function(vm, evt) {
        Extensions.validatePassword(self.passWord(), this.confirmPassWord(), function() {
            Ajax.Post("/Account/Edit", JSON.stringify({
                id : self.id,
                email : self.email(),
                password : self.passWord()
            }), function(res) {
                if (res.Success) {
                    toastr.success("Edits saved successfully!");
                    Application.Transition('home');
                }
            });
        });
    };
}

/***
 *     ____ ____ ____ ____ ____ ____ ____ ____ ____ ____ ____ _________
 *    ||A |||P |||P |||L |||I |||C |||A |||T |||I |||O |||N |||       ||
 *    ||__|||__|||__|||__|||__|||__|||__|||__|||__|||__|||__|||_______||
 *    |/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/_______\|
 */
var Application = (function() {
    var modelMap = [];
    var user = new User();
    var filters = new Filters();
    this.title = ko.observable('');
    return {
        Initialize : function(window) {
            Ajax.Post('/Account/UserInfo', null, function(res) {
                Application.GetUser().setUser(res);
            });
            History.Adapter.bind(window, 'statechange', function() {
                var state = History.getState();
                // Note: We are using History.getState() instead of event.state
                var model = modelMap[state.data.modelKey];
                Ajax.UpdateView(state.url, JSON.stringify(state.data.id), function() {
                    model.Populate();
                    filters.SetFilter(state.data.modelKey, model.Populate);
                    ko.cleanNode(document.getElementById("mainContent"));
                    ko.applyBindings(model, document.getElementById("mainContent"));
                    ko.cleanNode(document.getElementById("filters"));
                    ko.applyBindings(filters, document.getElementById("filters"));
                    $("#mainContent").fadeIn("slow");
                });
            });
            ko.applyBindings(filters, document.getElementById("filters"));
            ko.applyBindings(user, document.getElementById("loginInformation"));
        },
        FetchModel : function(key) {
            return modelMap[key];
        },
        GetUser : function() {
            return user;
        },
        GetFilters : function() {
            return filters;
        },
        Transition : function(trns, id) {
            var url = '', title = "";
            var model = {};
            if (trns == "home")
                trns = "state";
            switch (trns) {
            case "location":
                model = modelMap[trns] || new LocationModel(id);
                url = "/Location/Index";
                title = "Choose a Location!";
                break;
            case "state":
                model = modelMap[trns] || new StateModel();
                url = "/State/Index";
                title = "Choose a State!";
                break;
            case "post":
                model = modelMap[trns] || new PostModel(id);
                url = "/Post/Index";
                title = "Find a Posting!";
                break;
            case "post_detail":
                model = modelMap[trns] || new PostDetail(id);
                url = "/Post/PostDetail";
                title = "What a Deal!";
                break;
            case "createPost":
                model = modelMap[trns] || new PostCreate();
                url = "/Post/Create";
                title = "Very Exciting!";
                break;
            case "login":
                model = modelMap[trns] || new Login();
                url = "/Account/Index";
                title = "Welcome Back!";
                break;
            case "register":
                model = modelMap[trns] || new Register();
                url = "/Account/Register";
                title = "Very Exciting!";
                break;
            case "manageAccount":
                model = modelMap[trns] || new Register(id);
                url = "/Account/Manage";
                title = "Preferences and Options!";
                break;
            case "viewMessages":
                model = modelMap[trns] || new MessageList(id);
                url = "/message/viewmessages";
                title = "Preferences and Options!";
                break;
            case 'sendMessage':
                model = modelMap[trns] || new Message(id);
                url = "/message/create";
                title = 'Send Message!';
                break;
            case 'message_view':
                model = modelMap[trns] || new MessageView(id);
                url = '/message/viewmessage';
                title = 'Message Received!';
                break;
            default:

            }
            model.id = id;
            modelMap[trns] = model;
            History.pushState({
                modelKey : trns,
                id : id
            }, title, url);
        }
    };
})();

vex.defaultOptions.className = 'vex-theme-os';
var open = true;
function toggleTools() {
    $("#body").animate({
        'margin-left' : open ? "-=180px" : "+=180px"
    });
    if (open) {
        $("#leftToolHandle").removeClass("unrotated").addClass("rotated");
    } else {
        $("#leftToolHandle").removeClass("rotated").addClass("unrotated");
    }
    open = !open;
}