(function($){
    //Definimos el Plugin
    $.fn.editorcenfo = function(options) {
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

        if (!_tools) {
            _elem.append('<div id="editor" contenteditable></div>');
        } else {
            _elem.append('<div id="editionTools"></div><div id="editor" contenteditable></div>');
            
            $('#editionTools').append('<button id="bold">Bold</button><button id="italic">Italic</button><button id="h1">H1</button>')
            $('#bold').on('click', function(e) {
                document.execCommand('bold',false,null);
                console.log('bold')
            })
            $('#italic').on('click', function(e) {
                document.execCommand('italic',false,null);
                console.log('italic')
            })
            $('#h1').on('click', function(e) {
                document.execCommand('formatBlock',false,'h1');
                console.log('h1')
            })
        }
    }
}(jQuery))

