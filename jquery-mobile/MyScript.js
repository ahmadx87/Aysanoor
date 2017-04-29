var animations = [""];
var multipleAnimationList = "";
var deviceIP = "http://192.168.4.1/"
var chromoselectorFlag = -1; //chromoselector update is fired as the app starts we use this var to prevent send command from running as the app starts.
var currentHash;
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    navigator.splashscreen.hide();
}


function onBackKeyDown(e) {
    e.preventDefault();
    if (currentHash.indexOf("sett") != -1) {
        if ($("#numberOfLEDSinput").val() != localStorage.numberOfLEDS || $("#usernameWifi").val() != "" || $("#passwordWifiOld").val() != "" || $("#passwordWifiNew").val() != "") {
            $.hyc.ui.alert({
                content: 'تغییرات ذخیره نخواهد شد. آیا مطمئن هستید؟',
                buttons: [{
                    name: 'بله',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#f31',
                    callback: function() {
                        $("#numberOfLEDSinput").val(localStorage.numberOfLEDS);
                        $("#ColorSequenceInput").val(localStorage.ledChipColorSequence);
                        $("#usernameWifi").val("");
                        $("#passwordWifiOld").val("");
                        $("#passwordWifiNew").val("");
                        window.history.back();
                        this.close();
                    },
                    closable: false
                }, {
                    name: 'خیر',
                    id: 'cancelBtn',
                    color: '#000',
                    bgColor: '#fff',
                    callback: function() {
                        this.close();
                    },
                    closable: false
                }],
                closable: false
            });
        } else {
            window.history.back();
        }
    } else if (currentHash.indexOf("pagetwo") != -1) {
        if (localStorage.animationListSave != $("#sortable").html()) {
            $.hyc.ui.alert({
                content: 'تغییرات ذخیره نخواهد شد. آیا مطمئن هستید؟',
                buttons: [{
                    name: 'بله',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#f31',
                    callback: function() {
                        $("#sortable").empty();
                        $("#sortable").append(localStorage.animationListSave);
                        window.history.back();
                        this.close();
                    },
                    closable: false
                }, {
                    name: 'خیر',
                    id: 'cancelBtn',
                    color: '#000',
                    bgColor: '#fff',
                    callback: function() {
                        this.close();
                    },
                    closable: false
                }],
                closable: false
            });
        } else {
            window.history.back();
        }
    } else {
        $.hyc.ui.alert({
            content: 'آیا مایلید از نرم افزار خارج شوید؟',
            buttons: [{
                name: 'بله',
                id: 'confirmBtn',
                color: '#fff',
                bgColor: '#f31',
                callback: function() {
                    $("#sortable").empty();
                    $("#sortable").append(localStorage.animationListSave);
                    this.close();
                    navigator.app.exitApp();
                },
                closable: false
            }, {
                name: 'خیر',
                id: 'cancelBtn',
                color: '#000',
                bgColor: '#fff',
                callback: function() {
                    this.close();
                },
                closable: false
            }],
            closable: false
        });
    }
}

