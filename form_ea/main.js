var Submit = function () {
    var errorMessages = {
        name: {
            regExp: /^[^\d\p{P}]{3,}$/,
            empty: "Nombre de pila (obligatorio)",
            notValid: "Solo letras, longitud mínima 3"
        },
        surname: {
            regExp: /^[^\d\p{P}]{3,}$/,
            empty: "Apellido (obligatorio)",
            notValid: "Solo letras, longitud mínima 3"
        },
        phone: {
            regExp: /^[\d+()]{8,}$/,
            empty: "Teléfono (obligatorio)",
            notValid: "'+' y números solamente, longitud mínima de 8 dígitos"
        },
        email: {
            regExp: /^[a-zA-Z0-9.’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
            empty: "Correo electrónico (obligatorio)\n",
            notValid: "No válido. Formato: usuario@dominio.xxx, A-Z"
        }
    };

    $( ".js-close-popup" ).on( "click", function() {
        $('.popup').css('display', 'none');
    } );

    var form = $('#registration_form');
    const inputsForm = $('.js-input');

    return {
        toggleErrors: function toggleErrors() {
            inputsForm.keyup(function () {
                var _this = $(this);
                _this.siblings(".form_error").remove();
                let checkingError = Submit.validateInput(_this);
                if (checkingError) {
                    _this.parent().append("<div class=\"form_error\"> ".concat(checkingError, "</div >"));
                }
            });
        },
        submitHandler: function submitHandler() {
            form.submit(function (e) {
                e.preventDefault();
                Submit.toggleErrors();
                $(".form_error").remove();
                var errorFields = Submit.validateForm(form);

                if (errorFields.length) {
                    Submit.showErrorFields(errorFields);
                    console.log(1);
                } else {
                    console.log(2);
                    var serializeData = form.serialize();
                    var dataArr = serializeData.split("&");
                    $('#reg_btn').html('<div class="lds-ring"><div></div><div></div><div></div><div></div></div>')
                    $.ajax({
                        url: 'https://api.apispreadsheets.com/data/VWURqVg63DTQmNry/',
                        type: 'POST',
                        contentType: false,
                        processData: false,
                        data: new FormData(this),
                        success: function success(msg) {
                            $('#reg_btn').html('Enviar');
                            setTimeout(function () {
                                $('.popup').css('display', 'block');
                            }, 1000);
                            console.log(3);
                        },
                        error: function () {
                            $('#reg_btn').html('Enviar');
                            setTimeout(function () {
                                alert('Estamos teniendo un problema técnico que estamos procurando resolver a la brevedad. Por favor, inténtelo después.');
                            }, 1000);
                            console.log(4);
                        }
                    })
                }
            });
        },
        showErrorFields: function showErrorFields(errorFields) {
            for (var i = 0; i < errorFields.length; i++) {
                console.log(errorFields[i]);
                var _errorFields$i = errorFields[i],
                    name = _errorFields$i.name,
                    msg = _errorFields$i.msg;
                var field = $("[name=".concat(name, "]"));
                console.log(field);
                console.log(field.parents(".js-input"));
                field.parent().append("<div class=\"form_error\"> ".concat(msg, "</div >"));
            }
        },
        validateInput: function validateInput(input) {
            if (!input.length) {
                return false;
            }

            var error = "";
            var value = input.val();
            var name = input.attr("name");

            if (!errorMessages[name]) {
                return false;
            }

            var _errorMessages$name = errorMessages[name],
                regExp = _errorMessages$name.regExp,
                empty = _errorMessages$name.empty,
                notValid = _errorMessages$name.notValid;

            if (value.length < 1) {
                error = empty;
            } else {
                var isValid = regExp.test(value);

                if (!isValid) {
                    error = notValid;
                }
            }

            return error;
        },
        validateForm: function validateForm(form) {
            var inputs = form.find(".js-input");
            var errors = [];

            for (var i = 0; i < inputs.length; i++) {
                var input = $(inputs[i]);
                var name = input.attr("name");

                var error = Submit.validateInput(input);

                if (error) {
                        errors.push({
                            name: name,
                            msg: error
                        });
                }
            }

            var filteredErrors = errors.filter(function (error) {
                return error;
            });
            return filteredErrors;
        },
        init: function init() {
            Submit.submitHandler();
        }
    };
}();

$(document).ready(function () {
    Submit.init();
});