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
                    nonempty: function (nonempty) {
                        return true;
                    },
                    email: function (email) {
                        var emailReg =
                            /^[a-zA-Z0-9.’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
                        return emailReg.test(email) ? email.length <= 48 : false;
                    },
                    fullphone: function (number) {
                        var numberReg = /^[+0-9]+$/;
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
            // Austria
            case 14:
                IPs = ['104.132.143.', '104.47.1.', '104.47.6.', '109.70.238.', '141.98.214.', '144.208.208.', '145.224.82.', '145.224.98.', '146.19.52.', '146.66.155.', '146.70.116.', '146.70.146.', '149.19.53.', '153.92.162.', '163.116.166.', '170.236.180.', '172.224.133.', '176.124.249.', '176.97.158.', '178.157.103.' ];
                break;
            // Bahrain
            case 17:
                IPs = ['13.248.106.', '15.177.87.', '150.222.7.', '161.69.76.', '165.1.166.', '172.71.228.', '193.25.204.', '195.219.152.', '31.217.249.', '45.11.75.', '52.119.249.', '52.95.228.', '99.77.147.', '99.77.236.', '176.118.176.', '193.188.12.', '38.54.2.', '45.11.72.', '87.252.126.', '91.189.188.' ];
                break;
            // Chile
            case 43:
                IPs = ['104.132.186.', '104.133.94.', '104.29.52.', '119.8.159.', '130.41.229.', '130.41.96.', '134.238.158.', '138.255.97.', '138.84.43.', '148.143.127.', '148.253.47.', '149.20.193.', '154.16.208.', '156.245.0.', '159.172.172.', '162.158.225.', '162.158.99.', '163.116.227.', '167.250.196.', '168.194.199.' ];
                break;
            // Costa Rica
            case 52:
                IPs = ['103.225.130.', '128.201.144.', '138.59.19.', '143.202.160.', '154.6.175.', '160.20.246.', '160.223.203.', '162.158.81.', '165.183.123.', '168.197.96.', '170.84.255.', '172.111.170.', '179.0.202.', '179.189.223.', '181.215.230.', '181.41.154.', '185.190.80.', '186.151.94.', '190.112.223.', '190.148.85.' ];
                break;
            // Denmark
            case 58:
                IPs = ['104.133.55.', '104.133.98.', '104.134.149.', '104.95.111.', '134.238.142.', '134.65.172.', '138.124.178.', '141.98.254.', '145.224.110.', '145.224.88.', '145.60.253.', '146.112.11.', '146.112.135.', '146.112.173.', '146.112.213.', '146.112.235.', '146.19.99.', '146.70.42.', '146.70.80.', '146.70.89.' ];
                break;
            // Ecuador
            case 62:
                IPs = ['104.29.31.', '104.29.86.', '170.239.204.', '172.68.176.', '172.68.230.', '172.70.224.', '177.86.142.', '179.0.129.', '179.0.204.', '181.78.29.', '181.78.31.', '186.232.242.', '187.49.8.', '190.103.114.', '190.103.191.', '190.103.191.', '190.123.14.', '45.65.203.', '45.229.87.', '45.228.203.' ];
                break;
            // El Salvador
            case 64:
                IPs = ['103.158.32.', '138.185.29.', '189.84.96.', '190.61.38.', '200.0.180.', '200.11.31.', '200.12.237.', '200.13.180.', '200.30.131.', '200.30.138.', '200.30.179.', '200.33.51.', '201.131.42.', '205.211.243.', '209.124.102.', '45.162.87.', '45.164.207.', '45.174.226.', '45.5.12.', '65.182.10.' ];
                break;
            // Finland
            case 72:
                IPs = ['104.132.215.', '104.134.154.', '104.47.0.', '104.47.13.', '104.47.5.', '104.88.192.', '109.107.129.', '109.107.171.', '13.106.226.', '134.238.42.', '141.98.169.', '146.19.200.', '162.218.92.', '165.1.158.', '168.149.149.', '172.224.104.', '172.94.38.', '172.94.92.', '176.119.199.', '176.97.197.' ];
                break;
            // Germany
            case 80:
                IPs = ['102.128.165.', '102.165.50.', '103.192.163.', '103.230.58.', '103.43.118.', '104.107.210.', '104.115.82.', '104.121.76.', '104.124.11.', '104.132.18.', '104.132.23.', '104.132.242.', '104.132.246.', '104.132.3.', '104.132.39.', '104.132.54.', '104.132.61.', '104.133.135.', '104.133.171.', '104.133.185.' ];
                break;
            // Guatemala
            case 88:
                IPs = ['104.29.37.', '157.167.14.', '179.0.192.', '181.189.27.', '192.207.183.', '200.10.241.', '200.124.127.', '200.35.184.', '200.9.255.', '200.9.74.', '201.131.73.', '203.153.9.', '207.248.101.', '45.165.152.', '45.177.17.', '45.179.198.', '45.188.58.', '66.96.61.', '83.171.201.', '162.158.11.' ];
                break;
            // India
            case 99:
                IPs = ['103.1.6.', '103.10.109.', '103.10.168.', '103.10.222.', '103.10.252.', '103.10.9.', '103.100.106.', '103.100.192.', '103.100.201.', '103.100.245.', '103.101.132.', '103.101.134.', '103.101.172.', '103.101.233.', '103.101.43.', '103.102.147.', '103.102.2.', '103.102.234.', '103.102.244.', '103.102.25.' ];
                break;
            // Ireland
            case 103:
                IPs = ['104.132.169.', '104.132.47.', '104.132.8.', '104.133.143.', '104.133.204.', '104.133.215.', '104.134.155.', '104.134.162.', '104.146.176.', '104.146.225.', '104.146.239.', '104.37.4.', '104.47.10.', '104.47.12.', '104.47.16.', '104.47.2.', '104.47.29.', '104.47.31.', '107.191.68.', '13.104.176.' ];
                break;
            // Italy
            case 105:
                IPs = ['102.129.205.', '102.165.10.', '103.188.231.', '104.132.136.', '104.132.198.', '104.132.244.', '104.133.195.', '104.133.203.', '104.133.216.', '104.133.234.', '104.250.172.', '104.29.45.', '104.37.3.', '104.76.208.', '104.77.185.', '104.85.248.', '109.107.138.', '109.107.152.', '109.230.212.', '13.105.173.' ];
                break;
            // Kuwait
            case 114:
                IPs = ['162.158.194.', '162.158.59.', '171.25.224.', '176.110.119.', '185.1.129.', '185.187.176.', '185.21.183.', '185.230.100.', '193.105.56.', '193.108.30.', '193.109.215.', '193.22.172.', '193.42.223.', '193.56.9.', '194.176.108.', '194.31.57.', '195.114.31.', '195.137.174.', '195.80.227.', '212.6.37.' ];
                break;
            // Malaysia
            case 129:
                IPs = ['103.104.69.', '103.105.138.', '103.106.73.', '103.107.87.', '103.116.47.', '103.117.141.', '103.117.20.', '103.117.81.', '103.118.156.', '103.119.34.', '103.120.136.', '103.122.164.', '103.130.153.', '103.131.143.', '103.135.245.', '103.136.11.', '103.14.184.', '103.140.61.', '103.141.171.', '103.143.219.' ];
                break;
            // Mexico
            case 138:
                IPs = ['104.124.0.', '104.243.245.', '104.250.179.', '104.29.8.', '104.72.79.', '128.1.202.', '128.14.89.', '130.41.173.', '130.41.175.', '130.41.71.', '131.100.0.', '131.100.3.', '136.144.41.', '137.83.172.', '138.186.140.', '139.45.171.', '148.244.44.', '149.20.192.', '154.208.130.', '201.131.40.' ];
                break;
            // Netherlands
            case 150:
                IPs = ['103.158.222.', '103.166.229.', '103.229.81.', '103.248.249.', '103.56.172.', '103.71.56.', '103.76.130.', '104.110.240.', '104.132.179.', '104.132.195.', '104.132.40.', '104.132.50.', '104.133.54.', '104.134.0.', '104.134.165.', '104.134.171.', '104.146.234.', '104.206.249.', '104.225.98.', '104.227.248.' ];
                break;
            // Norway
            case 160:
                IPs = ['104.132.142.', '130.41.185.', '134.90.147.', '138.43.100.', '141.101.146.', '146.19.210.', '146.19.60.', '146.70.103.', '146.70.17.', '147.243.211.', '153.92.172.', '159.253.122.', '17.72.97.', '172.111.196.', '172.224.128.', '172.224.93.', '176.101.170.', '176.116.31.', '185.1.12.', '185.1.174.' ];
                break;
            // Oman
            case 161:
                IPs = ['185.1.191.', '185.182.10.', '185.183.183.', '185.185.125.', '185.69.0.', '193.3.37.', '193.43.68.', '194.156.226.', '194.60.200.', '195.245.85.', '199.48.224.', '206.167.33.', '38.54.116.', '41.63.109.', '46.255.56.', '88.218.201.', '145.14.128.', '157.180.236.', '184.87.208.', '45.13.56.' ];
                break;
            // Panama
            case 165:
                IPs = ['131.196.34.', '138.186.142.', '138.84.46.', '170.82.247.', '172.68.96.', '181.199.208.', '185.244.139.', '186.96.77.', '188.64.141.', '190.114.7.', '190.217.124.', '190.217.127.', '190.242.140.', '190.242.145.', '190.242.3.', '190.242.30.', '190.60.29.', '190.61.82.', '190.98.128.', '200.6.52.' ];
                break;
            // Peru
            case 168:
                IPs = ['103.22.192.', '128.1.165.', '130.41.99.', '138.186.143.', '141.136.60.', '148.253.227.', '149.20.207.', '154.212.142.', '156.227.0.', '163.116.229.', '164.163.241.', '165.183.124.', '172.68.222.', '176.227.129.', '177.67.250.', '179.0.153.', '179.61.14.', '186.1.138.', '186.1.142.', '186.1.145.' ];
                break;
            // Portugal
            case 172:
                IPs = ['104.133.52.', '104.133.254.', '128.90.168.', '157.240.212.', '154.53.195.', '176.124.252.', '192.103.147.', '192.76.242.', '192.84.15.', '194.140.232.', '194.140.238.', '194.145.121.', '194.153.132.', '194.42.43.', '195.10.57.', '195.170.168.', '195.234.134.', '195.238.252.', '195.66.127.', '185.92.210.'];
                break;
            // Qatar
            case 174:
                IPs = ['13.106.227.', '185.1.159.', '185.161.121.', '185.21.181.', '20.157.154.', '20.157.190.', '20.38.16.', '20.95.129.', '52.108.130.', '52.111.200.', '91.228.176.', '95.181.234.', '184.29.69.', '20.135.239.', '20.209.3.', '20.209.55.', '20.60.209.', '40.107.124.', '40.92.115.', '40.95.117.' ];
                break;
            // Saudi Arabia
            case 187:
                IPs = ['103.154.242.', '146.19.71.', '146.70.167.', '152.89.197.', '154.84.155.', '154.92.26.', '156.227.4.', '156.238.134.', '156.59.255.', '163.116.183.', '163.116.185.', '163.116.191.', '172.69.103.', '172.70.156.', '172.70.158.', '172.70.203.', '176.110.100.', '176.97.216.', '178.249.111.', '185.1.126.' ];
                break;
            // South Africa
            case 197:
                IPs = ['102.132.100.', '102.132.107.', '102.132.112.', '102.132.117.', '102.132.98.', '102.135.190.', '102.140.31.', '102.141.232.', '102.141.235.', '102.164.121.', '102.165.188.', '102.165.6.', '102.176.185.', '102.176.185.', '102.177.115.', '102.214.89.', '102.214.189.', '102.215.97.', '102.216.131.' ];
                break;
            // Sweden
            case 205:
                IPs = ['104.118.217.', '104.123.68.', '104.132.27.', '104.69.222.', '109.107.130.', '109.230.199.', '109.248.144.', '13.248.100.', '130.0.200.', '136.228.209.', '137.83.180.', '141.98.255.', '144.27.116.', '144.27.118.', '144.27.121.', '144.27.123.', '144.27.137.', '144.27.147.', '144.27.149.', '144.27.190.' ];
                break;
            // Switzerland
            case 206:
                IPs = ['102.129.143.', '104.109.250.', '104.132.228.', '104.133.104.', '104.47.22.', '109.107.133.', '109.234.77.', '134.238.138.', '134.238.144.', '136.228.211.', '137.83.140.', '137.83.177.', '138.124.176.', '138.199.20.', '138.199.6.', '145.224.106.', '145.224.90.', '146.19.134.', '146.70.99.', '152.89.162.' ];
                break;
            // Thailand
            case 211:
                IPs = ['103.103.67.', '103.104.179.', '103.105.73.', '103.107.70.', '103.108.49.', '103.120.246.', '103.121.32.', '103.122.245.', '103.122.45.', '103.125.82.', '103.131.35.', '103.135.111.', '103.136.168.', '103.136.248.', '103.137.18.', '103.14.24.', '103.141.232.', '103.144.44.', '103.152.53.', '103.153.118.' ];
                break;
            // United Arab Emirates
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