$(document).ready(function() {

    // check if we are connected to device WiFi
    ///////////////////////////////////////////
    $.mobile.loading('show', {
        text: 'foo',
        textVisible: false,
        theme: 'z',
        html: ""
    });
    sendStartMsg();

    /////////////////////////////////////////////

    setInterval(function() {
        currentHash = window.location.href;
    }, 1000);

    "use strict";
    if (navigator.userAgent.match(/(iPad.*|iPhone.*|iPod.*);.*CPU.*OS 7_\d/i)) {
        $("body").addClass("ios7");
        $("body").append('');
    }


    /// Brightness slider

    $('#brightnessSlider').slider({
        highlight: true,
        stop: function(event, ui) {
            $(".brightnessVal").html($('#brightnessSlider').val());
            sendCommand(deviceIP + "+XBI" + Math.round($('#brightnessSlider').val() * 2.55) + "BI+");
        }
    });

    var lastreq = 0;
    $('#brightnessSlider').on("change", function() {
        localStorage.setItem("brightnessValue", $('#brightnessSlider').val());
        var d = new Date();
        var currenttime = d.getTime(); //get the time of this change event
        var interval = currenttime - lastreq; //how many milliseconds since the last request
        if (interval >= 100) { //more than 100 milliseconds
            lastreq = currenttime; //set lastreq for next change event
            $(".brightnessVal").html($('#brightnessSlider').val());
            sendCommand(deviceIP + "+XBI" + Math.round($('#brightnessSlider').val() * 2.55) + "BI+");
        }

    });

    // gHue slider

    $('#gHueChangeTimeIntervalSlider').slider({
        highlight: true,
        stop: function(event, ui) {
            localStorage.setItem("gHueChangeTimeIntervalVal", $('#gHueChangeTimeIntervalSlider').val());
            $(".gHueTimeVal").html($('#gHueChangeTimeIntervalSlider').val());
            sendCommand(deviceIP + "+XHUE" + Math.round($('#gHueChangeTimeIntervalSlider').val() * 2.55) + "HUE+");
        }
    });

    var lastreqHue = 0;
    $('#gHueChangeTimeIntervalSlider').on("change", function() {
        localStorage.setItem("gHueChangeTimeIntervalVal", $('#gHueChangeTimeIntervalSlider').val());
        var d = new Date();
        var currenttime = d.getTime(); //get the time of this change event
        var interval = currenttime - lastreqHue; //how many milliseconds since the last request
        if (interval >= 100) { //more than 100 milliseconds
            lastreqHue = currenttime; //set lastreqHue for next change event
            $(".gHueTimeVal").html($('#gHueChangeTimeIntervalSlider').val());
            sendCommand(deviceIP + "+XHUE" + Math.round($('#gHueChangeTimeIntervalSlider').val() * 2.55) + "HUE+");
        }

    });




    /////////////////

    /// FPS slider

    $('#FPSSlider').slider({
        highlight: true,
    });


    $('#FPSSlider').on("change", function() {
        $(".FPSVal").html($('#FPSSlider').val());
        localStorage.setItem("FPSValue", $('#FPSSlider').val());
    });
    ///////////////////

    /// AnimationDuration slider

    $('#AnimationDurationSlider').slider({
        highlight: true,
    });


    $('#AnimationDurationSlider').on("change", function() {
        $(".AnimationDurationVal").html($('#AnimationDurationSlider').val());
        localStorage.setItem("AnimationDurationValue", $('#AnimationDurationSlider').val());
    });
    ///////////////////

    //mode selector

    var modes = ["رنگ ثابت", "انیمیشن ثابت", "لیست انیمیشن"];
    var modeSelectHTMLstring = "";



    var i = 0;
    for (i = 0; i < modes.length; i++) {
        modeSelectHTMLstring += "<option value=\"" + i + "\">" + modes[i] + "</option>";
    }

    $("#modeOptions").prepend(modeSelectHTMLstring);

    $("#modeOptions").on('change', function() {
        localStorage.modeSelectionIndex = $('#modeOptions').val();
        switch ($('#modeOptions').val()) {
            case "0":
                $('.multiAnimationPortion').fadeOut(500);
                $('.singleAnimationPortion').fadeOut(500, function() {
                    $('.singleColorPortion').fadeIn(500);
                });
                break;
            case "1":
                $('.multiAnimationPortion').fadeOut(500);
                $('.singleColorPortion').fadeOut(500, function() {
                    $('.singleAnimationPortion').fadeIn(500);
                });
                break;
            case "2":
                $('.singleAnimationPortion').fadeOut(500);
                $('.singleColorPortion').fadeOut(500, function() {
                    $('.multiAnimationPortion').fadeIn(500);
                });
                break;
        }

    });

    //color sequence select
    $("#ColorSequenceInput").on('change', function() {
        localStorage.ledChipColorSequence = $('#ColorSequenceInput').val();
    });

    if ($.isNumeric(localStorage.ledChipColorSequence)) {
        $("#ColorSequenceInput").val(localStorage.ledChipColorSequence);
        $('#ColorSequenceInput').selectmenu().selectmenu('refresh', true);
    } else {
        $("#ColorSequenceInput option[value='0']").attr('selected', 'selected');
        $('#ColorSequenceInput').selectmenu().selectmenu('refresh');
    }

    //animation selector

    animations = ["رنگین کمان", "رنگین کمان+درخشش", "رنگین کمان+درخشش 2", "تپش تصادفی", "ستاره دنباله دار", "3 ستاره دنباله دار", "رفت و برگشتی", "7 رنگ پیوسته"];
    var selectionHTMLstring = "";

    var i = 0;
    for (i = 0; i < animations.length; i++) {
        selectionHTMLstring += "<option value=\"" + i + "\">" + animations[i] + "</option>";
    }

    $("#animationDropDown").prepend(selectionHTMLstring);
    $("#animationDropDownPage2").prepend(selectionHTMLstring);
    $("#animationDropDown").on('change', function() {
        localStorage.animSelectionIndex = $('#animationDropDown').val();
        sendCommand(deviceIP + "+XMA-" + (parseInt(localStorage.animSelectionIndex) + 1).toString() + "-MA+"); //XM is sent to the ESP so that it won't be saved in EEPROM.
    });


    $(".brightnessVal").html(localStorage.brightnessValue);
    $('#brightnessSlider').val(localStorage.brightnessValue).slider('refresh');
    $(".gHueTimeVal").html(localStorage.gHueChangeTimeIntervalVal);
    $('#gHueChangeTimeIntervalSlider').val(localStorage.gHueChangeTimeIntervalVal).slider('refresh');
    $(".FPSVal").html(localStorage.FPSValue);
    $('#FPSSlider').val(localStorage.FPSValue).slider('refresh');
    $(".AnimationDurationVal").html(localStorage.AnimationDurationValue);
    $('#AnimationDurationSlider').val(localStorage.AnimationDurationValue).slider('refresh');

    if ($.isNumeric(localStorage.modeSelectionIndex)) {
        $("#modeOptions").val(localStorage.modeSelectionIndex);
        $('#modeOptions').selectmenu().selectmenu('refresh', true);
    } else {
        $("#modeOptions option[value='0']").attr('selected', 'selected');
        $('#modeOptions').selectmenu().selectmenu('refresh');
    }

    if ($.isNumeric(localStorage.animSelectionIndex)) {
        $("#animationDropDown").val(localStorage.animSelectionIndex);
        $("#animationDropDown").selectmenu().selectmenu('refresh', true);
    } else {
        $("#animationDropDown option[value='0']").attr('selected', 'selected');
        $('#animationDropDown').selectmenu().selectmenu('refresh');
    }

    if ($.isNumeric(localStorage.numberOfLEDS)) {
        $("#numberOfLEDSinput").val(localStorage.numberOfLEDS);
    } else {
        $("#numberOfLEDSinput").val("100");
    }

    /// RGB color slider selection
    $('#colorRSlider').slider(); //if slider() method is not applied we get error when we call refresh method on the slider
    $('#colorGSlider').slider();
    $('#colorBSlider').slider();

    if ($.isNumeric(localStorage.chosenColorR)) {
        $('#colorRSlider').val(localStorage.chosenColorR).slider('refresh');
        $("#colorRSlider").css("background", 'rgb(' + $("#colorRSlider").val() + ',0,0)');
    } else {
        $("#colorRSlider").val("0").slider('refresh');
    }

    if ($.isNumeric(localStorage.chosenColorG)) {
        $("#colorGSlider").val(localStorage.chosenColorG).slider('refresh');
        $("#colorGSlider").css("background", 'rgb(0,' + $("#colorGSlider").val() + ',0)');
    } else {
        $("#colorGSlider").val("0").slider('refresh');
    }

    if ($.isNumeric(localStorage.chosenColorB)) {
        $("#colorBSlider").val(localStorage.chosenColorB).slider('refresh');
        $("#colorBSlider").css("background", 'rgb(0,0,' + $("#colorBSlider").val() + ')');
    } else {
        $("#colorBSlider").val("0").slider('refresh');
    }

    $("#modeOptions").trigger("change");
    // end of initialization


});

