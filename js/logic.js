(function($){
    //Definimos el Plugin
    $.fn.editCF = function(options) {
        var $elm = this;

        //definimos las variables por default
        var config = $.extend({
            'editionTools' : true, //mostrar herramientas de edición
            'onSaved' : true //guardar llave:valor JSON
        }, options);
        console.log($elm)
        init($elm, config['editionTools']);
    }

    var init = function (_elem, _tools){
        //Si tools es negativo no creamos el edition tools.
        if (!_tools) {
            _elem.append('<div id="editor" contenteditable></div>');
        } else {
            _elem.append('<div id="editionTools"></div><div id="editor" contenteditable></div>');
            //creamos los botones para editar
            $('#editionTools').append('<button class="btnEdit" id="bold">Bold</button><button class="btnEdit" id="italic">Italic</button><button class="btnEditformat" id="h1">H1</button>')
            
            //bold - italic
            $('.btnEdit').on('click', function() {
                document.execCommand(this.id,false,null);
            })
            //h1
            $('.btnEditformat').on('click', function() {
                document.execCommand('formatBlock',false,this.id);
            })
        }
    }
}(jQuery))

