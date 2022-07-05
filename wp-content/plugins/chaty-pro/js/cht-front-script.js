jQuery( function($) {
    !function (t) {
        var e = {};

        function i(n) {
            if (e[n]) return e[n].exports;
            var o = e[n] = {i: n, l: !1, exports: {}};
            return t[n].call(o.exports, o, o.exports, i), o.l = !0, o.exports
        }

        i.m = t, i.c = e, i.d = function (t, e, n) {
            i.o(t, e) || Object.defineProperty(t, e, {configurable: !1, enumerable: !0, get: n})
        }, i.n = function (t) {
            var e = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return i.d(e, "a", e), e
        }, i.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, i.p = "/", i(i.s = 10);
    }({
        10: function (t, e, i) {
            i(11), t.exports = i(12)
        }, 11: function (t, e) {

            !function (t) {
                var e;
                var country_name = "";
                var widget_status = false;
                var activeIndexID = 0;
                var currentCountryCount = "";
                var isChatyInMobile = false; //initiate as false
                var exitIntentStatus = false;
                var pageScrollStatus = false;
                var timeIntervalStatus = false;
                var maxTimeInterval = 0;
                var chatyFunctionLoaded = false;
                var isBoatUser = false;
                var isActionTriggered = false;

                function i(t) {
                    for (var e = t + "=", i = document.cookie.split(";"), n = 0; n < i.length; n++) {
                        for (var o = i[n]; " " == o.charAt(0);) o = o.substring(1);
                        if (0 == o.indexOf(e)) return o.substring(e.length, o.length)
                    }
                    return ""
                }

                function check_for_widget_data(index) {
                    activeIndexID = index;
                    if(index < e.chaty_widgets.length) {
                        if(checkForDateSettings()) {
                            if (e.chaty_widgets[index].countries.length > 0) {
                                if (country_name == "") {
                                    var $ipurl = 'https://www.cloudflare.com/cdn-cgi/trace';
                                    jQuery.get($ipurl, function (cloudflaredata) {
                                        var currentCountry = cloudflaredata.match("loc=(.*)");
                                        if (currentCountry.length > 1) {
                                            currentCountry = currentCountry[1];
                                            if (currentCountry) {
                                                currentCountry = currentCountry.toUpperCase();
                                                country_name = currentCountry;
                                                if (jQuery.inArray(currentCountry, e.chaty_widgets[activeIndexID].countries) != -1) {
                                                    set_widget_data(activeIndexID);
                                                } else {
                                                    currentCountryCount++;
                                                    setTimeout(function () {
                                                        check_for_widget_data(currentCountryCount);
                                                    }, 10);
                                                }
                                            } else {
                                                currentCountryCount++;
                                                setTimeout(function () {
                                                    check_for_widget_data(currentCountryCount);
                                                }, 10);
                                            }
                                        }
                                    });
                                } else {
                                    if (jQuery.inArray(country_name, e.chaty_widgets[activeIndexID].countries) != -1) {
                                        set_widget_data(activeIndexID);
                                    } else {
                                        currentCountryCount++;
                                        setTimeout(function () {
                                            check_for_widget_data(currentCountryCount);
                                        }, 10);
                                    }
                                }
                            } else {
                                set_widget_data(index);
                            }
                        }
                    } else {
                        if(jQuery(".chaty-main-widget.whatsapp-action-btn a").length) {
                            jQuery(".chaty-main-widget.whatsapp-action-btn a").each(function(){
                                thisHref = jQuery(this).prop("href");
                                thisHref = decodeURI(thisHref);
                                thisHref = thisHref.replace(/{title}/g, jQuery("title").text());
                                thisHref = thisHref.replace(/{url}/g, encodeURI(window.location.href));
                                $(this).prop("href", thisHref);
                            })
                        }
                        if(jQuery(".chaty-main-widget.email-action-btn a").length) {
                            jQuery(".chaty-main-widget.email-action-btn a").each(function(){
                                thisHref = jQuery(this).prop("href");
                                thisHref = decodeURI(thisHref);
                                thisHref = thisHref.replace(/{title}/g, jQuery("title").text());
                                thisHref = thisHref.replace(/{url}/g, encodeURI(window.location.href));
                                $(this).prop("href", thisHref);
                            })
                        }
                    }

                    if (jQuery("body .has-custom-chaty-popup.whatsapp-button.open-it-by-default:first-child").length && !isActionTriggered) {
                        if (!jQuery("body .has-custom-chaty-popup.whatsapp-button.open-it-by-default:first-child").closest(".chaty-widget").hasClass("one_widget")) {
                            var thisIndex = jQuery("body .has-custom-chaty-popup.whatsapp-button.open-it-by-default:first-child").closest(".chaty-widget").attr("data-index");
                            var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                            if (is_chaty_settings_expired("cht_whatsapp_window" + widgetIndex)) {
                                isActionTriggered = true;
                                jQuery("body .has-custom-chaty-popup.whatsapp-button.open-it-by-default:first-child").trigger("click");
                            }
                        } else {
                            var $m = jQuery("body .has-custom-chaty-popup.whatsapp-button.open-it-by-default:first-child");
                            var timeInterval = 0;
                            if(jQuery("#chaty-inline-popup").length) {
                                var thisIndex = $m.data("data-index");
                                $("#chaty-widget-"+thisIndex).removeClass("chaty-popup-open");
                                $(".chaty-popup-open").removeClass("chaty-popup-open");
                                jQuery(".chaty-widget.hide-block").removeClass("active");
                            }
                            jQuery("#chaty-inline-popup").remove();
                            if($m.attr("data-popup") != undefined && $m.attr("data-popup") != "") {
                                var thisIndex = $m.closest(".chaty-widget").attr("data-index");
                                var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                                jQuery("#chaty-widget-"+thisIndex).addClass("hide-block");
                                jQuery("#chaty-widget-"+thisIndex).addClass("chaty-popup-open");
                                var htmlString = "<div data-index='"+thisIndex+"' id='chaty-inline-popup' class='chaty-inline-popup chaty-popup-form "+$(this).data("channel")+"-channel'>";
                                htmlString += $m.attr("data-popup");
                                htmlString + "</div>";
                                jQuery("body").append(htmlString);
                                var thisIndex = $m.closest(".chaty-widget").attr("data-index");
                                if (chaty_settings.chaty_widgets[thisIndex]['mode'] == "horizontal") {
                                    jQuery(".chaty-inline-popup").css("bottom", (parseInt(chaty_settings.chaty_widgets[thisIndex]['bot']) + "px"));
                                    if (chaty_settings.chaty_widgets[thisIndex]['pos_side'] == "right") {
                                        jQuery(".chaty-inline-popup").css("left", "auto").css("right", chaty_settings.chaty_widgets[thisIndex]['side'] + "px");
                                    } else {
                                        jQuery(".chaty-inline-popup").css("right", "auto").css("left", chaty_settings.chaty_widgets[thisIndex]['side'] + "px");
                                    }
                                } else {
                                    jQuery(".chaty-inline-popup").css("bottom", parseInt(chaty_settings.chaty_widgets[thisIndex]['bot']) + "px");
                                    if (chaty_settings.chaty_widgets[thisIndex]['pos_side'] == "right") {
                                        jQuery(".chaty-inline-popup").css("left", "auto").css("right", (parseInt(chaty_settings.chaty_widgets[thisIndex]['side']) + "px"))
                                    } else {
                                        jQuery(".chaty-inline-popup").css("right", "auto").css("left", (parseInt(chaty_settings.chaty_widgets[thisIndex]['side']) + "px"));
                                    }
                                }
                                if(jQuery(".chaty-inline-popup .default-value").length) {

                                    thisHref = jQuery(".chaty-inline-popup .default-value").text();
                                    thisHref = decodeURI(thisHref);
                                    thisHref = thisHref.replace(/{title}/g, jQuery("title").text());
                                    thisHref = thisHref.replace(/{url}/g, window.location.href);

                                    jQuery(".chaty-whatsapp-msg").val(thisHref);
                                    jQuery(".chaty-whatsapp-phone").val(jQuery(".chaty-inline-popup .default-msg-phone").text());
                                    chatyHtml = jQuery(".chaty-inline-popup .default-msg-value").html();
                                    chatyHtml = chatyHtml.replace(/{title}/g, jQuery("title").text());
                                    chatyHtml = chatyHtml.replace(/{url}/g, window.location.href);
                                    jQuery(".chaty-whatsapp-message").html(chatyHtml);
                                }
                                jQuery("#chaty-widget-"+thisIndex).addClass("active");
                                setTimeout(function(){
                                    jQuery("#chaty-inline-popup").addClass("active");
                                }, 150);
                                if(!jQuery("body").hasClass("chaty-in-mobile")) {
                                    jQuery(".chaty-whatsapp-msg").focus();
                                }
                            }
                        }
                    }

                    /* Remove Arrows if title is blank */
                    jQuery(".chaty-widget-i-title").each(function () {
                        if (jQuery(this).text() == "") {
                            jQuery(this).closest(".chaty-widget-i").addClass("hide-chaty-arrow");
                            jQuery(this).remove();
                        }
                    });
                }

                function checkForDateSettings() {
                    if(chaty_settings.chaty_widgets[activeIndexID].has_date_setting == 0) {
                        return true;
                    }
                    var dateStatus = false;
                    var chtStartDate = chaty_settings.chaty_widgets[activeIndexID].chaty_start_time;
                    var chtEndDate = chaty_settings.chaty_widgets[activeIndexID].chaty_end_time;

                    var localDate = new Date();
                    localDate.setHours(localDate.getUTCHours() + parseFloat(chaty_settings.chaty_widgets[activeIndexID].date_utc_diff));

                    var currentTime = localDate.getFullYear()+"-"+(addPrefix(localDate.getMonth()+1))+"-"+addPrefix(localDate.getDate())+" "+addPrefix(localDate.getHours())+":"+addPrefix(localDate.getMinutes())+":"+addPrefix(localDate.getSeconds());

                    if(chtEndDate == "") {
                        if(chtStartDate <= currentTime) {
                            return true;
                        }
                    }

                    if(chtStartDate == "") {
                        if(chtEndDate >= currentTime) {
                            return true;
                        }
                    }

                    if(chtStartDate != "" && chtEndDate != "") {
                        if(chtStartDate <= currentTime && chtEndDate >= currentTime) {
                            return true;
                        }
                    }

                    currentCountryCount++;
                    setTimeout(function () {
                        check_for_widget_data(currentCountryCount);
                    }, 10);
                    return false;
                }

                function addPrefix(num) {
                    num = num.toString();
                    while (num.length < 2) num = "0" + num;
                    return num;
                }


                $(document).ready(function(){
                    e = chaty_settings;
                    if(e.chaty_widgets.length > 0) {

                        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                            isChatyInMobile = true;
                        }
                        if (isChatyInMobile) {
                            jQuery("body").addClass("chaty-in-mobile");
                        } else {
                            jQuery("body").addClass("chaty-in-desktop");
                        }

                        var botPattern = "(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
                        var re = new RegExp(botPattern, 'i');
                        var userAgent = navigator.userAgent;
                        if (re.test(userAgent)) {
                            isBoatUser = true;
                        }

                        if(chaty_settings.data_analytics_settings != "on") {
                            isBoatUser = true;
                        }

                        currentCountryCount = 0;
                        check_for_widget_data(currentCountryCount);
                    }
                });

                function set_widget_data(index) {
                    widget_status = false;
                    for(var i=0; i<e.chaty_widgets[index]['social'].length; i++) {
                        if(isChatyInMobile) {
                            if(e.chaty_widgets[index]['social'][i]['is_mobile']) {
                                widget_status = true;
                            }
                        } else {
                            if(e.chaty_widgets[index]['social'][i]['is_desktop']) {
                                widget_status = true;
                            }
                        }
                    }
                    if(widget_status) {
                        // chaty_settings.chaty_widgets[widgetIndex] = e.chaty_widgets[index];
                        if(check_for_time(index)) {
                            chaty_settings.widget_status[index]['on_page_status'] = 1;
                            set_chaty_widget(index);
                        } else {
                            currentCountryCount++;
                            setTimeout(function(){
                                check_for_widget_data(currentCountryCount);
                            },10);
                        }
                    } else {
                        currentCountryCount++;
                        setTimeout(function(){
                            check_for_widget_data(currentCountryCount);
                        },10);
                    }
                }

                function load_chaty_functions() {
                    if (isChatyInMobile) {
                        jQuery("body").addClass("chaty-in-mobile");
                    } else {
                        jQuery("body").addClass("chaty-in-desktop");
                    }
                    if(!chatyFunctionLoaded) {
                        chatyFunctionLoaded = true;
                        set_chaty_widget_size();

                        jQuery(document).on("click", ".i-trigger .i-trigger-open" , function(){
                            if(!jQuery(this).closest(".chaty-widget").hasClass("one_widget")) {
                                jQuery(this).closest(".chaty-widget").removeClass("none-widget-show").addClass("chaty-widget-show");
                            }
                            var thisIndex = jQuery(this).closest(".chaty-widget").attr("data-index");
                            if(chaty_settings.chaty_widgets[thisIndex]['click_setting'] == "click") {
                                jQuery(this).addClass("no-tooltip");
                            }
                            set_cta_status(thisIndex);
                            var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                            save_chaty_settings("ca"+widgetIndex);
                            if(chaty_settings.chaty_widgets[thisIndex]['animation_class'] != "") {
                                jQuery("#chaty-animation-"+thisIndex).removeClass("chaty-animation-"+chaty_settings.chaty_widgets[thisIndex]['animation_class']);
                            }

                            if(chaty_settings.chaty_widgets[thisIndex]['click_setting'] != "all_time" && jQuery(this).hasClass("one-widget")) {
                                jQuery(this).addClass("show-channel");
                                var tooltipText = jQuery(this).data("title");
                                jQuery(this).find(".chaty-widget-i-title").find("p").html(tooltipText);
                            }
                        });

                        jQuery(document).on("click", ".i-trigger.one-widget, .i-trigger .i-trigger-open" , function(){
                            var thisIndex = jQuery(this).closest(".chaty-widget").attr("data-index");
                            var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                            if(chaty_settings.chaty_widgets[thisIndex]['click_setting'] == "click") {
                                jQuery(this).addClass("no-tooltip");
                            }
                            set_cta_status(thisIndex);
                            save_chaty_settings("ca"+widgetIndex);
                            if(chaty_settings.chaty_widgets[thisIndex]['animation_class'] != "") {
                                jQuery("#chaty-animation-"+thisIndex).removeClass("chaty-animation-"+chaty_settings.chaty_widgets[thisIndex]['animation_class']);
                            }

                            if(chaty_settings.chaty_widgets[thisIndex]['click_setting'] != "all_time" && jQuery(this).hasClass("one-widget")) {
                                jQuery(this).addClass("show-channel");
                                var tooltipText = jQuery(this).data("title");
                                jQuery(this).find(".chaty-widget-i-title").find("p").html(tooltipText);

                            }
                        });

                        /*jQuery(document).on("mouseover", ".i-trigger.one-widget, .i-trigger .i-trigger-open" , function(){
                            var thisIndex = jQuery(this).closest(".chaty-widget").attr("data-index");
                            if(chaty_settings.chaty_widgets[thisIndex]['animation_class'] != "") {
                                jQuery("#chaty-animation-"+thisIndex).removeClass("chaty-animation-"+chaty_settings.chaty_widgets[thisIndex]['animation_class']);
                            }
                        })*/

                        jQuery(document).on("click", ".i-trigger .i-trigger-close" , function(){
                            if(!jQuery(this).closest(".chaty-widget").hasClass("one_widget")) {
                                jQuery(this).closest(".chaty-widget").removeClass("chaty-widget-show").addClass("none-widget-show");
                            }
                        });

                        /* Google Analytics */
                        jQuery(document).on("click", ".chaty-widget .update-analytics", function(){
                            var channelName = jQuery(this).attr("data-channel");
                            if(channelName != "" && channelName != null) {
                                if(window.hasOwnProperty("gtag")) {
                                    gtag("event", "chaty_" + channelName, {
                                        eventCategory: "chaty_" + channelName,
                                        event_action: "chaty_" + channelName,
                                        method: "chaty_" + channelName
                                    });
                                }
                                if (window.hasOwnProperty("ga")) {
                                    var ga_settings = window.ga.getAll()[0];
                                    ga_settings && ga_settings.send("event", "click", {
                                        eventCategory: "chaty_" + channelName,
                                        eventAction: "chaty_" + channelName,
                                        method: "chaty_" + channelName
                                    })
                                }
                            }
                        });

                        /* We chat settings */
                        // jQuery(document).on("click", ".wechat-box-head svg, .chaty-widget-i, .close-chaty-popup", function(e){
                        //     e.stopPropagation();
                        //     if(jQuery(this).hasClass("is-whatsapp-btn")) {
                        //         save_chaty_settings("cht_whatsapp_window");
                        //     }
                        //     jQuery("#chaty-inline-popup").remove();
                        //     jQuery("body").removeClass("chaty-popup-open");
                        // });
                        //
                        // jQuery(document).on("click", ".close-chaty-box", function(e){
                        //     e.stopPropagation();
                        //     if(jQuery(this).hasClass("is-whatsapp-btn")) {
                        //         save_chaty_settings("cht_whatsapp_window");
                        //     }
                        //     jQuery("#chaty-inline-popup").remove();
                        //     jQuery("body").removeClass("chaty-popup-open");
                        // });
                        jQuery(document).on("submit", ".whatsapp-chaty-form", function(e){
                            var thisIndex = jQuery(this).closest(".chaty-inline-popup").attr("data-index");
                            var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                            if(jQuery(this).closest(".chaty-inline-popup").find(".is-whatsapp-btn").length) {
                                if(jQuery(this).closest(".chaty-inline-popup").find(".is-default-open").length && parseInt(jQuery(this).closest(".chaty-inline-popup").find(".is-default-open").val()) == 1) {
                                    save_chaty_settings("cht_whatsapp_window"+widgetIndex);
                                }
                            }
                            jQuery("#chaty-inline-popup").removeClass("active");

                            $("#chaty-widget-"+thisIndex).removeClass("chaty-popup-open");
                            setTimeout(function(){
                                jQuery(".chaty-widget.hide-block").removeClass("active");
                            }, 250);
                            if(jQuery("body").hasClass("chaty-in-mobile") || jQuery(this).find(".use-whatsapp-web").length) {
                                e.preventDefault();
                                if(jQuery("body").hasClass("chaty-in-mobile")) {
                                    window.location = "https://wa.me/"+jQuery(this).find(".chaty-whatsapp-phone").val()+"?text="+jQuery(this).find(".chaty-whatsapp-msg").val();
                                } else {
                                    window.open("https://wa.me/"+jQuery(this).find(".chaty-whatsapp-phone").val()+"?text="+jQuery(this).find(".chaty-whatsapp-msg").val(), "_blank");
                                }
                                return false;
                            }
                        });

                        jQuery(document).on("click", ".close-chaty-popup, .close-chaty-box", function(){
                            var thisIndex = jQuery(this).closest(".chaty-inline-popup").attr("data-index");
                            var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                            if(jQuery(this).hasClass("is-whatsapp-btn")) {
                                if(jQuery(this).closest(".chaty-inline-popup").find(".is-default-open").length && parseInt(jQuery(this).closest(".chaty-inline-popup").find(".is-default-open").val()) == 1) {
                                    save_chaty_settings("cht_whatsapp_window"+widgetIndex);
                                }
                            }
                            jQuery("#chaty-inline-popup").removeClass("active");

                            $("#chaty-widget-"+thisIndex).removeClass("chaty-popup-open");
                            setTimeout(function(){
                                jQuery(".chaty-widget.hide-block").removeClass("active");
                            }, 250);
                        });

                        jQuery(document).on("click", ".has-custom-chaty-popup.whatsapp-button", function(e){
                            var timeInterval = 0;
                            if(jQuery("#chaty-inline-popup").length) {
                                var thisIndex = jQuery(this).data("data-index");
                                $("#chaty-widget-"+thisIndex).removeClass("chaty-popup-open");
                                $(".chaty-popup-open").removeClass("chaty-popup-open");
                                jQuery(".chaty-widget.hide-block").removeClass("active");
                            }
                            if(jQuery(this).hasClass("open-it-by-default")) {
                                e.preventDefault();
                            }
                            jQuery("#chaty-inline-popup").remove();
                            if(jQuery(this).attr("data-popup") != undefined && jQuery(this).attr("data-popup") != "") {
                                var thisIndex = jQuery(this).closest(".chaty-widget").attr("data-index");
                                var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                                jQuery("#chaty-widget-"+thisIndex).addClass("hide-block");
                                jQuery("#chaty-widget-"+thisIndex).addClass("chaty-popup-open");
                                var htmlString = "<div data-index='"+thisIndex+"' id='chaty-inline-popup' class='chaty-inline-popup chaty-popup-form "+$(this).data("channel")+"-channel'>";
                                    htmlString += jQuery(this).attr("data-popup");
                                    htmlString + "</div>";
                                jQuery("body").append(htmlString);
                                var thisIndex = jQuery(this).closest(".chaty-widget").attr("data-index");
                                if (chaty_settings.chaty_widgets[thisIndex]['mode'] == "horizontal") {
                                    jQuery(".chaty-inline-popup").css("bottom", (parseInt(chaty_settings.chaty_widgets[thisIndex]['bot']) + "px"));
                                    if (chaty_settings.chaty_widgets[thisIndex]['pos_side'] == "right") {
                                        jQuery(".chaty-inline-popup").css("left", "auto").css("right", chaty_settings.chaty_widgets[thisIndex]['side'] + "px");
                                    } else {
                                        jQuery(".chaty-inline-popup").css("right", "auto").css("left", chaty_settings.chaty_widgets[thisIndex]['side'] + "px");
                                    }
                                } else {
                                    jQuery(".chaty-inline-popup").css("bottom", parseInt(chaty_settings.chaty_widgets[thisIndex]['bot']) + "px");
                                    if (chaty_settings.chaty_widgets[thisIndex]['pos_side'] == "right") {
                                        jQuery(".chaty-inline-popup").css("left", "auto").css("right", (parseInt(chaty_settings.chaty_widgets[thisIndex]['side']) + "px"))
                                    } else {
                                        jQuery(".chaty-inline-popup").css("right", "auto").css("left", (parseInt(chaty_settings.chaty_widgets[thisIndex]['side']) + "px"));
                                    }
                                }
                                if(jQuery(".chaty-inline-popup .default-value").length) {

                                    thisHref = jQuery(".chaty-inline-popup .default-value").text();
                                    thisHref = decodeURI(thisHref);
                                    thisHref = thisHref.replace(/{title}/g, jQuery("title").text());
                                    thisHref = thisHref.replace(/{url}/g, window.location.href);

                                    jQuery(".chaty-whatsapp-msg").val(thisHref);
                                    jQuery(".chaty-whatsapp-phone").val(jQuery(".chaty-inline-popup .default-msg-phone").text());
                                    chatyHtml = jQuery(".chaty-inline-popup .default-msg-value").html();
                                    chatyHtml = chatyHtml.replace(/{title}/g, jQuery("title").text());
                                    chatyHtml = chatyHtml.replace(/{url}/g, window.location.href);
                                    jQuery(".chaty-whatsapp-message").html(chatyHtml);
                                }
                                jQuery("#chaty-widget-"+thisIndex).addClass("active");
                                setTimeout(function(){
                                    jQuery("#chaty-inline-popup").addClass("active");
                                }, 150);
                                if(!jQuery("body").hasClass("chaty-in-mobile")) {
                                    jQuery(".chaty-whatsapp-msg").focus();
                                }
                            }
                        });

                        jQuery(document).on("submit", ".chaty-contact-form-data", function(e){
                            var inputErrorCounter = 0;
                            jQuery(".has-chaty-error").removeClass("has-chaty-error");
                            jQuery(".chaty-error-msg").remove();
                            jQuery(".chaty-ajax-error-message").remove();
                            jQuery(".chaty-ajax-success-message").remove();
                            jQuery(this).find(".is-required").each(function(){
                                if(jQuery.trim(jQuery(this).val()) == "") {
                                    inputErrorCounter++;
                                    jQuery(this).addClass("has-chaty-error");
                                }
                            });
                            if(inputErrorCounter == 0) {
                                var $form = jQuery(this);
                                jQuery(".chaty-contact-submit-btn").attr("disabled", true);
                                jQuery.ajax({
                                    url: chaty_settings.ajax_url,
                                    data: {
                                        action: "chaty_front_form_save_data",
                                        name:   $form.find(".chaty-field-name").length?$form.find(".chaty-field-name").val():"",
                                        email:  $form.find(".chaty-field-email").length?$form.find(".chaty-field-email").val():"",
                                        phone:  $form.find(".chaty-field-phone").length?$form.find(".chaty-field-phone").val():"",
                                        message: $form.find(".chaty-field-message").length?$form.find(".chaty-field-message").val():"",
                                        nonce:  $form.find(".chaty-field-nonce").length?$form.find(".chaty-field-nonce").val():"",
                                        channel: $form.find(".chaty-field-channel").length?$form.find(".chaty-field-channel").val():"",
                                        widget: $form.find(".chaty-field-widget").length?$form.find(".chaty-field-widget").val():"",
                                        ref_url: window.location.href
                                    },
                                    type: 'post',
                                    async: true,
                                    defer: true,
                                    success: function (response) {
                                        response = jQuery.parseJSON(response);
                                        jQuery(".chaty-ajax-error-message").remove();
                                        jQuery(".chaty-ajax-success-message").remove();
                                        jQuery(".chaty-contact-submit-btn").attr("disabled", false);
                                        if(response.status == 1) {
                                            jQuery(".chaty-contact-footer").append("<div class='chaty-ajax-success-message'>"+response.message+"</div>");
                                            $(".chaty-field-name, .chaty-field-email, .chaty-field-message, .chaty-field-phone").val("");
                                            if(response.redirect_action == "yes") {
                                                if( response.link_in_new_tab == "yes" ) {
                                                    window.open( response.redirect_link, '_blank' );
                                                } else {
                                                    window.location = response.redirect_link;
                                                }
                                            }
                                            if(response.close_form_after == "yes") {
                                                setTimeout(function(){
                                                    jQuery("#chaty-inline-popup").removeClass("active");
                                                    jQuery(".chaty-widget").removeClass("chaty-popup-open");
                                                    setTimeout(function(){
                                                        jQuery(".chaty-widget.hide-block").removeClass("active");
                                                    }, 250);
                                                }, parseInt(response.close_form_after_seconds)*1000);
                                            }
                                        } else if(response.error == 1) {
                                            if(response.errors.length) {
                                                for(var i=0; i<response.errors.length; i++) {
                                                    $("."+response.errors[i].field).addClass("has-chaty-error");
                                                    $("."+response.errors[i].field).after("<span class='chaty-error-msg'>"+response.errors[i].message+"</span>");
                                                }
                                            }
                                        } else {
                                            jQuery(".chaty-contact-footer").append("<div class='chaty-ajax-error-message'>"+response.message+"</div>");
                                        }
                                    }
                                });
                            } else {
                                $(".has-chaty-error:first").focus();
                            }
                            return false;
                        });

                        jQuery(document).on("click", ".chaty-widget .wechat-action-btn", function(){
                            if(jQuery(this).attr("data-code") != "") {

                                if(jQuery("#chaty-inline-popup").length) {
                                    $(".chaty-popup-open").removeClass("chaty-popup-open");
                                    jQuery(".chaty-widget.hide-block").removeClass("active");
                                }

                                var thisIndex = jQuery(this).closest(".chaty-widget").attr("data-index");
                                var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                                jQuery("#chaty-widget-"+thisIndex).addClass("hide-block");
                                jQuery("#chaty-widget-"+thisIndex).addClass("chaty-popup-open");

                                jQuery("body").addClass("chaty-popup-open");
                                jQuery("#chaty-inline-popup").remove();
                                var htmlString = "<div data-index='"+thisIndex+"' id='chaty-inline-popup' class='chaty-inline-popup'>";
                                htmlString += '<div class="chaty-contact-header">WeChat <div role="button" class="close-chaty-popup"><div class="chaty-close-button"></div></div></div>';
                                htmlString += "<div class='wechat-box'><img src='" + jQuery(this).attr("data-code") + "' alt='QR Code' /><a href='javascript:;'>";
                                htmlString += "</a></div></div>";
                                jQuery("body").append(htmlString);

                                var thisIndex = jQuery(this).closest(".chaty-widget").attr("data-index");
                                if(chaty_settings.chaty_widgets[thisIndex]['mode'] == "horizontal") {
                                    jQuery(".chaty-inline-popup").css("bottom", (parseInt(chaty_settings.chaty_widgets[thisIndex]['bot']))+"px");
                                    if(chaty_settings.chaty_widgets[thisIndex]['pos_side'] == "right") {
                                        jQuery(".chaty-inline-popup").css("left", "auto").css("right", chaty_settings.chaty_widgets[thisIndex]['side']+"px");
                                    } else {
                                        jQuery(".chaty-inline-popup").css("right", "auto").css("left", chaty_settings.chaty_widgets[thisIndex]['side']+"px");
                                    }
                                } else {
                                    jQuery(".chaty-inline-popup").css("bottom", parseInt(chaty_settings.chaty_widgets[thisIndex]['bot'])+"px");
                                    if(chaty_settings.chaty_widgets[thisIndex]['pos_side'] == "right") {
                                        jQuery(".chaty-inline-popup").css("left", "auto").css("right", (parseInt(chaty_settings.chaty_widgets[thisIndex]['side']))+"px");
                                    } else {
                                        jQuery(".chaty-inline-popup").css("right", "auto").css("left", (parseInt(chaty_settings.chaty_widgets[thisIndex]['side']))+"px");
                                    }
                                }
                                jQuery("#chaty-widget-"+thisIndex).addClass("active");
                                setTimeout(function(){
                                    jQuery("#chaty-inline-popup").addClass("active");
                                }, 200);
                            }
                        });

                        jQuery(document).on("click", ".i-trigger .i-trigger-open", function(){
                            if(!isBoatUser) {
                                var widget_index = jQuery(this).closest(".chaty-widget").attr("data-index");
                                var widgetIndex = chaty_settings.chaty_widgets[widget_index].widget_index;
                                var widgetNonce = chaty_settings.chaty_widgets[widget_index].widget_nonce;
                                var isExpired = check_chaty_cookie_expired("wcf"+widgetIndex);
                                if(isExpired) {
                                    save_chaty_cookie_string("wcf"+widgetIndex);
                                    jQuery.ajax({
                                        url: chaty_settings.ajax_url,
                                        data: "index=" + widgetIndex + "&nonce=" + widgetNonce + "&is_widget=1&channel=&type=click&action=update_chaty_channel_status",
                                        type: 'post',
                                        async: true,
                                        defer: true,
                                        success: function () {

                                        }
                                    });
                                }
                            }
                        });

                        jQuery(document).on("click", ".chaty-main-widget", function(){
                            if(!isBoatUser) {
                                if (!jQuery(this).closest(".chaty-widget").hasClass("one_widget")) {
                                    var widget_index = jQuery(this).closest(".chaty-widget").attr("data-index");
                                    var widgetIndex = chaty_settings.chaty_widgets[widget_index].widget_index;
                                    var widgetNonce = jQuery(this).attr("data-nonce");
                                    var widgetChannel = jQuery(this).attr("data-channel");
                                    if(check_chaty_cookie_expired("wcf"+widgetIndex+"_"+widgetChannel)) {
                                        save_chaty_cookie_string("wcf"+widgetIndex+"_"+widgetChannel);
                                        jQuery.ajax({
                                            url: chaty_settings.ajax_url,
                                            data: "index=" + widgetIndex + "&nonce=" + widgetNonce + "&is_widget=0&channel=" + widgetChannel + "&type=click&action=update_chaty_channel_status",
                                            type: 'post',
                                            async: true,
                                            defer: true,
                                            success: function () {

                                            }
                                        });
                                    }
                                } else {
                                    var widget_index = jQuery(this).closest(".chaty-widget").attr("data-index");
                                    var widgetIndex = chaty_settings.chaty_widgets[widget_index].widget_index;
                                    var widgetNonce = chaty_settings.chaty_widgets[widget_index].widget_nonce;
                                    var widgetChannel = jQuery(this).attr("data-channel");
                                    var clickStatus = check_chaty_cookie_expired("wcf"+widgetIndex+"_"+widgetChannel);
                                    if(clickStatus) {
                                        save_chaty_cookie_string("wcf"+widgetIndex+"_"+widgetChannel);
                                    }
                                    var widgetStatus = check_chaty_cookie_expired("wcf"+widgetIndex);
                                    var is_widget = 0;
                                    if(widgetStatus) {
                                        is_widget = 1;
                                        save_chaty_cookie_string("wcf"+widgetIndex);
                                    }
                                    if(is_widget || clickStatus) {
                                        jQuery.ajax({
                                            url: chaty_settings.ajax_url,
                                            data: "index=" + widgetIndex + "&nonce=" + widgetNonce + "&is_widget=" + is_widget + "&channel=" + widgetChannel + "&type=click&action=update_chaty_channel_status",
                                            type: 'post',
                                            async: true,
                                            defer: true,
                                            success: function () {

                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                    set_trigger_variables();
                    if (pageScrollStatus) {
                        page_scroll_functions();
                    }

                    if (timeIntervalStatus) {
                        time_interval_function();
                    }

                    if (exitIntentStatus) {
                        exit_intent_function();
                    }
                }

                jQuery(window).resize(function() {
                    set_chaty_widget_size();
                });

                function setCSSKeyFrames(colorCode) {
                    var colorString = '@-webkit-keyframes chaty-animation-shockwave ' +
                        '{ ' +
                        '0% { transform: scale(1); box-shadow: 0 0 2px rgba('+colorCode+', 0.30), inset 0 0 1px rgba('+colorCode+', 0.30); } ' +
                        '95% { box-shadow: 0 0 50px rgba('+colorCode+', 0), inset 0 0 30px rgba('+colorCode+', 0); } ' +
                        '100% { transform: scale(2.25); } ' +
                        '} ' +
                        '' +
                        '@keyframes chaty-animation-shockwave { ' +
                        '0% { transform: scale(1); box-shadow: 0 0 2px rgba('+colorCode+', 0.30), inset 0 0 1px rgba('+colorCode+', 0.30); } ' +
                        '95% { box-shadow: 0 0 50px rgba('+colorCode+', 0), inset 0 0 30px rgba('+colorCode+', 0); } ' +
                        '100% { transform: scale(2.25); } ' +
                        '}';
                    if(!jQuery("#chaty-advance-css").length) {
                        jQuery("body").append("<div id='chaty-advance-css'></div>");
                    }
                    jQuery("#chaty-advance-css").append("<style>"+colorString+"</style>");
                }

                function set_chaty_channels(thisIndex) {

                    if(isChatyInMobile) {
                        jQuery(".chaty-widget-is .chaty-widget-i.is-in-desktop:not(.is-in-mobile)").remove();
                    } else {
                        jQuery(".chaty-widget-is .chaty-widget-i.is-in-mobile:not(.is-in-desktop)").remove();
                    }

                    set_trigger_variables();

                    var activeWidget = jQuery("#chaty-channel-box-"+thisIndex).find(".chaty-widget-i").length;

                    if(activeWidget == 0) {
                        jQuery("#chaty-widget-"+thisIndex).remove();
                    } else if(activeWidget == 1) {
                        var htmlToAdd = jQuery("#chaty-channel-box-"+thisIndex+" .chaty-widget-i:first").clone();
                        jQuery("#chaty-widget-"+thisIndex).find(".i-trigger").html(htmlToAdd);
                        jQuery("#chaty-widget-"+thisIndex+" .chaty-channels").remove();
                        jQuery("#chaty-widget-"+thisIndex).addClass("one_widget");
                        jQuery("#chaty-widget-"+thisIndex).find(".i-trigger").addClass("one-widget");
                        var CTAStatus = get_cta_status(thisIndex);
                        if(CTAStatus) {
                            var oldTitle = jQuery("#chaty-widget-" + thisIndex).find(".i-trigger .chaty-widget-i-title p").text();
                            jQuery("#chaty-widget-" + thisIndex).find(".i-trigger .chaty-widget-i-title p").html(chaty_settings.chaty_widgets[thisIndex]['cta']);
                            jQuery("#chaty-widget-" + thisIndex).find(".i-trigger").attr("data-title", oldTitle);
                        }
                        jQuery("#chaty-widget-"+thisIndex).find(".i-trigger").addClass("one-widget");
                        setCSSKeyFrames(jQuery("#chaty-channel-box-"+thisIndex+" .chaty-widget-i:first").data("rgb"));
                    } else {
                        setCSSKeyFrames(chaty_settings.chaty_widgets[thisIndex]['rgb_color']);
                    }

                    jQuery("#chaty-widget-"+thisIndex+" .i-trigger svg, #chaty-widget-"+thisIndex+" .i-trigger img").wrap(function() {
                        return "<div id='chaty-animation-"+ thisIndex +"' class='animation-svg'></div>";
                    });

                    /* set fonts if exists */
                    if(chaty_settings.chaty_widgets[thisIndex]['font_family'] != "") {
                        jQuery("head").append("<link id='chaty-front-font-"+thisIndex+"' href='https://fonts.googleapis.com/css?family="+encodeURI(chaty_settings.chaty_widgets[thisIndex]['font_family'])+"&display=swap' rel='stylesheet' type='text/css' />");
                        jQuery("#chaty-widget-"+thisIndex).css("font-family", chaty_settings.chaty_widgets[thisIndex]['font_family']);
                    }

                    /* checking for CTA */
                    var CTAStatus = get_cta_status(thisIndex);
                    if(!CTAStatus && chaty_settings.chaty_widgets[thisIndex]['click_setting'] == "click") {
                        jQuery("#chaty-widget-"+thisIndex+" .i-trigger .i-trigger-open").addClass("no-tooltip");
                        jQuery("#chaty-widget-"+thisIndex+" .i-trigger.one-widget").addClass("no-tooltip");
                        set_cta_status(thisIndex);

                        if(chaty_settings.chaty_widgets[thisIndex]['click_setting'] != "all_time" && jQuery("#chaty-widget-"+thisIndex+" .i-trigger").hasClass("one-widget")) {
                            jQuery("#chaty-widget-"+thisIndex+" .i-trigger").addClass("show-channel");
                        }
                    }

                    if(CTAStatus) {
                        if(chaty_settings.chaty_widgets[thisIndex]['pending_messages'] == "on") {
                            if(chaty_settings.chaty_widgets[thisIndex]['animation_class'] != "sheen") {
                                jQuery("#chaty-widget-" + thisIndex + " .i-trigger .i-trigger-open svg, #chaty-widget-" + thisIndex + " .i-trigger .i-trigger-open img, #chaty-widget-" + thisIndex + " .i-trigger.one-widget svg, #chaty-widget-" + thisIndex + " .i-trigger.one-widget img").after("<span class='cht-pending-message'>" + chaty_settings.chaty_widgets[thisIndex]['number_of_messages'] + "</span>")
                            } else {
                                jQuery("#chaty-widget-" + thisIndex + " .i-trigger .i-trigger-open, #chaty-widget-" + thisIndex + " .i-trigger.one-widget").append("<span class='cht-pending-message'>" + chaty_settings.chaty_widgets[thisIndex]['number_of_messages'] + "</span>")
                            }
                            jQuery("#chaty-widget-"+thisIndex+" .cht-pending-message").css("color", chaty_settings.chaty_widgets[thisIndex]['number_color']);
                            jQuery("#chaty-widget-"+thisIndex+" .cht-pending-message").css("background", chaty_settings.chaty_widgets[thisIndex]['number_bg_color']);
                        }
                    }

                    /* checking for animation */
                    if(chaty_settings.chaty_widgets[thisIndex]['animation_class'] != "") {
                        var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                        var animationStatus = is_chaty_settings_expired("ca"+widgetIndex);
                        if(animationStatus) {
                            jQuery("#chaty-animation-"+thisIndex).addClass("chaty-animation-"+chaty_settings.chaty_widgets[thisIndex]['animation_class']);
                        }
                    }

                    jQuery("#chaty-widget-"+thisIndex).addClass(chaty_settings.chaty_widgets[thisIndex]['mode']+"-cht-menu");
                    jQuery("#chaty-widget-"+thisIndex).addClass(chaty_settings.chaty_widgets[thisIndex]['pos_side']+"-cht-position");
                    if(chaty_settings.chaty_widgets[thisIndex]['pos_side'] == "right") {
                        jQuery("#chaty-widget-" + thisIndex).addClass("chaty-widget-is-left");
                        jQuery("#chaty-widget-" + thisIndex).css({
                            left: "auto",
                            right: chaty_settings.chaty_widgets[thisIndex]['side']+"px",
                            bottom: chaty_settings.chaty_widgets[thisIndex]['bot']+"px"
                        });
                    } else {
                        jQuery("#chaty-widget-" + thisIndex).addClass("chaty-widget-is-right");
                        jQuery("#chaty-widget-" + thisIndex).css({
                            right: "auto",
                            left: chaty_settings.chaty_widgets[thisIndex]['side']+"px",
                            bottom: chaty_settings.chaty_widgets[thisIndex]['bot']+"px"
                        })
                    }

                    /* Set left/right/bottom position */


                    /* checking for display status */
                    var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                    var displayStatus = is_chaty_settings_expired("cs"+widgetIndex);
                    if(!displayStatus) {
                        jQuery("#chaty-widget-"+thisIndex).removeClass("hide-widget");
                        chaty_settings.widget_status[thisIndex]['is_displayed'] = 1;
                        trigget_widget_displayed_status(thisIndex);
                    } else {
                        /* checking for triggers */
                        if(chaty_settings.chaty_widgets[thisIndex]['time_trigger'] == "no" && chaty_settings.chaty_widgets[thisIndex]['exit_intent'] == "no" && chaty_settings.chaty_widgets[thisIndex]['on_page_scroll'] == "no") {
                            save_chaty_settings("cs"+widgetIndex);
                            jQuery("#chaty-widget-"+thisIndex).removeClass("hide-widget");
                            chaty_settings.widget_status[thisIndex]['is_displayed'] = 1;
                            trigget_widget_displayed_status(thisIndex);
                        }

                        if(chaty_settings.chaty_widgets[thisIndex]['time_trigger'] == "yes" && parseInt(chaty_settings.chaty_widgets[thisIndex]['trigger_time']) <= 0) {
                            save_chaty_settings("cs"+widgetIndex);
                            jQuery("#chaty-widget-"+thisIndex).removeClass("hide-widget");
                            chaty_settings.widget_status[thisIndex]['is_displayed'] = 1;
                            trigget_widget_displayed_status(thisIndex);
                        }

                        if(chaty_settings.chaty_widgets[thisIndex]['on_page_scroll'] == "yes" && parseInt(chaty_settings.chaty_widgets[thisIndex]['page_scroll']) <= 0) {
                            save_chaty_settings("cs"+widgetIndex);
                            jQuery("#chaty-widget-"+thisIndex).removeClass("hide-widget");
                            chaty_settings.widget_status[thisIndex]['is_displayed'] = 1;
                            trigget_widget_displayed_status(thisIndex);
                        }
                    }

                    /* checking for State */
                    if(chaty_settings.chaty_widgets[thisIndex]['display_state'] == "open") {
                        if(!jQuery("#chaty-widget-"+thisIndex).hasClass("one_widget")) {
                            jQuery("#chaty-widget-"+thisIndex).removeClass("none-widget-show").addClass("chaty-widget-show");
                        }
                        jQuery("#chaty-widget-" + thisIndex + " .i-trigger .i-trigger-open").addClass("no-tooltip");

                        jQuery("#chaty-widget-"+thisIndex+" .i-trigger .i-trigger-open").addClass("true");

                        if(chaty_settings.chaty_widgets[thisIndex]['has_close_button'] == "no") {
                            jQuery("#chaty-widget-"+thisIndex).addClass("has-not-close-button");
                            if(!jQuery("#chaty-widget-"+thisIndex).hasClass("one_widget")) {
                                jQuery("#chaty-widget-"+thisIndex+" .i-trigger").remove();
                            }
                        }
                    } else if(chaty_settings.chaty_widgets[thisIndex]['display_state'] == "hover") {
                        jQuery(document).on("mouseenter", ".i-trigger .i-trigger-open" , function(){
                            if(!jQuery(this).hasClass("hover-action") && (jQuery(this).closest(".chaty-widget").hasClass("none-widget-show") || !jQuery(this).closest(".chaty-widget").hasClass("chaty-widget-show"))) {
                                if (!jQuery(this).closest(".chaty-widget").hasClass("one_widget")) {
                                    jQuery(this).closest(".chaty-widget").removeClass("none-widget-show").addClass("chaty-widget-show");
                                }
                                var thisIndex = jQuery(this).closest(".chaty-widget").attr("data-index");
                                if(chaty_settings.chaty_widgets[thisIndex]['click_setting'] == "click") {
                                    jQuery(this).addClass("no-tooltip");
                                    set_cta_status(thisIndex);
                                }
                                jQuery(this).addClass("hover-action");
                                var widgetIndex = chaty_settings.chaty_widgets[thisIndex].widget_index;
                                save_chaty_settings("ca" + widgetIndex);
                                if (chaty_settings.chaty_widgets[thisIndex]['animation_class'] != "") {
                                    jQuery("#chaty-animation-" + thisIndex).removeClass("chaty-animation-" + chaty_settings.chaty_widgets[thisIndex]['animation_class']);
                                }
                            }
                        });
                    }
                }

                function exit_intent_function() {
                    function addEvent(obj, evt, fn) {
                        if (obj.addEventListener) {
                            obj.addEventListener(evt, fn, false);
                        }
                        else if (obj.attachEvent) {
                            obj.attachEvent("on" + evt, fn);
                        }
                    }

                    addEvent(document, 'mouseout', function (evt) {
                        if (evt.toElement == null && evt.relatedTarget == null) {
                            trigger_exit_intent();
                        }
                    });
                }

                function get_cta_status(widget_index) {
                    var widgetIndex = chaty_settings.chaty_widgets[widget_index].widget_index;
                    var cookieStr = "cta"+widgetIndex;
                    var cookieValue = check_for_chaty_settinigs(cookieStr);
                    if(cookieValue != null && cookieValue != "") {
                        cookieValue = new Date(cookieValue);
                        var diffTime = Math.abs(new Date() - cookieValue);
                        var diffMin = Math.floor(diffTime / (1000 * 60));
                        if(diffMin >= 10) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return true;
                }

                function check_for_chaty_settinigs(cookieStr) {
                    var cookieString = get_chaty_cookie("chaty_settings");
                    var cookieArray = [];
                    if(cookieString != null && cookieString != "") {
                        cookieArray = JSON.parse(cookieString);
                    }
                    if(cookieArray.length > 0) {
                        for(var i=0; i<cookieArray.length; i++) {
                            if(cookieArray[i]['k'] == cookieStr) {
                                return cookieArray[i]['v'];
                            }
                        }
                    }
                    return null;
                }

                function save_chaty_settings(cookieStr) {
                    var cookieString = get_chaty_cookie("chaty_settings");
                    var cookieArray = [];
                    if(cookieString != null && cookieString != "") {
                        cookieArray = JSON.parse(cookieString);
                    }
                    var cookieFound = false;
                    if(cookieArray.length > 0) {
                        for(var i=0; i<cookieArray.length; i++) {
                            if(cookieArray[i]['k'] == cookieStr) {
                                cookieFound = true;
                                cookieArray[i]['v'] = new Date();
                            }
                        }
                    }
                    if(!cookieFound) {
                        cookieArray.push({"k": cookieStr, "v": new Date()});
                    }
                    cookieString = JSON.stringify(cookieArray);
                    set_chaty_cookie("chaty_settings", cookieString, "7");
                }

                function is_chaty_settings_expired(cookieStr) {
                    var cookieValue = check_for_chaty_settinigs(cookieStr);
                    if(cookieValue != null && cookieValue != "") {
                        cookieValue = new Date(cookieValue);
                        var diffTime = Math.abs(new Date() - cookieValue);
                        var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        if(diffDays >= 1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return true;
                }

                function trigger_exit_intent() {
                    if(exitIntentStatus) {
                        for (var i = 0; i < chaty_settings.chaty_widgets.length; i++) {
                            if (chaty_settings.chaty_widgets[i]['exit_intent'] == "yes" && chaty_settings.widget_status[i]['is_displayed'] == 0) {
                                jQuery("#chaty-widget-" + i).removeClass("hide-widget");
                                trigget_widget_displayed_status(i);
                                var widgetIndex = chaty_settings.chaty_widgets[i].widget_index;
                                save_chaty_settings("cs" + widgetIndex);
                                chaty_settings.widget_status[i]['is_displayed'] = 1;
                                chaty_settings.chaty_widgets[i]['exit_intent'] = "no";
                                jQuery("#chaty-widget-" + i).append("<div class='chaty-nav'></div>");
                                jQuery("#chaty-widget-" + i + " .chaty-nav").addClass(chaty_settings.chaty_widgets[i]['pos_side']);
                                launch_chaty(i+1);
                                setTimeout(function(){
                                    jQuery(".chaty-nav").addClass("active");
                                }, 100);
                                setTimeout(function(){
                                    jQuery(".chaty-nav").remove();
                                }, 2500);
                            }
                        }
                        set_trigger_variables();
                    }
                }

                function time_interval_function() {
                    if(timeIntervalStatus) {
                        for (var i = 0; i < chaty_settings.chaty_widgets.length; i++) {
                            if (chaty_settings.chaty_widgets[i]['time_trigger'] == "yes" && chaty_settings.widget_status[i]['is_displayed'] == 0) {
                                var timeToDisplay = parseInt(chaty_settings.chaty_widgets[i]['trigger_time'])*1000;
                                if(timeToDisplay <= maxTimeInterval) {
                                    jQuery("#chaty-widget-" + i).removeClass("hide-widget");
                                    trigget_widget_displayed_status(i);
                                    var widgetIndex = chaty_settings.chaty_widgets[i].widget_index;
                                    save_chaty_settings("cs" + widgetIndex);
                                    chaty_settings.widget_status[i]['is_displayed'] = 1;
                                    chaty_settings.chaty_widgets[i]['time_trigger'] = "no";
                                }
                            }
                        }
                        set_trigger_variables();
                        maxTimeInterval = maxTimeInterval+100;
                        if(timeIntervalStatus) {
                            setTimeout(function(){
                                time_interval_function();
                            }, 100);
                        }
                    }
                }

                function page_scroll_functions() {
                    jQuery(window).scroll(function () {
                        if(pageScrollStatus) {
                            var scrollHeight = jQuery(document).height() - jQuery(window).height();
                            var scrollPos = jQuery(window).scrollTop();
                            if (scrollPos != 0) {
                                var scrollPer = ((scrollPos / scrollHeight) * 100);
                                for (var i = 0; i < chaty_settings.chaty_widgets.length; i++) {
                                    if (chaty_settings.chaty_widgets[i]['on_page_scroll'] == "yes" && chaty_settings.widget_status[i]['is_displayed'] == 0) {
                                        var widgetScroll = parseInt(chaty_settings.chaty_widgets[i]['page_scroll']);
                                        if (scrollPer >= widgetScroll) {
                                            jQuery("#chaty-widget-" + i).removeClass("hide-widget");
                                            trigget_widget_displayed_status(i);
                                            var widgetIndex = chaty_settings.chaty_widgets[i].widget_index;
                                            save_chaty_settings("cs" + widgetIndex);
                                            chaty_settings.widget_status[i]['is_displayed'] = 1;
                                            chaty_settings.chaty_widgets[i]['on_page_scroll'] = "no";
                                        }
                                    }
                                }
                                set_trigger_variables();
                            }
                        }
                    });
                }

                function clear_trigger_variables() {
                    pageScrollStatus = false;
                    timeIntervalStatus = false;
                    exitIntentStatus = false;
                }

                function set_trigger_variables() {
                    clear_trigger_variables();

                    jQuery(".chaty-widget").each(function() {
                        var thisIndex = jQuery(this).attr("data-index");
                        if(chaty_settings.widget_status[thisIndex]['on_page_status'] == 1 && chaty_settings.widget_status[thisIndex]['is_displayed'] == 0) {

                            /* checking for time trigger */
                            if (chaty_settings.chaty_widgets[thisIndex]['time_trigger'] == "yes") {
                                if (parseInt(chaty_settings.chaty_widgets[thisIndex]['trigger_time']) > 0) {
                                    timeIntervalStatus = true;
                                } else {
                                    chaty_settings.chaty_widgets[thisIndex]['time_trigger'] == "no";
                                }
                            }

                            /* checking for page scroll trigger */
                            if (chaty_settings.chaty_widgets[thisIndex]['on_page_scroll'] == "yes") {
                                if (parseInt(chaty_settings.chaty_widgets[thisIndex]['page_scroll']) > 0) {
                                    pageScrollStatus = true;
                                } else {
                                    chaty_settings.chaty_widgets[thisIndex]['on_page_scroll'] == "no";
                                }
                            }

                            /* checking for page scroll trigger */
                            if (chaty_settings.chaty_widgets[thisIndex]['exit_intent'] == "yes") {
                                exitIntentStatus = true;
                            }
                        }
                    });
                }

                function set_chaty_widget_size() {
                    if(jQuery(".chaty-channels").length) {
                        jQuery(".chaty-channels").each(function(){
                            var thisIndex = parseInt(jQuery(this).attr("data-index"));
                            var widgetSize = parseInt(chaty_settings.chaty_widgets[thisIndex]['widget_size']);
                            var totalWidget = parseInt(jQuery(this).find(".chaty-widget-i.is-in-desktop").length);
                            if (!jQuery("body").hasClass("chaty-in-desktop")) {
                                totalWidget = parseInt(jQuery(this).find(".chaty-widget-i.is-in-mobile").length);
                            }
                            jQuery(this).find(".chaty-widget-i").css({
                                height: widgetSize+"px",
                                width: widgetSize+"px"
                            }).find("img").css({
                                height: widgetSize+"px",
                                width: widgetSize+"px"
                            }).find("span:not(.cht-pending-message)").css({
                                height: widgetSize+"px",
                                width: widgetSize+"px"
                            });
                            jQuery("#chaty-widget-"+thisIndex+" .chaty-widget-i, #chaty-widget-"+thisIndex+" .i-trigger .i-trigger-open, #chaty-widget-"+thisIndex+" .i-trigger .i-trigger-close, #chaty-widget-"+thisIndex+" .i-trigger .animation-svg, #chaty-widget-"+thisIndex+" .i-trigger .animation-svg img").css({
                                height: widgetSize+"px",
                                width: widgetSize+"px"
                            });
                            jQuery(this).css({top: "-" + 100 * totalWidget + "%"});

                            if (chaty_settings.chaty_widgets[thisIndex].mode == "horizontal") {
                                jQuery(this).css({top: "0"});
                                jQuery(this).width(totalWidget * (parseInt(widgetSize) + 8));
                                jQuery(this).height(parseInt(widgetSize) + 8);
                            } else {
                                jQuery(this).height(totalWidget * (parseInt(widgetSize) + 8));
                                jQuery(this).width(parseInt(widgetSize) + 8);
                            }
                        });
                    }
                    // if()
                }

                function check_for_time(index) {
                    var displayStatus = 0;
                    if (parseInt(chaty_settings.chaty_widgets[index].display_conditions) == 1) {
                        var displayRules = chaty_settings.chaty_widgets[index].display_rules;
                        if (displayRules.length > 0) {
                            var localDate = new Date();
                            localDate.setHours(localDate.getHours() + parseFloat(chaty_settings.chaty_widgets[index].gmt));
                            var utcHours = localDate.getUTCHours();
                            var utcMin = localDate.getUTCMinutes();
                            var utcDay = localDate.getUTCDay();
                            for (var rule = 0; rule < displayRules.length; rule++) {
                                var hourStatus = 0;
                                var minStatus = 0;
                                var checkForTime = 0;
                                if (displayRules[rule].days == -1) {
                                    checkForTime = 1;
                                } else if (displayRules[rule].days >= 0 && displayRules[rule].days <= 6) {
                                    if (displayRules[rule].days == utcDay) {
                                        checkForTime = 1;
                                    }
                                } else if (displayRules[rule].days == 7) {
                                    if (utcDay >= 0 && utcDay <= 4) {
                                        checkForTime = 1;
                                    }
                                } else if (displayRules[rule].days == 8) {
                                    if (utcDay >= 1 && utcDay <= 5) {
                                        checkForTime = 1;
                                    }
                                } else if (displayRules[rule].days == 9) {
                                    if (utcDay == 5 || utcDay == 6) {
                                        checkForTime = 1;
                                    }
                                }
                                if (checkForTime == 1) {
                                    if (utcHours > displayRules[rule].start_hours && utcHours < displayRules[rule].end_hours) {
                                        hourStatus = 1;
                                    } else if (utcHours == displayRules[rule].start_hours && utcHours < displayRules[rule].end_hours) {
                                        if (utcMin >= displayRules[rule].start_min) {
                                            hourStatus = 1;
                                        }
                                    } else if (utcHours > displayRules[rule].start_hours && utcHours == displayRules[rule].end_hours) {
                                        if (utcMin <= displayRules[rule].end_min) {
                                            hourStatus = 1;
                                        }
                                    } else if (utcHours == displayRules[rule].start_hours && utcHours == displayRules[rule].end_hours) {
                                        if (utcMin >= displayRules[rule].start_min && utcMin <= displayRules[rule].end_min) {
                                            hourStatus = 1;
                                        }
                                    }

                                    if (hourStatus == 1) {
                                        if (utcMin >= displayRules[rule].start_min && utcMin <= displayRules[rule].end_min) {
                                            minStatus = 1;
                                        }
                                    }
                                }

                                if (hourStatus == 1 && checkForTime == 1) {
                                    displayStatus = 1;
                                }
                                if (displayStatus == 1) {
                                    rule = displayRules.length + 1;
                                }
                            }
                        } else {
                            displayStatus = 1;
                        }
                    } else {
                        displayStatus = 1;
                    }
                    return displayStatus;
                }

                function set_chaty_widget(widgetIndex) {
                    "" != i("display_cta"), token = "", jQuery(document).ready(function () {
                        "true" == chaty_settings.chaty_widgets[widgetIndex].active && (function (e, n) {
                            var o = chaty_settings.chaty_widgets[widgetIndex].device, a = "";

                            if ("right" == chaty_settings.chaty_widgets[widgetIndex].position) a = "left: auto;bottom: 25px; right: 25px;"; else if ("left" == chaty_settings.chaty_widgets[widgetIndex].position) a = "right: auto; bottom: 25px; left: 25px;"; else if ("custom" == chaty_settings.chaty_widgets[widgetIndex].position) {
                                var c = chaty_settings.chaty_widgets[widgetIndex].pos_side, s = chaty_settings.chaty_widgets[widgetIndex].bot, r = chaty_settings.chaty_widgets[widgetIndex].side;
                                a = "right" === c ? "left: auto; bottom: " + s + "px; right: " + r + "px" : "left: " + r + "px; bottom: " + s + "px; right: auto"
                            }
                            var g = chaty_settings.chaty_widgets[widgetIndex].cta, d = "", l = chaty_settings.chaty_widgets[widgetIndex].social;
                            if(chaty_settings.chaty_widgets[widgetIndex].custom_css != "") {
                                jQuery("head").append("<style>"+chaty_settings.chaty_widgets[widgetIndex].custom_css+"</style>");
                            }

                            if (Object.keys(l).length >= 1 && (d = '<div data-number="'+chaty_settings.chaty_widgets[widgetIndex].widget_index+'" data-index="'+widgetIndex+'" id="chaty-widget-'+widgetIndex+'" class="chaty-widget chaty-widget-css'+chaty_settings.chaty_widgets[widgetIndex].widget_index+' hide-widget ' + n + " " + o + ' "   style="display:block; ' + a + '" dir="ltr">', d += '<div data-index="'+widgetIndex+'" id="chaty-channel-box-'+widgetIndex+'" class="chaty-widget-is chaty-channels" id="transition_disabled">'), d += function (e) {
                                var i = "", n = 0;
                                return t.each(chaty_settings.chaty_widgets[widgetIndex].social, function (t, o) {
                                    if (chaty_settings.chaty_widgets[widgetIndex].isPRO && jQuery("body").addClass("has-pro-version"), !chaty_settings.chaty_widgets[widgetIndex].isPRO && "3" == ++n) return !1;
                                    extra_class = "", "1" != chaty_settings.chaty_widgets[widgetIndex].analytics && 1 != chaty_settings.chaty_widgets[widgetIndex].analytics || (extra_class += " update-analytics ");
                                    var desktopClass = (chaty_settings.chaty_widgets[widgetIndex].social[t].is_desktop == 1) ? "is-in-desktop" : "";
                                    var mobileClass = (chaty_settings.chaty_widgets[widgetIndex].social[t].is_mobile == 1) ? "is-in-mobile" : "";
                                    var targetAction = (chaty_settings.chaty_widgets[widgetIndex].is_mobile == 1) ? chaty_settings.chaty_widgets[widgetIndex].social[t].mobile_target : chaty_settings.chaty_widgets[widgetIndex].social[t].desktop_target;
                                    if (jQuery("body").hasClass("chaty-in-mobile")) {
                                        chaty_settings.chaty_widgets[widgetIndex].social[t].href_url = chaty_settings.chaty_widgets[widgetIndex].social[t].mobile_url;
                                    }
                                    var onclick_settings = "";
                                    if(chaty_settings.chaty_widgets[widgetIndex].social[t].on_click != "") {
                                        onclick_settings = ' onclick="'+chaty_settings.chaty_widgets[widgetIndex].social[t].on_click+'"';
                                    }
                                    if (chaty_settings.chaty_widgets[widgetIndex].social[t].channel_type == "viber") {
                                        if (jQuery("body").hasClass("chaty-in-mobile")) {
                                            var viberVal = chaty_settings.chaty_widgets[widgetIndex].social[t].href_url;
                                            if(!isNaN(viberVal)) {
                                                viberVal = viberVal.replace("+", "");
                                                if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                                                    viberVal = "+" + viberVal;
                                                }
                                                chaty_settings.chaty_widgets[widgetIndex].social[t].href_url = viberVal;
                                            }
                                        }
                                        chaty_settings.chaty_widgets[widgetIndex].social[t].href_url = "viber://chat?number=" + chaty_settings.chaty_widgets[widgetIndex].social[t].href_url;
                                    }
                                    extra_class += " "+chaty_settings.chaty_widgets[widgetIndex].social[t].channel_type+"-action-btn ";
                                    extra_class += " "+chaty_settings.chaty_widgets[widgetIndex].social[t].social_channel+"-"+widgetIndex+"-channel ";
                                    if(parseInt(chaty_settings.chaty_widgets[widgetIndex].social[t].has_custom_popup) == 1) {
                                        if(chaty_settings.chaty_widgets[widgetIndex].social[t].channel_type == "whatsapp") {
                                            if(chaty_settings.chaty_widgets[widgetIndex].social[t].is_default_open) {
                                                if(is_chaty_settings_expired("cht_whatsapp_window"+chaty_settings.chaty_widgets[widgetIndex].widget_index)) {
                                                    extra_class += " open-it-by-default";
                                                }
                                            }
                                            targetAction = "";
                                            chaty_settings.chaty_widgets[widgetIndex].social[t].mobile_target = "";
                                            chaty_settings.chaty_widgets[widgetIndex].social[t].desktop_target = "";
                                            extra_class += " has-custom-chaty-popup whatsapp-button";
                                        } else if(chaty_settings.chaty_widgets[widgetIndex].social[t].channel_type == "contact_us") {
                                            extra_class += " has-custom-chaty-popup whatsapp-button";
                                        }
                                    }
                                    socialString = '<div id="'+chaty_settings.chaty_widgets[widgetIndex].social[t].channel_id+'" data-popup="'+chaty_settings.chaty_widgets[widgetIndex].social[t].popup_html+'" data-rgb="'+chaty_settings.chaty_widgets[widgetIndex].social[t].rbg_color+'" class="chaty-widget-i chaty-main-widget ' + desktopClass + " " + mobileClass + " " + extra_class + " channel-" + chaty_settings.chaty_widgets[widgetIndex].social[t].social_channel + '" data-title="' + chaty_settings.chaty_widgets[widgetIndex].social[t].val + '" data-nonce="' + chaty_settings.chaty_widgets[widgetIndex].social[t].channel_nonce + '" id="chaty-channel-' + chaty_settings.chaty_widgets[widgetIndex].social[t].social_channel + '" data-channel="' + chaty_settings.chaty_widgets[widgetIndex].social[t].social_channel + '" data-code="' + chaty_settings.chaty_widgets[widgetIndex].social[t].qr_code_image + '">', bgColor = "", "" != chaty_settings.chaty_widgets[widgetIndex].social[t].bg_color && (socialString += "<style>."+chaty_settings.chaty_widgets[widgetIndex].social[t].social_channel+"-"+widgetIndex+"-channel .color-element {fill: " + chaty_settings.chaty_widgets[widgetIndex].social[t].bg_color + "; background: " + chaty_settings.chaty_widgets[widgetIndex].social[t].bg_color + "}</style>", bgColor = "style='background-color: " + chaty_settings.chaty_widgets[widgetIndex].social[t].bg_color + ";'"), socialString += "<a class='set-url-target' "+onclick_settings+" rel='noopener' data-mobile-target='" + chaty_settings.chaty_widgets[widgetIndex].social[t].mobile_target + "' data-desktop-target='" + chaty_settings.chaty_widgets[widgetIndex].social[t].desktop_target + "' target='" + targetAction + "' href='" + chaty_settings.chaty_widgets[widgetIndex].social[t].href_url + "' ><span class='sr-only'>"+chaty_settings.chaty_widgets[widgetIndex].social[t].title+"</span>", "" != chaty_settings.chaty_widgets[widgetIndex].social[t].img_url ? socialString += "<span aria-hidden='true' class='chaty-social-img'><img " + bgColor + " src='" + chaty_settings.chaty_widgets[widgetIndex].social[t].img_url + "' alt='" + chaty_settings.chaty_widgets[widgetIndex].social[t].title + "' /></span>" : socialString += chaty_settings.chaty_widgets[widgetIndex].social[t].default_icon, socialString += "</a>", socialString += "<div class='chaty-widget-i-title'><p>" + chaty_settings.chaty_widgets[widgetIndex].social[t].title + "</p></div>", socialString += "</div>";
                                    i += socialString;
                                }), i
                            }(e), l = chaty_settings.chaty_widgets[widgetIndex].social, Object.keys(l).length >= 1) {
                                d += "</div>", d += '<div data-index="'+widgetIndex+'" id="chaty-trigger-'+widgetIndex+'" class="i-trigger">';
                                var h = i("display_cta");
                                var CU = current_url = window.location.origin;
                                CU = CU.replace("https://", "");
                                CU = CU.replace("http://", "");
                                if ("" != g && "none" != h) var p = "true"; else p = "no-tooltip";
                                d += '<div data-index="'+widgetIndex+'" id="chaty-trigger-button-'+widgetIndex+'" class="chaty-widget-i chaty-close-settings i-trigger-open ' + p + ' ">', d += function (t) {
                                    switch (chaty_settings.chaty_widgets[widgetIndex].widget_type) {
                                        case"chat-image":
                                            if (chaty_settings.chaty_widgets[widgetIndex].widget_img.length > 1) return '<div class="widget-img"><img style="background-color:' + chaty_settings.chaty_widgets[widgetIndex].color + '" src="' + chaty_settings.chaty_widgets[widgetIndex].widget_img + '"/></div>';
                                        case"chat-smile":
                                            return '<svg version="1.1" id="smile" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-496.8 507.1 54 54" style="enable-background:new -496.8 507.1 54 54;" xml:space="preserve"><style type="text/css">.sts1{fill:#FFFFFF;}  .sst2{fill:none;stroke:#808080;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}</style><g><circle cx="-469.8" cy="534.1" r="27" fill="' + chaty_settings.chaty_widgets[widgetIndex].color + '"/></g><path class="sts1" d="M-459.5,523.5H-482c-2.1,0-3.7,1.7-3.7,3.7v13.1c0,2.1,1.7,3.7,3.7,3.7h19.3l5.4,5.4c0.2,0.2,0.4,0.2,0.7,0.2c0.2,0,0.2,0,0.4,0c0.4-0.2,0.6-0.6,0.6-0.9v-21.5C-455.8,525.2-457.5,523.5-459.5,523.5z"/><path class="sst2" d="M-476.5,537.3c2.5,1.1,8.5,2.1,13-2.7"/><path class="sst2" d="M-460.8,534.5c-0.1-1.2-0.8-3.4-3.3-2.8"/></svg>';
                                        case"chat-bubble":
                                            return '<svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-496.9 507.1 54 54" style="enable-background:new -496.9 507.1 54 54;" xml:space="preserve"><style type="text/css">.sts1{fill:#FFFFFF;}</style><g><circle  cx="-469.9" cy="534.1" r="27" fill="' + chaty_settings.chaty_widgets[widgetIndex].color + '"/></g><path class="sts1" d="M-472.6,522.1h5.3c3,0,6,1.2,8.1,3.4c2.1,2.1,3.4,5.1,3.4,8.1c0,6-4.6,11-10.6,11.5v4.4c0,0.4-0.2,0.7-0.5,0.9   c-0.2,0-0.2,0-0.4,0c-0.2,0-0.5-0.2-0.7-0.4l-4.6-5c-3,0-6-1.2-8.1-3.4s-3.4-5.1-3.4-8.1C-484.1,527.2-478.9,522.1-472.6,522.1z   M-462.9,535.3c1.1,0,1.8-0.7,1.8-1.8c0-1.1-0.7-1.8-1.8-1.8c-1.1,0-1.8,0.7-1.8,1.8C-464.6,534.6-463.9,535.3-462.9,535.3z   M-469.9,535.3c1.1,0,1.8-0.7,1.8-1.8c0-1.1-0.7-1.8-1.8-1.8c-1.1,0-1.8,0.7-1.8,1.8C-471.7,534.6-471,535.3-469.9,535.3z   M-477,535.3c1.1,0,1.8-0.7,1.8-1.8c0-1.1-0.7-1.8-1.8-1.8c-1.1,0-1.8,0.7-1.8,1.8C-478.8,534.6-478.1,535.3-477,535.3z"/></svg>';
                                        case"chat-db":
                                            return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-496 507.1 54 54" style="enable-background:new -496 507.1 54 54;" xml:space="preserve"><style type="text/css">.sts1{fill:#FFFFFF;}</style><g><circle  cx="-469" cy="534.1" r="27" fill="' + chaty_settings.chaty_widgets[widgetIndex].color + '"/></g><path class="sts1" d="M-464.6,527.7h-15.6c-1.9,0-3.5,1.6-3.5,3.5v10.4c0,1.9,1.6,3.5,3.5,3.5h12.6l5,5c0.2,0.2,0.3,0.2,0.7,0.2c0.2,0,0.2,0,0.3,0c0.3-0.2,0.5-0.5,0.5-0.9v-18.2C-461.1,529.3-462.7,527.7-464.6,527.7z"/><path class="sts1" d="M-459.4,522.5H-475c-1.9,0-3.5,1.6-3.5,3.5h13.9c2.9,0,5.2,2.3,5.2,5.2v11.6l1.9,1.9c0.2,0.2,0.3,0.2,0.7,0.2c0.2,0,0.2,0,0.3,0c0.3-0.2,0.5-0.5,0.5-0.9v-18C-455.9,524.1-457.5,522.5-459.4,522.5z"/></svg>';
                                        default:
                                            return '<svg version="1.1" id="ch" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-496 507.7 54 54" style="enable-background:new -496 507.7 54 54;" xml:space="preserve"><style type="text/css">.sts1 {fill: #FFFFFF;}.st0{fill: #808080;}</style><g><circle cx="-469" cy="534.7" r="27" fill="' + chaty_settings.chaty_widgets[widgetIndex].color + '"/></g><path class="sts1" d="M-459.9,523.7h-20.3c-1.9,0-3.4,1.5-3.4,3.4v15.3c0,1.9,1.5,3.4,3.4,3.4h11.4l5.9,4.9c0.2,0.2,0.3,0.2,0.5,0.2 h0.3c0.3-0.2,0.5-0.5,0.5-0.8v-4.2h1.7c1.9,0,3.4-1.5,3.4-3.4v-15.3C-456.5,525.2-458,523.7-459.9,523.7z"/><path class="st0" d="M-477.7,530.5h11.9c0.5,0,0.8,0.4,0.8,0.8l0,0c0,0.5-0.4,0.8-0.8,0.8h-11.9c-0.5,0-0.8-0.4-0.8-0.8l0,0C-478.6,530.8-478.2,530.5-477.7,530.5z"/><path class="st0" d="M-477.7,533.5h7.9c0.5,0,0.8,0.4,0.8,0.8l0,0c0,0.5-0.4,0.8-0.8,0.8h-7.9c-0.5,0-0.8-0.4-0.8-0.8l0,0C-478.6,533.9-478.2,533.5-477.7,533.5z"/></svg>'
                                    }

                                }(e), h = i("display_cta"), "" != g && "none" != h && (d += ' <div class="chaty-widget-i-title true"> ', d += g, d += "</div>"), d += "</div>", d += '<div class="chaty-widget-i chaty-close-settings i-trigger-close" data-title="' + chaty_settings.chaty_widgets[widgetIndex].close_text + '" style="background-color:' + chaty_settings.chaty_widgets[widgetIndex].color + '">', "" == chaty_settings.chaty_widgets[widgetIndex].close_img ? (d += '<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">', d += '<ellipse cx="26" cy="26" rx="26" ry="26" fill="' + chaty_settings.chaty_widgets[widgetIndex].color + '"/>', d += '<rect width="27.1433" height="3.89857" rx="1.94928" transform="translate(18.35 15.6599) scale(0.998038 1.00196) rotate(45)" fill="white"/>', d += '<rect width="27.1433" height="3.89857" rx="1.94928" transform="translate(37.5056 18.422) scale(0.998038 1.00196) rotate(135)" fill="white"/>', d += "</svg>") : d += "<span class='chaty-social-img'><img alt='" + chaty_settings.chaty_widgets[widgetIndex].close_text + "' src='" + chaty_settings.chaty_widgets[widgetIndex].close_img + "' /></span>", d += '<div class="chaty-widget-i-title">', d += chaty_settings.chaty_widgets[widgetIndex].close_text, d += "</div>", d += "</div>", d += " </div>", 0 === n.length && !chaty_settings.chaty_widgets[widgetIndex].isPRO && (d += ''), d += "</div>";
                            } else ;
                            t("body").append(d);
                            set_chaty_channels(widgetIndex);
                            load_chaty_functions();
                            set_chaty_widget_size();
                        }(e, token));
                    });

                    currentCountryCount++;
                    setTimeout(function(){
                        check_for_widget_data(currentCountryCount);
                    },10);
                }

                function set_cta_status(widget_index) {
                    jQuery("#chaty-widget-"+widget_index+" .cht-pending-message").remove();
                    var widgetIndex = chaty_settings.chaty_widgets[widget_index].widget_index;
                    var cookieStr = "cta"+widgetIndex;
                    var cookieString = get_chaty_cookie("chaty_settings");
                    var cookieArray = [];
                    if(cookieString != null && cookieString != "") {
                        cookieArray = JSON.parse(cookieString);
                    }
                    var cookieFound = false;
                    if(cookieArray.length > 0) {
                        for(var i=0; i<cookieArray.length; i++) {
                            if(cookieArray[i]['k'] == cookieStr) {
                                cookieFound = true;
                                cookieArray[i]['v'] = new Date();
                            }
                        }
                    }
                    if(!cookieFound) {
                        cookieArray.push({"k": cookieStr, "v": new Date()});
                    }
                    cookieString = JSON.stringify(cookieArray);
                    set_chaty_cookie("chaty_settings", cookieString, "7");
                }

                function set_chaty_cookie(name,value,days) {
                    var expires = "";
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                        expires = "; expires=" + date.toUTCString();
                    }
                    document.cookie = name + "=" + (value || "") + expires + "; path=/";
                }

                function get_chaty_cookie(name) {
                    var nameEQ = name + "=";
                    var ca = document.cookie.split(';');
                    for(var i=0;i < ca.length;i++) {
                        var c = ca[i];
                        while (c.charAt(0)==' ') c = c.substring(1,c.length);
                        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                    }
                    return null;
                }

                function check_for_chaty_cookie_string(cookieStr) {
                    var cookieString = get_chaty_cookie("chaty_status_string");
                    var cookieArray = [];
                    if(cookieString != null && cookieString != "") {
                        cookieArray = JSON.parse(cookieString);
                    }
                    if(cookieArray.length > 0) {
                        for(var i=0; i<cookieArray.length; i++) {
                            if(cookieArray[i]['k'] == cookieStr) {
                                return cookieArray[i]['v'];
                            }
                        }
                    }
                    return null;
                }

                function save_chaty_cookie_string(cookieStr) {
                    var cookieString = get_chaty_cookie("chaty_status_string");
                    var cookieArray = [];
                    if(cookieString != null && cookieString != "") {
                        cookieArray = JSON.parse(cookieString);
                    }
                    var cookieFound = false;
                    if(cookieArray.length > 0) {
                        for(var i=0; i<cookieArray.length; i++) {
                            if(cookieArray[i]['k'] == cookieStr) {
                                cookieFound = true;
                                cookieArray[i]['v'] = new Date();
                            }
                        }
                    }
                    if(!cookieFound) {
                        cookieArray.push({"k": cookieStr, "v": new Date()});
                    }
                    cookieString = JSON.stringify(cookieArray);
                    set_chaty_cookie("chaty_status_string", cookieString, "7");
                }

                function check_chaty_cookie_expired(cookieStr) {
                    var cookieValue = check_for_chaty_cookie_string(cookieStr);
                    if(cookieValue != null && cookieValue != "") {
                        cookieValue = new Date(cookieValue);
                        var diffTime = Math.abs(new Date() - cookieValue);
                        var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        if(diffDays >= 2) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return true;
                }

                function trigget_widget_displayed_status(widget_index) {
                    if(!isBoatUser) {
                        var widgetIndex = chaty_settings.chaty_widgets[widget_index].widget_index;
                        var widgetNonce = chaty_settings.chaty_widgets[widget_index].widget_nonce;
                        var isExpired = check_chaty_cookie_expired("cwds"+widgetIndex);
                        if (isExpired) {
                            save_chaty_cookie_string("cwds"+widgetIndex);
                            var socialChannels = "";
                            if (jQuery("#chaty-widget-" + widgetIndex).hasClass("single_widget")) {
                                if (jQuery("#chaty-widget-" + widget_index + " .i-trigger.one-widget > .chaty-main-widget").length) {
                                    var channelKey = "cwds" + widgetIndex + "_" + jQuery("#chaty-widget-" + widget_index + " .i-trigger.one-widget > .chaty-main-widget").attr("data-channel");
                                    if (check_chaty_cookie_expired(channelKey)) {
                                        socialChannels = jQuery("#chaty-widget-" + widget_index + " .i-trigger.one-widget > .chaty-main-widget").attr("data-channel");
                                        save_chaty_cookie_string(channelKey);
                                    }
                                }
                            } else {
                                jQuery("#chaty-widget-" + widget_index + " .chaty-channels").find(".chaty-main-widget").each(function () {
                                    var channelKey = "cwds" + widgetIndex + "_" + jQuery(this).attr("data-channel");
                                    if(check_chaty_cookie_expired(channelKey)) {
                                        socialChannels += jQuery(this).attr("data-channel") + ",";
                                        save_chaty_cookie_string(channelKey);
                                    }
                                });
                            }
                            jQuery.ajax({
                                url: chaty_settings.ajax_url,
                                data: "index=" + widgetIndex + "&nonce=" + widgetNonce + "&is_widget=1&channel=&type=view&action=update_chaty_channel_status&channels=" + socialChannels,
                                type: 'post',
                                async: true,
                                defer: true,
                                success: function () {

                                }
                            });
                        } else {
                            var socialChannels = "";
                            if (jQuery("#chaty-widget-" + widget_index).hasClass("single_widget")) {
                                if (jQuery("#chaty-widget-" + widget_index + " .i-trigger.one-widget > .chaty-main-widget").length) {
                                    var channelKey = "cwds" + widgetIndex + "_" + jQuery("#chaty-widget-" + widget_index + " .i-trigger.one-widget > .chaty-main-widget").attr("data-channel");
                                    if (check_chaty_cookie_expired(channelKey)) {
                                        socialChannels = jQuery("#chaty-widget-" + widget_index + " .i-trigger.one-widget > .chaty-main-widget").attr("data-channel");
                                        save_chaty_cookie_string(channelKey);
                                    }
                                }
                            } else {
                                jQuery("#chaty-widget-" + widget_index + " .chaty-channels").find(".chaty-main-widget").each(function () {
                                    channelKey = "cwds" + widgetIndex + "_" + jQuery(this).attr("data-channel");
                                    if (check_chaty_cookie_expired(channelKey)) {
                                        socialChannels += jQuery(this).attr("data-channel") + ",";
                                        save_chaty_cookie_string("cwds" + widgetIndex + "_" + jQuery(this).attr("data-channel"))
                                    }
                                });
                            }
                            if(socialChannels != "") {
                                jQuery.ajax({
                                    url: chaty_settings.ajax_url,
                                    data: "index=" + widgetIndex + "&nonce=" + widgetNonce + "&is_widget=1&channel=&type=view&action=update_chaty_channel_view&channels=" + socialChannels+"&for=channels",
                                    type: 'post',
                                    async: true,
                                    defer: true,
                                    success: function () {

                                    }
                                });
                            }

                        }
                    }
                }
            }(jQuery);
        }, 12: function (t, e) {

        }
    });
});

function launch_chaty(widget_number) {
    if(widget_number == undefined || widget_number == "widget_index") {
        widget_number = 1;
    }
    widget_number = parseInt(widget_number);
    var selected_widget = -1;
    if(chaty_settings.chaty_widgets.length > 0) {
        for(var i=0; i<chaty_settings.chaty_widgets.length; i++) {
            var widget_index = chaty_settings.chaty_widgets[i]['widget_index'];
            if(widget_index == "") {
                widget_index = 0;
            } else {
                widget_index = parseInt(widget_index.replace("_", ""));
            }
            widget_index = widget_index+1;
            if(widget_index == widget_number) {
                selected_widget = i;
            }
        }
    }
    if(selected_widget != -1 && selected_widget > -1) {
        if(jQuery("#chaty-widget-"+selected_widget).length) {
            jQuery("#chaty-widget-"+selected_widget).removeClass("hide-widget");
            //trigget_widget_displayed_status(selected_widget);
            jQuery("#chaty-widget-"+selected_widget+" .i-trigger .i-trigger-open").trigger("click");
        }
    } else {
        console.log("widget not exists on this page");
    }
}

function close_chaty() {
    if(jQuery("#chaty-inline-popup").hasClass("active")) {
        jQuery("#chaty-inline-popup .close-chaty-popup").trigger("click");
    }
    if(jQuery(".chaty-widget.chaty-widget-show").length) {
        jQuery(".chaty-widget.chaty-widget-show").each(function(){
            if(jQuery(this).find(".chaty-close-settings").length) {
                jQuery(this).find(".chaty-close-settings").trigger("click");
            }
        });
    }
}