$(document).ready(function() {
    var lastreq = 0;
    var colorChosenBuffer = localStorage.chosenColor; //this variable is created because in update function of the chromoselector it will be reseted.
    var updatePreview = function() {
        var color = $(this).chromoselector("getColor");
        $(this).prop("disabled", true);
        $(this).css({
            "width": "100%",
            'background-color': color.getHexString(),
            'color': color.getHexString(),
            //'color': color.getTextColor().getHexString(),
            //'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().getHexString()
        });
        localStorage.chosenColor = color.getHexString();
        localStorage.chosenColorR = Math.round(color.getRgb().r * 255);
        $("#colorRSlider").val(localStorage.chosenColorR).slider('refresh');
        localStorage.chosenColorG = Math.round(color.getRgb().g * 255);
        $("#colorGSlider").val(localStorage.chosenColorG).slider('refresh');
        localStorage.chosenColorB = Math.round(color.getRgb().b * 255);
        $("#colorBSlider").val(localStorage.chosenColorB).slider('refresh');
        var d = new Date();
        var currenttime = d.getTime(); //get the time of this change event
        var interval = currenttime - lastreq; //how many milliseconds since the last request
        chromoselectorFlag += 1;
        if (interval >= 100 && chromoselectorFlag > 1) { //more than 2 seconds
            lastreq = currenttime; //set lastreq for next change event
            sendCommand(deviceIP + "+XCC-" + localStorage.chosenColorR + "-" + localStorage.chosenColorG + "-" + localStorage.chosenColorB + "-CC+");

        }
        $(this).chromoselector('save');
    };
    // Initialise the color picker width
    pickerWidth = Math.round($("#page").width() / 1.3);

    $("#chromoselectorInput").chromoselector({
        autosave: true,
        resizable: false,
        autoshow: false,
        minWidth: 50,
        maxWidth: 2500,
        panel: false,
        target: "#chromoselectorDiv",
        autoshow: false,
        preview: false,
        width: pickerWidth,
        ringwidth: 25,
        create: updatePreview,
        update: updatePreview
    }).chromoselector("show", 0);
    $("#chromoselectorInput").chromoselector('setColor', colorChosenBuffer);

    marginPicker = Math.round(($("#page").width() - $("#chromoselectorInput").width()) / 2);


    $("#chromoselectorDiv").css({
        "width": $("#chromoselectorInput").chromoselector('getWidth'),
        "margin-left": marginPicker
    });

    $('#colorRSlider').on("change", function() {
        $("#chromoselectorInput").chromoselector('setColor', 'rgb(' + $("#colorRSlider").val() + ',' + localStorage.chosenColorG + ',' + localStorage.chosenColorB + ')');
        $(this).css("background", 'rgb(' + $("#colorRSlider").val() + ',0,0)');
    });

    $('#colorGSlider').on("change", function() {
        $("#chromoselectorInput").chromoselector('setColor', 'rgb(' + localStorage.chosenColorR + ',' + $("#colorGSlider").val() + ',' + localStorage.chosenColorB + ')');
        $(this).css("background", 'rgb(0,' + $("#colorGSlider").val() + ',0)');
    });

    $('#colorBSlider').on("change", function() {
        $("#chromoselectorInput").chromoselector('setColor', 'rgb(' + localStorage.chosenColorR + ',' + localStorage.chosenColorG + ',' + $("#colorBSlider").val() + ')');
        $(this).css("background", 'rgb(0,0,' + $("#colorBSlider").val() + ')');
    });


});


