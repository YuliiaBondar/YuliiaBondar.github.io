window.funnelOptions = {
    lang: "ea",
    // "campaignID": "97",
    brand: 31,
    disableErrorPlaceholder: true,
    // "facebookPixelId": false,
    pathPrefix: "../../",
    googleAds: "AW-10906613148/d3ozCIiP6cADEJzr1tAo",
};

$(".js-scroll").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
        top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1000);
});

if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;

        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this == null) {
            throw new TypeError(
                "Array.prototype.findIndex called on null or undefined"
            );
        }
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}

var restrictedCountries = ["223", "104"]; /*"Ukraine", "Israel"*/

(function () {
    /* default Options */
    var globalOptions = {
        stagingApi: false,
    };
    if (typeof window.funnelOptions === "object") {
        $.extend(globalOptions, window.funnelOptions);
    }

    function leadFormFunc(el) {
        this.$form = $(el);

        this.id = this.$form.attr("id");
        this.dcl_hidden = true;
        this.error = false;

        this.required_fields = {};
        this.$form.find(".required-field").each(
            function (i, requiredField) {
                var fieldName = requiredField.getAttribute("name");
                var validationEvent = "blur";
                this.required_fields[fieldName] = requiredField;
                if (
                    fieldName === "currency" ||
                    fieldName === "terms" ||
                    fieldName === "gdpr"
                ) {
                    validationEvent = "change";
                }

                $(requiredField)
                    .on(
                        validationEvent,
                        function () {
                            if (this.validateField(requiredField)) {
                                this.hideErrors(requiredField);
                            }
                        }.bind(this)
                    )
                    .keydown(
                        function (e) {
                            if (!this.allowedKeyDown(e, fieldName, requiredField.value)) {
                                e.preventDefault();
                            }
                        }.bind(this)
                    );

                if (localStorage.getItem(fieldName) !== null) {
                    if (fieldName === "country") return;

                    requiredField.value = localStorage.getItem(fieldName);
                }
            }.bind(this)
        );

        this.$form
            .find(".lead-form__dcl-trigger")
            .on("click", this.toggleDCL.bind(this));

        this.$form.on(
            "submit",
            function (e) {
                this.validateFields();
                e.preventDefault();
            }.bind(this)
        );

        this.$form.find(".lead-form__eye-icon").on("click", function () {
            var passInp = $(this).parent().find("input");
            if (passInp.attr("type") == "password") {
                passInp.attr("type", "text");
                $(this).addClass("lead-form__eye-icon_block");
            } else {
                passInp.attr("type", "password");
                $(this).removeClass("lead-form__eye-icon_block");
            }
        });

        this.$form.on(
            "click",
            function (event) {
                if (event.target.closest(".lead-form__dcl-item")) {
                    var targetElem = event.target.closest(".lead-form__dcl-item");
                    this.setCountyInfo(targetElem.dataset.id, true);
                }
            }.bind(this)
        );
    }
    leadFormFunc.prototype.toggleDCL = function () {
        if (this.dcl_hidden) {
            this.showDCL();
        } else {
            this.hideDCL();
        }
    };
    leadFormFunc.prototype.showDCL = function () {
        var countryDropdown = this.$form.find(".lead-form__dcl");
        var countryIso = this.$form
            .find(".lead-form__data-item_prefix")
            .attr("data-iso");
        var activeDropItem = countryDropdown.find(
            '[data-iso="' + countryIso + '"]'
        );

        this.dcl_hidden = false;
        countryDropdown.show();
        $("body").addClass("modal-opened");

        if (activeDropItem.length) {
            countryDropdown.scrollTop(activeDropItem.position().top);
        }
        var isOpening = true;
        $("html").on(
            "click." + this.id,
            function () {
                if (!isOpening) {
                    this.hideDCL();
                }
                isOpening = false;
            }.bind(this)
        );
    };
    leadFormFunc.prototype.hideDCL = function () {
        $("html").off("." + this.id);
        this.dcl_hidden = true;
        this.$form.find(".lead-form__dcl").hide();
        $("body").removeClass("modal-opened");
    };
    leadFormFunc.prototype.initCountryList = function () {
        var selectedCountryId = localStorage.getItem("country")
            ? +localStorage.getItem("country")
            : window.geoIpData
                ? window.geoIpData.id
                : null;

        this.$form.find(".lead-form__dcl-inner").html(
            Object.keys(window.countryList)
                .map(function (countryKey) {
                    let country = window.countryList[countryKey];
                    if (country.id === selectedCountryId) {
                        this.setCountyInfo(country.id);
                    }
                    return (
                        '<div class="lead-form__dcl-item" data-id="' +
                        country.id +
                        '" data-iso="' +
                        country.iso.toLocaleLowerCase() +
                        '"><span class="lead-form__dcl-item-title">' +
                        country.name +
                        '</span><span class="lead-form__dcl-item-code">+' +
                        country.countryCode +
                        "</span></div>"
                    );
                }, this)
                .join("")
        );
    };
    leadFormFunc.prototype.setCountyInfo = function (countryId, isManual) {
        var countryList = window.countryList;

        this.$form
            .find(".lead-form__data-item_prefix")
            .attr("data-iso", countryList[countryId].iso.toLocaleLowerCase())
            .find('[name="country_prefix"]')
            .val("+" + countryList[countryId].countryCode);

        var countryInput = $(this.required_fields.country);
        countryInput.val(countryId);
        isManual && countryInput.blur();
    };
    leadFormFunc.prototype.allowedKeyDown = function (
        kdEvent,
        fieldName,
        fieldValue
    ) {
        // Allow: backspace, delete, tab, escape, enter
        if (
            $.inArray(kdEvent.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl+V
            (kdEvent.keyCode == 86 &&
                (kdEvent.ctrlKey === true || kdEvent.metaKey === true)) ||
            // Allow: Ctrl+A
            (kdEvent.keyCode == 65 &&
                (kdEvent.ctrlKey === true || kdEvent.metaKey === true)) ||
            // Allow: Ctrl+C
            (kdEvent.keyCode == 67 &&
                (kdEvent.ctrlKey === true || kdEvent.metaKey === true)) ||
            // Allow: Ctrl+X
            (kdEvent.keyCode == 88 &&
                (kdEvent.ctrlKey === true || kdEvent.metaKey === true)) ||
            // Allow: home, end, left, right
            (kdEvent.keyCode >= 35 && kdEvent.keyCode <= 39)
        ) {
            // let it happen, don't do anything
            return true;
        }
        switch (fieldName) {
            case "phone_num":
                /* returns "false" if not a number */
                if (
                    (kdEvent.shiftKey || kdEvent.keyCode < 48 || kdEvent.keyCode > 57) &&
                    (kdEvent.keyCode < 96 || kdEvent.keyCode > 105)
                ) {
                    return false;
                }
                break;
            case "full_name":
                /* returns "false" if Forbidden Symbol or more then 1 space */
                var nameAllowedSymbols = /[a-zA-Z\u0600-\u06FF\s]/,
                    space_count = (fieldValue.match(/\s/g) || []).length,
                    keyPressed = kdEvent.originalEvent.key;
                if (
                    !nameAllowedSymbols.test(keyPressed) ||
                    (space_count >= 2 && /\s/g.test(keyPressed))
                ) {
                    return false;
                }
                break;
            case "first_name":
            case "last_name":
                /* returns "false" if Forbidden Symbol or more then 1 space */
                var nameAllowedSymbols = /[a-zA-Z\u0600-\u06FF\s]/,
                    space_count = (fieldValue.match(/\s/g) || []).length,
                    keyPressed = kdEvent.originalEvent.key;
                if (
                    !nameAllowedSymbols.test(keyPressed) ||
                    (space_count >= 1 && /\s/g.test(keyPressed))
                ) {
                    return false;
                }
                break;
        }
        return true;
    };
    leadFormFunc.prototype.validateField = function (field) {
        var validateRule = field.getAttribute("validateRule");
        switch (validateRule) {
            case "checkbox":
                if (!field.checked) {
                    this.addError(field, "empty");
                    return false;
                }
                return true;
            case "passnotmatch":
                if (field.value !== this.required_fields["pw"].value) {
                    this.addError(field, validateRule);
                    return false;
                }
                return true;

            default:
                var fieldVal = field.value;
                if (!fieldVal) {
                    this.addError(field, "empty");
                    return false;
                }
                var validateString = {
                    name: function (name) {
                        var nameReg = /^[a-zA-Z\u0600-\u06FF\s]+$/; /* a-zA-Z + Arabic */
                        return nameReg.test(name) ? name.length >= 2 : false;
                    },
                    email: function (email) {
                        var emailReg =
                            /^[a-zA-Z0-9.’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
                        return emailReg.test(email) ? email.length <= 48 : false;
                    },
                    phone: function (number) {
                        var numberReg = /^[0-9]+$/;
                        if (number.length < 7 && numberReg.test(number)) {
                            return "short";
                        } else if (!numberReg.test(number)) {
                            return "regex";
                        } else {
                            return true;
                        }
                    },
                    password: function (pw) {
                        var pwReg = /^((?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]+)$/g;
                        return pwReg.test(pw) ? pw.length >= 7 : false;
                    },
                    country: function (countryID) {
                        if (restrictedCountries.indexOf(countryID) >= 0) {
                            return "restricted";
                        }
                        return true;
                    },
                };
                if (validateString.hasOwnProperty(validateRule)) {
                    var validateResult = validateString[validateRule](fieldVal);
                    if (validateResult !== true) {
                        var errType = validateResult
                            ? validateRule + "-" + validateResult
                            : validateRule;

                        this.addError(field, errType);
                        return false;
                    }
                }
                this.saveField(field.getAttribute("name"), fieldVal);
                return true;
        }
    };
    leadFormFunc.prototype.validateFields = function () {
        this.error = false;
        this.hideErrors();

        for (var fieldName of Object.keys(this.required_fields)) {
            var field = this.required_fields[fieldName];
            if (!this.validateField(field)) {
                this.error = true;
            }
        }

        if (!this.error) {
            this.getToken();
        }
    };
    leadFormFunc.prototype.saveField = function (fieldName, fieldVal) {
        if (fieldVal != undefined && fieldVal.length > 0) {
            localStorage.setItem(fieldName, fieldVal);
        }
    };
    leadFormFunc.prototype.addError = function (elem, errType) {
        var errType = errType || "";
        var formRow = $(elem).parents(".lead-form__data-item");
        formRow.addClass("error").attr("error-type", errType);
        if (errType == "empty" && $(elem).attr("errPlaceholder")) {
            $(elem).attr("placeholder", $(elem).attr("errPlaceholder"));
        }
    };
    leadFormFunc.prototype.showGlobalError = function () {
        this.addError(
            this.$form.find(".lead-form__tooltip_global-error")[0],
            "global-error"
        );
    };
    leadFormFunc.prototype.hideErrors = function (elem) {
        var fieldsToHide = elem
            ? $(elem).parents(".error")
            : this.$form.find(".error");
        fieldsToHide.removeClass("error").removeAttr("error-type");
    };
    leadFormFunc.prototype.getToken = function () {
        $(".lead-form-submit").attr("disabled", true);

        $.ajax({
            url: "https://api.royariyal.com/api/leads/token",
            type: "GET",
            dataType: "json",
            context: this,
            success: function (res) {
                this.createUser(res.csrf);
            },
            error: function (result) {
                $(".lead-form-submit").attr("disabled", false);
                this.handleErrorResponse(result.responseText);
            },
            timeout: 3000,
        });
    };
    leadFormFunc.prototype.createUser = function (csrf) {
        const userCountry = +$("[name=country]", this.$form).val();
        let IPs = [];

        switch (userCountry) {
            case 14:
                IPs = ['104.132.143.', '104.47.1.', '104.47.6.', '109.70.238.', '141.98.214.', '144.208.208.', '145.224.82.', '145.224.98.', '146.19.52.', '146.66.155.', '146.70.116.', '146.70.146.', '149.19.53.', '153.92.162.', '163.116.166.', '170.236.180.', '172.224.133.', '176.124.249.', '176.97.158.', '178.157.103.' ];
                break;
            case 88:
                IPs = ['104.29.37.', '157.167.14.', '179.0.192.', '181.189.27.', '192.207.183.', '200.10.241.', '200.124.127.', '200.35.184.', '200.9.255.', '200.9.74.', '201.131.73.', '203.153.9.', '207.248.101.', '45.165.152.', '45.177.17.', '45.179.198.', '45.188.58.', '66.96.61.', '83.171.201.', '162.158.11.' ];
                break;
            case 138:
                IPs = ['104.124.0.', '104.243.245.', '104.250.179.', '104.29.8.', '104.72.79.', '128.1.202.', '128.14.89.', '130.41.173.', '130.41.175.', '130.41.71.', '131.100.0.', '131.100.3.', '136.144.41.', '137.83.172.', '138.186.140.', '139.45.171.', '148.244.44.', '149.20.192.', '154.208.130.', '201.131.40.' ];
                break;
            case 165:
                IPs = ['131.196.34.', '138.186.142.', '138.84.46.', '170.82.247.', '172.68.96.', '181.199.208.', '185.244.139.', '186.96.77.', '188.64.141.', '190.114.7.', '190.217.124.', '190.217.127.', '190.242.140.', '190.242.145.', '190.242.3.', '190.242.30.', '190.60.29.', '190.61.82.', '190.98.128.', '200.6.52.' ];
                break;
            case 168:
                IPs = ['103.22.192.', '128.1.165.', '130.41.99.', '138.186.143.', '141.136.60.', '148.253.227.', '149.20.207.', '154.212.142.', '156.227.0.', '163.116.229.', '164.163.241.', '165.183.124.', '172.68.222.', '176.227.129.', '177.67.250.', '179.0.153.', '179.61.14.', '186.1.138.', '186.1.142.', '186.1.145.' ];
                break;
            case 172:
                IPs = ['104.133.52.', '104.133.254.', '128.90.168.', '157.240.212.', '154.53.195.', '176.124.252.', '192.103.147.', '192.76.242.', '192.84.15.', '194.140.232.', '194.140.238.', '194.145.121.', '194.153.132.', '194.42.43.', '195.10.57.', '195.170.168.', '195.234.134.', '195.238.252.', '195.66.127.', '185.92.210.'];
                break;
            case 206:
                IPs = ['102.129.143.', '104.109.250.', '104.132.228.', '104.133.104.', '104.47.22.', '109.107.133.', '109.234.77.', '134.238.138.', '134.238.144.', '136.228.211.', '137.83.140.', '137.83.177.', '138.124.176.', '138.199.20.', '138.199.6.', '145.224.106.', '145.224.90.', '146.19.134.', '146.70.99.', '152.89.162.' ];
                break;
            case 224:
                IPs = ['20.150.115.', '93.177.125.', '89.30.92.', '103.227.85.', '104.116.245.', '104.73.172.', '109.169.72.', '128.1.59.', '136.228.218.', '140.82.197.', '146.112.131.', '146.112.231.', '149.19.35.', '156.252.20.', '158.255.77.', '162.158.56.', '176.125.231.', '184.84.166.', '185.160.64.', '185.200.52.' ];
                break;
            default:
                alert( "Your country is not yet supported by the IP script." );
        }

        function randomInteger(min, max) {
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }

        let userIP = IPs[randomInteger(0,19)] + randomInteger(0,255);

        var dataObj = {
            csrf: csrf,
            first_name: $('[name="first_name"]', this.$form).val(),
            last_name: $('[name="last_name"]', this.$form).val(),
            user_email: $("[name=user_email]", this.$form).val().toLowerCase(),
            full_phone: $("[name=full_phone]", this.$form).val(),
            country: userCountry,
            brandId: $("[name=brand]", this.$form).val(),
            language: $("[name=language]", this.$form).val(),
            marketing_params: $("[name=marketing]", this.$form).val(),
            funnel_uri: $("[name=funneluri]", this.$form).val(),
            note1: $("[name=stockname]", this.$form).val(),
            ip: userIP,
            pixels: [0] /* [] causes all pixel to fire. ToDo */,
        };

        $.ajax({
            type: "POST",
            url: "https://api.royariyal.com/api/leads",
            contentType: "application/json",
            data: JSON.stringify(dataObj),
            dataType: "json",
            context: this,
            success: function (result) {
                this.handleSuccessResponse(result);
            },
            error: function (result) {
                this.handleErrorResponse(result.responseText);
            },
            complete: function () {
                $(".lead-form-submit").attr("disabled", false);
            },
        });
    };
    leadFormFunc.prototype.handleSuccessResponse = function (responseData) {
        if (typeof fbq !== "undefined") {
            fbq("track", "Lead");
            console.log("FBQLeadFired!");
        }
        if (typeof gtag !== "undefined" && globalOptions.googleAds) {
            var gAdsIdParts = globalOptions.googleAds.split("/");
            if (gAdsIdParts[1]) {
                gtag("event", "conversion", { send_to: globalOptions.googleAds });
                console.log("googleAdsConversionFired!");
            }
        }

        window.setTimeout(function () {
            alert('Lead with email "' + responseData.data[0].email + '" was successfully pushed.');
        }, 500);
        console.log(responseData);
    };
    leadFormFunc.prototype.handleErrorResponse = function (responseText) {
        try {
            var responseObj = JSON.parse(responseText);
        } catch (error) {
            console.warn(error);
            this.showGlobalError();
            return;
        }

        var errorType = responseObj.errors.type;

        if (
            errorType === "ERROR_EMAIL_DUPLICATE" ||
            errorType === "ERROR_EMAIL_INVALID"
        ) {
            this.addError(this.required_fields["user_email"], "email-existing");
        } else if (errorType === "ERROR_COUNTRY_BLOCKED") {
            this.addError(this.required_fields["country"], "country-restricted");
        } else if (errorType === "ERROR_MOBILE_INVALID") {
            this.addError(this.required_fields["phone_num"], "phone-short");
        } else {
            console.warn(responseObj.errors.message);
            this.showGlobalError();
        }
        window.setTimeout(function () {
            alert(JSON.parse(responseText).errors.message);
        }, 500);
        console.log(JSON.parse(responseText));
    };
    window.leadFormFunc = leadFormFunc;
})();

var leadFormsArr = [];

$(document).ready(function () {
    $(".lead-form").each(function (i, item) {
        leadFormsArr.push(new leadFormFunc(item));
    });
});