$(document).ready(function() {
	

    if (localStorage.animationListSave) {
        $("#sortable").append(localStorage.animationListSave);
    } else {
        for (var i = 0; i < animations.length; i++) {
            $("#sortable").append('<li>' + animations[i] + '</li>');
        }
    }
    $('#removeButton, #addButton').css('opacity', '0.4');
    var imgButtonHeight = 0;
    $(window).load(function() {
        imgButtonHeight = $("#animationDropDownPage2").height();
        $(".imgButton").height(imgButtonHeight * .9);
        $(".imgButton").width(imgButtonHeight * .9);
    });

    if ($.isNumeric(localStorage.animSelectionIndex)) {
        $("#animationDropDownPage2").val(localStorage.animSelectionIndex);
        $("#animationDropDownPage2").selectmenu().selectmenu('refresh', true);
    } else {
        $("#animationDropDownPage2 option[value='0']").attr('selected', 'selected');
        $('#animationDropDownPage2').selectmenu().selectmenu('refresh');
    }
    $("#sortable").css("top", imgButtonHeight * 3.1);
    $("#sortable").selectable({
        stop: function(event, ui) { //If multiple items are selected, deselect all.
            if ($('.ui-selected').length > 1) {
                $(event.target).children('.ui-selected').removeClass('ui-selected');
            }
            if ($('#sortable .ui-selected').index() >= 0) {
                $('#removeButton, #addButton').css('opacity', '1');
            } else {
                $('#removeButton, #addButton').css('opacity', '0.4');
            }
        }
    });
    $("#sortable")
        .selectable({
            filter: "li",
        })
        .find("li")


    $("#addButton").on("tap", function() {
        if ($('#sortable .ui-selected').index() != -1) {
            $('#removeButton').css('opacity', '1');
            if ($('#sortable li').length < 30) {
                $('#sortable .ui-selected').before('<li>' + $('#animationDropDownPage2 option:selected').text() + '</li>');
                var $s = $('#sortable');

                var optionTop = $('#sortable .ui-selected').offset().top;
                var selectTop = $s.offset().top;
                $s.scrollTop($s.scrollTop() + (optionTop - selectTop));


                $("#sortable")
                    .selectable({
                        filter: "li",
                    })
                    .find("li")
            } else {
                $.hyc.ui.alert({
                    content: 'حداکثر 30 انیمیشن می توانید اضافه کنید.',
                    buttons: [{
                        name: 'قبول',
                        id: 'confirmBtn',
                        color: '#fff',
                        bgColor: '#3c3',
                        callback: function() {
                            this.close();
                        },
                        closable: true
                    }, ],
                    closable: true
                });
            }
        }
    });



    $("#removeButton").on("tap", function() {
        var $selectedItem = ($('#sortable .ui-selected').index());
        if ($('#sortable li').length > 1 && $selectedItem != -1) {
            $('#sortable .ui-selected').remove();
            if ($selectedItem + 1 <= $('#sortable li').length) {
                $('#sortable li').eq($selectedItem).addClass('ui-selected');
            } else {
                $('#sortable li').eq($selectedItem - 1).addClass('ui-selected');
            }

        }

        var $s = $('#sortable');

        var optionTop = $('#sortable .ui-selected').offset().top;
        var selectTop = $s.offset().top;
        $s.scrollTop($s.scrollTop() + (optionTop - selectTop));
        if ($('#sortable li').length == 1) {
            $('#removeButton').css('opacity', '0.4');
        }

    });

    $("#upButton").on("tap", function() {


        var $selectedItem = ($('#sortable .ui-selected').index());

        if ($('#sortable li').length > 1 && $selectedItem != -1 && $selectedItem != 0) {
            $('#sortable li').eq($selectedItem - 1).before('<li>' + $('#sortable li').eq($selectedItem).html() + '</li>');
            $('#sortable .ui-selected').remove();
            $('#sortable li').eq($selectedItem - 1).addClass('ui-selected');
            var $s = $('#sortable');

            var optionTop = $('#sortable .ui-selected').offset().top;
            var selectTop = $s.offset().top;
            $s.scrollTop($s.scrollTop() + (optionTop - selectTop));
        }


    });

    $("#downButton").on("tap", function() {


        var $selectedItem = ($('#sortable .ui-selected').index());

        if ($('#sortable li').length > 1 && $selectedItem != -1 && $selectedItem != $('#sortable li').length - 1) {
            $('#sortable li').eq($selectedItem + 1).after('<li>' + $('#sortable li').eq($selectedItem).html() + '</li>');
            $('#sortable .ui-selected').remove();
            $('#sortable li').eq($selectedItem + 1).addClass('ui-selected');
            var $s = $('#sortable');

            var optionTop = $('#sortable .ui-selected').offset().top;
            var selectTop = $s.offset().top;
            $s.scrollTop($s.scrollTop() + (optionTop - selectTop));
        }


    });

    $("#okButton").click(function() {
        $("#sortable").find("li").removeClass('ui-selected');
        localStorage.setItem("animationListSave", $.trim($("#sortable").html()));
        multipleAnimationList = "";
        $('#sortable li').each(function() { //this part generates the string to be sent to controller, like -1-0-3-2-0
            for (var i = 0; i < animations.length; i++) {
                if ($(this).text() == animations[i]) {
                    multipleAnimationList = multipleAnimationList + "-" + (i + 1).toString();
                    break;
                }
            }
        })
        multipleAnimationList += "-";
        localStorage.multipleAnimationList = multipleAnimationList;
        window.history.back();
    })


    $("#okButtonSettingsPage").click(function() {
        var configString = "";
        if ($("#numberOfLEDSinput").val() > 1000 || $("#numberOfLEDSinput").val() < 1 || (/[^0-9]/.test($("#numberOfLEDSinput").val()))) {
            $.hyc.ui.alert({
                content: 'تعداد LED باید بیشتر از یک و کمتر از 1000 عدد باشد.',
                buttons: [{
                    name: 'قبول',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#3c3',
                    callback: function() {
                        this.close();
                    },
                    closable: true
                }, ],
                closable: true
            });
        } else {
            localStorage.numberOfLEDS = $("#numberOfLEDSinput").val();
            configString += "@NLED" + $("#numberOfLEDSinput").val() + "@NLED";
        }

        var usernameValidate = (/[^a-zA-Z0-9 &,.:*-]/.test($("#usernameWifi").val()) || (($("#usernameWifi").val()).length < 1) || (($("#usernameWifi").val()).length > 32));
        var passwordOldValidate = ((/[^a-zA-Z0-9 &,.:*-]/.test($("#passwordWifiOld").val())) || (($("#passwordWifiOld").val()).length < 8) || (($("#passwordWifiOld").val()).length > 32)); //check if password length is at least 8 chars and it only contains letters, numbers and these chars: "space-&:.,". if everything is ok it will return false.
        var passwordNewValidate = ((/[^a-zA-Z0-9 &,.:*-]/.test($("#passwordWifiNew").val())) || (($("#passwordWifiNew").val()).length < 8) || (($("#passwordWifiNew").val()).length > 32));
        if ($("#passwordWifiOld").val().length > 0 || $("#passwordWifiNew").val().length > 0 || $("#usernameWifi").val().length > 0) {
            if (usernameValidate || passwordOldValidate || passwordNewValidate) {
                $.hyc.ui.alert({
                    content: '<p style="text-align:right;">در تغییر دادن نام و رمز وایفای به موارد زیر توجه کنید:<br/>- رمز وایفای باید حداقل 8 و حداکثر 32 کارکتر باشد.<br/>- نام وایفای باید حداقل 1 و حداکثر 32 کارکتر باشد.<br/>- رمز و نام وایفای تنها می تواند شامل حروف انگلیسی بزرگ و کوچک، اعداد، و علائم : , . &amp; * - و فاصله خالی باشد.</p>',
                    buttons: [{
                        name: 'قبول',
                        id: 'confirmBtn',
                        color: '#fff',
                        bgColor: '#080',
                        callback: function() {
                            this.close();
                        },
                        closable: true
                    }, ],
                    color: "#aaa",
                    closable: true
                });

            } else {
                configString += '@UN' + $("#usernameWifi").val() + '@UN@PN' + $("#passwordWifiNew").val() + '@PN@PO' + $("#passwordWifiOld").val() + '@PO';
            }

        }
        //window.history.back();
        sendConfig(configString);

    })

    //back button list creation page
    $('#cancelButton').on("tap", function() {
        if (localStorage.animationListSave != $("#sortable").html()) {
            $.hyc.ui.alert({
                content: 'تغییرات ذخیره نخواهد شد. آیا مطمئن هستید؟',
                buttons: [{
                    name: 'بله',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#f31',
                    callback: function() {
                        $("#sortable").empty();
                        $("#sortable").append(localStorage.animationListSave);
                        window.history.back();
                        this.close();
                    },
                    closable: false
                }, {
                    name: 'خیر',
                    id: 'cancelBtn',
                    color: '#000',
                    bgColor: '#fff',
                    callback: function() {
                        this.close();
                    },
                    closable: false
                }],
                closable: false
            });
        } else {
            window.history.back();
        }

    });

    $('#cancelButtonSettingsPage').on("tap", function() {

        if ($("#numberOfLEDSinput").val() != localStorage.numberOfLEDS || $("#usernameWifi").val() != "" || $("#passwordWifiOld").val() != "" || $("#passwordWifiNew").val() != "") {
            $.hyc.ui.alert({
                content: 'تغییرات ذخیره نخواهد شد. آیا مطمئن هستید؟',
                buttons: [{
                    name: 'بله',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#f31',
                    callback: function() {
                        $("#numberOfLEDSinput").val(localStorage.numberOfLEDS);
                        $("#ColorSequenceInput").val(localStorage.ledChipColorSequence);
                        $("#usernameWifi").val("");
                        $("#passwordWifiOld").val("");
                        $("#passwordWifiNew").val("");
                        window.history.back();
                        this.close();
                    },
                    closable: false
                }, {
                    name: 'خیر',
                    id: 'cancelBtn',
                    color: '#000',
                    bgColor: '#fff',
                    callback: function() {
                        this.close();
                    },
                    closable: false
                }],
                closable: false
            });
        } else {
            window.history.back();
        }
    });


    $('#runButton').on("tap", function() {
        sendPattern();
    });



});

$(window).load(function() {

    $("#listContainer").height($(window).height());
    setTimeout(function() {
        $("#listContainer").height(Math.round($(window).height() - $("#listCreationSelectAndButtonContainer").height() * 1.2 - $("#headerPageTwo").height() * 2));
		$("#sortable").height($("#listContainer").height());
    }, 3000);
});


function sendConfig(configString) {

$.mobile.loading('show', {
        text: 'foo',
        textVisible: false,
        theme: 'z',
        html: ""
    });
	
	
    $.ajax({
        url: deviceIP + "+" + configString + "+",
        type: 'GET',
        cache: false,
        timeout: 3500,
        error: function() {
            $.mobile.loading('hide');
            $.hyc.ui.alert({
                content: 'ارتباط با دستگاه برقرار نیست لطفا مطمئن شوید به شبکه وایفای مربوط به دستگاه متصل شده اید.',
                buttons: [{
                    name: 'قبول',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#080',
                    callback: function() {
                        this.close();
                    },
                    closable: true
                }, ],
                color: "#aaa",
                closable: true
            });
        },
        success: function(data) {
			console.log(data);
			if (data=="passOK"){
            $.mobile.loading('hide');
			
            $.hyc.ui.alert({
                content: 'تنظیمات با موفقیت اعمال گردید. دستگاه مجددا راه اندازی خواهد شد. در صورت نیاز دوباره به شبکه وایفای متصل شوید.',
                buttons: [{
                    name: 'قبول',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#080',
                    callback: function() {
                        this.close();
                    },
                    closable: false
                }, ],
                color: "#aaa",
                closable: true
            });			
			}
			if (data=="passERROR"){
            $.mobile.loading('hide');
            $.hyc.ui.alert({
                content: 'رمز فعلی وایفای به درستی وارد نشده است. تغییرات نام و رمز وایفای اعمال نخواهد شد.',
                buttons: [{
                    name: 'قبول',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#080',
                    callback: function() {
                        this.close();
                    },
                    closable: false
                }, ],
                color: "#aaa",
                closable: true
            });			
			}
			else{
            $.mobile.loading('hide');
			}

        }
    });
	
}

function sendPattern() {
    var outputProgram = "";
    outputProgram = "BI" + Math.round(localStorage.brightnessValue * 2.55) + "BI";
    switch (localStorage.modeSelectionIndex) {
        case "0":
            outputProgram += "CC-" + localStorage.chosenColorR + "-" + localStorage.chosenColorG + "-" + localStorage.chosenColorB + "-CC";
            break;
        case "1":
            outputProgram += "HUE" + Math.round($('#gHueChangeTimeIntervalSlider').val() * 2.55) + "HUE"
            outputProgram += "MA-" + (parseInt(localStorage.animSelectionIndex) + 1).toString() + "-MA";
            outputProgram += "FPS" + localStorage.FPSValue + "FPS";
            break;
        case "2":
            if ((localStorage.multipleAnimationList) == null) {
                localStorage.multipleAnimationList = "-0-"
            };
            outputProgram += "HUE" + Math.round($('#gHueChangeTimeIntervalSlider').val() * 2.55) + "HUE"
            outputProgram += "MA" + localStorage.multipleAnimationList + "MA"
            outputProgram += "FPS" + localStorage.FPSValue + "FPS";
            outputProgram += "AD" + localStorage.AnimationDurationValue + "AD";
            break;
    }
    outputProgram = deviceIP + "+" + outputProgram + "+";
    console.log(outputProgram);
    sendCommand(outputProgram);
}

function sendCommand(command) {
    $.get(command, function(data, status) {
        return data;

    });
}


//the following function forces NumberOfLeds input to only accept number character
$(function() {
    $("input[id*='numberOfLEDSinput']").keydown(function(event) {
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105) && event.keyCode != 8) {
            event.preventDefault();
        }
    });
})

function sendStartMsg() {
    $.ajax({
        url: deviceIP + "+hi+",
        type: 'GET',
        //async: false,
        cache: false,
        timeout: 2500,
        error: function() {
            $.mobile.loading('hide');
            $.hyc.ui.alert({
                content: 'ارتباط با دستگاه برقرار نیست لطفا مطمئن شوید به شبکه وایفای مربوط به دستگاه متصل شده اید.',
                buttons: [{
                    name: 'قبول',
                    id: 'confirmBtn',
                    color: '#fff',
                    bgColor: '#080',
                    callback: function() {
                        this.close();
                    },
                    closable: true
                }, ],
                color: "#aaa",
                closable: true
            });
        },
        success: function(data) {
            $.mobile.loading('hide');

        }
    });
}
